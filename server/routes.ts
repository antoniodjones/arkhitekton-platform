import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, memStorage } from "./storage";
import { z } from "zod";
import {
  insertArchitectureElementSchema,
  insertKnowledgeBasePageSchema,
  insertPageCommentSchema,
  insertUserStorySchema,
  updateUserStorySchema,
  insertDefectSchema,
  updateDefectSchema,
  insertEpicSchema,
  insertIntegrationChannelSchema,
  insertObjectSyncFlowSchema,
  insertApplicationSettingSchema,
  insertApplicationSchema,
  updateApplicationSchema,
  insertJiraMappingSchema,
  insertJiraSyncLogSchema,
  insertJiraWebhookEventSchema,
  type KnowledgeBasePage,
  type IntegrationChannel,
  type ObjectSyncFlow,
  type InsertJiraMapping,
  type InsertJiraSyncLog,
  type InsertJiraWebhookEvent,
  insertArchitecturalModelSchema,
  insertArchitecturalObjectSchema,
  insertObjectConnectionSchema,
  type InsertArchitecturalModel,
  type InsertArchitecturalObject
} from "@shared/schema";
import Anthropic from '@anthropic-ai/sdk';
import { encrypt, decrypt, isEncrypted } from './encryption';
import { validateGherkinFormat } from '@shared/gherkin-validator';

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

  // Knowledge Base API - Hierarchical Documentation System

  // Get all root-level pages (no parent)
  app.get("/api/knowledge-base/pages", async (req, res) => {
    try {
      const { parentId, search, category } = req.query;
      let pages;

      if (search && typeof search === 'string') {
        pages = await storage.searchKnowledgeBasePages(search);
      } else if (category && typeof category === 'string') {
        pages = await storage.getKnowledgeBasePagesByCategory(category);
      } else if (parentId === 'null' || !parentId) {
        // Get root pages (no parent)
        pages = await storage.getRootKnowledgeBasePages();
      } else if (typeof parentId === 'string') {
        // Get child pages of specific parent
        pages = await storage.getChildKnowledgeBasePages(parentId);
      } else {
        pages = await storage.getAllKnowledgeBasePages();
      }

      res.json(pages);
    } catch (error) {
      console.error("Failed to fetch knowledge base pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  // Get single page by ID
  app.get("/api/knowledge-base/pages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const page = await storage.getKnowledgeBasePage(id);

      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }

      res.json(page);
    } catch (error) {
      console.error("Failed to fetch page:", error);
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  // Create new page - simplified
  app.post("/api/knowledge-base/pages", async (req, res) => {
    try {
      // Auto-generate slug if not provided
      const pageData = {
        title: req.body.title,
        slug: req.body.slug || req.body.title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
        content: req.body.content || "",
        category: req.body.category || "General",
        status: req.body.status || "draft",
        tags: req.body.tags || [],
        parentPageId: req.body.parentPageId || null,
        order: req.body.order || 0
      };

      const validatedData = insertKnowledgeBasePageSchema.parse(pageData);
      const page = await storage.createKnowledgeBasePage(validatedData);
      res.status(201).json(page);
    } catch (error) {
      console.error("Failed to create page:", error);
      res.status(400).json({ message: "Failed to create page", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Update page
  app.patch("/api/knowledge-base/pages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // If title changed, update slug and path
      if (updates.title && !updates.slug) {
        updates.slug = updates.title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }

      const updatedPage = await storage.updateKnowledgeBasePage(id, updates);
      if (!updatedPage) {
        return res.status(404).json({ message: "Page not found" });
      }

      res.json(updatedPage);
    } catch (error) {
      console.error("Failed to update page:", error);
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  // Delete page
  app.delete("/api/knowledge-base/pages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteKnowledgeBasePage(id);

      if (!success) {
        return res.status(404).json({ message: "Page not found" });
      }

      res.json({ message: "Page deleted successfully" });
    } catch (error) {
      console.error("Failed to delete page:", error);
      res.status(500).json({ message: "Failed to delete page" });
    }
  });

  // Get page hierarchy (breadcrumb trail)
  app.get("/api/knowledge-base/pages/:id/breadcrumbs", async (req, res) => {
    try {
      const { id } = req.params;
      const breadcrumbs = await storage.getPageBreadcrumbs(id);
      res.json(breadcrumbs);
    } catch (error) {
      console.error("Failed to fetch breadcrumbs:", error);
      res.status(500).json({ message: "Failed to fetch breadcrumbs" });
    }
  });

  // Move page to different parent (drag & drop support)
  app.post("/api/knowledge-base/pages/:id/move", async (req, res) => {
    try {
      const { id } = req.params;
      const { newParentId, newOrder } = req.body;

      const success = await storage.moveKnowledgeBasePage(id, newParentId, newOrder);
      if (!success) {
        return res.status(404).json({ message: "Page not found" });
      }

      res.json({ message: "Page moved successfully" });
    } catch (error) {
      console.error("Failed to move page:", error);
      res.status(500).json({ message: "Failed to move page" });
    }
  });

  // User Stories API - Enterprise Story Management

  // Get all user stories with enterprise pagination and sorting
  app.get("/api/user-stories", async (req, res) => {
    try {
      const { assignee, epicId, search, page = '1', pageSize = '25', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      // Validate pagination parameters
      const parsedPage = Math.max(parseInt(page as string) || 1, 1);
      const allowedPageSizes = [10, 25, 50, 100];
      let parsedPageSize = parseInt(pageSize as string) || 25;

      // Allow custom page sizes but cap at 200 for performance
      if (!allowedPageSizes.includes(parsedPageSize)) {
        parsedPageSize = Math.min(Math.max(parsedPageSize, 10), 200);
      }

      // Validate sort parameters
      const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'priority', 'status', 'storyPoints'];
      const finalSortBy = allowedSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt';
      const finalSortOrder = ['asc', 'desc'].includes(sortOrder as string) ? sortOrder as string : 'desc';

      let stories;
      if (epicId && typeof epicId === 'string') {
        // Epic ID can be text format (EPIC-1, EPIC-2, etc.)
        if (epicId.trim().length === 0) {
          return res.status(400).json({ message: "Invalid epicId" });
        }
        stories = await storage.getUserStoriesByEpic(epicId);
      } else if (assignee && typeof assignee === 'string') {
        // Basic assignee validation (non-empty string)
        if (assignee.trim().length === 0) {
          return res.status(400).json({ message: "Invalid assignee" });
        }
        stories = await storage.getUserStoriesByAssignee(assignee);
      } else {
        stories = await storage.getAllUserStories();
      }

      // Apply search filter
      if (search && typeof search === 'string' && search.trim().length > 0) {
        const searchLower = search.trim().toLowerCase();
        stories = stories.filter(story =>
          story.id.toLowerCase().includes(searchLower) ||
          story.title.toLowerCase().includes(searchLower) ||
          (story.description && story.description.toLowerCase().includes(searchLower)) ||
          (story.acceptanceCriteria && story.acceptanceCriteria.toLowerCase().includes(searchLower))
        );
      }

      // Apply sorting
      const sortedStories = stories.sort((a, b) => {
        let aVal = a[finalSortBy as keyof typeof a];
        let bVal = b[finalSortBy as keyof typeof b];

        // Handle Date objects
        if (aVal instanceof Date) aVal = aVal.getTime();
        if (bVal instanceof Date) bVal = bVal.getTime();

        // Handle null/undefined
        if (aVal == null) aVal = '';
        if (bVal == null) bVal = '';

        if (finalSortOrder === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        } else {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        }
      });

      // Calculate pagination
      const total = sortedStories.length;
      const totalPages = Math.ceil(total / parsedPageSize);
      const currentPage = Math.min(parsedPage, totalPages || 1);
      const offset = (currentPage - 1) * parsedPageSize;
      const paginatedStories = sortedStories.slice(offset, offset + parsedPageSize);

      res.json({
        items: paginatedStories,
        total,
        page: currentPage,
        pageSize: parsedPageSize,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        sort: {
          sortBy: finalSortBy,
          sortOrder: finalSortOrder
        }
      });
    } catch (error) {
      console.error("Failed to fetch user stories:", error);
      res.status(500).json({ message: "Failed to fetch user stories" });
    }
  });

  // Get single user story
  app.get("/api/user-stories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const story = await storage.getUserStory(id);

      if (!story) {
        return res.status(404).json({ message: "User story not found" });
      }

      res.json(story);
    } catch (error) {
      console.error("Failed to fetch user story:", error);
      res.status(500).json({ message: "Failed to fetch user story" });
    }
  });

  // Create new user story with referential integrity checks
  app.post("/api/user-stories", async (req, res) => {
    try {
      const validatedData = insertUserStorySchema.parse(req.body);

      const story = await storage.createUserStory(validatedData);
      res.status(201).json(story);
    } catch (error) {
      console.error("Failed to create user story:", error);

      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.message
        });
      }

      res.status(400).json({
        message: "Failed to create user story",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Update user story with enterprise validation and integrity checks
  app.patch("/api/user-stories/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Validate story ID format
      if (!id || !id.startsWith('US-')) {
        return res.status(400).json({
          message: "Invalid story ID format. Expected US-*"
        });
      }

      // Validate update data with proper schema
      const validatedUpdates = updateUserStorySchema.parse(req.body);

      // Check if story exists first
      const existingStory = await storage.getUserStory(id);
      if (!existingStory) {
        return res.status(404).json({ message: "User story not found" });
      }

      // Enforce Gherkin format requirement for in-progress status
      if (validatedUpdates.status === 'in-progress') {
        const criteriaToCheck = validatedUpdates.acceptanceCriteria ?? existingStory.acceptanceCriteria;

        if (!criteriaToCheck || criteriaToCheck.trim().length === 0) {
          return res.status(400).json({
            message: "Cannot move story to in-progress: acceptance criteria are required"
          });
        }

        // Validate Gherkin format
        const validation = validateGherkinFormat(criteriaToCheck);

        if (!validation.isValid) {
          return res.status(400).json({
            message: "Cannot move story to in-progress: acceptance criteria must follow Gherkin format (Given/When/Then)",
            errors: validation.errors
          });
        }
      }

      // Enforce defect blocking - prevent "done" status when open defects exist
      if (validatedUpdates.status === 'done' || validatedUpdates.status === 'review') {
        const openDefects = await storage.getOpenDefectsByStory(id);

        if (openDefects.length > 0) {
          const criticalDefects = openDefects.filter(d => d.severity === 'critical').length;
          const highDefects = openDefects.filter(d => d.severity === 'high').length;

          return res.status(400).json({
            message: `Cannot move story to ${validatedUpdates.status}: ${openDefects.length} open defect(s) must be resolved first`,
            defects: {
              total: openDefects.length,
              critical: criticalDefects,
              high: highDefects,
              ids: openDefects.map(d => d.id)
            }
          });
        }
      }

      const updatedStory = await storage.updateUserStory(id, validatedUpdates);
      if (!updatedStory) {
        return res.status(404).json({ message: "User story not found" });
      }

      res.json(updatedStory);
    } catch (error) {
      console.error("Failed to update user story:", error);

      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.message
        });
      }

      res.status(500).json({ message: "Failed to update user story" });
    }
  });

  // Delete user story
  app.delete("/api/user-stories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteUserStory(id);

      if (!success) {
        return res.status(404).json({ message: "User story not found" });
      }

      res.json({ message: "User story deleted successfully" });
    } catch (error) {
      console.error("Failed to delete user story:", error);
      res.status(500).json({ message: "Failed to delete user story" });
    }
  });

  // ============================================================
  // DEFECT API ENDPOINTS - Quality Assurance & Bug Tracking
  // ============================================================

  // Get all defects or filter by story/severity/assignee
  app.get("/api/defects", async (req, res) => {
    try {
      const { userStoryId, severity, assignee, open, search } = req.query;

      let defects;
      if (userStoryId && typeof userStoryId === 'string') {
        if (open === 'true') {
          defects = await storage.getOpenDefectsByStory(userStoryId);
        } else {
          defects = await storage.getDefectsByStory(userStoryId);
        }
      } else if (severity && typeof severity === 'string') {
        defects = await storage.getDefectsBySeverity(severity);
      } else if (assignee && typeof assignee === 'string') {
        defects = await storage.getDefectsByAssignee(assignee);
      } else {
        defects = await storage.getAllDefects();
      }

      // Apply search filter
      if (search && typeof search === 'string' && search.trim().length > 0) {
        const searchLower = search.trim().toLowerCase();
        defects = defects.filter(defect =>
          defect.title.toLowerCase().includes(searchLower) ||
          (defect.description && defect.description.toLowerCase().includes(searchLower)) ||
          defect.userStoryId.toLowerCase().includes(searchLower)
        );
      }

      res.json({ data: defects });
    } catch (error) {
      console.error("Failed to fetch defects:", error);
      res.status(500).json({ message: "Failed to fetch defects" });
    }
  });

  // Get single defect
  app.get("/api/defects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const defect = await storage.getDefect(id);

      if (!defect) {
        return res.status(404).json({ message: "Defect not found" });
      }

      res.json({ data: defect });
    } catch (error) {
      console.error("Failed to fetch defect:", error);
      res.status(500).json({ message: "Failed to fetch defect" });
    }
  });

  // Create defect
  app.post("/api/defects", async (req, res) => {
    try {
      const validatedData = insertDefectSchema.parse(req.body);

      // Verify the user story exists
      const story = await storage.getUserStory(validatedData.userStoryId);
      if (!story) {
        return res.status(404).json({ message: "User story not found" });
      }

      const defect = await storage.createDefect(validatedData);
      res.status(201).json(defect);
    } catch (error) {
      console.error("Failed to create defect:", error);

      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.message
        });
      }

      res.status(400).json({
        message: "Failed to create defect",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Update defect
  app.patch("/api/defects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedUpdates = updateDefectSchema.parse(req.body);

      const updatedDefect = await storage.updateDefect(id, validatedUpdates);
      if (!updatedDefect) {
        return res.status(404).json({ message: "Defect not found" });
      }

      res.json(updatedDefect);
    } catch (error) {
      console.error("Failed to update defect:", error);

      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.message
        });
      }

      res.status(500).json({ message: "Failed to update defect" });
    }
  });

  // Resolve defect
  app.post("/api/defects/:id/resolve", async (req, res) => {
    try {
      const { id } = req.params;
      const { resolution, rootCause } = req.body;

      if (!resolution || typeof resolution !== 'string') {
        return res.status(400).json({ message: "Resolution is required" });
      }

      const resolvedDefect = await storage.resolveDefect(id, resolution, rootCause);
      if (!resolvedDefect) {
        return res.status(404).json({ message: "Defect not found" });
      }

      res.json(resolvedDefect);
    } catch (error) {
      console.error("Failed to resolve defect:", error);
      res.status(500).json({ message: "Failed to resolve defect" });
    }
  });

  // Delete defect
  app.delete("/api/defects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteDefect(id);

      if (!success) {
        return res.status(404).json({ message: "Defect not found" });
      }

      res.json({ message: "Defect deleted successfully" });
    } catch (error) {
      console.error("Failed to delete defect:", error);
      res.status(500).json({ message: "Failed to delete defect" });
    }
  });

  // ============================================================
  // EPIC API ENDPOINTS - Enterprise Architecture Value Streams
  // ============================================================

  // Get all epics
  app.get("/api/epics", async (req, res) => {
    try {
      const { valueStream, status } = req.query;

      let epics;
      if (valueStream && typeof valueStream === 'string') {
        epics = await storage.getEpicsByValueStream(valueStream);
      } else if (status && typeof status === 'string') {
        epics = await storage.getEpicsByStatus(status);
      } else {
        epics = await storage.getAllEpics();
      }

      // Calculate progress for each epic
      const epicsWithProgress = await Promise.all(epics.map(async (epic) => {
        const stories = await storage.getUserStoriesByEpic(epic.id);
        const totalStoryPoints = stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
        const completedStoryPoints = stories
          .filter(s => s.status === 'done')
          .reduce((sum, s) => sum + (s.storyPoints || 0), 0);
        const completionPercentage = totalStoryPoints > 0
          ? Math.round((completedStoryPoints / totalStoryPoints) * 100)
          : 0;

        return {
          ...epic,
          totalStoryPoints,
          completedStoryPoints,
          completionPercentage,
          storyCount: stories.length
        };
      }));

      res.json({ data: epicsWithProgress });
    } catch (error) {
      console.error("Failed to fetch epics:", error);
      res.status(500).json({ message: "Failed to fetch epics" });
    }
  });

  // Get single epic
  app.get("/api/epics/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const epic = await storage.getEpic(id);

      if (!epic) {
        return res.status(404).json({ message: "Epic not found" });
      }

      // Get stories for this epic
      const stories = await storage.getUserStoriesByEpic(id);
      const totalStoryPoints = stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
      const completedStoryPoints = stories
        .filter(s => s.status === 'done')
        .reduce((sum, s) => sum + (s.storyPoints || 0), 0);
      const completionPercentage = totalStoryPoints > 0
        ? Math.round((completedStoryPoints / totalStoryPoints) * 100)
        : 0;

      res.json({
        data: {
          ...epic,
          totalStoryPoints,
          completedStoryPoints,
          completionPercentage,
          stories
        }
      });
    } catch (error) {
      console.error("Failed to fetch epic:", error);
      res.status(500).json({ message: "Failed to fetch epic" });
    }
  });

  // Create epic
  app.post("/api/epics", async (req, res) => {
    try {
      // Validate using Zod schema
      const validated = insertEpicSchema.parse(req.body);

      // Generate unique Epic ID with retry logic for concurrent requests
      let epic;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        try {
          // Get all existing epics to determine next ID
          const allEpics = await storage.getAllEpics();

          // Extract numeric IDs and find max
          const numericIds = allEpics
            .map(e => {
              const match = e.id.match(/^EPIC-(\d+)$/);
              return match ? parseInt(match[1], 10) : 0;
            })
            .filter(n => n > 0);

          const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
          const epicId = `EPIC-${nextId}`;

          // Attempt to create with this ID
          epic = await storage.createEpic({
            ...validated,
            id: epicId
          });

          // Success! Break out of retry loop
          break;
        } catch (createError: any) {
          // Check if it's a duplicate key error
          if (createError.code === '23505' || createError.message?.includes('duplicate')) {
            attempts++;
            if (attempts >= maxAttempts) {
              return res.status(409).json({
                message: "Failed to generate unique Epic ID after multiple attempts",
                error: "Conflict"
              });
            }
            // Add small random delay to reduce collision probability
            await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
            continue;
          }
          // Not a duplicate error, rethrow
          throw createError;
        }
      }

      res.status(201).json({ data: epic });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        });
      }

      console.error("Failed to create epic:", error);
      res.status(500).json({ message: "Failed to create epic" });
    }
  });

  // Update epic
  app.patch("/api/epics/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Validate Epic ID format
      if (!id.startsWith('EPIC-')) {
        return res.status(400).json({ message: "Invalid epic ID format" });
      }

      // Partial validation for updates
      const updateData = insertEpicSchema.partial().parse(req.body);

      const epic = await storage.updateEpic(id, updateData);

      if (!epic) {
        return res.status(404).json({ message: "Epic not found" });
      }

      res.json({ data: epic });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        });
      }

      console.error("Failed to update epic:", error);
      res.status(500).json({ message: "Failed to update epic" });
    }
  });

  // Delete epic
  app.delete("/api/epics/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Check if epic has stories
      const stories = await storage.getUserStoriesByEpic(id);
      if (stories.length > 0) {
        return res.status(400).json({
          message: "Cannot delete epic with associated stories",
          storyCount: stories.length
        });
      }

      const success = await storage.deleteEpic(id);

      if (!success) {
        return res.status(404).json({ message: "Epic not found" });
      }

      res.json({ message: "Epic deleted successfully" });
    } catch (error) {
      console.error("Failed to delete epic:", error);
      res.status(500).json({ message: "Failed to delete epic" });
    }
  });

  // GitHub Integration and Traceability endpoints
  app.get('/api/user-stories/:id/traceability', async (req, res) => {
    try {
      const { id } = req.params;

      // Get user story with GitHub integration
      const story = await storage.getUserStory(id);
      if (!story) {
        return res.status(404).json({ error: 'User story not found' });
      }

      // Get code mappings for this story (if storage method exists)
      let codeMappings = [];
      if (storage.getStoryCodeMappings) {
        codeMappings = await storage.getStoryCodeMappings(id);
      }

      // Get GitHub integration logs (if storage method exists)
      let githubLogs = [];
      if (storage.getGitHubIntegrationLogs) {
        githubLogs = await storage.getGitHubIntegrationLogs(id);
      }

      const traceability = {
        story,
        codeMappings,
        githubLogs,
        traceabilityPath: {
          epic: story.epicId,
          story: story.id,
          github: {
            repo: story.githubRepo,
            branch: story.githubBranch,
            issue: story.githubIssue,
            commits: story.githubCommits
          },
          codeFiles: codeMappings.map((m: any) => m.filePath || m.file_path),
          totalLinesOfCode: codeMappings.reduce((sum: number, m: any) => sum + (m.linesOfCode || m.lines_of_code || 0), 0)
        }
      };

      res.json({ data: traceability });
    } catch (error) {
      console.error('Error fetching user story traceability:', error);
      res.status(500).json({ error: 'Failed to fetch traceability data' });
    }
  });

  // Get defects for a user story
  app.get('/api/user-stories/:id/defects', async (req, res) => {
    try {
      const { id } = req.params;
      const defects = await storage.getDefectsByStory(id);
      res.json(defects);
    } catch (error) {
      console.error('Error fetching story defects:', error);
      res.status(500).json({ error: 'Failed to fetch defects' });
    }
  });

  app.get('/api/github/integration-summary', async (req, res) => {
    try {
      // Get all user stories with GitHub integration
      const stories = await storage.getAllUserStories();
      const storiesWithGitHub = stories.filter(s => s.githubRepo);

      const summary = {
        totalStories: stories.length,
        storiesWithGitHub: storiesWithGitHub.length,
        repositories: [...new Set(storiesWithGitHub.map(s => s.githubRepo))],
        branches: [...new Set(storiesWithGitHub.map(s => s.githubBranch).filter(Boolean))],
        totalCommits: storiesWithGitHub.reduce((sum, s) => sum + (s.githubCommits?.length || 0), 0),
        traceabilityPercentage: Math.round((storiesWithGitHub.length / stories.length) * 100)
      };

      res.json({ data: summary });
    } catch (error) {
      console.error('Error fetching GitHub integration summary:', error);
      res.status(500).json({ error: 'Failed to fetch integration summary' });
    }
  });

  app.post('/api/github/link-commit', async (req, res) => {
    try {
      const { storyId, commitHash, commitMessage } = req.body;

      if (!storyId || !commitHash) {
        return res.status(400).json({ error: 'Story ID and commit hash are required' });
      }

      // Get current story
      const story = await storage.getUserStory(storyId);
      if (!story) {
        return res.status(404).json({ error: 'User story not found' });
      }

      // Add commit to the story's commits array
      const updatedCommits = [...(story.githubCommits || []), commitHash];
      await storage.updateUserStory(storyId, { githubCommits: updatedCommits });

      res.json({
        success: true,
        message: 'Commit linked successfully',
        totalCommits: updatedCommits.length
      });
    } catch (error) {
      console.error('Error linking commit:', error);
      res.status(500).json({ error: 'Failed to link commit' });
    }
  });

  // Developer Integration Channels API
  app.get("/api/integrations/developer/channels", async (req, res) => {
    try {
      const { type, tool_id } = req.query;

      let channels;
      if (type && typeof type === 'string') {
        channels = await storage.getIntegrationChannelsByType(type);
      } else if (tool_id && typeof tool_id === 'string') {
        const channel = await storage.getIntegrationChannelByTool(tool_id);
        channels = channel ? [channel] : [];
      } else {
        channels = await storage.getAllIntegrationChannels();
      }

      res.json(channels || []);
    } catch (error) {
      console.error('Integration channels API error:', error);

      // MVP: Focus on VSCode + GitHub only
      const mockChannels = [
        {
          id: "vscode-channel",
          toolId: "vscode",
          name: "Visual Studio Code",
          type: "ide",
          status: "active",
          directionality: "bidirectional",
          capabilities: ["model_sync", "code_gen", "real_time", "cursor_support"],
          version: "1.0.0",
          description: "ARKHITEKTON extension for VSCode (supports Cursor IDE)",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "github-channel",
          toolId: "github",
          name: "GitHub",
          type: "vcs",
          status: "active",
          directionality: "bidirectional",
          capabilities: ["model_sync", "webhook", "ci_cd", "branch_merge"],
          version: "1.0.0",
          description: "GitHub integration for version control and collaboration",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      res.json(mockChannels);
    }
  });

  app.get("/api/integrations/developer/channels/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const channel = await storage.getIntegrationChannel(id);

      if (!channel) {
        return res.status(404).json({ message: "Integration channel not found" });
      }

      res.json(channel);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integration channel" });
    }
  });

  app.post("/api/integrations/developer/channels", async (req, res) => {
    try {
      const validatedData = insertIntegrationChannelSchema.parse(req.body);
      const channel = await storage.createIntegrationChannel(validatedData);
      res.status(201).json(channel);
    } catch (error) {
      res.status(400).json({ message: "Invalid channel data" });
    }
  });

  app.patch("/api/integrations/developer/channels/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedChannel = await storage.updateIntegrationChannel(id, updates);

      if (!updatedChannel) {
        return res.status(404).json({ message: "Integration channel not found" });
      }

      res.json(updatedChannel);
    } catch (error) {
      res.status(500).json({ message: "Failed to update integration channel" });
    }
  });

  app.delete("/api/integrations/developer/channels/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteIntegrationChannel(id);

      if (!deleted) {
        return res.status(404).json({ message: "Integration channel not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete integration channel" });
    }
  });

  // Object Sync Flows API
  app.get("/api/integrations/developer/sync-flows", async (req, res) => {
    try {
      const { channel_id, state } = req.query;

      let flows;
      if (channel_id && typeof channel_id === 'string') {
        flows = await storage.getObjectSyncFlowsByChannel(channel_id);
      } else if (state && typeof state === 'string') {
        flows = await storage.getObjectSyncFlowsByState(state);
      } else {
        flows = await storage.getAllObjectSyncFlows();
      }

      res.json(flows || []);
    } catch (error) {
      console.error('Sync flows API error:', error);

      // MVP: VSCode + GitHub flows only
      const mockFlows = [
        {
          id: "vscode-flow-1",
          name: "Architecture Component Sync",
          description: "AWS component created in VSCode, synced to ARKHITEKTON",
          integrationChannelId: "vscode-channel",
          currentState: "committed",
          stateHistory: ["draft", "staged", "committed"],
          objectTypes: ["aws_component", "service"],
          syncMetrics: { successCount: 12, errorCount: 0 },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "vscode-flow-2",
          name: "Interface Definition Sync",
          description: "API interface from VSCode to GitHub",
          integrationChannelId: "vscode-channel",
          currentState: "staged",
          stateHistory: ["draft", "staged"],
          objectTypes: ["interface", "api_spec"],
          syncMetrics: { successCount: 8, errorCount: 1 },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "github-flow-1",
          name: "Main Branch Architecture",
          description: "Production architecture in GitHub main branch",
          integrationChannelId: "github-channel",
          currentState: "merged",
          stateHistory: ["draft", "staged", "committed", "branched", "merged"],
          objectTypes: ["architecture_model", "deployment"],
          syncMetrics: { successCount: 25, errorCount: 2 },
          branchInfo: { branch: "main", lastCommit: "a1b2c3d" },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "github-flow-2",
          name: "Feature Branch Development",
          description: "New microservice architecture branch",
          integrationChannelId: "github-channel",
          currentState: "branched",
          stateHistory: ["draft", "staged", "committed", "branched"],
          objectTypes: ["microservice", "container"],
          syncMetrics: { successCount: 7, errorCount: 0 },
          branchInfo: { branch: "feature/payment-service", pullRequest: "#42" },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      res.json(mockFlows);
    }
  });

  app.get("/api/integrations/developer/sync-flows/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const flow = await storage.getObjectSyncFlow(id);

      if (!flow) {
        return res.status(404).json({ message: "Sync flow not found" });
      }

      res.json(flow);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sync flow" });
    }
  });

  app.post("/api/integrations/developer/sync-flows", async (req, res) => {
    try {
      const validatedData = insertObjectSyncFlowSchema.parse(req.body);
      const flow = await storage.createObjectSyncFlow(validatedData);
      res.status(201).json(flow);
    } catch (error) {
      res.status(400).json({ message: "Invalid sync flow data" });
    }
  });

  app.patch("/api/integrations/developer/sync-flows/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedFlow = await storage.updateObjectSyncFlow(id, updates);

      if (!updatedFlow) {
        return res.status(404).json({ message: "Sync flow not found" });
      }

      res.json(updatedFlow);
    } catch (error) {
      res.status(500).json({ message: "Failed to update sync flow" });
    }
  });

  app.patch("/api/integrations/developer/sync-flows/:id/state", async (req, res) => {
    try {
      const { id } = req.params;
      const { state, stateVersion } = req.body;

      if (!state || stateVersion === undefined) {
        return res.status(400).json({ message: "State and stateVersion are required" });
      }

      const updatedFlow = await storage.updateSyncFlowState(id, state, stateVersion);

      if (!updatedFlow) {
        return res.status(409).json({ message: "Sync flow not found or state version conflict" });
      }

      res.json(updatedFlow);
    } catch (error) {
      res.status(500).json({ message: "Failed to update sync flow state" });
    }
  });

  app.delete("/api/integrations/developer/sync-flows/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteObjectSyncFlow(id);

      if (!deleted) {
        return res.status(404).json({ message: "Sync flow not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete sync flow" });
    }
  });

  // Git-like object history API for developer integrations
  app.get("/api/integrations/developer/object-history/:objectId", async (req, res) => {
    try {
      const { objectId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      // Mock object history data based on Git-like state transitions
      const mockHistory = [
        {
          id: "hist-1",
          objectId,
          state: "committed",
          stateVersion: 3,
          commitMessage: "Updated component interface",
          author: "developer@example.com",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          changes: ["interface", "documentation"],
          parentVersion: 2
        },
        {
          id: "hist-2",
          objectId,
          state: "staged",
          stateVersion: 2,
          commitMessage: "Added new methods to component",
          author: "developer@example.com",
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          changes: ["methods", "validation"],
          parentVersion: 1
        },
        {
          id: "hist-3",
          objectId,
          state: "draft",
          stateVersion: 1,
          commitMessage: "Initial component creation",
          author: "architect@example.com",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          changes: ["initial"],
          parentVersion: null
        }
      ];

      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedHistory = mockHistory.slice(startIndex, endIndex);

      res.json({
        data: paginatedHistory,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: mockHistory.length,
          totalPages: Math.ceil(mockHistory.length / Number(limit))
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch object history" });
    }
  });

  // Application Settings API
  app.get("/api/settings", async (req, res) => {
    try {
      const { category } = req.query;

      let settings;
      if (category && typeof category === 'string') {
        settings = await storage.getSettingsByCategory(category);
      } else {
        settings = await storage.getAllSettings();
      }

      // Never return sensitive values in plain text - mask them
      const maskedSettings = settings.map(setting => ({
        ...setting,
        value: setting.isSensitive ? '••••••••' : setting.value
      }));

      res.json(maskedSettings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getSetting(key);

      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }

      // Mask sensitive values
      const maskedSetting = {
        ...setting,
        value: setting.isSensitive ? '••••••••' : setting.value
      };

      res.json(maskedSetting);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const validatedData = insertApplicationSettingSchema.parse(req.body);

      // Encrypt sensitive values before storing
      const valueToStore = validatedData.isSensitive
        ? encrypt(validatedData.value)
        : validatedData.value;

      const setting = await storage.createSetting({
        ...validatedData,
        value: valueToStore
      });

      // Return masked value
      const maskedSetting = {
        ...setting,
        value: setting.isSensitive ? '••••••••' : setting.value
      };

      res.status(201).json(maskedSetting);
    } catch (error) {
      res.status(400).json({ message: "Invalid setting data" });
    }
  });

  app.patch("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;

      // Get existing setting to check if it's sensitive
      const existingSetting = await storage.getSetting(key);
      if (!existingSetting) {
        return res.status(404).json({ message: "Setting not found" });
      }

      // Don't allow changing the key itself
      const { key: _, ...updates } = req.body;

      // Encrypt sensitive values before storing
      let valueToStore = updates.value;
      if (updates.value && existingSetting.isSensitive) {
        valueToStore = encrypt(updates.value);
      }

      const setting = await storage.updateSetting(key, {
        ...updates,
        value: valueToStore
      });

      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }

      // Return masked value
      const maskedSetting = {
        ...setting,
        value: setting.isSensitive ? '••••••••' : setting.value
      };

      res.json(maskedSetting);
    } catch (error) {
      res.status(400).json({ message: "Failed to update setting" });
    }
  });

  app.delete("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const success = await storage.deleteSetting(key);

      if (!success) {
        return res.status(404).json({ message: "Setting not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete setting" });
    }
  });

  // GitHub Webhook Handler
  app.post("/api/webhooks/github", async (req, res) => {
    try {
      const event = req.headers['x-github-event'];

      // Only process push events for now
      if (event !== 'push') {
        return res.json({ message: 'Event type not supported', processed: 0 });
      }

      const payload = req.body;
      const commits = payload.commits || [];

      // Track processing results
      const results = {
        processed: 0,
        linked: 0,
        blocked: 0, // Commits blocked due to violations
        stories_updated: [] as string[],
        violations: [] as Array<{ commit: string; message: string; reason: string; story?: string }>
      };

      // Regex to extract story IDs: US-XXXXXXX
      const storyIdRegex = /US-[A-Z0-9]{7}/g;

      for (const commit of commits) {
        results.processed++;

        // Extract story IDs from commit message
        const storyIds = commit.message.match(storyIdRegex) || [];

        if (storyIds.length === 0) {
          // VIOLATION: No story ID in commit - BLOCK ENTIRE COMMIT
          results.violations.push({
            commit: commit.id.substring(0, 7),
            message: commit.message.split('\n')[0],
            reason: '❌ BLOCKED: No user story ID found (US-XXXXXXX format required)'
          });
          results.blocked++;
          console.log(`❌ BLOCKED commit ${commit.id.substring(0, 7)}: No story ID`);
          continue; // Skip this commit entirely
        }

        // PHASE 1: PRE-VALIDATION - Check ALL stories before linking ANY
        let commitIsValid = true;
        const validatedStories = [];

        for (const storyId of storyIds) {
          // Check if story exists
          const story = await storage.getUserStory(storyId);

          if (!story) {
            results.violations.push({
              commit: commit.id.substring(0, 7),
              message: commit.message.split('\n')[0],
              reason: `❌ BLOCKED: Story ${storyId} not found in database`,
              story: storyId
            });
            commitIsValid = false;
            console.log(`❌ BLOCKED commit ${commit.id.substring(0, 7)} → ${storyId}: Story not found`);
            break; // Entire commit is invalid
          }

          // ENFORCE: Story MUST have acceptance criteria - BLOCKING RULE
          if (!story.acceptanceCriteria || story.acceptanceCriteria.trim().length === 0) {
            results.violations.push({
              commit: commit.id.substring(0, 7),
              message: commit.message.split('\n')[0],
              reason: `❌ BLOCKED: Story ${storyId} has no acceptance criteria (required for commit linking)`,
              story: storyId
            });
            commitIsValid = false;
            console.log(`❌ BLOCKED commit ${commit.id.substring(0, 7)} → ${storyId}: No acceptance criteria`);
            break; // Entire commit is invalid
          }

          // TODO: Validate Gherkin format (Given/When/Then)

          // Story is valid - add to validated list
          validatedStories.push(story);
        }

        // If ANY story failed validation, BLOCK the entire commit
        if (!commitIsValid) {
          results.blocked++;
          continue; // Do NOT link this commit to ANY story
        }

        // PHASE 2: LINKING - All stories are valid, proceed with linking
        const commitData = {
          sha: commit.id,
          message: commit.message.split('\n')[0], // First line only
          author: commit.author.name,
          email: commit.author.email,
          timestamp: commit.timestamp,
          url: commit.url
        };

        for (const story of validatedStories) {
          // Get existing commits
          const existingCommits = story.githubCommits || [];

          // Check if commit already linked (avoid duplicates)
          const isDuplicate = existingCommits.some(c => c.sha === commit.id);
          if (isDuplicate) {
            console.log(`⏭️  Skipped duplicate: ${commit.id.substring(0, 7)} → ${story.id} (already linked)`);
            continue;
          }

          // Add new commit
          const updatedCommits = [...existingCommits, commitData];

          // Update story with new commit
          await storage.updateUserStory(story.id, {
            githubCommits: updatedCommits
          });

          results.linked++;

          // Track unique stories updated
          if (!results.stories_updated.includes(story.id)) {
            results.stories_updated.push(story.id);
          }

          console.log(`✅ Linked commit ${commit.id.substring(0, 7)} → ${story.id}: "${commit.message.split('\n')[0].substring(0, 60)}..."`);
        }
      }

      // Enhanced logging with context
      console.log('\n📊 GitHub Webhook Processing Summary:');
      console.log(`   Repository: ${payload.repository?.full_name || 'unknown'}`);
      console.log(`   Branch: ${payload.ref || 'unknown'}`);
      console.log(`   Pusher: ${payload.pusher?.name || 'unknown'}`);
      console.log(`   Commits processed: ${results.processed}`);
      console.log(`   Commits linked: ${results.linked}`);
      console.log(`   Commits blocked: ${results.blocked}`);
      console.log(`   Stories updated: ${results.stories_updated.join(', ') || 'none'}`);
      console.log(`   Violations: ${results.violations.length}`);

      if (results.violations.length > 0) {
        console.log('\n⚠️  Violations detected:');
        results.violations.forEach((v, idx) => {
          console.log(`   ${idx + 1}. [${v.commit}] "${v.message}"`);
          console.log(`      Reason: ${v.reason}`);
        });
      }

      // Structured response with enhanced context
      res.json({
        success: true,
        repository: payload.repository?.full_name,
        branch: payload.ref?.replace('refs/heads/', ''),
        pusher: payload.pusher?.name,
        ...results
      });
    } catch (error) {
      console.error('❌ GitHub webhook error:', error);

      // Structured error response
      res.status(500).json({
        success: false,
        message: "Failed to process webhook",
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // ============================================================================
  // Applications API - Application Portfolio Management (APM/CMDB)
  // ============================================================================

  // GET /api/applications - Get all applications with optional filters
  app.get("/api/applications", async (req, res) => {
    try {
      const { status, type, owner, team, search } = req.query;

      let applications;

      if (search && typeof search === 'string') {
        applications = await storage.searchApplications(search);
      } else if (status && typeof status === 'string') {
        applications = await storage.getApplicationsByStatus(status);
      } else if (type && typeof type === 'string') {
        applications = await storage.getApplicationsByType(type);
      } else if (owner && typeof owner === 'string') {
        applications = await storage.getApplicationsByOwner(owner);
      } else if (team && typeof team === 'string') {
        applications = await storage.getApplicationsByTeam(team);
      } else {
        applications = await storage.getAllApplications();
      }

      res.json(applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // GET /api/applications/:id - Get single application by ID
  app.get("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const application = await storage.getApplication(id);

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      res.json(application);
    } catch (error) {
      console.error('Error fetching application:', error);
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });

  // POST /api/applications - Create new application
  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      console.error('Error creating application:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid application data",
          details: error.errors
        });
      }
      res.status(500).json({ error: "Failed to create application" });
    }
  });

  // PATCH /api/applications/:id - Update application
  app.patch("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateApplicationSchema.parse(req.body);

      const updatedApplication = await storage.updateApplication(id, validatedData);

      if (!updatedApplication) {
        return res.status(404).json({ error: "Application not found" });
      }

      res.json(updatedApplication);
    } catch (error) {
      console.error('Error updating application:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid application data",
          details: error.errors
        });
      }
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  // DELETE /api/applications/:id - Delete application
  app.delete("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteApplication(id);

      if (!deleted) {
        return res.status(404).json({ error: "Application not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting application:', error);
      res.status(500).json({ error: "Failed to delete application" });
    }
  });

  // Object Storage API - for file uploads
  const { ObjectStorageService, ObjectNotFoundError } = await import("./objectStorage");

  // Public file serving endpoint
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Private objects endpoint (accessible publicly for now - can add auth later)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Get upload URL endpoint
  app.post("/api/objects/upload", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  // Update screenshot URLs after upload
  app.post("/api/user-stories/:id/screenshots", async (req, res) => {
    try {
      const { id } = req.params;
      const { screenshotURL } = req.body;

      if (!screenshotURL) {
        return res.status(400).json({ error: "screenshotURL is required" });
      }

      const objectStorageService = new ObjectStorageService();

      // Extract object path from the signed URL
      // The signed URL format is: https://storage.googleapis.com/bucket-name/path?signature...
      let objectPath = screenshotURL;
      if (screenshotURL.startsWith('https://storage.googleapis.com/')) {
        const url = new URL(screenshotURL);
        const pathParts = url.pathname.split('/');
        // Skip bucket name and get the rest of the path
        if (pathParts.length >= 3) {
          const privateDir = process.env.PRIVATE_OBJECT_DIR || '';
          const fullPath = pathParts.slice(1).join('/'); // Remove leading empty string

          // Check if this path starts with private directory
          if (fullPath.startsWith(privateDir.replace(/^\//, ''))) {
            // Extract the object ID from the path
            const objectId = fullPath.replace(privateDir.replace(/^\//, ''), '').replace(/^\//, '');
            objectPath = `/objects/${objectId}`;
          }
        }
      }

      // Get current story
      const story = await storage.getUserStory(id);
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }

      // Add screenshot to array
      const screenshots = [...(story.screenshots || []), objectPath];
      await storage.updateUserStory(id, { screenshots });

      res.status(200).json({
        objectPath,
        screenshots
      });
    } catch (error) {
      console.error("Error adding screenshot:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============================================================================
  // Jira Integration API - Native bi-directional sync
  // Stories: US-SXLNYIG (Webhook), US-SRV4N7Z (ID Mapping), US-T5QNZ82 (Outbound Sync)
  // ============================================================================

  // POST /api/jira/webhooks - Receive webhooks from Jira
  app.post("/api/jira/webhooks", async (req, res) => {
    const startTime = Date.now();

    try {
      const { webhookEvent, issue, changelog } = req.body;

      if (!webhookEvent || !issue) {
        return res.status(400).json({ error: "Invalid webhook payload" });
      }

      // Extract event details
      const jiraIssueKey = issue.key;
      const eventType = webhookEvent; // 'issue:created', 'issue:updated', 'issue:deleted'

      // Generate idempotency key to prevent duplicate processing
      const idempotencyKey = `${webhookEvent}-${issue.id}-${issue.fields.updated}`;

      // Check if already processed
      const existingEvent = await storage.getJiraWebhookEventByIdempotency(idempotencyKey);
      if (existingEvent) {
        console.log(`⏭️  Webhook already processed: ${idempotencyKey}`);
        return res.status(200).json({
          status: "already_processed",
          eventId: existingEvent.id
        });
      }

      // Store webhook event for async processing
      const webhookEventId = await storage.createJiraWebhookEvent({
        webhookId: req.headers['x-atlassian-webhook-identifier'] as string,
        eventType,
        jiraIssueKey,
        rawPayload: req.body,
        idempotencyKey,
        processingStatus: "pending"
      });

      // Quick response to Jira (< 200ms)
      const responseTime = Date.now() - startTime;
      console.log(`✅ Jira webhook received: ${eventType} for ${jiraIssueKey} (${responseTime}ms)`);

      res.status(200).json({
        status: "accepted",
        eventId: webhookEventId,
        processingTime: responseTime
      });

      // TODO: Queue async job for processing (implement in future iteration)
      // For now, process synchronously in background
      setImmediate(async () => {
        try {
          await processJiraWebhook(webhookEventId, eventType, issue, changelog, storage);
        } catch (error) {
          console.error(`❌ Webhook processing error:`, error);
        }
      });

    } catch (error) {
      console.error('❌ Jira webhook error:', error);
      res.status(500).json({
        error: "Failed to process webhook",
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/jira/mappings/:arkhitektonId - Get Jira mapping for ARKHITEKTON entity
  app.get("/api/jira/mappings/:arkhitektonId", async (req, res) => {
    try {
      const { arkhitektonId } = req.params;
      const mapping = await storage.getJiraMappingByArkhitektonId(arkhitektonId);

      if (!mapping) {
        return res.status(404).json({ error: "No Jira mapping found" });
      }

      res.json(mapping);
    } catch (error) {
      console.error('Error fetching Jira mapping:', error);
      res.status(500).json({ error: "Failed to fetch mapping" });
    }
  });

  // POST /api/jira/mappings - Create manual Jira mapping
  app.post("/api/jira/mappings", async (req, res) => {
    try {
      const validatedData = insertJiraMappingSchema.parse(req.body);
      const mapping = await storage.createJiraMapping(validatedData);
      res.status(201).json(mapping);
    } catch (error) {
      console.error('Error creating Jira mapping:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid mapping data",
          details: error.errors
        });
      }
      res.status(500).json({ error: "Failed to create mapping" });
    }
  });

  // POST /api/user-stories/:id/sync-to-jira - Manually sync story to Jira
  app.post("/api/user-stories/:id/sync-to-jira", async (req, res) => {
    try {
      const { id } = req.params;
      const { jiraProjectKey, forceUpdate } = req.body;

      if (!jiraProjectKey) {
        return res.status(400).json({ error: "jiraProjectKey is required" });
      }

      const story = await storage.getUserStory(id);
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }

      // Check if already synced
      if (story.jiraIssueKey && !forceUpdate) {
        return res.status(400).json({
          error: "Story already synced to Jira",
          jiraIssueKey: story.jiraIssueKey
        });
      }

      // TODO: Implement actual Jira API call to create/update issue
      // For now, just update sync status
      await storage.updateUserStory(id, {
        syncStatus: "pending",
        syncSource: "manual"
      });

      res.json({
        status: "sync_initiated",
        storyId: id,
        jiraProjectKey
      });

    } catch (error) {
      console.error('Error syncing to Jira:', error);
      res.status(500).json({ error: "Failed to sync to Jira" });
    }
  });

  // GET /api/jira/sync/stats - Get sync statistics
  app.get("/api/jira/sync/stats", async (req, res) => {
    try {
      const stats = await storage.getJiraSyncStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching sync stats:', error);
      res.status(500).json({ error: "Failed to fetch sync stats" });
    }
  });

  const httpServer = createServer(app);
  // Architectural Models API (Canvas)
  app.get("/api/architectural-models", async (_req, res) => {
    const models = await memStorage.getArchitecturalModels();
    res.json(models);
  });

  app.get("/api/architectural-models/:id", async (req, res) => {
    const model = await memStorage.getArchitecturalModel(req.params.id);
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }
    res.json(model);
  });

  app.post("/api/architectural-models", async (req, res) => {
    try {
      const validatedData = insertArchitecturalModelSchema.parse(req.body);
      const model = await memStorage.createArchitecturalModel(validatedData);
      res.status(201).json(model);
    } catch (e) {
      res.status(400).json({ message: "Invalid model data" });
    }
  });

  // Architectural Objects API
  app.get("/api/architectural-models/:id/objects", async (req, res) => {
    const objects = await memStorage.getArchitecturalObjects(req.params.id);
    res.json(objects);
  });

  app.post("/api/architectural-objects", async (req, res) => {
    try {
      const validatedData = insertArchitecturalObjectSchema.parse(req.body);
      const object = await memStorage.createArchitecturalObject(validatedData);
      res.status(201).json(object);
    } catch (e) {
      res.status(400).json({ message: "Invalid object data" });
    }
  });

  app.patch("/api/architectural-objects/:id", async (req, res) => {
    try {
      const validatedData = insertArchitecturalObjectSchema.partial().parse(req.body);
      const object = await memStorage.updateArchitecturalObject(req.params.id, validatedData);
      if (!object) {
        return res.status(404).json({ message: "Object not found" });
      }
      res.json(object);
    } catch (e) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  return httpServer;
}

// ============================================================================
// Jira Webhook Processing - Async background processing
// ============================================================================

async function processJiraWebhook(
  webhookEventId: string,
  eventType: string,
  issue: any,
  changelog: any,
  storage: any
) {
  const startTime = Date.now();

  try {
    // Loop prevention: Check if update came from ARKHITEKTON
    if (isUpdateFromArkhitekton(changelog)) {
      await storage.updateJiraWebhookEvent(webhookEventId, {
        processingStatus: "ignored",
        processedAt: new Date()
      });
      console.log(`⏭️  Ignored webhook (loop prevention): ${issue.key}`);
      return;
    }

    // Extract ARKHITEKTON ID from Jira custom field
    const arkhitektonId = issue.fields.customfield_10001; // ARKHITEKTON_ID custom field

    if (!arkhitektonId) {
      await storage.updateJiraWebhookEvent(webhookEventId, {
        processingStatus: "ignored",
        processedAt: new Date(),
        processingError: "No ARKHITEKTON_ID found in Jira issue"
      });
      console.log(`⏭️  Ignored webhook (no ARKHITEKTON ID): ${issue.key}`);
      return;
    }

    // Find or create mapping
    let mapping = await storage.getJiraMappingByIssueKey(issue.key);

    if (!mapping && eventType === 'issue:created') {
      // Create new mapping for Jira-originated issue
      mapping = await storage.createJiraMapping({
        arkhitektonId,
        arkhitektonType: mapJiraIssueTypeToArkhitekton(issue.fields.issuetype.name),
        jiraIssueKey: issue.key,
        jiraIssueId: issue.id,
        jiraIssueType: issue.fields.issuetype.name,
        jiraProjectKey: issue.fields.project.key,
        syncDirection: "from_jira"
      });
      console.log(`✅ Created mapping: ${arkhitektonId} ↔ ${issue.key}`);
    }

    if (!mapping) {
      await storage.updateJiraWebhookEvent(webhookEventId, {
        processingStatus: "ignored",
        processedAt: new Date(),
        processingError: "No mapping found and not a creation event"
      });
      return;
    }

    // Map Jira fields to ARKHITEKTON schema
    const updateData = {
      title: issue.fields.summary,
      description: issue.fields.description || "",
      status: mapJiraStatusToArkhitekton(issue.fields.status.name),
      priority: mapJiraPriorityToArkhitekton(issue.fields.priority?.name),
      syncSource: "jira",
      lastSyncedAt: new Date(),
      syncStatus: "synced",
      jiraIssueKey: issue.key,
      jiraIssueId: issue.id
    };

    // Update ARKHITEKTON entity
    await storage.updateUserStory(arkhitektonId, updateData);

    // Log successful sync
    const duration = Date.now() - startTime;
    await storage.createJiraSyncLog({
      mappingId: mapping.id,
      syncDirection: "from_jira",
      syncType: eventType.split(':')[1], // 'created', 'updated', 'deleted'
      syncSource: "webhook",
      requestPayload: issue,
      status: "success",
      durationMs: duration
    });

    // Mark webhook as processed
    await storage.updateJiraWebhookEvent(webhookEventId, {
      processingStatus: "processed",
      processedAt: new Date()
    });

    console.log(`✅ Processed webhook: ${issue.key} → ${arkhitektonId} (${duration}ms)`);

  } catch (error) {
    console.error(`❌ Webhook processing failed:`, error);

    await storage.updateJiraWebhookEvent(webhookEventId, {
      processingStatus: "failed",
      processedAt: new Date(),
      processingError: error instanceof Error ? error.message : 'Unknown error'
    });

    throw error;
  }
}

// Helper: Check if update originated from ARKHITEKTON (loop prevention)
function isUpdateFromArkhitekton(changelog: any): boolean {
  if (!changelog || !changelog.items) return false;

  // Check if sync_source field was updated to 'arkhitekton'
  return changelog.items.some((item: any) =>
    item.field === 'customfield_10002' && // sync_source custom field
    item.toString === 'arkhitekton'
  );
}

// Helper: Map Jira issue type to ARKHITEKTON type
function mapJiraIssueTypeToArkhitekton(jiraIssueType: string): string {
  const mapping: Record<string, string> = {
    'Story': 'user_story',
    'Task': 'user_story',
    'Bug': 'defect',
    'Epic': 'epic'
  };
  return mapping[jiraIssueType] || 'user_story';
}

// Helper: Map Jira status to ARKHITEKTON status
function mapJiraStatusToArkhitekton(jiraStatus: string): string {
  const mapping: Record<string, string> = {
    'To Do': 'backlog',
    'Backlog': 'backlog',
    'In Progress': 'in-progress',
    'In Review': 'review',
    'Code Review': 'review',
    'Done': 'done',
    'Closed': 'done',
    'Won\'t Do': 'backlog'
  };
  return mapping[jiraStatus] || 'backlog';
}

// Helper: Map Jira priority to ARKHITEKTON priority
function mapJiraPriorityToArkhitekton(jiraPriority: string | undefined): string {
  if (!jiraPriority) return 'medium';

  const mapping: Record<string, string> = {
    'Highest': 'high',
    'High': 'high',
    'Medium': 'medium',
    'Low': 'low',
    'Lowest': 'low'
  };
  return mapping[jiraPriority] || 'medium';
}
