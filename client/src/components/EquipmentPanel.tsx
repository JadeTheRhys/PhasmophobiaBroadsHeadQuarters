/**
 * EquipmentPanel.tsx
 * 
 * A React component that displays a list of ghost-hunting equipment featured in Phasmophobia.
 * Each equipment is shown as a stylish card with:
 * - Equipment name
 * - Neon-themed icon (from Lucide icons)
 * - Brief description of its purpose
 * - Concise usage tip
 * 
 * The cards use the neon/cyberpunk palette (purple #b71cff, cyan #5dfdff) with
 * attractive fonts and modern hover/active effects to fit the site aesthetic.
 */

import { 
  Radio, 
  BookOpen, 
  MessageSquare, 
  Thermometer, 
  Flashlight, 
  Cross,
  Flame,
  HardHat,
  CircleDot,
  Mic,
  Camera,
  Droplet,
  Pill,
  AudioLines,
  Wind,
  Lightbulb,
  CircleDashed,
  Eye,
  Scan,
  Triangle,
  Sparkles,
  Video,
  type LucideIcon
} from 'lucide-react';

// Equipment data structure
interface Equipment {
  name: string;
  icon: LucideIcon;
  description: string;
  usageTip: string;
}

// Complete list of Phasmophobia equipment with descriptions and tips
const EQUIPMENT_LIST: Equipment[] = [
  {
    name: 'DOTS Projector',
    icon: CircleDot,
    description: 'Projects a grid of laser dots that reveals ghost silhouettes passing through.',
    usageTip: 'Place in a room and watch for movement through a video camera or directly for best results.'
  },
  {
    name: 'EMF Reader',
    icon: Radio,
    description: 'Detects electromagnetic field disturbances caused by ghost activity.',
    usageTip: 'Look for EMF Level 5 readings as evidence. Lower levels indicate recent ghost interaction.'
  },
  {
    name: 'Ghost Writing Book',
    icon: BookOpen,
    description: 'A journal that ghosts can write in to communicate with investigators.',
    usageTip: 'Place on a flat surface in the ghost room and wait. Some ghosts write faster when alone.'
  },
  {
    name: 'Spirit Box',
    icon: MessageSquare,
    description: 'Allows verbal communication with ghosts through radio frequency scanning.',
    usageTip: 'Ask questions like "Where are you?" or "How old are you?" Some ghosts only respond when alone.'
  },
  {
    name: 'Thermometer',
    icon: Thermometer,
    description: 'Measures ambient temperature to detect freezing temperatures from ghost presence.',
    usageTip: 'Scan rooms for temperatures below 0°C/32°F to find the ghost room or confirm Freezing Temps evidence.'
  },
  {
    name: 'UV Light',
    icon: Lightbulb,
    description: 'Reveals fingerprints, footprints, and other UV-reactive evidence left by ghosts.',
    usageTip: 'Check light switches, doors, and windows. Combine with salt to reveal ghost footprints.'
  },
  {
    name: 'Video Camera',
    icon: Video,
    description: 'Records video feed and can detect Ghost Orbs when placed in the ghost room.',
    usageTip: 'Place on tripods in the ghost room and monitor the truck screen for Ghost Orbs evidence.'
  },
  {
    name: 'Flashlight',
    icon: Flashlight,
    description: 'Primary light source for navigating dark investigation locations.',
    usageTip: 'Turn off during hunts to reduce detection. The strong flashlight has longer range.'
  },
  {
    name: 'Crucifix',
    icon: Cross,
    description: 'Prevents the ghost from entering a hunt when placed in its territory.',
    usageTip: 'Place near the ghost room before activity increases. Each crucifix prevents 2 hunts.'
  },
  {
    name: 'Firelight',
    icon: Flame,
    description: 'A flame-based light source that can be blown out by ghost activity.',
    usageTip: 'Watch for the flame being extinguished as a sign of nearby ghost presence.'
  },
  {
    name: 'Head Gear',
    icon: HardHat,
    description: 'Mounted head camera that provides hands-free video recording capability.',
    usageTip: 'Great for capturing evidence while using other equipment with both hands.'
  },
  {
    name: 'Igniter',
    icon: Sparkles,
    description: 'Used to light candles, fireplaces, and other ignitable objects.',
    usageTip: 'Keep a lighter handy to relight candles after ghost interactions extinguish them.'
  },
  {
    name: 'Motion Sensor',
    icon: Scan,
    description: 'Detects movement and triggers an alert when something passes through.',
    usageTip: 'Place in hallways or doorways to track ghost movement patterns across the location.'
  },
  {
    name: 'Parabolic Microphone',
    icon: Mic,
    description: 'Directional microphone that detects sound through walls at long range.',
    usageTip: 'Use from outside the building to locate which room the ghost is active in.'
  },
  {
    name: 'Photo Camera',
    icon: Camera,
    description: 'Takes photographs that can earn money and document ghost interactions.',
    usageTip: 'Photograph the ghost, interactions, bone, Ouija board, and dirty water for bonus rewards.'
  },
  {
    name: 'Salt',
    icon: Droplet,
    description: 'Creates salt piles that ghosts will step in, revealing their footprints.',
    usageTip: 'Place near doorways and high-activity areas. Use UV light to see footprints in salt.'
  },
  {
    name: 'Sanity Medication',
    icon: Pill,
    description: 'Pills that restore investigator sanity to delay ghost hunts.',
    usageTip: 'Use when sanity drops below 50% to stay safe longer. Save for emergency situations.'
  },
  {
    name: 'Sound Sensor',
    icon: AudioLines,
    description: 'Detects and displays sound levels in the room where placed.',
    usageTip: 'Monitor from the truck to identify which areas have the most ghost activity.'
  },
  {
    name: 'Incense',
    icon: Wind,
    description: 'Smudge sticks that cleanse an area and can stop ghost hunts temporarily.',
    usageTip: 'Light during a hunt near the ghost to stop it for 6 seconds. Use to clear cursed objects.'
  },
  {
    name: 'Tripod',
    icon: Triangle,
    description: 'A stand for placing video cameras at optimal viewing angles.',
    usageTip: 'Set up in corners for maximum room coverage. Essential for capturing Ghost Orbs.'
  },
  {
    name: 'Fingerprint Powder',
    icon: Eye,
    description: 'Powder that reveals fingerprints on surfaces touched by ghosts.',
    usageTip: 'Dust light switches, doors, and windows. Shows as Ultraviolet evidence type.'
  },
  {
    name: 'Candle',
    icon: Flame,
    description: 'Light source that can be placed and will flicker or extinguish with ghost activity.',
    usageTip: 'Useful for passive ghost detection. Place multiples to track ghost movement.'
  },
  {
    name: 'Glowstick',
    icon: CircleDashed,
    description: 'Chemical light source that lasts indefinitely and can be thrown.',
    usageTip: 'Great for marking explored areas or creating ambient lighting without batteries.'
  },
  {
    name: 'Ouija Board',
    icon: MessageSquare,
    description: 'Cursed object that allows direct communication with ghosts at a sanity cost.',
    usageTip: 'Ask questions for bonus money but monitor sanity closely. Can trigger hunts if it breaks.'
  }
];

