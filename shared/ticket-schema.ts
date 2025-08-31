import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { pgTable, varchar, text, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core';

// Ticket system tables
export const tickets = pgTable('tickets', {
  id: varchar('id', { length: 255 }).primaryKey(),
  ticketNumber: varchar('ticket_number', { length: 50 }).notNull().unique(),
  type: varchar('type', { length: 50 }).notNull(), // 'architecture_review', 'architect_request', 'adr', 'change_request'
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'open', 'in_progress', 'under_review', 'approved', 'rejected', 'closed', 'on_hold'
  priority: varchar('priority', { length: 20 }).notNull(), // 'low', 'medium', 'high', 'critical', 'urgent'
  severity: varchar('severity', { length: 20 }), // 'minor', 'major', 'critical', 'blocker'
  reporter: varchar('reporter', { length: 255 }).notNull(),
  assignee: varchar('assignee', { length: 255 }),
  reviewers: text('reviewers').array(), // Array of reviewer IDs
  watchers: text('watchers').array(), // Array of watcher IDs
  labels: text('labels').array(), // Array of labels/tags
  businessJustification: text('business_justification'),
  technicalImpact: text('technical_impact'),
  riskAssessment: varchar('risk_level', { length: 20 }), // 'low', 'medium', 'high', 'critical'
  estimatedEffort: varchar('estimated_effort', { length: 100 }),
  actualEffort: varchar('actual_effort', { length: 100 }),
  dueDate: timestamp('due_date'),
  targetResolution: timestamp('target_resolution'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
  closedAt: timestamp('closed_at'),
  metadata: jsonb('metadata'), // Flexible JSON for type-specific data
});

export const ticketLinks = pgTable('ticket_links', {
  id: varchar('id', { length: 255 }).primaryKey(),
  sourceTicketId: varchar('source_ticket_id', { length: 255 }).notNull(),
  targetTicketId: varchar('target_ticket_id', { length: 255 }),
  targetObjectType: varchar('target_object_type', { length: 100 }), // 'adr', 'capability', 'architecture_model', 'code_component'
  targetObjectId: varchar('target_object_id', { length: 255 }),
  linkType: varchar('link_type', { length: 50 }).notNull(), // 'blocks', 'relates_to', 'implements', 'supersedes', 'duplicates'
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ticketComments = pgTable('ticket_comments', {
  id: varchar('id', { length: 255 }).primaryKey(),
  ticketId: varchar('ticket_id', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  content: text('content').notNull(),
  commentType: varchar('comment_type', { length: 50 }).notNull(), // 'comment', 'status_change', 'assignment', 'approval', 'rejection'
  isInternal: boolean('is_internal').default(false),
  metadata: jsonb('metadata'), // For status changes, assignments, etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const ticketAttachments = pgTable('ticket_attachments', {
  id: varchar('id', { length: 255 }).primaryKey(),
  ticketId: varchar('ticket_id', { length: 255 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  filePath: varchar('file_path', { length: 500 }).notNull(),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  uploadedBy: varchar('uploaded_by', { length: 255 }).notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

export const ticketStateTransitions = pgTable('ticket_state_transitions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  ticketId: varchar('ticket_id', { length: 255 }).notNull(),
  fromStatus: varchar('from_status', { length: 50 }),
  toStatus: varchar('to_status', { length: 50 }).notNull(),
  actor: varchar('actor', { length: 255 }).notNull(),
  reason: text('reason'),
  automatedChange: boolean('automated_change').default(false),
  changeDetectionData: jsonb('change_detection_data'), // For AI-detected changes
  transitionedAt: timestamp('transitioned_at').defaultNow().notNull(),
});

// Architecture Review Request specific metadata schema
export const architectureReviewRequestSchema = z.object({
  projectName: z.string(),
  businessDomain: z.string(),
  stakeholders: z.array(z.string()),
  proposedSolution: z.string(),
  alternativesConsidered: z.array(z.string()),
  architecturalConcerns: z.array(z.string()),
  complianceRequirements: z.array(z.string()),
  performanceRequirements: z.string().optional(),
  securityRequirements: z.string().optional(),
  scalabilityRequirements: z.string().optional(),
  integrationPoints: z.array(z.string()),
  dataFlows: z.array(z.string()),
  deploymentModel: z.string().optional(),
  technologyStack: z.array(z.string()),
  budgetConstraints: z.string().optional(),
  timelineConstraints: z.string().optional(),
  linkedArchitectureModels: z.array(z.string()),
  linkedCapabilities: z.array(z.string()),
  expectedOutcomes: z.array(z.string()),
});

// Architect Request specific metadata schema
export const architectRequestSchema = z.object({
  projectName: z.string(),
  projectDescription: z.string(),
  businessObjectives: z.array(z.string()),
  projectDuration: z.string(),
  teamSize: z.number(),
  budgetRange: z.string(),
  requiredSkills: z.array(z.string()),
  preferredArchitect: z.string().optional(),
  urgency: z.string(),
  projectPhase: z.string(), // 'planning', 'design', 'implementation', 'maintenance'
  technologyDomains: z.array(z.string()),
  complexityLevel: z.string(), // 'low', 'medium', 'high', 'expert'
  stakeholderMap: z.array(z.object({
    name: z.string(),
    role: z.string(),
    involvement: z.string(),
  })),
  deliverables: z.array(z.string()),
  successCriteria: z.array(z.string()),
  riskFactors: z.array(z.string()),
});

// Enhanced ADR metadata schema
export const adrTicketSchema = z.object({
  decisionCategory: z.string(), // 'strategic', 'technical', 'security', 'data', 'infrastructure'
  architecturalLayer: z.string(), // 'business', 'application', 'data', 'technology', 'security'
  scope: z.string(), // 'enterprise', 'domain', 'application', 'component'
  context: z.string(),
  decision: z.string(),
  alternatives: z.array(z.object({
    option: z.string(),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    effort: z.string(),
    risk: z.string(),
  })),
  consequences: z.array(z.object({
    type: z.string(), // 'positive', 'negative', 'neutral'
    description: z.string(),
    impact: z.string(), // 'low', 'medium', 'high'
    timeframe: z.string(), // 'immediate', 'short_term', 'long_term'
  })),
  implementationPlan: z.object({
    phases: z.array(z.object({
      name: z.string(),
      duration: z.string(),
      deliverables: z.array(z.string()),
      dependencies: z.array(z.string()),
    })),
    resources: z.array(z.string()),
    timeline: z.string(),
    risks: z.array(z.string()),
    mitigations: z.array(z.string()),
  }).optional(),
  complianceImpact: z.array(z.string()),
  technicalDebtScore: z.number().min(0).max(100),
  maintenanceImpact: z.string(),
  operationalImpact: z.string(),
  linkedArchitectureViews: z.array(z.string()),
  affectedSystems: z.array(z.string()),
  reviewCriteria: z.array(z.string()),
});

// Change Detection metadata schema
export const changeDetectionSchema = z.object({
  changeType: z.string(), // 'code_change', 'dependency_change', 'configuration_change', 'api_change'
  detectionMethod: z.string(), // 'automated_scan', 'manual_report', 'integration_webhook'
  sourceLocation: z.string(),
  changedFiles: z.array(z.string()),
  impactAnalysis: z.object({
    affectedComponents: z.array(z.string()),
    architecturalLayers: z.array(z.string()),
    riskLevel: z.string(),
    recommendedActions: z.array(z.string()),
  }),
  confidence: z.number().min(0).max(100),
  detectedAt: z.string(),
  analysisData: z.record(z.any()),
});

// Portfolio association schema for flexible hierarchy
export const portfolioAssociationSchema = z.object({
  level1: z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['portfolio', 'division', 'business_unit'])
  }),
  level2: z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['product', 'program', 'project', 'initiative'])
  }),
  level3: z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['product', 'program', 'project', 'initiative'])
  }).optional(),
  externalRef: z.object({
    system: z.string(), // e.g., 'jira', 'azure_devops', 'asana'
    projectKey: z.string(),
    projectName: z.string(),
    url: z.string().optional()
  }).optional()
});

