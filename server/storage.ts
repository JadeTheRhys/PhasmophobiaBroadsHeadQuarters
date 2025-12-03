import { randomUUID } from "crypto";
import type { 
  User, InsertUser, 
  ChatMessage, InsertChatMessage, 
  GhostEvent, InsertGhostEvent,
  Evidence, InsertEvidence,
  SquadStatus, InsertSquadStatus 
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  
  getChatMessages(limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage & { displayName?: string; photoUrl?: string }): Promise<ChatMessage>;
  
  getGhostEvents(limit?: number): Promise<GhostEvent[]>;
  createGhostEvent(event: InsertGhostEvent): Promise<GhostEvent>;
  
  getEvidence(): Promise<Evidence[]>;
  createEvidence(evidence: InsertEvidence): Promise<Evidence>;
  clearEvidence(): Promise<void>;
  
  getSquadStatus(): Promise<SquadStatus[]>;
  updateSquadStatus(status: InsertSquadStatus & { displayName?: string; photoUrl?: string }): Promise<SquadStatus>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chatMessages: Map<string, ChatMessage & { displayName?: string; photoUrl?: string }>;
  private ghostEvents: Map<string, GhostEvent>;
  private evidence: Map<string, Evidence>;
  private squadStatus: Map<string, SquadStatus & { displayName?: string; photoUrl?: string }>;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.ghostEvents = new Map();
    this.evidence = new Map();
    this.squadStatus = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.displayName === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      ...insertUser, 
      lastSeen: new Date() 
    };
    this.users.set(insertUser.id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...data, lastSeen: new Date() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async getChatMessages(limit: number = 50): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values())
      .sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime())
      .slice(-limit);
    return messages;
  }

  async createChatMessage(message: InsertChatMessage & { displayName?: string; photoUrl?: string }): Promise<ChatMessage> {
    const chatMessage: ChatMessage & { displayName?: string; photoUrl?: string } = {
      ...message,
      timestamp: new Date()
    };
    this.chatMessages.set(message.id, chatMessage);
    return chatMessage;
  }

  async getGhostEvents(limit: number = 20): Promise<GhostEvent[]> {
    const events = Array.from(this.ghostEvents.values())
      .sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime())
      .slice(-limit);
    return events;
  }

  async createGhostEvent(event: InsertGhostEvent): Promise<GhostEvent> {
    const ghostEvent: GhostEvent = {
      ...event,
      timestamp: new Date()
    };
    this.ghostEvents.set(event.id, ghostEvent);
    return ghostEvent;
  }

  async getEvidence(): Promise<Evidence[]> {
    return Array.from(this.evidence.values())
      .sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());
  }

  async createEvidence(evidenceItem: InsertEvidence): Promise<Evidence> {
    const ev: Evidence = {
      ...evidenceItem,
      timestamp: new Date()
    };
    this.evidence.set(evidenceItem.id, ev);
    return ev;
  }

  async clearEvidence(): Promise<void> {
    this.evidence.clear();
  }

  async getSquadStatus(): Promise<SquadStatus[]> {
    return Array.from(this.squadStatus.values());
  }

  async updateSquadStatus(status: InsertSquadStatus & { displayName?: string; photoUrl?: string }): Promise<SquadStatus> {
    const existing = this.squadStatus.get(status.userId);
    const squadStatusItem: SquadStatus & { displayName?: string; photoUrl?: string } = {
      id: existing?.id || status.id,
      userId: status.userId,
      isDead: status.isDead ?? existing?.isDead ?? false,
      map: status.map ?? existing?.map ?? null,
      location: status.location ?? existing?.location ?? null,
      displayName: status.displayName ?? existing?.displayName,
      photoUrl: status.photoUrl ?? existing?.photoUrl,
      timestamp: new Date()
    };
    this.squadStatus.set(status.userId, squadStatusItem);
    return squadStatusItem;
  }
}

export const storage = new MemStorage();
