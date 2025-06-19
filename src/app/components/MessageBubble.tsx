import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';
import { Copy, Check, User, Sparkles } from 'lucide-react';
import { Message } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (message.role === 'user') {
    return (
      <div className="flex items-start gap-3 justify-end">
        <div className="group flex items-start gap-2 max-w-2xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 mt-1"
          >
            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          </Button>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-md p-4">
            <p className="whitespace-pre-wrap">{message.content}</p>
            <p className="text-xs opacity-70 mt-2">{formatTime(message.timestamp)}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl flex-shrink-0">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      
      <div className="group flex items-start gap-2 max-w-2xl">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-md p-4">
          <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
            {message.content}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {formatTime(message.timestamp)}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 mt-1"
        >
          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  );
};

export default MessageBubble;
