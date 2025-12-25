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
  insertTestSuiteSchema,
  updateTestSuiteSchema,
  insertTestCaseSchema,
  updateTestCaseSchema,
  insertTestRunSchema,
  updateTestRunSchema,
  insertTestResultSchema,
  updateTestResultSchema,
  insertEpicSchema,
  insertSprintSchema,
  updateSprintSchema,
  insertIntegrationChannelSchema,
  insertObjectSyncFlowSchema,
  insertApplicationSettingSchema,
  insertApplicationSchema,
  updateApplicationSchema,
  insertInitiativeSchema,
  updateInitiativeSchema,
  insertInitiativeApplicationLinkSchema,
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
  type InsertArchitecturalObject,
  insertWikiPageSchema,
  updateWikiPageSchema,
  insertEntityMentionSchema,
  type WikiPage,
  type EntityMention
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
      const { assignee, epicId, search, status, priority, page = '1', pageSize = '25', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

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

      // Apply status filter
      if (status && typeof status === 'string' && status.trim().length > 0) {
        stories = stories.filter(story => story.status === status);
      }

      // Apply priority filter
      if (priority && typeof priority === 'string' && priority.trim().length > 0) {
        stories = stories.filter(story => story.priority === priority);
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
  // REPRODUCTION STEPS API - US-QC-IMPL-011
  // ============================================================

  // Get all reproduction steps for a defect
  app.get("/api/defects/:defectId/steps", async (req, res) => {
    try {
      const { defectId } = req.params;
      const steps = await storage.getReproductionStepsByDefect(defectId);
      res.json({ data: steps });
    } catch (error) {
      console.error("Failed to get reproduction steps:", error);
      res.status(500).json({ message: "Failed to get reproduction steps" });
    }
  });

  // Create new reproduction step
  app.post("/api/defects/:defectId/steps", async (req, res) => {
    try {
      const { defectId } = req.params;
      const { description, expectedResult } = req.body;

      if (!description || typeof description !== 'string') {
        return res.status(400).json({ message: "Description is required" });
      }

      // Auto-generate step ID
      const stepId = await storage.getNextStepId(defectId);

      // Get current max sequence
      const existingSteps = await storage.getReproductionStepsByDefect(defectId);
      const sequence = existingSteps.length + 1;

      const newStep = await storage.createReproductionStep({
        defectId,
        stepId,
        sequence,
        description,
        expectedResult: expectedResult || null,
      });

      res.status(201).json({ data: newStep });
    } catch (error) {
      console.error("Failed to create reproduction step:", error);
      res.status(500).json({ message: "Failed to create reproduction step" });
    }
  });

  // Update reproduction step
  app.put("/api/defects/:defectId/steps/:stepId", async (req, res) => {
    try {
      const { defectId, stepId } = req.params;
      const { description, expectedResult } = req.body;

      // Find the step by defect ID and step ID
      const existingSteps = await storage.getReproductionStepsByDefect(defectId);
      const step = existingSteps.find(s => s.stepId === stepId);

      if (!step) {
        return res.status(404).json({ message: "Reproduction step not found" });
      }

      const updates: any = {};
      if (description !== undefined) updates.description = description;
      if (expectedResult !== undefined) updates.expectedResult = expectedResult;

      const updatedStep = await storage.updateReproductionStep(step.id, updates);

      if (!updatedStep) {
        return res.status(404).json({ message: "Failed to update step" });
      }

      res.json({ data: updatedStep });
    } catch (error) {
      console.error("Failed to update reproduction step:", error);
      res.status(500).json({ message: "Failed to update reproduction step" });
    }
  });

  // Delete reproduction step (soft delete)
  app.delete("/api/defects/:defectId/steps/:stepId", async (req, res) => {
    try {
      const { defectId, stepId } = req.params;

      // Find the step by defect ID and step ID
      const existingSteps = await storage.getReproductionStepsByDefect(defectId);
      const step = existingSteps.find(s => s.stepId === stepId);

      if (!step) {
        return res.status(404).json({ message: "Reproduction step not found" });
      }

      // Check if step is referenced
      const references = await storage.getStepReferences(step.id);
      if (references.length > 0) {
        return res.status(400).json({
          message: `This step is referenced in ${references.length} place(s)`,
          references: references.map(r => ({
            type: r.referenceType,
            id: r.referenceId,
            url: r.referenceUrl,
          })),
        });
      }

      const success = await storage.deleteReproductionStep(step.id);

      if (!success) {
        return res.status(404).json({ message: "Failed to delete step" });
      }

      // Recalculate sequences for remaining steps
      const remainingSteps = await storage.getReproductionStepsByDefect(defectId);
      const reorderData = remainingSteps.map((s, index) => ({
        stepId: s.stepId,
        sequence: index + 1,
      }));
      await storage.reorderReproductionSteps(defectId, reorderData);

      res.json({ message: "Step deleted successfully" });
    } catch (error) {
      console.error("Failed to delete reproduction step:", error);
      res.status(500).json({ message: "Failed to delete reproduction step" });
    }
  });

  // Reorder reproduction steps
  app.put("/api/defects/:defectId/steps/reorder", async (req, res) => {
    try {
      const { defectId } = req.params;
      const { steps } = req.body;

      if (!Array.isArray(steps)) {
        return res.status(400).json({ message: "Steps array is required" });
      }

      // Validate format: [{ stepId: "S001", sequence: 1 }, ...]
      for (const step of steps) {
        if (!step.stepId || typeof step.sequence !== 'number') {
          return res.status(400).json({ message: "Each step must have stepId and sequence" });
        }
      }

      // Check for duplicate sequences
      const sequences = steps.map(s => s.sequence);
      const uniqueSequences = new Set(sequences);
      if (sequences.length !== uniqueSequences.size) {
        return res.status(400).json({ message: "Duplicate sequence numbers detected" });
      }

      await storage.reorderReproductionSteps(defectId, steps);

      const updatedSteps = await storage.getReproductionStepsByDefect(defectId);
      res.json({ data: updatedSteps });
    } catch (error) {
      console.error("Failed to reorder reproduction steps:", error);
      res.status(500).json({ message: "Failed to reorder reproduction steps" });
    }
  });

  // Get references for a step
  app.get("/api/reproduction-steps/:stepId/references", async (req, res) => {
    try {
      const { stepId } = req.params;
      const references = await storage.getStepReferences(stepId);
      res.json({ data: references });
    } catch (error) {
      console.error("Failed to get step references:", error);
      res.status(500).json({ message: "Failed to get step references" });
    }
  });

  // Create step reference
  app.post("/api/reproduction-steps/:stepId/references", async (req, res) => {
    try {
      const { stepId } = req.params;
      const { referenceType, referenceId, referenceUrl, referenceText } = req.body;

      if (!referenceType || !referenceId) {
        return res.status(400).json({ message: "referenceType and referenceId are required" });
      }

      const newReference = await storage.createStepReference({
        stepId,
        referenceType,
        referenceId,
        referenceUrl: referenceUrl || null,
        referenceText: referenceText || null,
      });

      res.status(201).json({ data: newReference });
    } catch (error) {
      console.error("Failed to create step reference:", error);
      res.status(500).json({ message: "Failed to create step reference" });
    }
  });

  // Batch process code changes for step references (US-QC-IMPL-013)
  app.post("/api/reproduction-steps/batch-process-references", async (req, res) => {
    try {
      const { batchProcessCodeChangesForStepReferences } = await import('./services/step-reference-detector');
      const result = await batchProcessCodeChangesForStepReferences();
      res.json({
        message: "Batch processing complete",
        ...result,
      });
    } catch (error) {
      console.error("Failed to batch process references:", error);
      res.status(500).json({ message: "Failed to batch process references" });
    }
  });

  // Get enriched step references with metadata
  app.get("/api/reproduction-steps/:stepId/references/enriched", async (req, res) => {
    try {
      const { stepId } = req.params;
      const { getEnrichedStepReferences } = await import('./services/step-reference-detector');
      const enrichedRefs = await getEnrichedStepReferences(stepId);
      res.json({ data: enrichedRefs });
    } catch (error) {
      console.error("Failed to get enriched step references:", error);
      res.status(500).json({ message: "Failed to get enriched step references" });
    }
  });

  // ============================================================
  // STEP MIGRATION - US-QC-IMPL-014
  // ============================================================

  // Preview migration from textarea to structured steps
  app.post("/api/defects/:defectId/steps/preview-migration", async (req, res) => {
    try {
      const { defectId } = req.params;
      const { text } = req.body;

      if (!text || typeof text !== 'string') {
        return res.status(400).json({ message: "Text is required" });
      }

      const { autoParseSteps, validateParsedSteps } = await import('./services/step-migration');
      const parsedSteps = autoParseSteps(text);
      const validation = validateParsedSteps(parsedSteps);

      res.json({
        data: {
          steps: parsedSteps,
          validation,
        },
      });
    } catch (error) {
      console.error("Failed to preview migration:", error);
      res.status(500).json({ message: "Failed to preview migration" });
    }
  });

  // Execute migration from textarea to structured steps
  app.post("/api/defects/:defectId/steps/execute-migration", async (req, res) => {
    try {
      const { defectId } = req.params;
      const { steps, originalText } = req.body;

      if (!Array.isArray(steps) || steps.length === 0) {
        return res.status(400).json({ message: "Steps array is required" });
      }

      // Store original text in defect's legacy field
      if (originalText) {
        await storage.updateDefect(defectId, {
          legacyStepsToReproduce: originalText,
        });
      }

      // Get next step ID
      const existingSteps = await storage.getReproductionStepsByDefect(defectId);
      let stepCounter = existingSteps.length + 1;

      // Create all steps
      const createdSteps = [];
      for (const step of steps) {
        const stepId = `S${stepCounter.toString().padStart(3, '0')}`;
        
        const newStep = await storage.createReproductionStep({
          defectId,
          stepId,
          sequence: step.sequence,
          description: step.description,
        });

        createdSteps.push(newStep);
        stepCounter++;
      }

      res.json({
        data: createdSteps,
        message: `Successfully migrated ${createdSteps.length} steps`,
      });
    } catch (error) {
      console.error("Failed to execute migration:", error);
      res.status(500).json({ message: "Failed to execute migration" });
    }
  });

  // ============================================================
  // TEST MANAGEMENT API ENDPOINTS - Test Suites, Cases, Runs, Results
  // ============================================================

  // Test Suites
  app.get("/api/test-suites", async (req, res) => {
    try {
      const { module, parentId } = req.query;

      let suites;
      if (module && typeof module === 'string') {
        suites = await storage.getTestSuitesByModule(module);
      } else if (parentId && typeof parentId === 'string') {
        suites = await storage.getChildTestSuites(parentId);
      } else {
        suites = await storage.getAllTestSuites();
      }

      res.json(suites);
    } catch (error) {
      console.error("Failed to fetch test suites:", error);
      res.status(500).json({ message: "Failed to fetch test suites" });
    }
  });

  app.get("/api/test-suites/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const suite = await storage.getTestSuite(id);

      if (!suite) {
        return res.status(404).json({ message: "Test suite not found" });
      }

      // Also fetch child suites and test cases
      const [children, testCases] = await Promise.all([
        storage.getChildTestSuites(id),
        storage.getTestCasesBySuite(id)
      ]);

      res.json({ ...suite, children, testCases });
    } catch (error) {
      console.error("Failed to fetch test suite:", error);
      res.status(500).json({ message: "Failed to fetch test suite" });
    }
  });

  app.post("/api/test-suites", async (req, res) => {
    try {
      const validatedSuite = insertTestSuiteSchema.parse(req.body);
      const newSuite = await storage.createTestSuite(validatedSuite);
      res.status(201).json(newSuite);
    } catch (error) {
      console.error("Failed to create test suite:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Validation failed", errors: error.message });
      }
      res.status(500).json({ message: "Failed to create test suite" });
    }
  });

  app.patch("/api/test-suites/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedUpdates = updateTestSuiteSchema.parse(req.body);
      const updated = await storage.updateTestSuite(id, validatedUpdates);

      if (!updated) {
        return res.status(404).json({ message: "Test suite not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Failed to update test suite:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Validation failed", errors: error.message });
      }
      res.status(500).json({ message: "Failed to update test suite" });
    }
  });

  app.delete("/api/test-suites/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTestSuite(id);

      if (!success) {
        return res.status(404).json({ message: "Test suite not found" });
      }

      res.json({ message: "Test suite deleted successfully" });
    } catch (error) {
      console.error("Failed to delete test suite:", error);
      res.status(500).json({ message: "Failed to delete test suite" });
    }
  });

  // Test Cases
  app.get("/api/test-cases", async (req, res) => {
    try {
      const { suiteId, storyId } = req.query;

      let cases;
      if (suiteId && typeof suiteId === 'string') {
        cases = await storage.getTestCasesBySuite(suiteId);
      } else if (storyId && typeof storyId === 'string') {
        cases = await storage.getTestCasesByStory(storyId);
      } else {
        cases = await storage.getAllTestCases();
      }

      res.json(cases);
    } catch (error) {
      console.error("Failed to fetch test cases:", error);
      res.status(500).json({ message: "Failed to fetch test cases" });
    }
  });

  app.get("/api/test-cases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const testCase = await storage.getTestCase(id);

      if (!testCase) {
        return res.status(404).json({ message: "Test case not found" });
      }

      // Also fetch execution history
      const executionHistory = await storage.getTestResultsByCase(id);

      res.json({ ...testCase, executionHistory });
    } catch (error) {
      console.error("Failed to fetch test case:", error);
      res.status(500).json({ message: "Failed to fetch test case" });
    }
  });

  app.post("/api/test-cases", async (req, res) => {
    try {
      const validatedCase = insertTestCaseSchema.parse(req.body);
      const newCase = await storage.createTestCase(validatedCase);
      res.status(201).json(newCase);
    } catch (error) {
      console.error("Failed to create test case:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Validation failed", errors: error.message });
      }
      res.status(500).json({ message: "Failed to create test case" });
    }
  });

  app.patch("/api/test-cases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedUpdates = updateTestCaseSchema.parse(req.body);
      const updated = await storage.updateTestCase(id, validatedUpdates);

      if (!updated) {
        return res.status(404).json({ message: "Test case not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Failed to update test case:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Validation failed", errors: error.message });
      }
      res.status(500).json({ message: "Failed to update test case" });
    }
  });

  app.delete("/api/test-cases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTestCase(id);

      if (!success) {
        return res.status(404).json({ message: "Test case not found" });
      }

      res.json({ message: "Test case deleted successfully" });
    } catch (error) {
      console.error("Failed to delete test case:", error);
      res.status(500).json({ message: "Failed to delete test case" });
    }
  });

  // Link/Unlink test case to story
  app.post("/api/test-cases/:testCaseId/stories/:storyId", async (req, res) => {
    try {
      const { testCaseId, storyId } = req.params;
      const success = await storage.linkTestCaseToStory(testCaseId, storyId);

      if (!success) {
        return res.status(400).json({ message: "Failed to link test case to story" });
      }

      res.json({ message: "Test case linked to story successfully" });
    } catch (error) {
      console.error("Failed to link test case:", error);
      res.status(500).json({ message: "Failed to link test case to story" });
    }
  });

  app.delete("/api/test-cases/:testCaseId/stories/:storyId", async (req, res) => {
    try {
      const { testCaseId, storyId } = req.params;
      const success = await storage.unlinkTestCaseFromStory(testCaseId, storyId);

      if (!success) {
        return res.status(404).json({ message: "Link not found" });
      }

      res.json({ message: "Test case unlinked from story successfully" });
    } catch (error) {
      console.error("Failed to unlink test case:", error);
      res.status(500).json({ message: "Failed to unlink test case from story" });
    }
  });

  // Test Runs
  app.get("/api/test-runs", async (req, res) => {
    try {
      const { suiteId } = req.query;

      let runs;
      if (suiteId && typeof suiteId === 'string') {
        runs = await storage.getTestRunsBySuite(suiteId);
      } else {
        runs = await storage.getAllTestRuns();
      }

      res.json(runs);
    } catch (error) {
      console.error("Failed to fetch test runs:", error);
      res.status(500).json({ message: "Failed to fetch test runs" });
    }
  });

  app.get("/api/test-runs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const run = await storage.getTestRun(id);

      if (!run) {
        return res.status(404).json({ message: "Test run not found" });
      }

      // Also fetch results
      const results = await storage.getTestResultsByRun(id);

      // Calculate summary
      const summary = {
        total: results.length,
        passed: results.filter(r => r.status === 'passed').length,
        failed: results.filter(r => r.status === 'failed').length,
        blocked: results.filter(r => r.status === 'blocked').length,
        skipped: results.filter(r => r.status === 'skipped').length,
        notRun: results.filter(r => r.status === 'not-run').length,
      };

      res.json({ ...run, results, summary });
    } catch (error) {
      console.error("Failed to fetch test run:", error);
      res.status(500).json({ message: "Failed to fetch test run" });
    }
  });

  app.post("/api/test-runs", async (req, res) => {
    try {
      const validatedRun = insertTestRunSchema.parse(req.body);
      const newRun = await storage.createTestRun(validatedRun);

      // Auto-create test results for all cases in the suite
      const testCases = await storage.getTestCasesBySuite(validatedRun.suiteId);
      
      for (const testCase of testCases) {
        await storage.createTestResult({
          runId: newRun.id,
          caseId: testCase.id,
          status: 'not-run'
        });
      }

      res.status(201).json(newRun);
    } catch (error) {
      console.error("Failed to create test run:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Validation failed", errors: error.message });
      }
      res.status(500).json({ message: "Failed to create test run" });
    }
  });

  app.patch("/api/test-runs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedUpdates = updateTestRunSchema.parse(req.body);
      const updated = await storage.updateTestRun(id, validatedUpdates);

      if (!updated) {
        return res.status(404).json({ message: "Test run not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Failed to update test run:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Validation failed", errors: error.message });
      }
      res.status(500).json({ message: "Failed to update test run" });
    }
  });

  app.post("/api/test-runs/:id/complete", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.completeTestRun(id);

      if (!updated) {
        return res.status(404).json({ message: "Test run not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Failed to complete test run:", error);
      res.status(500).json({ message: "Failed to complete test run" });
    }
  });

  app.delete("/api/test-runs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTestRun(id);

      if (!success) {
        return res.status(404).json({ message: "Test run not found" });
      }

      res.json({ message: "Test run deleted successfully" });
    } catch (error) {
      console.error("Failed to delete test run:", error);
      res.status(500).json({ message: "Failed to delete test run" });
    }
  });

  // Test Results
  app.get("/api/test-results", async (req, res) => {
    try {
      const { runId, caseId } = req.query;

      let results;
      if (runId && typeof runId === 'string') {
        results = await storage.getTestResultsByRun(runId);
      } else if (caseId && typeof caseId === 'string') {
        results = await storage.getTestResultsByCase(caseId);
      } else {
        results = await storage.getAllTestResults();
      }

      res.json(results);
    } catch (error) {
      console.error("Failed to fetch test results:", error);
      res.status(500).json({ message: "Failed to fetch test results" });
    }
  });

  app.post("/api/test-results", async (req, res) => {
    try {
      const validatedResult = insertTestResultSchema.parse(req.body);
      const newResult = await storage.createTestResult(validatedResult);
      res.status(201).json(newResult);
    } catch (error) {
      console.error("Failed to create test result:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Validation failed", errors: error.message });
      }
      res.status(500).json({ message: "Failed to create test result" });
    }
  });

  app.patch("/api/test-results/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedUpdates = updateTestResultSchema.parse(req.body);
      
      // Auto-set executedAt when status changes from not-run
      if (validatedUpdates.status && validatedUpdates.status !== 'not-run') {
        validatedUpdates.executedAt = new Date();
      }

      const updated = await storage.updateTestResult(id, validatedUpdates);

      if (!updated) {
        return res.status(404).json({ message: "Test result not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Failed to update test result:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Validation failed", errors: error.message });
      }
      res.status(500).json({ message: "Failed to update test result" });
    }
  });

  // Link test result to defect
  app.post("/api/test-results/:resultId/defects/:defectId", async (req, res) => {
    try {
      const { resultId, defectId } = req.params;
      const success = await storage.linkTestResultToDefect(resultId, defectId);

      if (!success) {
        return res.status(400).json({ message: "Failed to link test result to defect" });
      }

      res.json({ message: "Test result linked to defect successfully" });
    } catch (error) {
      console.error("Failed to link test result:", error);
      res.status(500).json({ message: "Failed to link test result to defect" });
    }
  });

  // Test Coverage Dashboard
  app.get("/api/test-coverage/dashboard", async (req, res) => {
    try {
      const [stories, testCases] = await Promise.all([
        storage.getAllUserStories(),
        storage.getAllTestCases()
      ]);

      // Calculate coverage metrics
      const storiesWithTests = new Set();
      
      // Note: This is a simplified version - in production, we'd use a more efficient query
      for (const testCase of testCases) {
        const testCaseDetails = await storage.getTestCase(testCase.id);
        // In a real implementation, we'd fetch linked stories here
      }

      const totalStories = stories.length;
      const coveredStories = storiesWithTests.size;
      const coveragePercent = totalStories > 0 ? Math.round((coveredStories / totalStories) * 100) : 0;

      res.json({
        totalStories,
        coveredStories,
        uncoveredStories: totalStories - coveredStories,
        coveragePercent,
        totalTestCases: testCases.length
      });
    } catch (error) {
      console.error("Failed to fetch test coverage:", error);
      res.status(500).json({ message: "Failed to fetch test coverage" });
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

  // ============================================================
  // SPRINT API ENDPOINTS - Agile Sprint Management (US-PLAN-101)
  // ============================================================

  // Get all sprints
  app.get("/api/sprints", async (req, res) => {
    try {
      const { status } = req.query;

      let sprints;
      if (status && typeof status === 'string') {
        sprints = await storage.getSprintsByStatus(status);
      } else {
        sprints = await storage.getAllSprints();
      }

      res.json({ data: sprints, total: sprints.length });
    } catch (error) {
      console.error("Failed to fetch sprints:", error);
      res.status(500).json({ message: "Failed to fetch sprints" });
    }
  });

  // Get active sprint
  app.get("/api/sprints/active", async (req, res) => {
    try {
      const sprint = await storage.getActiveSprint();
      if (!sprint) {
        return res.status(404).json({ message: "No active sprint found" });
      }
      res.json(sprint);
    } catch (error) {
      console.error("Failed to fetch active sprint:", error);
      res.status(500).json({ message: "Failed to fetch active sprint" });
    }
  });

  // Get single sprint
  app.get("/api/sprints/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const sprint = await storage.getSprint(id);

      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }

      // Get stories assigned to this sprint
      const allStories = await storage.getAllUserStories();
      const sprintStories = allStories.filter(s => s.sprintId === id);

      res.json({
        ...sprint,
        stories: sprintStories,
        storyCount: sprintStories.length
      });
    } catch (error) {
      console.error("Failed to fetch sprint:", error);
      res.status(500).json({ message: "Failed to fetch sprint" });
    }
  });

  // Create sprint
  app.post("/api/sprints", async (req, res) => {
    try {
      const validated = insertSprintSchema.parse(req.body);
      const sprint = await storage.createSprint(validated);
      res.status(201).json(sprint);
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        });
      }
      console.error("Failed to create sprint:", error);
      res.status(500).json({ message: "Failed to create sprint" });
    }
  });

  // Update sprint
  app.patch("/api/sprints/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = updateSprintSchema.parse(req.body);
      const sprint = await storage.updateSprint(id, updateData);

      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }

      res.json(sprint);
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        });
      }
      console.error("Failed to update sprint:", error);
      res.status(500).json({ message: "Failed to update sprint" });
    }
  });

  // Start sprint (change status to active)
  app.post("/api/sprints/:id/start", async (req, res) => {
    try {
      const { id } = req.params;

      // Check if there's already an active sprint
      const activeSprint = await storage.getActiveSprint();
      if (activeSprint && activeSprint.id !== id) {
        return res.status(400).json({
          message: "Another sprint is already active",
          activeSprintId: activeSprint.id
        });
      }

      const sprint = await storage.updateSprint(id, { status: 'active' });
      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }

      res.json(sprint);
    } catch (error) {
      console.error("Failed to start sprint:", error);
      res.status(500).json({ message: "Failed to start sprint" });
    }
  });

  // Complete sprint
  app.post("/api/sprints/:id/complete", async (req, res) => {
    try {
      const { id } = req.params;

      // Recalculate points before completing
      await storage.recalculateSprintPoints(id);

      const sprint = await storage.updateSprint(id, { status: 'completed' });
      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }

      res.json(sprint);
    } catch (error) {
      console.error("Failed to complete sprint:", error);
      res.status(500).json({ message: "Failed to complete sprint" });
    }
  });

  // Assign story to sprint
  app.post("/api/sprints/:sprintId/stories/:storyId", async (req, res) => {
    try {
      const { sprintId, storyId } = req.params;

      const sprint = await storage.getSprint(sprintId);
      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }

      const story = await storage.updateUserStory(storyId, { 
        sprintId, 
        status: 'sprint' // Move to sprint backlog
      });

      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }

      // Recalculate sprint points
      await storage.recalculateSprintPoints(sprintId);
      const updatedSprint = await storage.getSprint(sprintId);

      res.json({ 
        message: "Story assigned to sprint",
        story,
        sprint: updatedSprint
      });
    } catch (error) {
      console.error("Failed to assign story to sprint:", error);
      res.status(500).json({ message: "Failed to assign story to sprint" });
    }
  });

  // Remove story from sprint
  app.delete("/api/sprints/:sprintId/stories/:storyId", async (req, res) => {
    try {
      const { sprintId, storyId } = req.params;

      const story = await storage.updateUserStory(storyId, { 
        sprintId: null, 
        status: 'backlog' // Move back to backlog
      });

      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }

      // Recalculate sprint points
      await storage.recalculateSprintPoints(sprintId);
      const updatedSprint = await storage.getSprint(sprintId);

      res.json({ 
        message: "Story removed from sprint",
        story,
        sprint: updatedSprint
      });
    } catch (error) {
      console.error("Failed to remove story from sprint:", error);
      res.status(500).json({ message: "Failed to remove story from sprint" });
    }
  });

  // Delete sprint
  app.delete("/api/sprints/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteSprint(id);

      if (!success) {
        return res.status(404).json({ message: "Sprint not found" });
      }

      res.json({ message: "Sprint deleted successfully" });
    } catch (error) {
      console.error("Failed to delete sprint:", error);
      res.status(500).json({ message: "Failed to delete sprint" });
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

  // ============================================================================
  // CODE CHANGES API - Link PRs, Commits, Branches to Work Items
  // ============================================================================

  // GET /api/code-changes/:entityType/:entityId - Get all code changes for an entity
  app.get('/api/code-changes/:entityType/:entityId', async (req, res) => {
    try {
      const { entityType, entityId } = req.params;
      const changes = await storage.getCodeChangesByEntity(entityType, entityId);
      res.json({ data: changes });
    } catch (error) {
      console.error('Error fetching code changes:', error);
      res.status(500).json({ error: 'Failed to fetch code changes' });
    }
  });

  // GET /api/code-changes/recent - Get recent code changes across all entities
  app.get('/api/code-changes/recent', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const changes = await storage.getRecentCodeChanges(limit);
      res.json({ data: changes });
    } catch (error) {
      console.error('Error fetching recent code changes:', error);
      res.status(500).json({ error: 'Failed to fetch recent code changes' });
    }
  });

  // POST /api/code-changes - Create a new code change link
  app.post('/api/code-changes', async (req, res) => {
    try {
      const { entityType, entityId, changeType, provider, repository, ...details } = req.body;

      if (!entityType || !entityId || !changeType || !repository) {
        return res.status(400).json({ 
          error: 'entityType, entityId, changeType, and repository are required' 
        });
      }

      // Check for duplicates using externalId
      if (details.externalId) {
        const existing = await storage.getCodeChangeByExternalId(details.externalId);
        if (existing) {
          // Update existing record instead of creating duplicate
          const updated = await storage.updateCodeChange(existing.id, {
            ...details,
            eventTimestamp: details.eventTimestamp ? new Date(details.eventTimestamp) : new Date(),
          });
          return res.json({ data: updated, updated: true });
        }
      }

      const change = await storage.createCodeChange({
        entityType,
        entityId,
        changeType,
        provider: provider || 'github',
        repository,
        eventTimestamp: details.eventTimestamp ? new Date(details.eventTimestamp) : new Date(),
        ...details,
      });

      res.status(201).json({ data: change });
    } catch (error) {
      console.error('Error creating code change:', error);
      res.status(500).json({ error: 'Failed to create code change' });
    }
  });

  // PUT /api/code-changes/:id - Update a code change (e.g., PR merged)
  app.put('/api/code-changes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updated = await storage.updateCodeChange(id, updates);
      if (!updated) {
        return res.status(404).json({ error: 'Code change not found' });
      }

      res.json({ data: updated });
    } catch (error) {
      console.error('Error updating code change:', error);
      res.status(500).json({ error: 'Failed to update code change' });
    }
  });

  // DELETE /api/code-changes/:id - Delete a code change
  app.delete('/api/code-changes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCodeChange(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting code change:', error);
      res.status(500).json({ error: 'Failed to delete code change' });
    }
  });

  // POST /api/webhooks/github - Consolidated GitHub webhook handler
  // Handles: push (commits), pull_request (PRs), create (branches)
  // Features: Story validation, automatic status updates, code traceability
  app.post('/api/webhooks/github', async (req, res) => {
    try {
      const event = req.headers['x-github-event'] as string;
      const payload = req.body;
      const repository = payload.repository?.full_name;

      console.log(`\n📬 GitHub webhook received: ${event} from ${repository}`);

      // Extract story IDs from text (supports US-*, DEF-*, EPIC-*)
      const extractStoryIds = (text: string): string[] => {
        if (!text) return [];
        const matches = text.match(/US-[A-Z0-9-]+|DEF-[A-Z0-9-]+|EPIC-\d+/gi) || [];
        return [...new Set(matches.map(m => m.toUpperCase()))];
      };

      const getEntityType = (storyId: string) => {
        if (storyId.startsWith('US-')) return 'user_story';
        if (storyId.startsWith('DEF-')) return 'defect';
        return 'epic';
      };

      // Track processing results
      const results = {
        event,
        repository,
        processed: 0,
        linked: 0,
        blocked: 0,
        stories_updated: [] as string[],
        violations: [] as Array<{ id: string; message: string; reason: string }>
      };

      switch (event) {
        case 'push': {
          const commits = payload.commits || [];
          
          for (const commit of commits) {
            results.processed++;
            const storyIds = extractStoryIds(commit.message);

            if (storyIds.length === 0) {
              results.violations.push({
                id: commit.id.substring(0, 7),
                message: commit.message.split('\n')[0].substring(0, 60),
                reason: 'No story ID found (US-*, DEF-*, or EPIC-* required)'
              });
              results.blocked++;
              continue;
            }

            // Validate and link each story
            for (const storyId of storyIds) {
              const entityType = getEntityType(storyId);
              
              // Validate story exists
              let story = null;
              if (entityType === 'user_story') {
                story = await storage.getUserStory(storyId);
              } else if (entityType === 'defect') {
                story = await storage.getDefect(storyId);
              }

              if (!story && entityType !== 'epic') {
                results.violations.push({
                  id: commit.id.substring(0, 7),
                  message: `→ ${storyId}`,
                  reason: `${storyId} not found in database`
                });
                continue;
              }

              // Create code change record
              await storage.createCodeChange({
                entityType,
                entityId: storyId,
                changeType: 'commit',
                provider: 'github',
                repository,
                commitSha: commit.id,
                commitMessage: commit.message.split('\n')[0],
                commitUrl: commit.url,
                authorUsername: commit.author?.username || commit.author?.name,
                authorEmail: commit.author?.email,
                eventTimestamp: new Date(commit.timestamp),
                externalId: `commit:${commit.id}:${storyId}`,
                syncSource: 'webhook',
              });

              results.linked++;
              if (!results.stories_updated.includes(storyId)) {
                results.stories_updated.push(storyId);
              }
              console.log(`✅ Linked commit ${commit.id.substring(0, 7)} → ${storyId}`);
            }
          }
          break;
        }

        case 'pull_request': {
          results.processed++;
          const pr = payload.pull_request;
          const action = payload.action;
          
          // Extract story IDs from PR title, body, or branch name
          const storyIds = [
            ...extractStoryIds(pr.title),
            ...extractStoryIds(pr.head?.ref),
            ...extractStoryIds(pr.body || '')
          ];
          const uniqueStoryIds = [...new Set(storyIds)];

          if (uniqueStoryIds.length === 0) {
            results.violations.push({
              id: `PR #${pr.number}`,
              message: pr.title.substring(0, 60),
              reason: 'No story ID found in title, branch, or body'
            });
            results.blocked++;
          } else {
            for (const storyId of uniqueStoryIds) {
              const entityType = getEntityType(storyId);
              const prState = action === 'closed' && pr.merged ? 'merged'
                : pr.draft ? 'draft'
                : pr.state;

              // Check if PR already tracked
              const existing = await storage.getCodeChangeByExternalId(`pr:${pr.id}:${storyId}`);

              if (existing) {
                await storage.updateCodeChange(existing.id, {
                  prState,
                  prTitle: pr.title,
                  prMergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
                  prMergedBy: pr.merged_by?.login,
                });
                console.log(`🔄 Updated PR #${pr.number} → ${storyId} (${prState})`);
              } else {
                await storage.createCodeChange({
                  entityType,
                  entityId: storyId,
                  changeType: 'pull_request',
                  provider: 'github',
                  repository,
                  prNumber: pr.number,
                  prTitle: pr.title,
                  prState,
                  prUrl: pr.html_url,
                  prBaseBranch: pr.base?.ref,
                  prHeadBranch: pr.head?.ref,
                  authorUsername: pr.user?.login,
                  authorAvatarUrl: pr.user?.avatar_url,
                  eventTimestamp: new Date(pr.created_at),
                  externalId: `pr:${pr.id}:${storyId}`,
                  syncSource: 'webhook',
                });
                console.log(`✅ Linked PR #${pr.number} → ${storyId}`);
              }

              results.linked++;
              if (!results.stories_updated.includes(storyId)) {
                results.stories_updated.push(storyId);
              }

              // Auto-update story status based on PR lifecycle
              if (entityType === 'user_story') {
                const story = await storage.getUserStory(storyId);
                if (story) {
                  if (action === 'opened' && story.status === 'in-progress') {
                    await storage.updateUserStory(storyId, { status: 'review' });
                    console.log(`📝 ${storyId} status → review (PR opened)`);
                  } else if (prState === 'merged' && story.status === 'review') {
                    await storage.updateUserStory(storyId, { status: 'done' });
                    console.log(`✅ ${storyId} status → done (PR merged)`);
                  }
                }
              }
            }
          }
          break;
        }

        case 'create': {
          if (payload.ref_type === 'branch') {
            results.processed++;
            const branchName = payload.ref;
            const storyIds = extractStoryIds(branchName);

            if (storyIds.length === 0) {
              results.violations.push({
                id: branchName,
                message: 'Branch created',
                reason: 'No story ID in branch name'
              });
            } else {
              for (const storyId of storyIds) {
                const entityType = getEntityType(storyId);

                await storage.createCodeChange({
                  entityType,
                  entityId: storyId,
                  changeType: 'branch',
                  provider: 'github',
                  repository,
                  branchName,
                  branchUrl: `https://github.com/${repository}/tree/${branchName}`,
                  authorUsername: payload.sender?.login,
                  eventTimestamp: new Date(),
                  externalId: `branch:${repository}:${branchName}`,
                  syncSource: 'webhook',
                });

                results.linked++;
                if (!results.stories_updated.includes(storyId)) {
                  results.stories_updated.push(storyId);
                }
                console.log(`🌿 Linked branch ${branchName} → ${storyId}`);

                // Auto-update story status to in-progress when branch created
                if (entityType === 'user_story') {
                  const story = await storage.getUserStory(storyId);
                  if (story && story.status === 'backlog') {
                    await storage.updateUserStory(storyId, { status: 'in-progress' });
                    console.log(`📝 ${storyId} status → in-progress (branch created)`);
                  }
                }
              }
            }
          }
          break;
        }

        default:
          console.log(`⏭️ Ignoring event type: ${event}`);
      }

      // Summary logging
      console.log('\n📊 Webhook Processing Summary:');
      console.log(`   Processed: ${results.processed} | Linked: ${results.linked} | Blocked: ${results.blocked}`);
      console.log(`   Stories: ${results.stories_updated.join(', ') || 'none'}`);
      if (results.violations.length > 0) {
        console.log('   ⚠️ Violations:');
        results.violations.forEach(v => console.log(`      - [${v.id}] ${v.reason}`));
      }

      res.json({ success: true, ...results });
    } catch (error) {
      console.error('❌ GitHub webhook error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
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

  // ============================================================================
  // Initiatives API - Strategic Transformation Portfolio Management
  // ============================================================================

  // GET /api/initiatives - Get all initiatives with optional filters
  app.get("/api/initiatives", async (req, res) => {
    try {
      const { status, type, priority, search } = req.query;

      let initiatives;

      if (search && typeof search === 'string') {
        initiatives = await storage.searchInitiatives(search);
      } else if (status && typeof status === 'string') {
        initiatives = await storage.getInitiativesByStatus(status);
      } else if (type && typeof type === 'string') {
        initiatives = await storage.getInitiativesByType(type);
      } else if (priority && typeof priority === 'string') {
        initiatives = await storage.getInitiativesByPriority(priority);
      } else {
        initiatives = await storage.getAllInitiatives();
      }

      res.json(initiatives);
    } catch (error) {
      console.error('Error fetching initiatives:', error);
      res.status(500).json({ error: "Failed to fetch initiatives" });
    }
  });

  // GET /api/initiatives/:id - Get single initiative by ID
  app.get("/api/initiatives/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const initiative = await storage.getInitiative(id);

      if (!initiative) {
        return res.status(404).json({ error: "Initiative not found" });
      }

      res.json(initiative);
    } catch (error) {
      console.error('Error fetching initiative:', error);
      res.status(500).json({ error: "Failed to fetch initiative" });
    }
  });

  // POST /api/initiatives - Create new initiative
  app.post("/api/initiatives", async (req, res) => {
    try {
      const validatedData = insertInitiativeSchema.parse(req.body);
      const initiative = await storage.createInitiative(validatedData);
      res.status(201).json(initiative);
    } catch (error) {
      console.error('Error creating initiative:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid initiative data",
          details: error.errors
        });
      }
      res.status(500).json({ error: "Failed to create initiative" });
    }
  });

  // PATCH /api/initiatives/:id - Update initiative
  app.patch("/api/initiatives/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateInitiativeSchema.parse(req.body);

      const updatedInitiative = await storage.updateInitiative(id, validatedData);

      if (!updatedInitiative) {
        return res.status(404).json({ error: "Initiative not found" });
      }

      res.json(updatedInitiative);
    } catch (error) {
      console.error('Error updating initiative:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid initiative data",
          details: error.errors
        });
      }
      res.status(500).json({ error: "Failed to update initiative" });
    }
  });

  // DELETE /api/initiatives/:id - Delete initiative
  app.delete("/api/initiatives/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteInitiative(id);

      if (!deleted) {
        return res.status(404).json({ error: "Initiative not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting initiative:', error);
      res.status(500).json({ error: "Failed to delete initiative" });
    }
  });

  // ============================================================================
  // Initiative-Application Links API - Cross-references
  // ============================================================================

  // GET /api/initiatives/:id/applications - Get applications linked to an initiative
  app.get("/api/initiatives/:id/applications", async (req, res) => {
    try {
      const { id } = req.params;
      const links = await storage.getApplicationsForInitiative(id);
      res.json(links);
    } catch (error) {
      console.error('Error fetching initiative applications:', error);
      res.status(500).json({ error: "Failed to fetch initiative applications" });
    }
  });

  // GET /api/applications/:id/initiatives - Get initiatives linked to an application
  app.get("/api/applications/:id/initiatives", async (req, res) => {
    try {
      const { id } = req.params;
      const links = await storage.getInitiativesForApplication(id);
      res.json(links);
    } catch (error) {
      console.error('Error fetching application initiatives:', error);
      res.status(500).json({ error: "Failed to fetch application initiatives" });
    }
  });

  // POST /api/initiative-application-links - Create a link between initiative and application
  app.post("/api/initiative-application-links", async (req, res) => {
    try {
      const validatedData = insertInitiativeApplicationLinkSchema.parse(req.body);
      const link = await storage.createInitiativeApplicationLink(validatedData);
      res.status(201).json(link);
    } catch (error) {
      console.error('Error creating initiative-application link:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid link data",
          details: error.errors
        });
      }
      res.status(500).json({ error: "Failed to create link" });
    }
  });

  // DELETE /api/initiative-application-links/:id - Delete a link
  app.delete("/api/initiative-application-links/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteInitiativeApplicationLink(id);

      if (!deleted) {
        return res.status(404).json({ error: "Link not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting link:', error);
      res.status(500).json({ error: "Failed to delete link" });
    }
  });

  // GET /api/initiative-application-links - Get all links (for dependencies view)
  app.get("/api/initiative-application-links", async (req, res) => {
    try {
      const links = await storage.getAllInitiativeApplicationLinks();
      res.json(links);
    } catch (error) {
      console.error('Error fetching links:', error);
      res.status(500).json({ error: "Failed to fetch links" });
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

  // ============================================================================
  // WIKI KNOWLEDGE CORE API - Phase 1 Foundation
  // Stories: US-WIKI-001 through US-WIKI-010 (CRUD operations)
  // ============================================================================

  // GET /api/wiki - List all wiki pages
  app.get("/api/wiki", async (req, res) => {
    try {
      const { category, status, search } = req.query;

      let pages: WikiPage[];

      if (search && typeof search === 'string') {
        pages = await storage.searchWikiPages(search);
      } else if (category && typeof category === 'string') {
        pages = await storage.getWikiPagesByCategory(category);
      } else if (status && typeof status === 'string') {
        pages = await storage.getWikiPagesByStatus(status);
      } else {
        pages = await storage.getAllWikiPages();
      }

      res.json({ data: pages });
    } catch (error) {
      console.error("Error fetching wiki pages:", error);
      res.status(500).json({ error: "Failed to fetch wiki pages" });
    }
  });

  // GET /api/wiki/tree - Get tree structure (root pages)
  app.get("/api/wiki/tree", async (req, res) => {
    try {
      const rootPages = await storage.getRootWikiPages();
      res.json({ data: rootPages });
    } catch (error) {
      console.error("Error fetching wiki tree:", error);
      res.status(500).json({ error: "Failed to fetch wiki tree" });
    }
  });

  // GET /api/wiki/:id - Get a specific wiki page
  app.get("/api/wiki/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const page = await storage.getWikiPage(id);

      if (!page) {
        return res.status(404).json({ error: "Wiki page not found" });
      }

      // Increment view count
      await storage.incrementWikiPageViews(id);

      res.json({ data: page });
    } catch (error) {
      console.error("Error fetching wiki page:", error);
      res.status(500).json({ error: "Failed to fetch wiki page" });
    }
  });

  // GET /api/wiki/:id/children - Get child pages
  app.get("/api/wiki/:id/children", async (req, res) => {
    try {
      const { id } = req.params;
      const children = await storage.getChildWikiPages(id);
      res.json({ data: children });
    } catch (error) {
      console.error("Error fetching child pages:", error);
      res.status(500).json({ error: "Failed to fetch child pages" });
    }
  });

  // POST /api/wiki - Create a new wiki page
  app.post("/api/wiki", async (req, res) => {
    try {
      const validatedData = insertWikiPageSchema.parse(req.body);
      const page = await storage.createWikiPage(validatedData);
      res.status(201).json({ data: page });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid wiki page data", details: error.errors });
      }
      console.error("Error creating wiki page:", error);
      res.status(500).json({ error: "Failed to create wiki page" });
    }
  });

  // PUT /api/wiki/:id - Update a wiki page
  app.put("/api/wiki/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateWikiPageSchema.parse(req.body);
      const page = await storage.updateWikiPage(id, validatedData);

      if (!page) {
        return res.status(404).json({ error: "Wiki page not found" });
      }

      res.json({ data: page });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid wiki page data", details: error.errors });
      }
      console.error("Error updating wiki page:", error);
      res.status(500).json({ error: "Failed to update wiki page" });
    }
  });

  // DELETE /api/wiki/:id - Delete a wiki page
  app.delete("/api/wiki/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteWikiPage(id);

      if (!success) {
        return res.status(404).json({ error: "Wiki page not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting wiki page:", error);
      res.status(500).json({ error: "Failed to delete wiki page" });
    }
  });

  // POST /api/wiki/:id/duplicate - Duplicate a wiki page
  app.post("/api/wiki/:id/duplicate", async (req, res) => {
    try {
      const { id } = req.params;
      const duplicate = await storage.duplicateWikiPage(id);

      if (!duplicate) {
        return res.status(404).json({ error: "Wiki page not found" });
      }

      res.status(201).json({ data: duplicate });
    } catch (error) {
      console.error("Error duplicating wiki page:", error);
      res.status(500).json({ error: "Failed to duplicate wiki page" });
    }
  });

  // PUT /api/wiki/:id/move - Move a wiki page in the tree
  app.put("/api/wiki/:id/move", async (req, res) => {
    try {
      const { id } = req.params;
      const { parentId, sortOrder } = req.body;

      const success = await storage.moveWikiPage(id, parentId, sortOrder);

      if (!success) {
        return res.status(404).json({ error: "Wiki page not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error moving wiki page:", error);
      res.status(500).json({ error: "Failed to move wiki page" });
    }
  });

  // POST /api/wiki/:id/draft - Auto-save draft
  app.post("/api/wiki/:id/draft", async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      await storage.saveWikiPageDraft(id, content);
      res.json({ success: true, savedAt: new Date() });
    } catch (error) {
      console.error("Error saving wiki draft:", error);
      res.status(500).json({ error: "Failed to save draft" });
    }
  });

  // GET /api/wiki/:id/draft - Get draft
  app.get("/api/wiki/:id/draft", async (req, res) => {
    try {
      const { id } = req.params;
      const draft = await storage.getWikiPageDraft(id);
      res.json({ draft });
    } catch (error) {
      console.error("Error getting wiki draft:", error);
      res.status(500).json({ error: "Failed to get draft" });
    }
  });

  // GET /api/wiki/search - Full-text search (enhanced version)
  app.get("/api/wiki/search", async (req, res) => {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }

      const pages = await storage.searchWikiPages(q);
      res.json({ data: pages, query: q, count: pages.length });
    } catch (error) {
      console.error("Error searching wiki pages:", error);
      res.status(500).json({ error: "Failed to search wiki pages" });
    }
  });

  // ============================================================================
  // ENTITY MENTIONS API - Phase 2 Semantic Linking (Prep)
  // ============================================================================

  // GET /api/wiki/:id/mentions - Get all mentions in a page
  app.get("/api/wiki/:id/mentions", async (req, res) => {
    try {
      const { id } = req.params;
      const mentions = await storage.getEntityMentionsByPage(id);
      res.json({ data: mentions });
    } catch (error) {
      console.error("Error fetching mentions:", error);
      res.status(500).json({ error: "Failed to fetch mentions" });
    }
  });

  // GET /api/wiki/:id/backlinks - Get all pages that mention this entity
  app.get("/api/wiki/backlinks/:entityType/:entityId", async (req, res) => {
    try {
      const { entityType, entityId } = req.params;
      const mentions = await storage.getEntityMentionsByEntity(entityType, entityId);
      
      // Enrich mentions with page details
      const enrichedBacklinks = await Promise.all(
        mentions.map(async (mention) => {
          const page = await storage.getWikiPage(mention.pageId);
          return {
            pageId: mention.pageId,
            pageTitle: page?.title || 'Unknown Page',
            pageCategory: page?.category || null,
            mentionText: mention.text,
            createdAt: mention.createdAt,
          };
        })
      );
      
      // Remove duplicates (same page can have multiple mentions)
      const uniqueBacklinks = enrichedBacklinks.reduce((acc, backlink) => {
        if (!acc.find(b => b.pageId === backlink.pageId)) {
          acc.push(backlink);
        }
        return acc;
      }, [] as typeof enrichedBacklinks);
      
      res.json({ data: uniqueBacklinks });
    } catch (error) {
      console.error("Error fetching backlinks:", error);
      res.status(500).json({ error: "Failed to fetch backlinks" });
    }
  });

  // POST /api/wiki/mentions - Create entity mention
  app.post("/api/wiki/mentions", async (req, res) => {
    try {
      const validatedData = insertEntityMentionSchema.parse(req.body);
      const mention = await storage.createEntityMention(validatedData);
      res.status(201).json({ data: mention });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid mention data", details: error.errors });
      }
      console.error("Error creating mention:", error);
      res.status(500).json({ error: "Failed to create mention" });
    }
  });

  // ============================================================================
  // UNIFIED ENTITY SEARCH API - Platform-wide @mentions
  // Story: US-WIKI-070 (Unified Entity Search API for @mentions)
  // ============================================================================

  // GET /api/entities/search - Search across all entity types for @mentions and global search
  app.get("/api/entities/search", async (req, res) => {
    try {
      const { q, type, limit = '10', offset = '0' } = req.query;
      
      // Minimum 2 characters for search (user-friendly, while 3+ is ideal)
      if (!q || typeof q !== 'string' || q.length < 2) {
        return res.status(400).json({ 
          error: "Search query 'q' is required (minimum 2 characters)",
          query: q || '',
          totalResults: 0,
          results: []
        });
      }

      const searchLimit = Math.min(parseInt(limit as string) || 10, 50);
      const searchOffset = Math.max(parseInt(offset as string) || 0, 0);
      const query = q.toLowerCase().trim();
      const results: any[] = [];

      // Helper to calculate relevance score
      const calculateScore = (item: any, query: string): number => {
        let score = 0;
        const id = (item.id || '').toLowerCase();
        const title = (item.title || item.name || '').toLowerCase();
        const description = (item.description || '').toLowerCase();
        
        // Exact ID match = highest priority
        if (id === query) score += 100;
        else if (id.includes(query)) score += 50;
        
        // Title matches = high priority
        if (title === query) score += 80;
        else if (title.startsWith(query)) score += 60;
        else if (title.includes(query)) score += 40;
        
        // Description matches = medium priority
        if (description.includes(query)) score += 20;
        
        // Recency boost (within last 7 days)
        const updatedAt = item.updatedAt || item.createdAt;
        if (updatedAt) {
          const daysSinceUpdate = (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceUpdate < 7) score += 10;
          else if (daysSinceUpdate < 30) score += 5;
        }
        
        // Status boost (active/in-progress > done > archived)
        const status = (item.status || '').toLowerCase();
        if (['active', 'in-progress', 'in_progress', 'sprint'].includes(status)) score += 10;
        else if (['done', 'completed', 'published'].includes(status)) score += 5;
        else if (['archived', 'deprecated'].includes(status)) score -= 5;
        
        return score;
      };

      // Helper to add results with entity metadata and scoring
      const addResults = (items: any[], entityType: string, getUrl: (item: any) => string) => {
        const scored = items
          .map(item => {
            const id = (item.id || '').toLowerCase();
            const title = (item.title || item.name || '').toLowerCase();
            const description = (item.description || '').toLowerCase();
            const searchFields = `${id} ${title} ${description}`;
            
            // Check if item matches query
            if (!searchFields.includes(query)) return null;
            
            return {
              item,
              score: calculateScore(item, query)
            };
          })
          .filter((result): result is { item: any; score: number } => result !== null && result.score > 0);
        
        // Sort by score descending
        scored.sort((a, b) => b.score - a.score);
        
        // Map to result format
        const mapped = scored.map(({ item, score }) => ({
          id: item.id,
          entityType,
          title: item.title || item.name,
          description: item.description,
          status: item.status || 'active',
          score,
          url: getUrl(item),
          metadata: {
            description: item.description?.substring(0, 100),
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            ...getEntityMetadata(item, entityType)
          }
        }));
        
        results.push(...mapped);
      };

      // Helper to get entity-specific metadata
      const getEntityMetadata = (item: any, entityType: string) => {
        switch (entityType) {
          case 'user_story':
            return { 
              storyPoints: item.storyPoints, 
              priority: item.priority,
              epicId: item.epicId,
              assignee: item.assignee
            };
          case 'epic':
            return { 
              valueStream: item.valueStream,
              priority: item.priority
            };
          case 'defect':
            return { 
              severity: item.severity, 
              type: item.type,
              assignedTo: item.assignedTo
            };
          case 'model':
            return { 
              domain: item.domain, 
              type: item.type,
              state: item.state
            };
          case 'application':
            return { 
              type: item.type,
              criticality: item.criticality,
              owner: item.owner
            };
          case 'initiative':
            return { 
              status: item.status,
              priority: item.priority,
              businessValue: item.businessValue,
              owner: item.owner
            };
          case 'page':
            return { 
              category: item.category,
              template: item.template,
              views: item.views
            };
          case 'element':
            return { 
              type: item.type,
              category: item.category,
              layer: item.layer,
              framework: item.framework
            };
          default:
            return {};
        }
      };

      // Search User Stories
      if (!type || type === 'user_story') {
        const stories = await storage.getAllUserStories();
        addResults(stories, 'user_story', (s) => `/plan/stories/${s.id}`);
      }

      // Search Epics
      if (!type || type === 'epic') {
        const epics = await storage.getAllEpics();
        addResults(epics, 'epic', (e) => `/plan?epicId=${e.id}`);
      }

      // Search Defects
      if (!type || type === 'defect') {
        const defects = await storage.getAllDefects();
        addResults(defects, 'defect', (d) => `/quality/defects/${d.id}`);
      }

      // Search Applications
      if (!type || type === 'application') {
        const apps = await storage.getAllApplications();
        addResults(apps, 'application', (a) => `/apm?appId=${a.id}`);
      }

      // Search Initiatives
      if (!type || type === 'initiative') {
        const initiatives = await storage.getAllInitiatives();
        addResults(initiatives, 'initiative', (i) => `/portfolio?tab=initiatives&id=${i.id}`);
      }

      // Search Wiki Pages
      if (!type || type === 'page') {
        const pages = await storage.getAllWikiPages();
        addResults(pages, 'page', (p) => `/wiki-v2/${p.id}`);
      }

      // Search Architectural Models
      if (!type || type === 'model' || type === 'diagram') {
        const models = await storage.getArchitecturalModels();
        addResults(models, 'model', (m) => `/studio/canvas?modelId=${m.id}`);
      }

      // Search Architecture Elements
      if (!type || type === 'element') {
        const elements = await storage.getArchitectureElements();
        addResults(elements, 'element', (e) => `/elements?id=${e.id}`);
      }

      // Search Code Changes (Commits/PRs)
      if (!type || type === 'code_change') {
        const codeChanges = await storage.getAllCodeChanges();
        
        // Custom search logic for code changes
        const matchingChanges = codeChanges.filter(change => {
          const searchText = query.toLowerCase();
          
          // Match commit SHA (partial or full)
          if (change.commitSha && change.commitSha.toLowerCase().includes(searchText)) {
            return true;
          }
          
          // Match PR number (with or without #)
          const prQuery = searchText.replace(/^#/, '');
          if (change.prNumber && change.prNumber.toString() === prQuery) {
            return true;
          }
          
          // Match commit message
          if (change.commitMessage && change.commitMessage.toLowerCase().includes(searchText)) {
            return true;
          }
          
          // Match PR title
          if (change.prTitle && change.prTitle.toLowerCase().includes(searchText)) {
            return true;
          }
          
          // Match branch name
          if (change.branchName && change.branchName.toLowerCase().includes(searchText)) {
            return true;
          }
          
          // Match author (with or without @)
          const authorQuery = searchText.replace(/^@/, '');
          if (change.authorUsername && change.authorUsername.toLowerCase().includes(authorQuery)) {
            return true;
          }
          
          return false;
        });

        // For each code change, fetch linked entities to determine primary item
        const enrichedChanges = await Promise.all(
          matchingChanges.map(async (change) => {
            // Get all code changes with the same commit SHA
            const allChanges = await storage.getAllCodeChanges();
            const relatedChanges = allChanges.filter(c => c.commitSha === change.commitSha);
            
            // Fetch all linked entities for this commit
            const linkedEntitiesPromises = relatedChanges.map(async (relatedChange) => {
              let entity: any = null;
              let entityType = '';
              let url = '';
              
              if (relatedChange.entityType === 'defect') {
                entity = await storage.getDefect(relatedChange.entityId);
                entityType = 'defect';
                url = `/quality/defects/${relatedChange.entityId}`;
              } else if (relatedChange.entityType === 'user_story') {
                entity = await storage.getUserStory(relatedChange.entityId);
                entityType = 'user_story';
                url = `/plan/stories/${relatedChange.entityId}`;
              } else if (relatedChange.entityType === 'epic') {
                entity = await storage.getEpic(relatedChange.entityId);
                entityType = 'epic';
                url = `/plan?epicId=${relatedChange.entityId}`;
              }
              
              if (entity) {
                return {
                  id: relatedChange.entityId,
                  title: entity.title || entity.name || 'Unknown',
                  entityType: entityType,
                  url: url
                };
              }
              return null;
            });
            
            const allLinkedEntities = (await Promise.all(linkedEntitiesPromises)).filter(Boolean);
            
            // Determine primary entity (priority: defect > user_story > epic)
            let primaryEntity: any = null;
            let primaryType = '';
            let primaryUrl = '';
            
            // Find the highest priority entity
            const defectEntity = allLinkedEntities.find(e => e?.entityType === 'defect');
            const storyEntity = allLinkedEntities.find(e => e?.entityType === 'user_story');
            const epicEntity = allLinkedEntities.find(e => e?.entityType === 'epic');
            
            if (defectEntity) {
              primaryEntity = await storage.getDefect(defectEntity.id);
              primaryType = 'defect';
              primaryUrl = defectEntity.url;
            } else if (storyEntity) {
              primaryEntity = await storage.getUserStory(storyEntity.id);
              primaryType = 'user_story';
              primaryUrl = storyEntity.url;
            } else if (epicEntity) {
              primaryEntity = await storage.getEpic(epicEntity.id);
              primaryType = 'epic';
              primaryUrl = epicEntity.url;
            }
            
            return {
              change,
              primaryEntity,
              primaryType,
              primaryUrl,
              linkedCount: allLinkedEntities.length,
              linkedItems: allLinkedEntities
            };
          })
        );

        // Add results using primary entity with code change metadata
        enrichedChanges.forEach(({ change, primaryEntity, primaryType, primaryUrl, linkedCount, linkedItems }) => {
          if (primaryEntity) {
            const result = {
              id: primaryEntity.id,
              entityType: primaryType as any,
              title: primaryEntity.title || primaryEntity.name,
              description: primaryEntity.description,
              status: primaryEntity.status || 'active',
              score: calculateScore(primaryEntity, query),
              url: primaryUrl,
              metadata: {
                description: primaryEntity.description?.substring(0, 100),
                createdAt: primaryEntity.createdAt,
                updatedAt: primaryEntity.updatedAt,
                // Code change metadata
                commitSha: change.commitSha,
                prNumber: change.prNumber,
                branchName: change.branchName,
                authorUsername: change.authorUsername,
                linkedItemsCount: linkedCount,
                linkedItems: linkedItems,
                codeChangeId: change.id,
                ...getEntityMetadata(primaryEntity, primaryType)
              }
            };
            results.push(result);
          }
        });
      }

      // Sort all results by score (descending)
      results.sort((a, b) => (b.score || 0) - (a.score || 0));

      // Apply pagination
      const totalResults = results.length;
      const paginatedResults = results.slice(searchOffset, searchOffset + searchLimit);

      // Group results by entity type
      const grouped: Record<string, any[]> = {};
      paginatedResults.forEach(r => {
        if (!grouped[r.entityType]) grouped[r.entityType] = [];
        grouped[r.entityType].push(r);
      });

      res.json({
        query: q,
        totalResults,
        limit: searchLimit,
        offset: searchOffset,
        hasMore: totalResults > (searchOffset + searchLimit),
        results: paginatedResults,
        grouped,
      });
    } catch (error) {
      console.error("Error searching entities:", error);
      res.status(500).json({ error: "Failed to search entities" });
    }
  });

  // GET /api/entities/:type/:id - Get entity details for preview card
  app.get("/api/entities/:type/:id", async (req, res) => {
    try {
      const { type, id } = req.params;
      let entity: any = null;
      let url: string = '';

      switch (type) {
        case 'user_story':
          entity = await storage.getUserStory(id);
          url = `/plan?storyId=${id}`;
          break;
        case 'epic':
          entity = await storage.getEpic(id);
          url = `/plan?epicId=${id}`;
          break;
        case 'defect':
          entity = await storage.getDefect(id);
          url = `/defects/${id}`;
          break;
        case 'application':
          entity = await storage.getApplication(id);
          url = `/apm?appId=${id}`;
          break;
        case 'page':
          entity = await storage.getWikiPage(id);
          url = `/wiki-v2/${id}`;
          break;
        case 'model':
        case 'diagram':
          entity = await storage.getArchitecturalModel(id);
          url = `/studio/canvas?modelId=${id}`;
          break;
        case 'object':
        case 'component':
          entity = await storage.getArchitecturalObject(id);
          url = `/studio/canvas?objectId=${id}`;
          break;
        case 'capability':
          entity = await storage.getBusinessCapability(id);
          url = `/capabilities?id=${id}`;
          break;
        case 'element':
          entity = await storage.getArchitectureElement(id);
          url = `/elements?id=${id}`;
          break;
        default:
          return res.status(400).json({ error: `Unknown entity type: ${type}` });
      }

      if (!entity) {
        return res.status(404).json({ error: "Entity not found" });
      }

      res.json({
        id: entity.id,
        entityType: type,
        title: entity.title || entity.name,
        description: entity.description,
        status: entity.status || 'active',
        url,
        metadata: entity,
      });
    } catch (error) {
      console.error("Error fetching entity:", error);
      res.status(500).json({ error: "Failed to fetch entity" });
    }
  });

  // ============================================================================
  // END ENTITY SEARCH API
  // ============================================================================

  return httpServer;
}
