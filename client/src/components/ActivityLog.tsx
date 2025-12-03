import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTime } from '@/lib/store';
import { AlertCircle, Ghost, Zap, Volume2 } from 'lucide-react';

export interface LogEntry {
  id: string;
  type: 'system' | 'event' | 'command' | 'hunt';
  message: string;
  timestamp: Date;
}

interface ActivityLogProps {
  logs: LogEntry[];
}

const LOG_ICONS = {
  system: AlertCircle,
  event: Ghost,
  command: Zap,
  hunt: Volume2
};

const LOG_COLORS = {
  system: 'text-muted-foreground',
  event: 'text-red-400',
  command: 'text-accent',
  hunt: 'text-red-500'
};

export function ActivityLog({ logs }: ActivityLogProps) {
  return (
    <div className="phasmo-card flex-grow flex flex-col min-h-[300px]" data-testid="activity-log">
      <h2 className="phasmo-subtitle text-lg font-orbitron mb-4 flex items-center gap-2">
        <Ghost className="w-5 h-5" />
        GHOST ACTIVITY LOG
      </h2>
      
      <ScrollArea className="log-container flex-grow h-[200px]">
        <div className="space-y-2 pr-4">
          {logs.length === 0 ? (
            <p className="text-muted-foreground font-jetbrains text-sm italic">
              [SYSTEM] Awaiting initial authentication...
            </p>
          ) : (
            logs.map((log) => {
              const Icon = LOG_ICONS[log.type];
              const colorClass = LOG_COLORS[log.type];
              
              return (
                <div
                  key={log.id}
                  className={`flex items-start gap-2 font-jetbrains text-sm ${colorClass}`}
                  data-testid={`log-entry-${log.id}`}
                >
                  <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-xs">
                    [{formatTime(log.timestamp)}]
                  </span>
                  <span className="flex-grow">{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
