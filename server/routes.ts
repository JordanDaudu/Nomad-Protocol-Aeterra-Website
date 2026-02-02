import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getDevlogs, getDevlogById, getLore, getLoreById, getGallery, getSystems, getSystemById } from "./content";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Devlogs API
  app.get("/api/devlogs", (req, res) => {
    try {
      const devlogs = getDevlogs();
      res.json(devlogs);
    } catch (error) {
      console.error("Error fetching devlogs:", error);
      res.status(500).json({ error: "Failed to fetch devlogs" });
    }
  });

  app.get("/api/devlogs/:id", (req, res) => {
    try {
      const devlog = getDevlogById(req.params.id);
      if (!devlog) {
        return res.status(404).json({ error: "Devlog not found" });
      }
      res.json(devlog);
    } catch (error) {
      console.error("Error fetching devlog:", error);
      res.status(500).json({ error: "Failed to fetch devlog" });
    }
  });

  // Lore API
  app.get("/api/lore", (req, res) => {
    try {
      const lore = getLore();
      res.json(lore);
    } catch (error) {
      console.error("Error fetching lore:", error);
      res.status(500).json({ error: "Failed to fetch lore" });
    }
  });

  app.get("/api/lore/:id", (req, res) => {
    try {
      const lore = getLoreById(req.params.id);
      if (!lore) {
        return res.status(404).json({ error: "Lore entry not found" });
      }
      res.json(lore);
    } catch (error) {
      console.error("Error fetching lore:", error);
      res.status(500).json({ error: "Failed to fetch lore" });
    }
  });

  // Gallery API
  app.get("/api/gallery", (req, res) => {
    try {
      const gallery = getGallery();
      res.json(gallery);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      res.status(500).json({ error: "Failed to fetch gallery" });
    }
  });

  // Systems API
  app.get("/api/systems", (req, res) => {
    try {
      const systems = getSystems();
      res.json(systems);
    } catch (error) {
      console.error("Error fetching systems:", error);
      res.status(500).json({ error: "Failed to fetch systems" });
    }
  });

  app.get("/api/systems/:id", (req, res) => {
    try {
      const system = getSystemById(req.params.id);
      if (!system) {
        return res.status(404).json({ error: "System not found" });
      }
      res.json(system);
    } catch (error) {
      console.error("Error fetching system:", error);
      res.status(500).json({ error: "Failed to fetch system" });
    }
  });

  return httpServer;
}