/**
 * EquipmentCard Component
 * Renders a single equipment item as a neon-styled card
 */
function EquipmentCard({ equipment }: { equipment: Equipment }) {
  const Icon = equipment.icon;
  
  return (
    <div 
      className="group relative bg-card/60 border border-primary/50 rounded-lg p-4 
                 transition-all duration-300 ease-out
                 hover:border-accent hover:bg-card/80 
                 hover:shadow-neon-purple-hover hover:scale-[1.02]
                 active:scale-[0.98]"
      data-testid={`equipment-card-${equipment.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Icon and Name Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/20 border border-primary/40 
                        group-hover:bg-accent/20 group-hover:border-accent/40 
                        transition-colors duration-300">
          <Icon className="w-5 h-5 text-accent group-hover:text-accent 
                          transition-colors duration-300" />
        </div>
        <h4 className="font-orbitron font-semibold text-sm text-accent 
                       group-hover:text-glow-cyan transition-all duration-300 
                       uppercase tracking-wide">
          {equipment.name}
        </h4>
      </div>
      
      {/* Description */}
      <p className="text-xs font-jetbrains text-foreground/80 mb-3 leading-relaxed">
        {equipment.description}
      </p>
      
      {/* Usage Tip */}
      <div className="bg-black/30 border border-primary/30 rounded-md p-2.5">
        <p className="text-xs font-jetbrains text-primary font-medium mb-1 uppercase tracking-wider">
          Tip:
        </p>
        <p className="text-xs font-jetbrains text-accent/90 leading-relaxed">
          {equipment.usageTip}
        </p>
      </div>
    </div>
  );
}

/**
 * EquipmentPanel Component
 * Main component that renders the grid of equipment cards
 */
export function EquipmentPanel() {
  return (
    <div className="space-y-4" data-testid="equipment-panel">
      {/* Header */}
      <h3 className="text-lg font-orbitron text-accent text-glow-cyan flex items-center gap-2">
        <Radio className="w-5 h-5" />
        Ghost Hunting Equipment
      </h3>
      
      {/* Description */}
      <p className="text-sm font-jetbrains text-muted-foreground">
        Essential tools for paranormal investigation. Click on each item to learn more.
      </p>
      
      {/* Equipment Grid - Responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2
                      scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
        {EQUIPMENT_LIST.map((equipment) => (
          <EquipmentCard key={equipment.name} equipment={equipment} />
        ))}
      </div>
    </div>
  );
}
