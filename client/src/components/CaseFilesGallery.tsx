import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { FolderOpen } from 'lucide-react';
import { CASE_FILES } from '@shared/schema';

// Get base URL for assets (handles GitHub Pages deployment)
const BASE_URL = import.meta.env.BASE_URL || '/';

// Map case file IDs to their image filenames
const CASE_IMAGE_FILENAMES: Record<string, string> = {
  '1': 'case1_1764775148686.jpg',
  '2': 'case2_1764775148687.jpg',
  '3': 'case3_1764775148687.jpg',
  '4': 'case4_1764775148688.jpg',
  '5': 'case5_1764775148688.jpg',
  '6': 'case6_1764775148688.jpg',
};

// Helper function to get full asset URL
function getCaseImageUrl(id: string): string {
  const filename = CASE_IMAGE_FILENAMES[id];
  return filename ? `${BASE_URL}assets/${filename}` : '';
}

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
            style={{ boxShadow: '0 0 8px hsl(280 85% 50% / 0.3)' }}
            data-testid={`card-case-${caseFile.id}`}
          >
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={getCaseImageUrl(caseFile.id)} 
                alt={caseFile.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <span className="absolute bottom-2 left-2 text-xs font-orbitron text-accent text-glow-cyan">
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
        <DialogContent className="bg-background border-accent max-w-2xl" style={{ boxShadow: '0 0 60px hsl(187 100% 66% / 0.3)' }}>
          <DialogHeader>
            <DialogTitle className="font-orbitron text-accent text-glow-cyan text-xl">
              {selectedCase?.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Case file details for {selectedCase?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden border-2 border-accent/50" style={{ boxShadow: '0 0 20px hsl(187 100% 66% / 0.4)' }}>
              {selectedCase && (
                <img 
                  src={getCaseImageUrl(selectedCase.id)} 
                  alt={selectedCase.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-primary font-orbitron text-glow-purple">
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
