import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInputProps {
  open: boolean;
  onClose: () => void;
  onTranscript: (transcript: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  open,
  onClose,
  onTranscript
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast({
          title: "Voice Recognition Error",
          description: "There was an issue with voice recognition. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setTranscript('');
      setIsRecording(true);
      recognitionRef.current.start();
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleUseTranscript = () => {
    if (transcript.trim()) {
      onTranscript(transcript.trim());
      setTranscript('');
      onClose();
    }
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    setTranscript('');
    onClose();
  };

  if (!isSupported) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MicOff className="h-5 w-5 text-red-500" />
              Voice Input Not Supported
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Speech recognition is not supported in your current browser.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Try using Chrome, Safari, or Edge for voice input functionality.
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-blue-600" />
            Voice Input
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-6">
          <div className="mb-6">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
            }`}>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="w-full h-full flex items-center justify-center text-white"
              >
                {isRecording ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {isRecording ? 'Listening... Click to stop' : 'Click the microphone to start recording'}
          </p>

          {transcript && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Transcript:
                </span>
              </div>
              <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                {transcript}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          
          {transcript && (
            <Button onClick={handleUseTranscript} className="bg-blue-600 hover:bg-blue-700">
              Use This Text
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceInput;
