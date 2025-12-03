import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  displayName: text("display_name").notNull(),
  photoUrl: text("photo_url").notNull().default("/avatars/default.png"),
  lastSeen: timestamp("last_seen").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  text: text("text").notNull(),
  isCommand: boolean("is_command").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const ghostEvents = pgTable("ghost_events", {
  id: varchar("id", { length: 36 }).primaryKey(),
  type: text("type").notNull(),
  intensity: integer("intensity").notNull().default(1),
  message: text("message"),
  triggeredBy: varchar("triggered_by", { length: 36 }),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const evidence = pgTable("evidence", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  evidence: text("evidence").notNull(),
  displayName: text("display_name"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const squadStatus = pgTable("squad_status", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().unique(),
  isDead: boolean("is_dead").default(false),
  map: text("map"),
  location: text("location"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ lastSeen: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ timestamp: true });
export const insertGhostEventSchema = createInsertSchema(ghostEvents).omit({ timestamp: true });
export const insertEvidenceSchema = createInsertSchema(evidence).omit({ timestamp: true });
export const insertSquadStatusSchema = createInsertSchema(squadStatus).omit({ timestamp: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertGhostEvent = z.infer<typeof insertGhostEventSchema>;
export type GhostEvent = typeof ghostEvents.$inferSelect;
export type InsertEvidence = z.infer<typeof insertEvidenceSchema>;
export type Evidence = typeof evidence.$inferSelect;
export type InsertSquadStatus = z.infer<typeof insertSquadStatusSchema>;
export type SquadStatus = typeof squadStatus.$inferSelect;

export const GHOST_DATA: Record<string, { evidence: string[]; strength: string; weakness: string }> = {
  Spirit: {
    evidence: ["EMF 5", "Spirit Box", "Writing"],
    strength: "No specific strengths.",
    weakness: "Smudge sticks stop attacks for a long duration."
  },
  Wraith: {
    evidence: ["EMF 5", "Spirit Box", "DOTS"],
    strength: "Never leaves footsteps; rarely touches the ground.",
    weakness: "Extremely affected by salt."
  },
  Phantom: {
    evidence: ["Spirit Box", "Fingerprints", "DOTS"],
    strength: "Looking at it drains sanity faster.",
    weakness: "Photo makes it disappear."
  },
  Poltergeist: {
    evidence: ["Spirit Box", "Fingerprints", "Writing"],
    strength: "Can throw multiple objects at once.",
    weakness: "Weak in empty rooms."
  },
  Banshee: {
    evidence: ["Fingerprints", "DOTS", "Orb"],
    strength: "Stalks one target at a time.",
    weakness: "Crucifix affects it more strongly."
  },
  Jinn: {
    evidence: ["EMF 5", "Fingerprints", "Freezing"],
    strength: "Fast when far from victim.",
    weakness: "Loses ability when power is off."
  },
  Mare: {
    evidence: ["Spirit Box", "Orb", "Writing"],
    strength: "More active in darkness.",
    weakness: "Turning lights on reduces attack chance."
  },
  Revenant: {
    evidence: ["Orb", "Writing", "Freezing"],
    strength: "Very fast while hunting.",
    weakness: "Extremely slow while wandering."
  },
  Shade: {
    evidence: ["EMF 5", "Writing", "Freezing"],
    strength: "Very shy; low activity around groups.",
    weakness: "Cannot hunt with 2+ people in same room."
  },
  Demon: {
    evidence: ["Fingerprints", "Writing", "Freezing"],
    strength: "Can hunt very early.",
    weakness: "Crucifix is more effective."
  },
  Yurei: {
    evidence: ["Orb", "Freezing", "DOTS"],
    strength: "Strong sanity drain.",
    weakness: "Smudging room traps it inside."
  },
  Oni: {
    evidence: ["EMF 5", "Freezing", "DOTS"],
    strength: "Very active when players nearby.",
    weakness: "Easy to identify by behavior."
  },
  Yokai: {
    evidence: ["Spirit Box", "Orb", "DOTS"],
    strength: "Hunts more when players speak near it.",
    weakness: "Cannot hear far-away voices."
  },
  Hantu: {
    evidence: ["Fingerprints", "Orb", "Freezing"],
    strength: "Very fast in cold areas.",
    weakness: "Much slower in warmer areas."
  },
  Goryo: {
    evidence: ["EMF 5", "Fingerprints", "DOTS"],
    strength: "Appears only through camera.",
    weakness: "Rarely seen outside ghost room."
  },
  Myling: {
    evidence: ["EMF 5", "Fingerprints", "Writing"],
    strength: "Very quiet while hunting.",
    weakness: "Parabolic mic hears it clearly."
  },
  Onryo: {
    evidence: ["Spirit Box", "Orb", "Freezing"],
    strength: "Hunts after flames go out.",
    weakness: "Candles protect from hunts."
  },
  Twins: {
    evidence: ["Spirit Box", "EMF 5", "Freezing"],
    strength: "Two distinct activity sources.",
    weakness: "EMF patterns reveal them."
  },
  Raiju: {
    evidence: ["EMF 5", "DOTS", "Orb"],
    strength: "Extremely fast near electronics.",
    weakness: "Causes large EMF spikes."
  },
  Obake: {
    evidence: ["EMF 5", "Fingerprints", "Orb"],
    strength: "Can shapeshift fingerprints.",
    weakness: "Fingerprints disappear faster."
  },
  Mimic: {
    evidence: ["Spirit Box", "Freezing", "Fingerprints", "Orb"],
    strength: "Copies behavior of any ghost.",
    weakness: "Always shows ghost orbs."
  },
  Moroi: {
    evidence: ["Spirit Box", "Writing", "Freezing"],
    strength: "Curses players; heavy sanity drain.",
    weakness: "Smudge sticks blind it longer."
  },
  Deogen: {
    evidence: ["Spirit Box", "Writing", "DOTS"],
    strength: "Fast when far from target.",
    weakness: "Very slow when close to target."
  },
  Thaye: {
    evidence: ["Orb", "Writing", "DOTS"],
    strength: "Very active early in investigation.",
    weakness: "Weakens drastically over time."
  }
};

export const MAP_DATA: Record<string, { name: string; size: string }> = {
  Grafton: { name: "Grafton Farmhouse", size: "Small" },
  Tanglewood: { name: "Tanglewood Street House", size: "Small" },
  Edgefield: { name: "Edgefield Street House", size: "Small" },
  Ridgeview: { name: "Ridgeview Road House", size: "Small" },
  Willow: { name: "Willow Street House", size: "Small" },
  Bleasdale: { name: "Bleasdale Farmhouse", size: "Small" },
  Brownstone: { name: "Brownstone High School", size: "Medium" },
  Prison: { name: "Prison", size: "Medium" },
  Asylum: { name: "Asylum", size: "Large" },
  Maple: { name: "Maple Lodge Campsite", size: "Large" },
  Lighthouse: { name: "Point Hope Lighthouse", size: "Small" },
  Sunny: { name: "Sunny Meadows", size: "Large" }
};

export const CASE_FILES = [
  {
    id: "1",
    title: "The Silent Approach",
    description: "Case File 001: Encounter at Brownstone High School. Docile at first—but EMF spikes were undeniable."
  },
  {
    id: "2",
    title: "Closet Panic",
    description: "Case File 002: Trapped in a closet during a hunt. EMF went critical. Survivor's adrenaline record."
  },
  {
    id: "3",
    title: "Emergency Extraction",
    description: "Case File 003: A Demon rushed the group. Dragged back to the van with seconds to spare."
  },
  {
    id: "4",
    title: "Ouija Board Gamble",
    description: "Case File 004: Asked the wrong question. Sanity wiped instantly. High-risk intel retrieval."
  },
  {
    id: "5",
    title: "The Voodoo Threat",
    description: "Case File 005: Mimic puppeteering a Voodoo Doll. Aggressive, persistent, and personal."
  },
  {
    id: "6",
    title: "Circle of Summoning",
    description: "Case File 006: Ritual circle activation. Immediate manifestation—danger level extreme."
  }
];

export const EVIDENCE_TYPES = [
  "EMF 5",
  "Spirit Box",
  "Fingerprints",
  "Orb",
  "Writing",
  "Freezing",
  "DOTS"
];

export const AVATAR_OPTIONS = [
  "/avatars/ghost1.png",
  "/avatars/ghost2.png",
  "/avatars/ghost3.png",
  "/avatars/hunter1.png",
  "/avatars/hunter2.png",
  "/avatars/hunter3.png"
];
