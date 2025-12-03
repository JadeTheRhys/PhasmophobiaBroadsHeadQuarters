import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Map, Building2 } from 'lucide-react';
import { MAP_DATA } from '@shared/schema';

interface MapDisplayProps {
  currentMap?: string;
  onMapChange?: (map: string) => void;
}

export function MapDisplay({ currentMap, onMapChange }: MapDisplayProps) {
  const [selectedMap, setSelectedMap] = useState(currentMap || '');
  const mapNames = Object.keys(MAP_DATA).sort();

  const handleMapChange = (value: string) => {
    setSelectedMap(value);
    onMapChange?.(value);
  };

  const mapInfo = selectedMap ? MAP_DATA[selectedMap] : null;

  return (
    <div className="space-y-4" data-testid="map-display">
      <h3 className="text-lg font-orbitron text-accent text-glow-cyan flex items-center gap-2">
        <Map className="w-5 h-5" />
        Investigation Location
      </h3>

      <Select value={selectedMap} onValueChange={handleMapChange}>
        <SelectTrigger 
          className="bg-background/50 border-primary font-jetbrains"
          data-testid="select-map"
        >
          <SelectValue placeholder="Select investigation location" />
        </SelectTrigger>
        <SelectContent className="bg-card border-primary max-h-[300px]">
          {mapNames.map((name) => (
            <SelectItem 
              key={name} 
              value={name}
              className="font-jetbrains"
            >
              {MAP_DATA[name].name} ({MAP_DATA[name].size})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card 
        className="overflow-hidden border-accent bg-background/50"
        style={{ boxShadow: '0 0 12px hsl(187 100% 66% / 0.3)' }}
      >
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center relative">
          {mapInfo ? (
            <>
              <Building2 className="w-16 h-16 text-accent/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent">
                <p className="font-orbitron text-accent text-lg text-glow-cyan">
                  {mapInfo.name}
                </p>
                <p className="font-jetbrains text-xs text-muted-foreground">
                  Size: {mapInfo.size}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <Map className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground font-jetbrains text-sm">
                Select a location
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
