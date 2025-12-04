import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommandInputProps {
  onSendMessage: (text: string, isCommand: boolean) => void;
}

export function CommandInput({ onSendMessage }: CommandInputProps) {
  const [inputValue, setInputValue] = useState('');

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
