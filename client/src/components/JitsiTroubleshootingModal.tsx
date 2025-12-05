import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Volume2,
  Shield,
  VolumeX,
  Monitor,
  ExternalLink,
  AlertCircle,
  Headphones,
} from 'lucide-react';

interface JitsiTroubleshootingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

interface ChecklistItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const checklistItems: ChecklistItem[] = [
  {
    id: 'speakers',
    icon: <Headphones className="w-5 h-5 text-accent" />,
    title: 'Speakers/Headphones Connected',
    description:
      'Ensure your speakers or headphones are plugged in and selected in Jitsi audio settings.',
  },
  {
    id: 'permissions',
    icon: <Shield className="w-5 h-5 text-accent" />,
    title: 'Browser & OS Audio Permissions',
    description:
      'Check that your browser and operating system allow audio access for Jitsi.',
  },
  {
    id: 'tab-muted',
    icon: <VolumeX className="w-5 h-5 text-accent" />,
    title: 'Browser Tab Not Muted',
    description:
      'Right-click the Jitsi tab and ensure it is not muted. Some browsers mute new tabs automatically.',
  },
  {
    id: 'test-device',
    icon: <Monitor className="w-5 h-5 text-accent" />,
    title: 'Test on Another Device/Browser',
    description:
      'If issues persist, try joining from a different browser or device to isolate the problem.',
  },
];

export function JitsiTroubleshootingModal({
  isOpen,
  onClose,
  onProceed,
}: JitsiTroubleshootingModalProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const resetCheckedItems = () => {
    setCheckedItems(new Set());
  };

  const handleCheckChange = (itemId: string, checked: boolean | 'indeterminate') => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (checked === true) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  const handleProceed = () => {
    onProceed();
    resetCheckedItems();
  };

  const handleClose = () => {
    onClose();
    resetCheckedItems();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-w-xl border-2 border-accent bg-background/95 backdrop-blur-sm"
        style={{
          boxShadow:
            '0 0 30px rgba(183, 28, 255, 0.4), 0 0 60px rgba(183, 28, 255, 0.2)',
        }}
        data-testid="jitsi-troubleshooting-modal"
      >
        <DialogHeader>
          <DialogTitle className="font-orbitron text-xl text-accent text-glow-cyan flex items-center gap-2">
            <Volume2 className="w-6 h-6" />
            Before Joining Squad Call
          </DialogTitle>
          <DialogDescription className="font-jetbrains text-muted-foreground">
            Review this audio troubleshooting checklist to ensure a smooth call
            experience.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh]">
          <div className="space-y-4 pr-4">
            {/* Disclaimer */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-950/30 border border-amber-500/50">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm font-jetbrains text-amber-200/90">
                <strong>Note:</strong> This website cannot directly fix Jitsi
                audio issues. However, these steps resolve most common problems.
              </p>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              <h4 className="font-orbitron text-sm text-foreground uppercase tracking-wider">
                Audio Troubleshooting Checklist
              </h4>
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-primary/30 hover:border-primary/50 transition-colors"
                >
                  <Checkbox
                    id={item.id}
                    checked={checkedItems.has(item.id)}
                    onCheckedChange={(checked) =>
                      handleCheckChange(item.id, checked)
                    }
                    className="mt-1 border-accent data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={item.id}
                      className="flex items-center gap-2 font-orbitron text-sm text-foreground cursor-pointer"
                    >
                      {item.icon}
                      {item.title}
                    </Label>
                    <p className="text-xs text-muted-foreground font-jetbrains mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Official Resources */}
            <div className="space-y-2 pt-2">
              <h4 className="font-orbitron text-sm text-foreground uppercase tracking-wider">
                Official Jitsi Resources
              </h4>
              <div className="flex flex-col gap-2">
                <a
                  href="https://jitsi.github.io/handbook/docs/user-guide/user-guide-start"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 font-jetbrains underline underline-offset-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Jitsi User Guide
                </a>
                <a
                  href="https://community.jitsi.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 font-jetbrains underline underline-offset-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Jitsi Community Forum
                </a>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="font-orbitron"
          >
            Cancel
          </Button>
          <Button
            onClick={handleProceed}
            className="font-orbitron bg-red-900/80 hover:bg-red-800 border-2 border-red-500 text-white"
            style={{
              boxShadow:
                '0 0 15px rgba(239, 68, 68, 0.6), 0 0 30px rgba(239, 68, 68, 0.3)',
            }}
          >
            I Understand, Join Call
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
