import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Ghost, Shield, AlertTriangle, BookOpen } from 'lucide-react';
import { GHOST_DATA } from '@shared/schema';

export function GhostProfile() {
  const [selectedGhost, setSelectedGhost] = useState<string>('');
  const ghostData = selectedGhost ? GHOST_DATA[selectedGhost] : null;

  const ghostNames = Object.keys(GHOST_DATA).sort();

  return (
    <div className="space-y-4" data-testid="ghost-profile">
      <h3 className="text-lg font-orbitron text-accent text-glow-cyan flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Ghost Database
      </h3>

      <Select value={selectedGhost} onValueChange={setSelectedGhost}>
        <SelectTrigger 
          className="bg-background/50 border-primary font-jetbrains"
          data-testid="select-ghost"
        >
          <SelectValue placeholder="--- Select Ghost Type ---" />
        </SelectTrigger>
        <SelectContent className="bg-card border-primary max-h-[300px]">
          {ghostNames.map((name) => (
            <SelectItem 
              key={name} 
              value={name}
              className="font-jetbrains"
            >
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {ghostData ? (
        <div className="log-container space-y-4" data-testid="ghost-info">
          <div className="flex items-center gap-2">
            <Ghost className="w-6 h-6 text-accent" />
            <h4 className="text-xl font-orbitron text-accent text-glow-cyan">
              {selectedGhost}
            </h4>
          </div>

          <div className="border-b border-primary/50 pb-2" />

          <div className="space-y-3">
            <div>
              <p className="text-sm text-primary font-bold font-jetbrains mb-1">Evidence:</p>
              <div className="flex flex-wrap gap-2">
                {ghostData.evidence.map((ev) => (
                  <Badge 
                    key={ev} 
                    variant="outline" 
                    className="bg-accent/10 border-accent text-accent font-jetbrains"
                  >
                    {ev}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-primary font-bold font-jetbrains">Strength:</p>
                <p className="text-sm text-foreground font-jetbrains">{ghostData.strength}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-primary font-bold font-jetbrains">Weakness:</p>
                <p className="text-sm text-foreground font-jetbrains">{ghostData.weakness}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="log-container text-center py-8">
          <Ghost className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
          <p className="text-muted-foreground font-jetbrains text-sm">
            Select a ghost type to view its profile
          </p>
        </div>
      )}
    </div>
  );
}
