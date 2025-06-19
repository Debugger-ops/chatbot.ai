"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ChatSidebar from './ChatSidebar';
import ChatInterface from './ChatInterface';
import AnalyticsDashboard from './AnalyticsDashboard';
import { Message, Conversation } from './../types/chat';

const ChatApp = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'chat' | 'analytics'>('chat');

  // Initialize with a default conversation
  useEffect(() => {
    const defaultConversation: Conversation = {
      id: 'default',
      title: 'New Conversation',
      messages: [
        {
          id: '1',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          role: 'assistant',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setConversations([defaultConversation]);
    setActiveConversation('default');
  }, []);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Conversation',
      messages: [
        {
          id: Math.random().toString(36).substr(2, 9),
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          role: 'assistant',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation.id);
  };

  const addMessage = (conversationId: string, message: Message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedConv = {
          ...conv,
          messages: [...conv.messages, message],
          updatedAt: new Date().toISOString()
        };
        
        // Update title based on first user message
        if (message.role === 'user' && conv.messages.length === 1) {
          updatedConv.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
        }
        
        return updatedConv;
      }
      return conv;
    }));
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (activeConversation === conversationId) {
      const remaining = conversations.filter(conv => conv.id !== conversationId);
      setActiveConversation(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const activeConv = conversations.find(conv => conv.id === activeConversation);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <ChatSidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onSelectConversation={setActiveConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user!}
        onLogout={logout}
      />
      
      <div className="flex-1 flex flex-col">
        {currentView === 'chat' ? (
          activeConv ? (
            <ChatInterface
              conversation={activeConv}
              onAddMessage={addMessage}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4">
                  No conversation selected
                </h2>
                <button
                  onClick={createNewConversation}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start New Conversation
                </button>
              </div>
            </div>
          )
        ) : (
          <AnalyticsDashboard conversations={conversations} />
        )}
      </div>
    </div>
  );
};

export default ChatApp;