// Object linkage schema for configurable associations
export const objectLinkageSchema = z.object({
  id: z.string(),
  type: z.enum(['ticket', 'architecture_element', 'adr', 'change_request', 'technical_debt', 'architecture_review', 'architect_request']),
  title: z.string(),
  ticketNumber: z.string().optional(),
  relationship: z.enum(['blocks', 'blocked_by', 'relates_to', 'duplicates', 'parent_of', 'child_of', 'implements', 'derived_from', 'generates']),
  description: z.string().optional()
});

// Insert schemas
export const insertTicketSchema = createInsertSchema(tickets).omit({ 
  id: true, 
  ticketNumber: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertTicketLinkSchema = createInsertSchema(ticketLinks).omit({ 
  id: true, 
  createdAt: true 
});

export const insertTicketCommentSchema = createInsertSchema(ticketComments).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertTicketAttachmentSchema = createInsertSchema(ticketAttachments).omit({ 
  id: true, 
  uploadedAt: true 
});

export const insertTicketStateTransitionSchema = createInsertSchema(ticketStateTransitions).omit({ 
  id: true, 
  transitionedAt: true 
});

// Types
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type TicketLink = typeof ticketLinks.$inferSelect;
export type InsertTicketLink = z.infer<typeof insertTicketLinkSchema>;
export type TicketComment = typeof ticketComments.$inferSelect;
export type InsertTicketComment = z.infer<typeof insertTicketCommentSchema>;
export type TicketAttachment = typeof ticketAttachments.$inferSelect;
export type InsertTicketAttachment = z.infer<typeof insertTicketAttachmentSchema>;
export type TicketStateTransition = typeof ticketStateTransitions.$inferSelect;
export type InsertTicketStateTransition = z.infer<typeof insertTicketStateTransitionSchema>;

export type ArchitectureReviewRequest = z.infer<typeof architectureReviewRequestSchema>;
export type ArchitectRequest = z.infer<typeof architectRequestSchema>;
export type ADRTicket = z.infer<typeof adrTicketSchema>;
export type ChangeDetection = z.infer<typeof changeDetectionSchema>;
export type PortfolioAssociation = z.infer<typeof portfolioAssociationSchema>;
export type ObjectLinkage = z.infer<typeof objectLinkageSchema>;

// Ticket type definitions
export const TICKET_TYPES = {
  ARCHITECTURE_REVIEW: 'architecture_review',
  ARCHITECT_REQUEST: 'architect_request',
  ADR: 'adr',
  CHANGE_REQUEST: 'change_request',
} as const;

export const TICKET_STATUSES = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CLOSED: 'closed',
  ON_HOLD: 'on_hold',
} as const;

export const TICKET_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
  URGENT: 'urgent',
} as const;

export const LINK_TYPES = {
  BLOCKS: 'blocks',
  RELATES_TO: 'relates_to',
  IMPLEMENTS: 'implements',
  SUPERSEDES: 'supersedes',
  DUPLICATES: 'duplicates',
} as const;