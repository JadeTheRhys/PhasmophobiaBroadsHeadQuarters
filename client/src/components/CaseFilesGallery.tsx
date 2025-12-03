import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { FolderOpen, FileText } from 'lucide-react';
import { CASE_FILES } from '@shared/schema';

export function CaseFilesGallery() {
  const [selectedCase, setSelectedCase] = useState<typeof CASE_FILES[0] | null>(null);

  return (
    <div className="space-y-4" data-testid="case-files-gallery">
      <h3 className="text-lg font-orbitron text-accent text-glow-cyan flex items-center gap-2">
        <FolderOpen className="w-5 h-5" />
        Case Files Archive
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CASE_FILES.map((caseFile) => (
          <Card
            key={caseFile.id}
            onClick={() => setSelectedCase(caseFile)}
            className="cursor-pointer overflow-hidden border-primary bg-background/50 hover:border-accent transition-all group"
            data-testid={`card-case-${caseFile.id}`}
          >
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center relative">
              <FileText className="w-10 h-10 text-primary/50 group-hover:text-accent transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              <span className="absolute bottom-2 left-2 text-xs font-orbitron text-accent">
                #{caseFile.id.padStart(3, '0')}
              </span>
            </div>
            <div className="p-2">
              <p className="text-xs font-jetbrains text-foreground truncate">
                {caseFile.title}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent className="bg-background border-accent max-w-lg" style={{ boxShadow: '0 0 60px hsl(187 100% 66% / 0.3)' }}>
          <DialogHeader>
            <DialogTitle className="font-orbitron text-accent text-glow-cyan text-xl">
              {selectedCase?.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Case file details for {selectedCase?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-primary/30 to-accent/20 rounded-lg flex items-center justify-center border border-accent/50">
              <FileText className="w-16 h-16 text-accent/50" />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-primary font-orbitron">
                Case #{selectedCase?.id.padStart(3, '0')}
              </p>
              <p className="text-foreground font-jetbrains text-sm leading-relaxed">
                {selectedCase?.description}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
