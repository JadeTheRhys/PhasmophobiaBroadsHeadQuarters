import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Heart, Skull } from 'lucide-react';
import { VideoCallButton } from './VideoCallButton';

export interface SquadMember {
  id: string;
  userId: string;
  displayName: string;
  photoUrl: string;
  isDead: boolean;
  map: string;
  location: string;
}

interface SquadStatusProps {
  members: SquadMember[];
}

export function SquadStatus({ members }: SquadStatusProps) {
  const aliveCount = members.filter(m => !m.isDead).length;

  return (
    <div className="space-y-4" data-testid="squad-status">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h3 className="text-lg font-orbitron text-accent text-glow-cyan flex items-center gap-2">
          <Users className="w-5 h-5" />
          Squad Status
        </h3>
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className={`font-jetbrains ${aliveCount > 0 ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}
          >
            {aliveCount}/{members.length} Active
          </Badge>
          <VideoCallButton roomName="PhasmoBroadsHQ" />
        </div>
      </div>

      <ScrollArea className="h-[280px]">
        <div className="space-y-3 pr-4">
          {members.length === 0 ? (
            <div className="log-container text-center py-8">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-30" />
              <p className="text-muted-foreground font-jetbrains text-sm">
                No squad members online
              </p>
              <p className="text-xs text-muted-foreground/60 font-jetbrains mt-2">
                Click the red phone to start a video call
              </p>
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  member.isDead 
                    ? 'bg-red-950/20 border-red-500/50' 
                    : 'bg-green-950/20 border-green-500/50'
                }`}
                data-testid={`squad-member-${member.id}`}
              >
                <Avatar className={`w-10 h-10 border-2 ${member.isDead ? 'border-red-500' : 'border-green-500'}`}>
                  <AvatarImage src={member.photoUrl} alt={member.displayName} />
                  <AvatarFallback className="bg-primary/20 text-accent text-xs font-orbitron">
                    {member.displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-grow min-w-0">
                  <p className="font-bold text-foreground font-jetbrains truncate">
                    {member.displayName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-jetbrains">
                    <MapPin className="w-3 h-3 text-primary" />
                    {member.isDead ? (
                      <span className="text-red-400">DECEASED</span>
                    ) : (
                      <span className="truncate">{member.map} — {member.location}</span>
                    )}
                  </div>
                </div>

                <div className={`p-2 rounded-full ${member.isDead ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                  {member.isDead ? (
                    <Skull className="w-5 h-5 text-red-500" />
                  ) : (
                    <Heart className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
