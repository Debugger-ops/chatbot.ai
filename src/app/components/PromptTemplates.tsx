import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { PromptTemplate } from '../types/chat';
import { 
  Code, 
  Lightbulb, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Heart,
  Sparkles 
} from 'lucide-react';

interface PromptTemplatesProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PromptTemplate) => void;
}

const PromptTemplates: React.FC<PromptTemplatesProps> = ({
  open,
  onClose,
  onSelectTemplate
}) => {
  const templates: PromptTemplate[] = [
    {
      id: '1',
      title: 'Code Review',
      description: 'Get feedback on your code',
      prompt: 'Please review this code and provide suggestions for improvement:\n\n[Paste your code here]',
      category: 'Programming'
    },
    {
      id: '2',
      title: 'Debug Help',
      description: 'Help with debugging issues',
      prompt: 'I\'m having trouble with this code. Here\'s the error message and the code:\n\nError: [Paste error here]\n\nCode: [Paste code here]\n\nCan you help me fix this?',
      category: 'Programming'
    },
    {
      id: '3',
      title: 'Creative Writing',
      description: 'Spark your creativity',
      prompt: 'Help me write a creative story about [describe your topic/theme]. I want it to be [tone/style] and include [specific elements you want].',
      category: 'Creative'
    },
    {
      id: '4',
      title: 'Business Proposal',
      description: 'Create professional proposals',
      prompt: 'Help me create a business proposal for [describe your business idea]. Include market analysis, competitive advantages, and financial projections.',
      category: 'Business'
    },
    {
      id: '5',
      title: 'Email Draft',
      description: 'Professional email writing',
      prompt: 'Help me write a professional email for [purpose]. The tone should be [formal/casual/friendly] and include [key points to cover].',
      category: 'Business'
    },
    {
      id: '6',
      title: 'Learning Path',
      description: 'Create study plans',
      prompt: 'I want to learn [subject/skill] and I have [time commitment] available. Can you create a structured learning path with resources and milestones?',
      category: 'Education'
    },
    {
      id: '7',
      title: 'Problem Solving',
      description: 'Analytical approach to challenges',
      prompt: 'I\'m facing this challenge: [describe your problem]. Can you help me break it down and suggest step-by-step solutions?',
      category: 'General'
    },
    {
      id: '8',
      title: 'Content Ideas',
      description: 'Brainstorm content topics',
      prompt: 'I need content ideas for [platform/audience] about [topic/niche]. The content should be [engaging/educational/entertaining] and appeal to [target audience].',
      category: 'Creative'
    },
    {
      id: '9',
      title: 'Health & Wellness',
      description: 'Wellness advice and tips',
      prompt: 'I want to improve my [specific health aspect] and my current situation is [describe current state]. Can you suggest practical steps and habits?',
      category: 'Health'
    },
    {
      id: '10',
      title: 'Interview Prep',
      description: 'Job interview preparation',
      prompt: 'I have an interview for a [job title] position at [company/industry]. Can you help me prepare by suggesting common questions and good answers?',
      category: 'Career'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Programming': return Code;
      case 'Creative': return Lightbulb;
      case 'Business': return Briefcase;
      case 'Education': return GraduationCap;
      case 'Health': return Heart;
      case 'Career': return FileText;
      default: return Sparkles;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Programming': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Creative': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Business': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Education': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Health': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Career': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Prompt Templates
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {categories.map(category => {
              const CategoryIcon = getCategoryIcon(category);
              const categoryTemplates = templates.filter(t => t.category === category);
              
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <CategoryIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      {category}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryTemplates.map(template => (
                      <div
                        key={template.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        onClick={() => onSelectTemplate(template)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {template.title}
                          </h4>
                          <Badge className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {template.description}
                        </p>
                        
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs text-gray-700 dark:text-gray-300 font-mono">
                          {template.prompt.length > 100 
                            ? template.prompt.substring(0, 100) + '...'
                            : template.prompt
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptTemplates;
