import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTime } from '@/lib/store';
import { MessageCircle } from 'lucide-react';

export interface ChatMessageDisplay {
  id: string;
  userId: string;
  displayName: string;
  photoUrl: string;
  text: string;
  isCommand: boolean;
  timestamp: Date;
}

interface ChatPanelProps {
  messages: ChatMessageDisplay[];
}

export function ChatPanel({ messages }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  return (
    <div className="space-y-4" data-testid="chat-panel">
      <h3 className="text-lg font-orbitron text-accent text-glow-cyan flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Squad Comms Log
      </h3>
      
      <ScrollArea className="log-container h-[300px]">
        <div className="space-y-3 pr-4">
          {messages.length === 0 ? (
            <p className="text-muted-foreground font-jetbrains text-sm italic">
              No messages yet. Start chatting with your squad!
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-3"
                data-testid={`chat-message-${msg.id}`}
              >
                <Avatar className="w-8 h-8 border border-accent">
                  <AvatarImage src={msg.photoUrl} alt={msg.displayName} />
                  <AvatarFallback className="bg-primary/20 text-accent text-xs font-orbitron">
                    {msg.displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground font-jetbrains">
                      {formatTime(msg.timestamp)}
                    </span>
                    <span className="font-bold text-primary font-jetbrains">
                      {msg.displayName}:
                    </span>
                  </div>
                  <p className={`font-jetbrains text-sm break-words ${msg.isCommand ? 'text-accent' : 'text-foreground'}`}>
                    {msg.text}
                  </p>
                </div>
              </div>
            ))
          )}
          {/* Invisible div at the end for auto-scrolling */}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>
      </ScrollArea>
    </div>
  );
}
