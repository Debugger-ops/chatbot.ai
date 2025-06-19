"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from '../hooks/use-toast';
import { 
  Send, 
  Mic, 
  MicOff, 
  Download, 
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { Conversation, Message, PromptTemplate } from '../types/chat';
import MessageBubble from './MessageBubble';
import PromptTemplates from './PromptTemplates';
import VoiceInput from './VoiceInput';
import ExportDialog from './ExportDialog';

interface ChatInterfaceProps {
  conversation: Conversation;
  onAddMessage: (conversationId: string, message: Message) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversation,
  onAddMessage
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      "That's an interesting question! Let me think about that for a moment. Based on what you've shared, I'd suggest considering multiple perspectives on this topic.",
      "I understand your point. Here's what I think might be helpful in this situation. Would you like me to elaborate on any specific aspect?",
      "Great question! This is actually a complex topic with several important considerations. Let me break it down for you step by step.",
      "I appreciate you sharing that with me. From my understanding, there are a few key factors we should consider here.",
      "That's a thoughtful inquiry. Based on current best practices and research, I'd recommend exploring these options.",
      "Interesting perspective! I can see why you'd think about it that way. Here are some additional insights that might be valuable.",
      "Thank you for the detailed explanation. Let me provide you with some comprehensive information about this topic.",
      "I'm glad you asked about this. It's an important subject that many people have questions about. Here's what I can tell you."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add some contextual responses based on keywords
    if (userMessage.toLowerCase().includes('help')) {
      return "I'm here to help! What specific area would you like assistance with? I can provide information, answer questions, or help you brainstorm ideas.";
    }
    
    if (userMessage.toLowerCase().includes('code') || userMessage.toLowerCase().includes('programming')) {
      return "I'd be happy to help with coding! Whether you need help with debugging, learning new concepts, or writing efficient code, I'm here to assist. What programming language or specific challenge are you working with?";
    }
    
    if (userMessage.toLowerCase().includes('creative') || userMessage.toLowerCase().includes('idea')) {
      return "I love creative challenges! Let's brainstorm together. What kind of creative project are you working on? I can help with ideation, planning, or overcoming creative blocks.";
    }
    
    return randomResponse;
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim();
    if (!content || isLoading) return;

    // Add to input history
    if (!messageContent) {
      setInputHistory(prev => [content, ...prev.slice(0, 19)]); // Keep last 20
      setHistoryIndex(-1);
      setInput('');
    }

    // Add user message
    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      role: 'user',
      timestamp: new Date().toISOString()
    };
    
    onAddMessage(conversation.id, userMessage);
    setIsLoading(true);

    try {
      // Simulate AI response
      const aiResponse = await simulateAIResponse(content);
      
      const assistantMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      onAddMessage(conversation.id, assistantMessage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'ArrowUp' && inputHistory.length > 0) {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, inputHistory.length - 1);
      setHistoryIndex(newIndex);
      setInput(inputHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(inputHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setInput(transcript);
    setShowVoiceInput(false);
  };

  const handleTemplateSelect = (template: PromptTemplate) => {
    setInput(template.prompt);
    setShowTemplates(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              {conversation.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI Assistant • Online
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplates(true)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Templates
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportDialog(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 max-w-md">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here... (Press ↑ for history)"
                className="pr-20 min-h-[44px] resize-none"
                disabled={isLoading}
              />
              
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVoiceInput(true)}
                  className="h-8 w-8 p-0"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line, ↑/↓ for message history
          </p>
        </div>
      </div>

      {/* Dialogs */}
      <PromptTemplates
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={handleTemplateSelect}
      />
      
      <VoiceInput
        open={showVoiceInput}
        onClose={() => setShowVoiceInput(false)}
        onTranscript={handleVoiceInput}
      />
      
      <ExportDialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        conversation={conversation}
      />
    </div>
  );
};

export default ChatInterface;