import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { GhostActivityMonitor } from '@/components/GhostActivityMonitor';
import { ActivityLog, LogEntry } from '@/components/ActivityLog';
import { CommandInput } from '@/components/CommandInput';
import { TabNavigation } from '@/components/TabNavigation';
import { ChatPanel, ChatMessageDisplay } from '@/components/ChatPanel';
import { EvidenceTracker } from '@/components/EvidenceTracker';
import { GhostProfile } from '@/components/GhostProfile';
import { CaseFilesGallery } from '@/components/CaseFilesGallery';
import { SquadStatus, SquadMember } from '@/components/SquadStatus';
import { ProfileEditor } from '@/components/ProfileEditor';
import { MapDisplay } from '@/components/MapDisplay';
import { useAppStore } from '@/lib/store';
import { 
  initializeFirebaseAuth,
  sendChatMessage,
  triggerGhostEvent,
  updateSquadStatus,
  saveEvidence,
  subscribeToChatMessages,
  subscribeToGhostEvents,
  subscribeToSquadStatus,
  FirebaseChatMessage,
  FirebaseGhostEvent,
  FirebaseSquadStatus
} from '@/lib/firebase';

export default function Home() {
  const { 
    userId, 
    displayName, 
    photoUrl, 
    setUser, 
    activeTab, 
    isFlickering, 
    isShaking,
    triggerEffect,
    setEmfLevel,
    setFirebaseOnline
  } = useAppStore();
  
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [chatMessages, setChatMessages] = useState<FirebaseChatMessage[]>([]);
  const [squadMembers, setSquadMembers] = useState<FirebaseSquadStatus[]>([]);
  
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      type: 'system',
      message: 'Command center initializing...',
      timestamp: new Date()
    }
  ]);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        const { userId: uid, isOnline } = await initializeFirebaseAuth();
        setUser(uid, displayName || 'Ghost Hunter', photoUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=ghost1&backgroundColor=b71cff');
        setIsFirebaseReady(true);
        setFirebaseOnline(isOnline);
        
        setLogs(prev => [...prev, {
          id: Date.now().toString(),
          type: 'system',
          message: isOnline 
            ? `Firebase connected. Agent ${uid.slice(0, 8)} authenticated.`
            : `Using offline mode. Agent ${uid.slice(0, 8)} initialized.`,
          timestamp: new Date()
        }]);

        if (isOnline) {
          await updateSquadStatus(
            displayName || 'Ghost Hunter',
            photoUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=ghost1&backgroundColor=b71cff'
          );
        }
      } catch (error) {
        console.error('Firebase init error:', error);
        setFirebaseOnline(false);
        setLogs(prev => [...prev, {
          id: Date.now().toString(),
          type: 'event',
          message: 'Firebase connection failed. Using offline mode.',
          timestamp: new Date()
        }]);
      }
    };

    initFirebase();
  }, []);

  useEffect(() => {
    if (!isFirebaseReady) return;

    const unsubChat = subscribeToChatMessages((messages) => {
      setChatMessages(messages);
    });

    const unsubEvents = subscribeToGhostEvents((event) => {
      if (event.type === 'hunt' || event.type === 'slam') {
        triggerEffect('hunt');
      } else if (event.type === 'flicker' || event.type === 'manifest') {
        triggerEffect('flicker');
      }
      setEmfLevel(event.intensity || 3);
      
      setLogs(prev => {
        if (prev.some(log => log.id === `event-${event.id}`)) return prev;
        return [...prev, {
          id: `event-${event.id}`,
          type: event.type === 'hunt' ? 'hunt' : 'event',
          message: event.message,
          timestamp: event.timestamp
        }];
      });
    });

    const unsubSquad = subscribeToSquadStatus((statuses) => {
      setSquadMembers(statuses);
    });

    return () => {
      unsubChat();
      unsubEvents();
      unsubSquad();
    };
  }, [isFirebaseReady, triggerEffect, setEmfLevel]);

  const handleSendMessage = useCallback(async (text: string, isCommand: boolean) => {
    if (!isFirebaseReady) return;

    if (isCommand) {
      const cmd = text.substring(1).toLowerCase();
      const [command, value] = cmd.split(':');

      switch (command) {
        case 'hunt':
          await triggerGhostEvent('hunt', 5);
          break;
        case 'flicker':
          await triggerGhostEvent('flicker', 3);
          break;
        case 'manifest':
          await triggerGhostEvent('manifest', 4);
          break;
        case 'slam':
          await triggerGhostEvent('slam', 4);
          break;
        case 'curse':
          await triggerGhostEvent('curse', 5);
          break;
        case 'dead':
          if (value) {
            await updateSquadStatus(displayName, photoUrl, true);
            setLogs(prev => [...prev, {
              id: Date.now().toString(),
              type: 'event',
              message: `${value || displayName} has been killed by the ghost!`,
              timestamp: new Date()
            }]);
          }
          break;
        case 'revive':
          if (value) {
            await updateSquadStatus(displayName, photoUrl, false);
            setLogs(prev => [...prev, {
              id: Date.now().toString(),
              type: 'system',
              message: `${value || displayName} has been revived.`,
              timestamp: new Date()
            }]);
          }
          break;
        case 'location':
          if (value) {
            await updateSquadStatus(displayName, photoUrl, undefined, undefined, value);
            setLogs(prev => [...prev, {
              id: Date.now().toString(),
              type: 'system',
              message: `${displayName} moved to: ${value}`,
              timestamp: new Date()
            }]);
          }
          break;
        case 'evidence':
          if (value) {
            await saveEvidence(value.toUpperCase(), displayName);
            setLogs(prev => [...prev, {
              id: Date.now().toString(),
              type: 'command',
              message: `Evidence logged: ${value.toUpperCase()}`,
              timestamp: new Date()
            }]);
          }
          break;
        default:
          setLogs(prev => [...prev, {
            id: Date.now().toString(),
            type: 'command',
            message: `Unknown command: ${command}`,
            timestamp: new Date()
          }]);
      }
    }

    await sendChatMessage(text, displayName, photoUrl, isCommand);
  }, [isFirebaseReady, displayName, photoUrl]);

  const handleTriggerHunt = useCallback(async () => {
    if (!isFirebaseReady) return;
    await triggerGhostEvent('hunt', 5);
  }, [isFirebaseReady]);

  const handleSaveProfile = useCallback(async (newName: string, newPhoto: string) => {
    setLogs(prev => [...prev, {
      id: Date.now().toString(),
      type: 'system',
      message: `Profile updated: ${newName}`,
      timestamp: new Date()
    }]);
    await updateSquadStatus(newName, newPhoto);
  }, []);

  const handleMapChange = useCallback(async (map: string) => {
    await updateSquadStatus(displayName, photoUrl, undefined, map);
    setLogs(prev => [...prev, {
      id: Date.now().toString(),
      type: 'system',
      message: `Investigation location set: ${map}`,
      timestamp: new Date()
    }]);
  }, [displayName, photoUrl]);

  const handleEvidenceChange = useCallback(async (evidence: string[]) => {
    if (evidence.length > 0) {
      const latestEvidence = evidence[evidence.length - 1];
      await saveEvidence(latestEvidence, displayName);
    }
  }, [displayName]);

  const chatMessagesDisplay: ChatMessageDisplay[] = chatMessages.map((msg) => ({
    id: msg.id,
    userId: msg.userId,
    displayName: msg.displayName,
    photoUrl: msg.photoUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=default',
    text: msg.text,
    isCommand: msg.isCommand,
    timestamp: msg.timestamp
  }));

  const squadMembersDisplay: SquadMember[] = squadMembers.map((status) => ({
    id: status.id,
    userId: status.userId,
    displayName: status.displayName,
    photoUrl: status.photoUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=default',
    isDead: status.isDead,
    map: status.map || 'Unknown',
    location: status.location || 'Unknown'
  }));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatPanel messages={chatMessagesDisplay} />;
      case 'evidence':
        return <EvidenceTracker onEvidenceChange={handleEvidenceChange} />;
      case 'ghost':
        return <GhostProfile />;
      case 'cases':
        return <CaseFilesGallery />;
      case 'squad':
        return (
          <div className="space-y-6">
            <SquadStatus members={squadMembersDisplay} />
            <MapDisplay onMapChange={handleMapChange} />
          </div>
        );
      case 'profile':
        return <ProfileEditor onSave={handleSaveProfile} />;
      default:
        return <ChatPanel messages={chatMessagesDisplay} />;
    }
  };

  return (
    <div 
      className={`min-h-screen p-4 sm:p-6 lg:p-10 ${isFlickering ? 'animate-flicker' : ''} ${isShaking ? 'animate-shake' : ''}`}
      data-testid="home-page"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <GhostActivityMonitor onTriggerHunt={handleTriggerHunt} />
            <ActivityLog logs={logs} />
            <CommandInput onSendMessage={handleSendMessage} />
          </div>

          <div className="space-y-6">
            <div className="phasmo-card">
              <h2 className="phasmo-subtitle text-lg font-orbitron mb-4" data-testid="text-data-terminal">
                DATA TERMINAL
              </h2>
              <TabNavigation />
              <div className="mt-6" data-testid="tab-content">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
