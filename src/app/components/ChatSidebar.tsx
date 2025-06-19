import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  MessageCircle, 
  Plus, 
  Settings, 
  Moon, 
  Sun, 
  User, 
  BarChart3,
  Trash2,
  LogOut
} from 'lucide-react';
import { Conversation } from '../types/chat';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  currentView: 'chat' | 'analytics';
  onViewChange: (view: 'chat' | 'analytics') => void;
  user: { name: string; email: string };
  onLogout: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  currentView,
  onViewChange,
  user,
  onLogout
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (hours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ChatBot AI
          </h1>
        </div>
        
        <Button 
          onClick={onNewConversation} 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Navigation */}
      <div className="px-4 mb-4">
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <Button
            variant={currentView === 'chat' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('chat')}
            className="flex-1"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </Button>
          <Button
            variant={currentView === 'analytics' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('analytics')}
            className="flex-1"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                activeConversation === conversation.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => onSelectConversation(conversation.id)}
              onMouseEnter={() => setHoveredConversation(conversation.id)}
              onMouseLeave={() => setHoveredConversation(null)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                    {conversation.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(conversation.updatedAt)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                    {conversation.messages[conversation.messages.length - 1]?.content}
                  </p>
                </div>
                
                {hoveredConversation === conversation.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 space-y-2">
        <Separator />
        
        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-full">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="flex-1"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="flex-1"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
