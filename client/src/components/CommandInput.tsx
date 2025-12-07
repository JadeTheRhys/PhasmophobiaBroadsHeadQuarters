import { useState, KeyboardEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scarySoundService } from '@/lib/scarySounds';

interface CommandInputProps {
  onSendMessage: (text: string, isCommand: boolean) => void;
}

export function CommandInput({ onSendMessage }: CommandInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  // Prime audio context on first user interaction
  useEffect(() => {
    if (!hasInteracted) {
      const primeAudio = () => {
        scarySoundService.primeAudioContext();
        setHasInteracted(true);
      };
      // Prime on any click or keypress in the document
      // Using { once: true } so listeners auto-remove after first trigger
      document.addEventListener('click', primeAudio, { once: true });
      document.addEventListener('keypress', primeAudio, { once: true });
      
      // Cleanup: only needed if component unmounts before interaction
      return () => {
        if (!hasInteracted) {
          document.removeEventListener('click', primeAudio);
          document.removeEventListener('keypress', primeAudio);
        }
      };
    }
  }, [hasInteracted]);

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const isCommand = trimmed.startsWith('!');
    onSendMessage(trimmed, isCommand);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-2" data-testid="command-input">
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type message or command (!hunt, !dead:NAME, etc.)"
          className="flex-grow bg-background/50 border-primary focus:border-accent text-accent font-jetbrains"
          data-testid="input-command"
        />
        <Button
          onClick={handleSubmit}
          size="icon"
          className="bg-primary hover:bg-primary/80"
          data-testid="button-send"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground font-jetbrains">
        Commands: !hunt, !flicker, !manifest, !curse, !slam, !evidence:X, !dead:X, !revive:X, !location:X | 🔊 !scare, !jumpscare, !whisper, !creak, !haunt
      </p>
    </div>
  );
}
