import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArchitectureElementSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Architecture Elements API
  app.get("/api/architecture-elements", async (req, res) => {
    try {
      const { category, framework } = req.query;
      
      let elements;
      if (category && typeof category === 'string') {
        elements = await storage.getArchitectureElementsByCategory(category);
      } else if (framework && typeof framework === 'string') {
        elements = await storage.getArchitectureElementsByFramework(framework);
      } else {
        elements = await storage.getArchitectureElements();
      }
      
      res.json(elements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch architecture elements" });
    }
  });

  app.post("/api/architecture-elements", async (req, res) => {
    try {
      const validatedData = insertArchitectureElementSchema.parse(req.body);
      const element = await storage.createArchitectureElement(validatedData);
      res.status(201).json(element);
    } catch (error) {
      res.status(400).json({ message: "Invalid element data" });
    }
  });

  // Recent Elements API (requires user context)
  app.get("/api/recent-elements/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const recentElements = await storage.getRecentElementsByUser(userId);
      res.json(recentElements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent elements" });
    }
  });

  app.post("/api/recent-elements", async (req, res) => {
    try {
      const { userId, elementId } = req.body;
      
      if (!userId || !elementId) {
        return res.status(400).json({ message: "userId and elementId are required" });
      }

      const recentElement = await storage.addRecentElement({
        userId,
        elementId,
        usageCount: 1
      });
      
      res.status(201).json(recentElement);
    } catch (error) {
      res.status(500).json({ message: "Failed to add recent element" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
