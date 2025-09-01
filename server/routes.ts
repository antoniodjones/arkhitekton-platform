import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArchitectureElementSchema } from "@shared/schema";
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic AI client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// The newest Anthropic model is "claude-sonnet-4-20250514"
const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

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

  // AI Assistant endpoint for architecture insights
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // System prompt for architecture guidance
      const systemPrompt = `You are an expert enterprise architect and AI assistant for ARKHITEKTON, a sophisticated architecture modeling platform. You help architects understand models, analyze relationships, and provide strategic guidance.

Your expertise includes:
- Enterprise Architecture frameworks (ArchiMate, TOGAF, BPMN)
- Cloud platforms (AWS, Azure, GCP)
- Systems design patterns and best practices
- Business-to-technology alignment
- Architecture governance and risk assessment

Provide insightful, practical advice that helps architects make better design decisions. Be concise but thorough. Focus on actionable insights.`;

      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Context: ${context || 'General architecture inquiry'}

Question: ${message}`
          }
        ],
      });

      const aiResponse = response.content[0].type === 'text' ? response.content[0].text : 'Unable to generate response';
      
      res.json({ 
        response: aiResponse,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('AI Chat Error:', error);
      res.status(500).json({ 
        error: 'Failed to process AI request',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // AI Assistant endpoint for element analysis
  app.post('/api/ai/analyze-element', async (req, res) => {
    try {
      const { elementType, framework, businessContext } = req.body;
      
      if (!elementType || !framework) {
        return res.status(400).json({ error: 'Element type and framework are required' });
      }

      const analysisPrompt = `Analyze this architecture element: ${elementType} from ${framework} framework.

Business Context: ${businessContext || 'Not provided'}

Provide:
1. Strategic purpose and business value
2. Common usage patterns and best practices
3. Typical relationships with other elements
4. Implementation considerations
5. Governance and risk factors

Keep response concise but comprehensive.`;

      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 800,
        system: 'You are an expert enterprise architect providing element analysis for ARKITEKTON.',
        messages: [{ role: 'user', content: analysisPrompt }],
      });

      res.json({ 
        analysis: response.content[0].type === 'text' ? response.content[0].text : 'Unable to analyze element',
        element: elementType,
        framework: framework,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('AI Element Analysis Error:', error);
      res.status(500).json({ 
        error: 'Failed to analyze element',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
