import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertArchitectureElementSchema,
  insertKnowledgeBasePageSchema,
  insertPageCommentSchema,
  insertTaskSchema,
  insertUserStorySchema,
  updateUserStorySchema,
  insertIntegrationChannelSchema,
  insertObjectSyncFlowSchema,
  type KnowledgeBasePage,
  type IntegrationChannel,
  type ObjectSyncFlow
} from "@shared/schema";
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

  // Tasks API - Project Management
  
  // Get all tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Get single task
  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const task = await storage.getTask(id);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      console.error("Failed to fetch task:", error);
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  // Create new task
  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      console.error("Failed to create task:", error);
      res.status(400).json({ message: "Failed to create task", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Update task
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedTask = await storage.updateTask(id, updates);
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(updatedTask);
    } catch (error) {
      console.error("Failed to update task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // Delete task
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTask(id);
      
      if (!success) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Failed to delete task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // User Stories API - Enterprise Story Management
  
  // Get all user stories with enterprise pagination and sorting
  app.get("/api/user-stories", async (req, res) => {
    try {
      const { taskId, assignee, page = '1', pageSize = '25', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      
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
      if (taskId && typeof taskId === 'string') {
        // Validate UUID format for taskId
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(taskId)) {
          return res.status(400).json({ message: "Invalid taskId format" });
        }
        stories = await storage.getUserStoriesByTask(taskId);
      } else if (assignee && typeof assignee === 'string') {
        // Basic assignee validation (non-empty string)
        if (assignee.trim().length === 0) {
          return res.status(400).json({ message: "Invalid assignee" });
        }
        stories = await storage.getUserStoriesByAssignee(assignee);
      } else {
        stories = await storage.getAllUserStories();
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
      
      // Validate referential integrity - check if parentTaskId exists
      if (validatedData.parentTaskId) {
        const parentTask = await storage.getTask(validatedData.parentTaskId);
        if (!parentTask) {
          return res.status(400).json({ 
            message: "Validation failed",
            errors: { parentTaskId: "Referenced task does not exist" }
          });
        }
      }
      
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
      if (!id || !id.startsWith('US-') || id.length !== 10) {
        return res.status(400).json({ 
          message: "Invalid story ID format. Expected US-XXXXXXX"
        });
      }
      
      // Validate update data with proper schema
      const validatedUpdates = updateUserStorySchema.parse(req.body);
      
      // Check if story exists first
      const existingStory = await storage.getUserStory(id);
      if (!existingStory) {
        return res.status(404).json({ message: "User story not found" });
      }
      
      // Validate referential integrity for parentTaskId if being updated
      if (validatedUpdates.parentTaskId !== undefined) {
        if (validatedUpdates.parentTaskId !== null) {
          const parentTask = await storage.getTask(validatedUpdates.parentTaskId);
          if (!parentTask) {
            return res.status(400).json({ 
              message: "Validation failed",
              errors: { parentTaskId: "Referenced task does not exist" }
            });
          }
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
          epic: story.parentTaskId,
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

  const httpServer = createServer(app);
  return httpServer;
}
