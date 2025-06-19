import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';
import { Download, FileText, Code2 } from 'lucide-react';
import { Conversation } from '../types/chat';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  conversation: Conversation;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onClose,
  conversation
}) => {
  const [exporting, setExporting] = useState(false);

  const exportAsJSON = () => {
    try {
      const data = {
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messages: conversation.messages,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-${conversation.title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Chat exported as JSON file",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export chat as JSON",
        variant: "destructive",
      });
    }
  };

  const exportAsText = () => {
    try {
      let content = `Chat Export: ${conversation.title}\n`;
      content += `Created: ${new Date(conversation.createdAt).toLocaleString()}\n`;
      content += `Updated: ${new Date(conversation.updatedAt).toLocaleString()}\n`;
      content += `Exported: ${new Date().toLocaleString()}\n`;
      content += `\n${'='.repeat(50)}\n\n`;

      conversation.messages.forEach((message, index) => {
        const timestamp = new Date(message.timestamp).toLocaleString();
        const role = message.role === 'user' ? 'You' : 'AI Assistant';
        
        content += `[${timestamp}] ${role}:\n`;
        content += `${message.content}\n\n`;
        
        if (index < conversation.messages.length - 1) {
          content += `${'-'.repeat(30)}\n\n`;
        }
      });

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-${conversation.title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Chat exported as text file",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export chat as text",
        variant: "destructive",
      });
    }
  };

  const exportAsMarkdown = () => {
    try {
      let content = `# ${conversation.title}\n\n`;
      content += `**Created:** ${new Date(conversation.createdAt).toLocaleString()}  \n`;
      content += `**Updated:** ${new Date(conversation.updatedAt).toLocaleString()}  \n`;
      content += `**Exported:** ${new Date().toLocaleString()}  \n\n`;
      content += `---\n\n`;

      conversation.messages.forEach((message, index) => {
        const timestamp = new Date(message.timestamp).toLocaleString();
        const role = message.role === 'user' ? '🧑 **You**' : '🤖 **AI Assistant**';
        
        content += `## ${role}\n`;
        content += `*${timestamp}*\n\n`;
        content += `${message.content}\n\n`;
        
        if (index < conversation.messages.length - 1) {
          content += `---\n\n`;
        }
      });

      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-${conversation.title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Chat exported as Markdown file",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export chat as Markdown",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Export Conversation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              {conversation.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {conversation.messages.length} messages • Created {new Date(conversation.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Choose export format:
            </p>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={exportAsText}
                disabled={exporting}
              >
                <FileText className="h-4 w-4 mr-2" />
                Plain Text (.txt)
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={exportAsMarkdown}
                disabled={exporting}
              >
                <FileText className="h-4 w-4 mr-2" />
                Markdown (.md)
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={exportAsJSON}
                disabled={exporting}
              >
                <Code2 className="h-4 w-4 mr-2" />
                JSON (.json)
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
