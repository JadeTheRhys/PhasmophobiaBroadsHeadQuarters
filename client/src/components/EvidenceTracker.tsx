import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Check, X, Minus } from 'lucide-react';
import { EVIDENCE_TYPES, GHOST_DATA } from '@shared/schema';

type EvidenceState = 'unknown' | 'confirmed' | 'ruled_out';

interface EvidenceItem {
  name: string;
  state: EvidenceState;
}

interface EvidenceTrackerProps {
  onEvidenceChange?: (evidence: string[]) => void;
}

export function EvidenceTracker({ onEvidenceChange }: EvidenceTrackerProps) {
  const [evidenceStates, setEvidenceStates] = useState<EvidenceItem[]>(
    EVIDENCE_TYPES.map(name => ({ name, state: 'unknown' }))
  );

  const toggleEvidence = (index: number) => {
    const newStates = [...evidenceStates];
    const current = newStates[index].state;
    
    if (current === 'unknown') {
      newStates[index].state = 'confirmed';
    } else if (current === 'confirmed') {
      newStates[index].state = 'ruled_out';
    } else {
      newStates[index].state = 'unknown';
    }
    
    setEvidenceStates(newStates);
    
    const confirmed = newStates.filter(e => e.state === 'confirmed').map(e => e.name);
    onEvidenceChange?.(confirmed);
  };

  const confirmedEvidence = evidenceStates.filter(e => e.state === 'confirmed').map(e => e.name);
  const ruledOutEvidence = evidenceStates.filter(e => e.state === 'ruled_out').map(e => e.name);

  const possibleGhosts = Object.entries(GHOST_DATA).filter(([_, data]) => {
    const hasAllConfirmed = confirmedEvidence.every(ev => data.evidence.includes(ev));
    const hasNoRuledOut = !ruledOutEvidence.some(ev => data.evidence.includes(ev));
    return hasAllConfirmed && hasNoRuledOut;
  });

  const resetEvidence = () => {
    setEvidenceStates(EVIDENCE_TYPES.map(name => ({ name, state: 'unknown' })));
    onEvidenceChange?.([]);
  };

  return (
    <div className="space-y-4" data-testid="evidence-tracker">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-orbitron text-accent text-glow-cyan flex items-center gap-2">
          <Fingerprint className="w-5 h-5" />
          Evidence Tracker
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetEvidence}
          className="text-xs font-jetbrains"
          data-testid="button-reset-evidence"
        >
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {evidenceStates.map((evidence, index) => (
          <button
            key={evidence.name}
            onClick={() => toggleEvidence(index)}
            className={`flex items-center justify-between p-3 rounded-md border transition-all font-jetbrains text-sm ${
              evidence.state === 'confirmed'
                ? 'bg-green-900/30 border-green-500 text-green-400'
                : evidence.state === 'ruled_out'
                ? 'bg-red-900/30 border-red-500 text-red-400 line-through opacity-60'
                : 'bg-background/30 border-primary/30 text-foreground hover:border-primary'
            }`}
            data-testid={`button-evidence-${evidence.name.toLowerCase().replace(' ', '-')}`}
          >
            <span>{evidence.name}</span>
            {evidence.state === 'confirmed' && <Check className="w-4 h-4" />}
            {evidence.state === 'ruled_out' && <X className="w-4 h-4" />}
            {evidence.state === 'unknown' && <Minus className="w-4 h-4 opacity-30" />}
          </button>
        ))}
      </div>

      <div className="border-t border-primary/30 pt-4">
        <h4 className="text-sm font-orbitron text-primary mb-2">
          Possible Ghosts ({possibleGhosts.length})
        </h4>
        <ScrollArea className="h-[120px]">
          <div className="flex flex-wrap gap-2 pr-4">
            {possibleGhosts.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No matching ghosts. Check your evidence.
              </p>
            ) : (
              possibleGhosts.map(([name]) => (
                <Badge
                  key={name}
                  variant="outline"
                  className="bg-primary/10 border-primary text-primary font-jetbrains"
                >
                  {name}
                </Badge>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
