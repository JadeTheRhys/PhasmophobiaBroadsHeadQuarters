/**
 * Scary Sound Effects Service
 * 
 * Manages audio playback for scare commands. Plays random horror sound effects
 * from royalty-free sources (Mixkit) when scare events are triggered.
 * 
 * All sounds are from Mixkit (https://mixkit.co) - free for commercial and personal use.
 */

// Royalty-free horror sound effects from Mixkit CDN
// These are preview/download links that work directly in web audio
export const SCARY_SOUND_EFFECTS = [
  {
    id: 'horror-suspense',
    name: 'Horror Suspense Sting',
    url: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3',
    category: 'jumpscare'
  },
  {
    id: 'creepy-whisper',
    name: 'Creepy Whisper',
    url: 'https://assets.mixkit.co/active_storage/sfx/2530/2530-preview.mp3',
    category: 'whisper'
  },
  {
    id: 'door-creak',
    name: 'Creaky Door',
    url: 'https://assets.mixkit.co/active_storage/sfx/2859/2859-preview.mp3',
    category: 'creak'
  },
  {
    id: 'scary-laugh',
    name: 'Scary Laugh',
    url: 'https://assets.mixkit.co/active_storage/sfx/2464/2464-preview.mp3',
    category: 'jumpscare'
  },
  {
    id: 'ghost-breath',
    name: 'Ghostly Breath',
    url: 'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3',
    category: 'ambience'
  },
  {
    id: 'horror-hit',
    name: 'Horror Hit',
    url: 'https://assets.mixkit.co/active_storage/sfx/211/211-preview.mp3',
    category: 'jumpscare'
  },
  {
    id: 'eerie-whisper',
    name: 'Eerie Whisper',
    url: 'https://assets.mixkit.co/active_storage/sfx/2531/2531-preview.mp3',
    category: 'whisper'
  },
  {
    id: 'creepy-ambience',
    name: 'Creepy Ambience',
    url: 'https://assets.mixkit.co/active_storage/sfx/213/213-preview.mp3',
    category: 'ambience'
  },
  {
    id: 'monster-growl',
    name: 'Monster Growl',
    url: 'https://assets.mixkit.co/active_storage/sfx/2466/2466-preview.mp3',
    category: 'jumpscare'
  },
  {
    id: 'haunted-wind',
    name: 'Haunted Wind',
    url: 'https://assets.mixkit.co/active_storage/sfx/2467/2467-preview.mp3',
    category: 'ambience'
  }
];

export type SoundCategory = 'jumpscare' | 'whisper' | 'creak' | 'ambience' | 'all';

// Audio mute state stored in localStorage for persistence
const MUTE_STORAGE_KEY = 'phasmo-hq-audio-muted';

class ScarySoundService {
  private audioElement: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private lastPlayedEventId: string | null = null;

  constructor() {
    // Load mute preference from localStorage
    if (typeof window !== 'undefined') {
      const storedMute = localStorage.getItem(MUTE_STORAGE_KEY);
      this.isMuted = storedMute === 'true';
    }
  }

  /**
   * Get the current mute state
   */
  getMuteState(): boolean {
    return this.isMuted;
  }

  /**
   * Toggle audio mute state
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem(MUTE_STORAGE_KEY, String(this.isMuted));
    }
    // If currently playing audio, mute/unmute it
    if (this.audioElement) {
      this.audioElement.muted = this.isMuted;
    }
    return this.isMuted;
  }

  /**
   * Set mute state explicitly
   */
  setMute(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem(MUTE_STORAGE_KEY, String(this.isMuted));
    }
    if (this.audioElement) {
      this.audioElement.muted = this.isMuted;
    }
  }

  /**
   * Get a random sound from the specified category
   */
  getRandomSound(category: SoundCategory = 'all'): typeof SCARY_SOUND_EFFECTS[0] {
    const sounds = category === 'all' 
      ? SCARY_SOUND_EFFECTS 
      : SCARY_SOUND_EFFECTS.filter(s => s.category === category);
    
    const randomIndex = Math.floor(Math.random() * sounds.length);
    return sounds[randomIndex] || SCARY_SOUND_EFFECTS[0];
  }

  /**
   * Play a random scary sound effect
   * Returns true if sound was played, false if muted or already playing
   * 
   * @param eventId - Unique identifier to prevent duplicate plays for the same event
   * @param category - Optional category filter for the sound
   */
  playRandomSound(eventId?: string, category: SoundCategory = 'all'): boolean {
    // Prevent duplicate plays for the same event
    if (eventId && eventId === this.lastPlayedEventId) {
      return false;
    }
    
    // Don't play if muted
    if (this.isMuted) {
      return false;
    }

    // Don't overlap sounds - wait for current to finish
    if (this.isPlaying && this.audioElement) {
      return false;
    }

    const sound = this.getRandomSound(category);
    this.playSound(sound.url);
    
    if (eventId) {
      this.lastPlayedEventId = eventId;
    }

    return true;
  }

  /**
   * Play a specific sound by URL
   */
  private playSound(url: string): void {
    try {
      // Clean up previous audio element
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.src = '';
      }

      this.audioElement = new Audio(url);
      this.audioElement.muted = this.isMuted;
      this.audioElement.volume = 0.7; // Not too loud
      
      this.audioElement.onplay = () => {
        this.isPlaying = true;
      };

      this.audioElement.onended = () => {
        this.isPlaying = false;
      };

      this.audioElement.onerror = () => {
        console.error('[ScarySounds] Failed to play sound:', url);
        this.isPlaying = false;
      };

      // Play the sound
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Auto-play might be blocked by browser - this is expected
          console.warn('[ScarySounds] Playback blocked:', error.message);
          this.isPlaying = false;
        });
      }
    } catch (error) {
      console.error('[ScarySounds] Error creating audio:', error);
      this.isPlaying = false;
    }
  }

  /**
   * Stop any currently playing sound
   */
  stopSound(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.isPlaying = false;
    }
  }

  /**
   * Check if sound is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

// Export singleton instance
export const scarySoundService = new ScarySoundService();

// Export scare command types that should trigger sounds
export const SCARE_COMMANDS = ['scare', 'jumpscare', 'whisper', 'creak', 'haunt'] as const;
export type ScareCommand = typeof SCARE_COMMANDS[number];

/**
 * Get the sound category for a scare command
 */
export function getSoundCategoryForCommand(command: ScareCommand): SoundCategory {
  switch (command) {
    case 'jumpscare':
      return 'jumpscare';
    case 'whisper':
      return 'whisper';
    case 'creak':
      return 'creak';
    case 'haunt':
      return 'ambience';
    case 'scare':
    default:
      return 'all';
  }
}
