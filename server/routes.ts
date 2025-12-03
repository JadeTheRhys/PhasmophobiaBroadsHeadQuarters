import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { randomUUID } from "crypto";
import { insertChatMessageSchema, insertGhostEventSchema, insertEvidenceSchema, insertSquadStatusSchema } from "@shared/schema";
import { z } from "zod";

const connectedClients = new Set<WebSocket>();

function broadcast(type: string, data: any) {
  const message = JSON.stringify({ type, data });
  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    connectedClients.add(ws);
    console.log("WebSocket client connected. Total:", connectedClients.size);

    ws.on("close", () => {
      connectedClients.delete(ws);
      console.log("WebSocket client disconnected. Total:", connectedClients.size);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      connectedClients.delete(ws);
    });
  });

  app.get("/api/chat", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(100);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const chatSchema = z.object({
        userId: z.string().min(1),
        text: z.string().min(1),
        isCommand: z.boolean().optional().default(false),
        displayName: z.string().optional(),
        photoUrl: z.string().optional()
      });

      const parsed = chatSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { userId, text, isCommand, displayName, photoUrl } = parsed.data;

      const message = await storage.createChatMessage({
        id: randomUUID(),
        userId,
        text,
        isCommand,
        displayName,
        photoUrl
      });

      broadcast("chat", message);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to create chat message" });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getGhostEvents(50);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ghost events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventSchema = z.object({
        type: z.string().min(1),
        intensity: z.number().min(1).max(5).optional(),
        triggeredBy: z.string().optional()
      });

      const parsed = eventSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { type, intensity, triggeredBy } = parsed.data;

      const eventMessages: Record<string, string> = {
        hunt: "HUNT INITIATED! All agents take cover immediately!",
        flicker: "Lights flickering detected. Paranormal activity rising.",
        manifest: "Ghost manifestation in progress...",
        slam: "Door SLAM! Ghost activity confirmed.",
        curse: "Cursed object interaction detected!",
        event: "Paranormal event registered."
      };

      const event = await storage.createGhostEvent({
        id: randomUUID(),
        type,
        intensity: intensity || Math.floor(Math.random() * 5) + 1,
        message: eventMessages[type] || eventMessages.event,
        triggeredBy: triggeredBy || null
      });

      broadcast("event", event);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to create ghost event" });
    }
  });

  app.get("/api/evidence", async (req, res) => {
    try {
      const evidence = await storage.getEvidence();
      res.json(evidence);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch evidence" });
    }
  });

  app.post("/api/evidence", async (req, res) => {
    try {
      const evidenceSchema = z.object({
        userId: z.string().min(1),
        evidence: z.string().min(1),
        displayName: z.string().optional()
      });

      const parsed = evidenceSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { userId, evidence, displayName } = parsed.data;

      const evidenceItem = await storage.createEvidence({
        id: randomUUID(),
        userId,
        evidence,
        displayName
      });

      broadcast("evidence", evidenceItem);
      res.status(201).json(evidenceItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to create evidence" });
    }
  });

  app.delete("/api/evidence", async (req, res) => {
    try {
      await storage.clearEvidence();
      broadcast("evidence_cleared", {});
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to clear evidence" });
    }
  });

  app.get("/api/squad", async (req, res) => {
    try {
      const statuses = await storage.getSquadStatus();
      res.json(statuses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch squad status" });
    }
  });

  app.post("/api/squad/status", async (req, res) => {
    try {
      const statusSchema = z.object({
        userId: z.string().min(1),
        isDead: z.boolean().optional(),
        map: z.string().optional(),
        location: z.string().optional(),
        displayName: z.string().optional(),
        photoUrl: z.string().optional()
      });

      const parsed = statusSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { userId, isDead, map, location, displayName, photoUrl } = parsed.data;

      const status = await storage.updateSquadStatus({
        id: randomUUID(),
        userId,
        isDead,
        map,
        location,
        displayName,
        photoUrl
      });

      broadcast("squad", status);
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to update squad status" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userSchema = z.object({
        id: z.string().min(1),
        displayName: z.string().min(1),
        photoUrl: z.string().optional()
      });

      const parsed = userSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { id, displayName, photoUrl } = parsed.data;

      const existingUser = await storage.getUser(id);
      if (existingUser) {
        const updatedUser = await storage.updateUser(id, { displayName, photoUrl });
        return res.json(updatedUser);
      }

      const user = await storage.createUser({
        id,
        displayName,
        photoUrl: photoUrl || "/avatars/default.png"
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  return httpServer;
}
