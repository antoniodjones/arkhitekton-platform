# Jira Integration - Technical Specification

**Version**: 1.0  
**Last Updated**: October 12, 2025  
**Status**: Design Specification  
**Owner**: ARKHITEKTON Integration Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [ID Mapping Strategy](#id-mapping-strategy)
4. [Database Schema](#database-schema)
5. [API Specifications](#api-specifications)
6. [Webhook Infrastructure](#webhook-infrastructure)
7. [Loop Prevention & Conflict Resolution](#loop-prevention--conflict-resolution)
8. [Field Mapping Rules](#field-mapping-rules)
9. [Authentication & Security](#authentication--security)
10. [Performance & Scalability](#performance--scalability)
11. [Error Handling & Retry Logic](#error-handling--retry-logic)
12. [Monitoring & Observability](#monitoring--observability)
13. [Implementation Phases](#implementation-phases)

---

## Executive Summary

This specification defines the native bi-directional integration between **ARKHITEKTON** and **Jira** (Cloud & Data Center). The integration enables real-time synchronization of user stories, defects, and epics while maintaining data consistency and preventing infinite sync loops.

### Key Design Principles

1. **Each system maintains its own primary keys** (mapping table approach)
2. **Webhook-based real-time sync** with async queue processing
3. **Loop prevention** via sync_source tracking and idempotency
4. **Conflict resolution** using last-write-wins with timestamp comparison
5. **Field mapping flexibility** supporting custom Jira fields

### Success Metrics

- **Sync Latency**: <5 seconds for 95th percentile
- **Accuracy**: 99.9% data consistency
- **Reliability**: 99.5% uptime
- **Performance**: Support 1000+ concurrent users

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         ARKHITEKTON                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  User Interface                                           │  │
│  │  - User Stories  - Defects  - Epics                      │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
│  ┌────────────────▼─────────────────────────────────────────┐  │
│  │  REST API Layer                                           │  │
│  │  - CRUD Operations  - Webhooks  - Validation             │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
│  ┌────────────────▼─────────────────────────────────────────┐  │
│  │  Jira Sync Service                                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐           │  │
│  │  │ Outbound │  │ Inbound  │  │ ID Mapping   │           │  │
│  │  │ Sync     │  │ Webhook  │  │ Service      │           │  │
│  │  └──────────┘  └──────────┘  └──────────────┘           │  │
│  └────────────────┬──────────────────┬───────────────────────┘  │
│                   │                  │                          │
│  ┌────────────────▼──────────────────▼───────────────────────┐  │
│  │  Async Job Queue (Bull/Redis)                             │  │
│  │  - Webhook Processing  - Retry Logic  - Rate Limiting     │  │
│  └────────────────┬──────────────────┬───────────────────────┘  │
│                   │                  │                          │
│  ┌────────────────▼──────────────────▼───────────────────────┐  │
│  │  PostgreSQL Database                                       │  │
│  │  - user_stories  - jira_mappings  - sync_logs             │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ HTTPS
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                         Jira Cloud/Data Center                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Jira REST API v3                                         │  │
│  │  - Issues  - Projects  - Custom Fields                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Webhooks                                                  │  │
│  │  - issue:created  - issue:updated  - issue:deleted        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **Outbound Sync** | Push changes from ARKHITEKTON to Jira |
| **Inbound Webhook** | Receive and process Jira webhooks |
| **ID Mapping Service** | Maintain ARKHITEKTON ↔ Jira ID mappings |
| **Async Job Queue** | Process sync operations asynchronously |
| **Sync Logs** | Audit trail and debugging |

---

## ID Mapping Strategy

### Core Principle: Each System Maintains Its Own IDs

**ARKHITEKTON IDs**: `US-K7V595F` (custom format)  
**Jira IDs**: `PROJ-1234` (project key + number)

### Mapping Table Design

Both systems store references to each other:

1. **ARKHITEKTON → Jira**: Store Jira key in `jiraIssueKey` field
2. **Jira → ARKHITEKTON**: Store ARKHITEKTON ID in custom field
3. **Mapping Table**: Centralized lookup for sync operations

### Example Flow

**Creating in ARKHITEKTON:**
```
1. User creates story: US-ABC123
2. Sync service creates Jira issue → PROJ-456
3. Store mapping: US-ABC123 ↔ PROJ-456
4. Update ARKHITEKTON: story.jiraIssueKey = "PROJ-456"
5. Update Jira custom field: "ARKHITEKTON_ID" = "US-ABC123"
```

**Updating in Jira:**
```
1. Webhook receives: PROJ-456 updated
2. Lookup mapping: PROJ-456 → US-ABC123
3. Update ARKHITEKTON story: US-ABC123
4. Mark sync_source: "jira" (prevent loop)
```

---

## Database Schema

### New Tables

#### 1. `jira_integration_mappings`

```typescript
export const jiraIntegrationMappings = pgTable("jira_integration_mappings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // ARKHITEKTON entity
  arkhitektonId: varchar("arkhitekton_id").notNull(),
  arkhitektonType: varchar("arkhitekton_type").notNull(), // 'user_story', 'defect', 'epic'
  
  // Jira entity
  jiraIssueKey: varchar("jira_issue_key").notNull(),      // PROJ-1234
  jiraIssueId: varchar("jira_issue_id").notNull(),        // 10001 (numeric ID)
  jiraIssueType: varchar("jira_issue_type").notNull(),    // 'Story', 'Bug', 'Epic'
  jiraProjectKey: varchar("jira_project_key").notNull(),  // PROJ
  
  // Sync metadata
  syncDirection: varchar("sync_direction"),                // 'to_jira', 'from_jira', 'bi_directional'
  lastSyncedAt: timestamp("last_synced_at").defaultNow(),
  syncStatus: varchar("sync_status").default("active"),   // 'active', 'paused', 'error'
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Indexes
CREATE INDEX idx_arkhitekton_id ON jira_integration_mappings(arkhitekton_id);
CREATE INDEX idx_jira_issue_key ON jira_integration_mappings(jira_issue_key);
CREATE INDEX idx_jira_issue_id ON jira_integration_mappings(jira_issue_id);
CREATE UNIQUE INDEX idx_mapping_unique ON jira_integration_mappings(arkhitekton_id, jira_issue_key);
```

#### 2. `jira_sync_logs`

```typescript
export const jiraSyncLogs = pgTable("jira_sync_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Mapping reference
  mappingId: varchar("mapping_id").references(() => jiraIntegrationMappings.id),
  
  // Sync details
  syncDirection: varchar("sync_direction").notNull(),     // 'to_jira', 'from_jira'
  syncType: varchar("sync_type").notNull(),               // 'create', 'update', 'delete'
  syncSource: varchar("sync_source").notNull(),           // 'webhook', 'manual', 'scheduled'
  
  // Payload
  requestPayload: jsonb("request_payload").$type<any>(),
  responsePayload: jsonb("response_payload").$type<any>(),
  
  // Status
  status: varchar("status").notNull(),                    // 'success', 'failed', 'pending', 'retrying'
  errorMessage: text("error_message"),
  errorCode: varchar("error_code"),
  
  // Performance
  durationMs: integer("duration_ms"),
  retryCount: integer("retry_count").default(0),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
});

// Indexes
CREATE INDEX idx_sync_status ON jira_sync_logs(status);
CREATE INDEX idx_sync_created ON jira_sync_logs(created_at);
CREATE INDEX idx_mapping_logs ON jira_sync_logs(mapping_id);
```

#### 3. `jira_webhook_events`

```typescript
export const jiraWebhookEvents = pgTable("jira_webhook_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Webhook details
  webhookId: varchar("webhook_id"),                       // Jira webhook ID
  eventType: varchar("event_type").notNull(),             // 'issue:created', 'issue:updated', etc.
  jiraIssueKey: varchar("jira_issue_key").notNull(),
  
  // Payload
  rawPayload: jsonb("raw_payload").$type<any>().notNull(),
  
  // Processing
  processedAt: timestamp("processed_at"),
  processingStatus: varchar("processing_status").default("pending"), // 'pending', 'processed', 'failed', 'ignored'
  processingError: text("processing_error"),
  
  // Idempotency
  idempotencyKey: varchar("idempotency_key").unique(),
  
  // Timestamps
  receivedAt: timestamp("received_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Indexes
CREATE INDEX idx_webhook_status ON jira_webhook_events(processing_status);
CREATE INDEX idx_webhook_received ON jira_webhook_events(received_at);
CREATE UNIQUE INDEX idx_idempotency ON jira_webhook_events(idempotency_key);
```

### Modified Tables

#### `user_stories` - Add Jira Fields

```typescript
export const userStories = pgTable("user_stories", {
  // ... existing fields ...
  
  // Jira integration fields
  jiraIssueKey: varchar("jira_issue_key"),               // PROJ-1234
  jiraIssueId: varchar("jira_issue_id"),                 // 10001
  lastSyncedAt: timestamp("last_synced_at"),
  syncSource: varchar("sync_source"),                     // 'arkhitekton', 'jira', 'manual'
  syncStatus: varchar("sync_status"),                     // 'synced', 'pending', 'error', 'disabled'
  
  // ... existing fields ...
});
```

#### `defects` - Add Jira Fields

```typescript
export const defects = pgTable("defects", {
  // ... existing fields ...
  
  // Jira integration fields
  jiraIssueKey: varchar("jira_issue_key"),
  jiraIssueId: varchar("jira_issue_id"),
  lastSyncedAt: timestamp("last_synced_at"),
  syncSource: varchar("sync_source"),
  syncStatus: varchar("sync_status"),
  
  // ... existing fields ...
});
```

#### `epics` - Add Jira Fields

```typescript
export const epics = pgTable("epics", {
  // ... existing fields ...
  
  // Jira integration fields
  jiraEpicKey: varchar("jira_epic_key"),
  jiraEpicId: varchar("jira_epic_id"),
  lastSyncedAt: timestamp("last_synced_at"),
  syncSource: varchar("sync_source"),
  syncStatus: varchar("sync_status"),
  
  // ... existing fields ...
});
```

---

## API Specifications

### ARKHITEKTON API Endpoints

#### 1. User Stories

```typescript
// List user stories (enhanced with Jira sync status)
GET /api/user-stories
Query params:
  - syncStatus: 'synced' | 'pending' | 'error' | 'disabled'
  - hasSyncError: boolean

Response:
{
  data: UserStory[],
  pagination: { ... },
  syncStats: {
    totalSynced: number,
    totalPending: number,
    totalErrors: number
  }
}

// Get single story with Jira mapping
GET /api/user-stories/:id
Response:
{
  ...story,
  jiraMapping: {
    issueKey: "PROJ-123",
    issueUrl: "https://yourcompany.atlassian.net/browse/PROJ-123",
    lastSyncedAt: "2025-10-12T10:00:00Z",
    syncStatus: "synced"
  }
}

// Create story and optionally sync to Jira
POST /api/user-stories
Body:
{
  ...storyData,
  syncToJira: boolean,          // Optional
  jiraProjectKey: string        // Required if syncToJira=true
}

// Update story and sync to Jira
PATCH /api/user-stories/:id
Body:
{
  ...updates,
  syncToJira: boolean           // Default: true if already linked
}

// Manual sync trigger
POST /api/user-stories/:id/sync-to-jira
Body:
{
  jiraProjectKey: string,
  forceUpdate: boolean          // Re-sync even if already synced
}
```

#### 2. Jira Webhooks (Inbound)

```typescript
// Receive Jira webhooks
POST /api/jira/webhooks
Headers:
  - X-Atlassian-Webhook-Identifier: string
  - X-Hub-Signature: string (HMAC verification)
Body: Jira webhook payload

Response:
{
  status: "accepted",
  jobId: "job-uuid"             // Async processing job ID
}

// Check webhook processing status
GET /api/jira/webhooks/:eventId/status
Response:
{
  status: "processed" | "pending" | "failed",
  error?: string,
  processedAt?: string
}
```

#### 3. Jira Mappings

```typescript
// Get mapping for ARKHITEKTON entity
GET /api/jira/mappings/:arkhitektonId
Response:
{
  arkhitektonId: "US-ABC123",
  jiraIssueKey: "PROJ-456",
  jiraIssueUrl: "https://...",
  syncStatus: "active",
  lastSyncedAt: "2025-10-12T10:00:00Z"
}

// Create manual mapping
POST /api/jira/mappings
Body:
{
  arkhitektonId: string,
  arkhitektonType: 'user_story' | 'defect' | 'epic',
  jiraIssueKey: string,
  jiraProjectKey: string
}

// Delete mapping (stop sync)
DELETE /api/jira/mappings/:mappingId
```

#### 4. Sync Management

```typescript
// Get sync statistics
GET /api/jira/sync/stats
Response:
{
  totalMappings: number,
  activeSyncs: number,
  errorSyncs: number,
  lastSyncTime: string,
  syncRate: {
    last24h: number,
    last7d: number
  }
}

// Bulk sync trigger
POST /api/jira/sync/bulk
Body:
{
  entityIds: string[],
  syncDirection: 'to_jira' | 'from_jira' | 'bi_directional'
}

// Retry failed syncs
POST /api/jira/sync/retry-failed
Body:
{
  limit?: number                // Max syncs to retry
}
```

### Jira API Usage

#### Authentication

**Jira Cloud - OAuth 2.0:**
```typescript
// OAuth flow
1. Redirect to Jira authorization URL
2. Receive callback with code
3. Exchange code for access token
4. Store refresh token securely

// Token refresh
POST https://auth.atlassian.com/oauth/token
Body:
{
  grant_type: "refresh_token",
  refresh_token: "stored_refresh_token",
  client_id: "YOUR_CLIENT_ID",
  client_secret: "YOUR_CLIENT_SECRET"
}
```

**Jira Data Center - API Token:**
```typescript
// Basic auth with API token
Headers:
{
  Authorization: "Basic " + base64(email + ":" + api_token)
}
```

#### Key Jira Endpoints

```typescript
// Create issue
POST /rest/api/3/issue
Body:
{
  fields: {
    project: { key: "PROJ" },
    issuetype: { name: "Story" },
    summary: "Story title",
    description: {
      type: "doc",
      version: 1,
      content: [...]              // Atlassian Document Format
    },
    customfield_10001: "US-ABC123" // ARKHITEKTON ID
  }
}

// Update issue
PUT /rest/api/3/issue/{issueKey}
Body:
{
  fields: { ... }
}

// Get issue
GET /rest/api/3/issue/{issueKey}

// Register webhook
POST /rest/api/3/webhook
Body:
{
  name: "ARKHITEKTON Sync Webhook",
  url: "https://arkhitekton.repl.co/api/jira/webhooks",
  events: ["issue:created", "issue:updated", "issue:deleted"],
  filters: {
    issue-related-events-section: "customfield_10001[ARKHITEKTON_ID]~."
  }
}
```

---

## Webhook Infrastructure

### Webhook Flow

```
Jira Event → Webhook POST → ARKHITEKTON → Queue Job → Process Async → Update DB
```

### Webhook Handler Implementation

```typescript
// server/routes.ts
app.post("/api/jira/webhooks", async (req, res) => {
  try {
    // 1. Verify HMAC signature
    const signature = req.headers['x-hub-signature'];
    const isValid = verifyJiraWebhookSignature(req.body, signature);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid signature" });
    }
    
    // 2. Extract event details
    const { webhookEvent, issue, changelog } = req.body;
    const jiraIssueKey = issue.key;
    const eventType = webhookEvent; // 'issue:created', 'issue:updated', etc.
    
    // 3. Check idempotency (prevent duplicate processing)
    const idempotencyKey = `${webhookEvent}-${issue.id}-${issue.updated}`;
    const existing = await storage.getWebhookEventByIdempotency(idempotencyKey);
    if (existing) {
      return res.status(200).json({ status: "already_processed" });
    }
    
    // 4. Store webhook event
    const webhookEventId = await storage.createWebhookEvent({
      eventType,
      jiraIssueKey,
      rawPayload: req.body,
      idempotencyKey,
      processingStatus: "pending"
    });
    
    // 5. Queue async job (respond quickly)
    await jiraSyncQueue.add('process-webhook', {
      webhookEventId,
      eventType,
      jiraIssueKey
    });
    
    // 6. Respond to Jira (< 200ms)
    res.status(200).json({
      status: "accepted",
      jobId: webhookEventId
    });
    
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal error" });
  }
});
```

### Async Job Processing

```typescript
// server/jira-sync-queue.ts
import Queue from 'bull';
import Redis from 'ioredis';

const redisConnection = new Redis(process.env.REDIS_URL);

export const jiraSyncQueue = new Queue('jira-sync', {
  redis: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: 100,
    removeOnFail: 500
  }
});

// Process webhook events
jiraSyncQueue.process('process-webhook', async (job) => {
  const { webhookEventId, eventType, jiraIssueKey } = job.data;
  
  try {
    // 1. Get webhook event
    const webhookEvent = await storage.getWebhookEvent(webhookEventId);
    const issue = webhookEvent.rawPayload.issue;
    
    // 2. Check if update came from ARKHITEKTON (prevent loop)
    const arkhitektonId = issue.fields.customfield_10001; // ARKHITEKTON_ID custom field
    const changeLog = webhookEvent.rawPayload.changelog;
    
    if (isUpdateFromArkhitekton(changeLog)) {
      await storage.updateWebhookEvent(webhookEventId, {
        processingStatus: "ignored",
        processedAt: new Date()
      });
      return { status: "ignored", reason: "Loop prevention" };
    }
    
    // 3. Find mapping
    const mapping = await storage.getJiraMappingByIssueKey(jiraIssueKey);
    
    if (!mapping && eventType === 'issue:created') {
      // New issue created in Jira without ARKHITEKTON mapping
      if (!arkhitektonId) {
        return { status: "ignored", reason: "No ARKHITEKTON ID" };
      }
      
      // Create mapping
      await storage.createJiraMapping({
        arkhitektonId,
        arkhitektonType: determineType(issue.fields.issuetype.name),
        jiraIssueKey,
        jiraIssueId: issue.id,
        jiraIssueType: issue.fields.issuetype.name,
        jiraProjectKey: issue.fields.project.key,
        syncDirection: "from_jira"
      });
    }
    
    if (!mapping) {
      return { status: "ignored", reason: "No mapping" };
    }
    
    // 4. Update ARKHITEKTON entity
    const updateData = mapJiraFieldsToArkhitekton(issue.fields);
    
    await storage.updateUserStory(mapping.arkhitektonId, {
      ...updateData,
      syncSource: "jira",
      lastSyncedAt: new Date(),
      syncStatus: "synced"
    });
    
    // 5. Log sync
    await storage.createSyncLog({
      mappingId: mapping.id,
      syncDirection: "from_jira",
      syncType: eventType.split(':')[1], // 'created', 'updated', 'deleted'
      syncSource: "webhook",
      requestPayload: issue,
      status: "success"
    });
    
    // 6. Mark webhook processed
    await storage.updateWebhookEvent(webhookEventId, {
      processingStatus: "processed",
      processedAt: new Date()
    });
    
    return { status: "success" };
    
  } catch (error) {
    console.error("Job processing error:", error);
    
    // Log error
    await storage.updateWebhookEvent(webhookEventId, {
      processingStatus: "failed",
      processingError: error.message,
      processedAt: new Date()
    });
    
    throw error; // Trigger retry
  }
});

// Helper: Check if update came from ARKHITEKTON
function isUpdateFromArkhitekton(changelog: any): boolean {
  if (!changelog || !changelog.items) return false;
  
  // Check if update was made by ARKHITEKTON service account
  // or if specific field pattern indicates ARKHITEKTON origin
  return changelog.items.some((item: any) => 
    item.field === 'customfield_10002' && // sync_source field
    item.toString === 'arkhitekton'
  );
}

// Helper: Map Jira issue type to ARKHITEKTON type
function determineType(jiraIssueType: string): string {
  const mapping: Record<string, string> = {
    'Story': 'user_story',
    'Task': 'user_story',
    'Bug': 'defect',
    'Epic': 'epic'
  };
  return mapping[jiraIssueType] || 'user_story';
}

// Helper: Map Jira fields to ARKHITEKTON schema
function mapJiraFieldsToArkhitekton(fields: any) {
  return {
    title: fields.summary,
    description: extractTextFromADF(fields.description), // Atlassian Document Format
    status: mapJiraStatusToArkhitekton(fields.status.name),
    priority: mapJiraPriorityToArkhitekton(fields.priority.name),
    assignee: fields.assignee?.emailAddress || null,
    storyPoints: fields.customfield_10016 || null, // Story Points custom field
    labels: fields.labels || []
  };
}
```

---

## Loop Prevention & Conflict Resolution

### Loop Prevention Strategy

**Problem**: Bi-directional sync can create infinite loops:
```
ARKHITEKTON update → Jira webhook → ARKHITEKTON update → Jira webhook → ∞
```

**Solution**: Multi-layer loop prevention

#### Layer 1: Sync Source Tracking

```typescript
// Mark origin of every update
interface SyncMetadata {
  syncSource: 'arkhitekton' | 'jira' | 'manual';
  syncTimestamp: Date;
  syncVersion: string;
}

// When updating from webhook, set syncSource = 'jira'
// When pushing to Jira, set custom field sync_source = 'arkhitekton'
```

#### Layer 2: Webhook Filtering

```typescript
// In webhook handler
if (changelog.items.some(item => 
  item.field === 'customfield_10002' && 
  item.toString === 'arkhitekton'
)) {
  // This update came from us, ignore
  return { status: "ignored", reason: "Loop prevention" };
}
```

#### Layer 3: Timestamp Comparison

```typescript
// Only sync if Jira timestamp is newer
const jiraUpdatedAt = new Date(issue.fields.updated);
const arkhitektonUpdatedAt = story.updatedAt;

if (jiraUpdatedAt <= arkhitektonUpdatedAt) {
  // ARKHITEKTON is newer or same, skip
  return { status: "ignored", reason: "Stale update" };
}
```

#### Layer 4: Idempotency Keys

```typescript
// Prevent duplicate webhook processing
const idempotencyKey = `${webhookEvent}-${issueId}-${updatedTimestamp}`;

// Check if already processed
if (await storage.hasProcessedIdempotency(idempotencyKey)) {
  return { status: "already_processed" };
}
```

### Conflict Resolution

**Strategy**: Last-Write-Wins (LWW) with timestamp comparison

```typescript
async function resolveConflict(
  arkhitektonEntity: UserStory,
  jiraIssue: JiraIssue
): Promise<'use_arkhitekton' | 'use_jira' | 'merge'> {
  
  const arkhitektonTime = arkhitektonEntity.updatedAt.getTime();
  const jiraTime = new Date(jiraIssue.fields.updated).getTime();
  
  // Case 1: Clear winner (>10 second difference)
  if (Math.abs(arkhitektonTime - jiraTime) > 10000) {
    return arkhitektonTime > jiraTime ? 'use_arkhitekton' : 'use_jira';
  }
  
  // Case 2: Race condition (<10 second difference)
  // Use field-level merge
  return 'merge';
}

// Field-level merge for race conditions
function mergeFields(
  arkhitektonEntity: UserStory,
  jiraIssue: JiraIssue
): Partial<UserStory> {
  return {
    title: jiraIssue.fields.summary, // Prefer Jira for text fields
    description: jiraIssue.fields.description,
    status: arkhitektonEntity.status, // Prefer ARKHITEKTON for workflow
    priority: jiraIssue.fields.priority.name,
    storyPoints: arkhitektonEntity.storyPoints, // Prefer ARKHITEKTON
    labels: [...new Set([
      ...arkhitektonEntity.labels,
      ...jiraIssue.fields.labels
    ])], // Merge arrays
  };
}
```

---

## Field Mapping Rules

### User Story ↔ Jira Story/Task

| ARKHITEKTON Field | Jira Field | Transformation |
|-------------------|------------|----------------|
| `id` | `customfield_10001` (ARKHITEKTON ID) | Direct |
| `title` | `summary` | Direct |
| `description` | `description` | Markdown → ADF* |
| `acceptanceCriteria` | `customfield_10003` | Direct (text) |
| `status` | `status.name` | Map via rules |
| `priority` | `priority.name` | high→P1, medium→P2, low→P3 |
| `storyPoints` | `customfield_10016` (Story Points) | Direct (number) |
| `assignee` | `assignee.emailAddress` | Email lookup |
| `epicId` | `parent.key` | Epic link |
| `labels` | `labels` | Array merge |
| `relatedFiles` | `customfield_10004` | JSON string |

*ADF = Atlassian Document Format

### Status Mapping

**ARKHITEKTON → Jira:**
```typescript
const statusMap: Record<string, string> = {
  'backlog': 'To Do',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  'done': 'Done',
  'cancelled': 'Won\'t Do'
};
```

**Jira → ARKHITEKTON:**
```typescript
const reverseStatusMap: Record<string, string> = {
  'To Do': 'backlog',
  'In Progress': 'in-progress',
  'In Review': 'in-review',
  'Code Review': 'in-review',
  'Done': 'done',
  'Closed': 'done',
  'Won\'t Do': 'cancelled'
};
```

### Defect ↔ Jira Bug

| ARKHITEKTON Field | Jira Field | Transformation |
|-------------------|------------|----------------|
| `severity` | `priority.name` | critical→P0, high→P1, medium→P2, low→P3 |
| `defectType` | `customfield_10005` | Direct |
| `rootCause` | `customfield_10006` | Direct (text) |
| `resolutionNotes` | `resolution.description` | Direct |
| `relatedStoryId` | `issuelinks` | Link to parent story |

### Epic ↔ Jira Epic

| ARKHITEKTON Field | Jira Field | Transformation |
|-------------------|------------|----------------|
| `valueStream` | `customfield_10007` | Direct |
| `businessValue` | `customfield_10008` | Direct (text) |
| `targetDate` | `duedate` | ISO 8601 date |
| `owner` | `assignee.emailAddress` | Email lookup |

---

## Authentication & Security

### OAuth 2.0 Flow (Jira Cloud)

```typescript
// 1. Authorization URL
const authUrl = `https://auth.atlassian.com/authorize?` +
  `audience=api.atlassian.com&` +
  `client_id=${CLIENT_ID}&` +
  `scope=read:jira-work write:jira-work&` +
  `redirect_uri=${REDIRECT_URI}&` +
  `response_type=code&` +
  `prompt=consent`;

// 2. Token exchange
const tokenResponse = await fetch('https://auth.atlassian.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: authCode,
    redirect_uri: REDIRECT_URI
  })
});

const { access_token, refresh_token, expires_in } = await tokenResponse.json();

// 3. Store tokens securely
await storage.storeJiraTokens({
  accessToken: encrypt(access_token),
  refreshToken: encrypt(refresh_token),
  expiresAt: new Date(Date.now() + expires_in * 1000)
});

// 4. Refresh token before expiry
async function refreshAccessToken() {
  const tokens = await storage.getJiraTokens();
  
  const response = await fetch('https://auth.atlassian.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: decrypt(tokens.refreshToken)
    })
  });
  
  const { access_token, expires_in } = await response.json();
  
  await storage.updateJiraTokens({
    accessToken: encrypt(access_token),
    expiresAt: new Date(Date.now() + expires_in * 1000)
  });
  
  return access_token;
}
```

### Webhook Security (HMAC Verification)

```typescript
import crypto from 'crypto';

function verifyJiraWebhookSignature(
  payload: any,
  signature: string
): boolean {
  const secret = process.env.JIRA_WEBHOOK_SECRET!;
  
  // Jira sends: sha256=<hash>
  const [algorithm, providedHash] = signature.split('=');
  
  // Compute expected hash
  const expectedHash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  // Constant-time comparison
  return crypto.timingSafeEqual(
    Buffer.from(providedHash),
    Buffer.from(expectedHash)
  );
}
```

### Required Jira Permissions

**Scopes for OAuth 2.0:**
- `read:jira-work` - Read issues, projects, fields
- `write:jira-work` - Create/update issues
- `read:jira-user` - Read user information
- `manage:jira-webhook` - Register webhooks

---

## Performance & Scalability

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Webhook Response Time** | <200ms | 95th percentile |
| **Sync Latency** | <5s | End-to-end (ARKHITEKTON → Jira) |
| **Webhook Processing** | <2s | Job processing time |
| **API Response Time** | <500ms | CRUD operations |
| **Concurrent Syncs** | 100/sec | Sustained rate |
| **Error Rate** | <0.1% | Failed syncs |

### Scalability Strategy

#### 1. Async Queue Architecture

```typescript
// Use Bull queue with Redis
const jiraSyncQueue = new Queue('jira-sync', {
  redis: {
    host: process.env.REDIS_HOST,
    port: 6379
  },
  settings: {
    maxStalledCount: 3,
    stalledInterval: 30000,
    lockDuration: 60000
  }
});

// Concurrency control
jiraSyncQueue.process('process-webhook', 10, async (job) => {
  // Process up to 10 jobs concurrently
});
```

#### 2. Rate Limiting

```typescript
// Jira Cloud: 10,000 requests/hour
import Bottleneck from 'bottleneck';

const jiraLimiter = new Bottleneck({
  reservoir: 10000,        // Initial capacity
  reservoirRefreshAmount: 10000,
  reservoirRefreshInterval: 60 * 60 * 1000, // 1 hour
  maxConcurrent: 20,       // Max concurrent requests
  minTime: 100             // Min 100ms between requests
});

// Wrap Jira API calls
export const jiraRequest = jiraLimiter.wrap(async (config: any) => {
  return fetch(config.url, config);
});
```

#### 3. Caching Strategy

```typescript
// Cache Jira custom field mappings (rarely change)
import NodeCache from 'node-cache';

const jiraFieldCache = new NodeCache({
  stdTTL: 3600,           // 1 hour TTL
  checkperiod: 600        // Check for expired keys every 10 min
});

async function getJiraCustomFields(projectKey: string) {
  const cacheKey = `custom_fields_${projectKey}`;
  
  let fields = jiraFieldCache.get(cacheKey);
  if (fields) return fields;
  
  fields = await jiraRequest({
    url: `/rest/api/3/field`,
    method: 'GET'
  });
  
  jiraFieldCache.set(cacheKey, fields);
  return fields;
}
```

#### 4. Database Indexing

```sql
-- Critical indexes for performance
CREATE INDEX idx_user_stories_jira_key ON user_stories(jira_issue_key) WHERE jira_issue_key IS NOT NULL;
CREATE INDEX idx_mappings_lookup ON jira_integration_mappings(arkhitekton_id, jira_issue_key);
CREATE INDEX idx_webhook_processing ON jira_webhook_events(processing_status, received_at);
CREATE INDEX idx_sync_logs_recent ON jira_sync_logs(created_at DESC) WHERE status = 'failed';
```

#### 5. Webhook Refresh Automation

```typescript
// Jira webhooks expire after 30 days of inactivity
import cron from 'node-cron';

// Run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  const webhooks = await jiraRequest({
    url: '/rest/api/3/webhook',
    method: 'GET'
  });
  
  for (const webhook of webhooks) {
    const lastDelivery = new Date(webhook.lastDelivery);
    const daysSinceLastDelivery = 
      (Date.now() - lastDelivery.getTime()) / (1000 * 60 * 60 * 24);
    
    // Refresh if approaching expiry (25 days)
    if (daysSinceLastDelivery > 25) {
      await jiraRequest({
        url: `/rest/api/3/webhook/${webhook.id}/refresh`,
        method: 'PUT'
      });
      
      console.log(`Refreshed webhook ${webhook.id}`);
    }
  }
});
```

---

## Error Handling & Retry Logic

### Error Categories

| Error Type | Retry Strategy | User Action |
|------------|---------------|-------------|
| **Network Timeout** | Exponential backoff, 3 attempts | Auto-retry |
| **Rate Limit (429)** | Wait + retry after rate limit reset | Auto-retry |
| **Auth Error (401)** | Refresh token, retry once | Alert user |
| **Not Found (404)** | No retry | Log + alert |
| **Validation Error (400)** | No retry | Fix data + manual retry |
| **Server Error (500)** | Exponential backoff, 5 attempts | Auto-retry |

### Retry Logic Implementation

```typescript
// Exponential backoff with jitter
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry validation errors
      if (error.status === 400 || error.status === 404) {
        throw error;
      }
      
      // Don't retry if last attempt
      if (attempt === maxAttempts) {
        throw error;
      }
      
      // Calculate delay with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 1000;
      
      console.log(`Retry attempt ${attempt} after ${delay + jitter}ms`);
      await sleep(delay + jitter);
    }
  }
  
  throw lastError!;
}

// Usage in sync operations
async function syncToJira(story: UserStory) {
  return retryWithBackoff(async () => {
    const response = await jiraRequest({
      url: `/rest/api/3/issue`,
      method: 'POST',
      body: mapArkhitektonToJira(story)
    });
    
    return response;
  }, 3, 1000);
}
```

### Error Notification System

```typescript
// Notify users of sync failures
async function handleSyncError(
  error: Error,
  context: {
    arkhitektonId: string;
    jiraIssueKey?: string;
    syncDirection: string;
  }
) {
  // 1. Log to database
  await storage.createSyncLog({
    mappingId: context.mappingId,
    syncDirection: context.syncDirection,
    status: 'failed',
    errorMessage: error.message,
    errorCode: error.code || 'UNKNOWN'
  });
  
  // 2. Update entity sync status
  await storage.updateUserStory(context.arkhitektonId, {
    syncStatus: 'error',
    syncError: error.message
  });
  
  // 3. Send notification (if critical)
  if (error.code === 'AUTH_ERROR' || error.code === 'RATE_LIMIT_EXCEEDED') {
    await notificationService.send({
      userId: story.assignee,
      type: 'sync_error',
      title: 'Jira Sync Failed',
      message: `Unable to sync story ${context.arkhitektonId}: ${error.message}`,
      action: {
        label: 'Retry Sync',
        url: `/api/user-stories/${context.arkhitektonId}/sync-to-jira`
      }
    });
  }
  
  // 4. Alert admins for system errors
  if (error.status >= 500) {
    await alerting.sendToSlack({
      channel: '#arkhitekton-alerts',
      severity: 'high',
      message: `Jira sync system error: ${error.message}`,
      context
    });
  }
}
```

---

## Monitoring & Observability

### Key Metrics to Track

```typescript
// Prometheus-style metrics
const metrics = {
  // Sync metrics
  'jira_sync_total': counter('Total sync operations'),
  'jira_sync_errors': counter('Sync errors'),
  'jira_sync_duration': histogram('Sync duration in ms'),
  'jira_sync_lag': gauge('Time between update and sync'),
  
  // Webhook metrics
  'jira_webhooks_received': counter('Webhooks received'),
  'jira_webhooks_processed': counter('Webhooks processed'),
  'jira_webhooks_failed': counter('Webhook processing failures'),
  'jira_webhook_processing_time': histogram('Webhook processing time'),
  
  // Queue metrics
  'jira_queue_size': gauge('Jobs in queue'),
  'jira_queue_processing': gauge('Jobs being processed'),
  'jira_queue_completed': counter('Completed jobs'),
  'jira_queue_failed': counter('Failed jobs'),
  
  // API metrics
  'jira_api_requests': counter('Jira API requests'),
  'jira_api_errors': counter('Jira API errors'),
  'jira_api_rate_limit_hits': counter('Rate limit hits'),
};
```

### Dashboard Views

**1. Sync Health Dashboard:**
- Total syncs (24h, 7d, 30d)
- Success rate (%)
- Error rate by type
- Average sync latency
- Queue size over time

**2. Webhook Dashboard:**
- Webhooks received (real-time)
- Processing status distribution
- Failed webhooks (with retry status)
- Average processing time

**3. Alerts Configuration:**

```typescript
const alerts = [
  {
    name: 'High Error Rate',
    condition: 'error_rate > 5%',
    duration: '5m',
    severity: 'critical',
    action: 'page_oncall'
  },
  {
    name: 'Sync Lag High',
    condition: 'avg_sync_lag > 60s',
    duration: '10m',
    severity: 'warning',
    action: 'slack_notification'
  },
  {
    name: 'Queue Backlog',
    condition: 'queue_size > 1000',
    duration: '5m',
    severity: 'warning',
    action: 'scale_workers'
  },
  {
    name: 'Webhook Failures',
    condition: 'webhook_failures > 10',
    duration: '5m',
    severity: 'high',
    action: 'investigate'
  }
];
```

### Logging Strategy

```typescript
// Structured logging with context
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'jira-sync' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log sync operations
logger.info('Sync started', {
  arkhitektonId: 'US-ABC123',
  jiraIssueKey: 'PROJ-456',
  syncDirection: 'to_jira',
  timestamp: new Date().toISOString()
});

// Log errors with context
logger.error('Sync failed', {
  arkhitektonId: 'US-ABC123',
  error: error.message,
  errorCode: error.code,
  stack: error.stack,
  retryAttempt: 2
});
```

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

**Goal**: OAuth + Basic Sync Infrastructure

**Stories**:
- ✅ US-ULVW5WM: OAuth authentication setup
- ✅ US-WZAB7CF: Field mapping specification
- Database schema implementation
- Basic API endpoints

**Deliverables**:
- Working OAuth flow
- Database tables created
- Field mapping documented
- Proof-of-concept: Create Jira issue from ARKHITEKTON

**Success Criteria**:
- Can authenticate with Jira
- Can create Jira issue with correct field mapping
- Mapping table stores relationship

---

### Phase 2: Bi-Directional Sync (Weeks 3-5)

**Goal**: Full Bi-Directional with Loop Prevention

**Stories**:
- ✅ US-ZXC4N12: Sync architecture with loop prevention
- Webhook receiver implementation
- Async queue setup (Bull + Redis)
- Outbound sync (ARKHITEKTON → Jira)
- Inbound sync (Jira → ARKHITEKTON)

**Deliverables**:
- Webhook endpoint receiving Jira events
- Queue processing webhook events
- Loop prevention working
- Sync logs and audit trail

**Success Criteria**:
- Update in ARKHITEKTON syncs to Jira
- Update in Jira syncs to ARKHITEKTON
- No infinite loops occur
- Sync completes in <5 seconds

---

### Phase 3: Performance & Reliability (Weeks 6-7)

**Goal**: Production-Ready Infrastructure

**Stories**:
- ✅ US-65R28JC: Performance assessment
- Rate limiting implementation
- Retry logic with exponential backoff
- Error handling and notifications
- Webhook refresh automation

**Deliverables**:
- Rate limiter respecting Jira limits
- Robust error handling
- Automated webhook refresh
- Monitoring dashboard

**Success Criteria**:
- Handles 100 syncs/sec
- 99.9% success rate
- Automatic recovery from transient failures
- Webhooks stay active (auto-refresh)

---

### Phase 4: Advanced Features (Weeks 8-10)

**Goal**: Enterprise Features

**Features**:
- Bulk sync operations
- Conflict resolution UI
- Sync history and rollback
- Multi-project support
- Custom field mapping UI
- Sync scheduling and throttling

**Deliverables**:
- Admin UI for sync configuration
- Bulk sync API
- Sync history viewer
- Project-specific field mappings

**Success Criteria**:
- Admins can configure sync without code changes
- Users can view sync history
- Support multiple Jira projects
- Custom field mappings per project

---

### Phase 5: Monitoring & Optimization (Weeks 11-12)

**Goal**: Observability & Optimization

**Tasks**:
- Prometheus metrics implementation
- Grafana dashboards
- Alert configuration
- Performance optimization
- Load testing

**Deliverables**:
- Real-time sync health dashboard
- Alerting for sync failures
- Performance benchmarks
- Load test results (1000+ concurrent users)

**Success Criteria**:
- Full observability into sync operations
- Proactive alerting
- Meets all performance targets
- Documentation complete

---

## Appendix A: Jira Custom Fields Required

### Fields to Create in Jira

| Field Name | Field Type | Description |
|------------|-----------|-------------|
| `ARKHITEKTON ID` | Text (single line) | Stores ARKHITEKTON entity ID (US-ABC123) |
| `Sync Source` | Select List | Values: "arkhitekton", "jira", "manual" |
| `Related Files` | Text (multi-line) | JSON array of file paths |
| `Acceptance Criteria` | Text (multi-line) | Gherkin acceptance criteria |
| `Defect Type` | Select List | Values: UI, Logic, Performance, etc. |
| `Root Cause` | Text (multi-line) | Root cause analysis |
| `Value Stream` | Select List | EA value stream categorization |

### Jira Project Configuration

1. Create custom fields (admin permission required)
2. Add fields to screen schemes
3. Configure field mappings in ARKHITEKTON settings
4. Register webhook for project
5. Test sync with sample issue

---

## Appendix B: API Rate Limits

### Jira Cloud Rate Limits

- **Default**: 10,000 requests/hour per app
- **Burst**: 100 requests/10 seconds
- **Webhook delivery**: 30,000 events/hour

**Response Headers:**
```
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9995
X-RateLimit-Reset: 1696348800
```

### Jira Data Center Rate Limits

- **Default**: Unlimited (self-hosted)
- **Configurable**: Can set custom limits

### Rate Limit Handling

```typescript
async function handleRateLimit(response: Response) {
  if (response.status === 429) {
    const resetTime = parseInt(response.headers.get('X-RateLimit-Reset')!);
    const waitTime = resetTime * 1000 - Date.now();
    
    console.log(`Rate limited. Waiting ${waitTime}ms`);
    await sleep(waitTime + 1000); // Add 1s buffer
    
    // Retry request
    return retryRequest();
  }
}
```

---

## Appendix C: Testing Strategy

### Unit Tests

```typescript
// Test field mapping
describe('Field Mapping', () => {
  it('should map ARKHITEKTON status to Jira status', () => {
    expect(mapStatus('in-progress')).toBe('In Progress');
    expect(mapStatus('done')).toBe('Done');
  });
  
  it('should handle unknown status gracefully', () => {
    expect(mapStatus('unknown')).toBe('To Do'); // Default
  });
});

// Test loop prevention
describe('Loop Prevention', () => {
  it('should ignore updates from ARKHITEKTON', () => {
    const changelog = {
      items: [{ field: 'customfield_10002', toString: 'arkhitekton' }]
    };
    expect(isUpdateFromArkhitekton(changelog)).toBe(true);
  });
});
```

### Integration Tests

```typescript
// Test full sync flow
describe('Sync Flow', () => {
  it('should create Jira issue when story created in ARKHITEKTON', async () => {
    const story = await createUserStory({ title: 'Test Story' });
    await syncToJira(story.id);
    
    const mapping = await getJiraMapping(story.id);
    expect(mapping.jiraIssueKey).toMatch(/PROJ-\d+/);
    
    const jiraIssue = await jiraClient.getIssue(mapping.jiraIssueKey);
    expect(jiraIssue.fields.summary).toBe('Test Story');
  });
  
  it('should update ARKHITEKTON when Jira issue updated', async () => {
    const webhookPayload = createWebhookPayload({
      eventType: 'issue:updated',
      issueKey: 'PROJ-123',
      summary: 'Updated Title'
    });
    
    await POST('/api/jira/webhooks', webhookPayload);
    await waitForQueueProcessing();
    
    const story = await getUserStory('US-ABC123');
    expect(story.title).toBe('Updated Title');
  });
});
```

### Load Tests

```typescript
// Artillery config
export default {
  config: {
    target: 'http://localhost:5000',
    phases: [
      { duration: 60, arrivalRate: 10 },   // Warm up
      { duration: 300, arrivalRate: 50 },  // Sustained load
      { duration: 60, arrivalRate: 100 }   // Peak load
    ]
  },
  scenarios: [
    {
      name: 'Webhook Processing',
      flow: [
        {
          post: {
            url: '/api/jira/webhooks',
            json: { /* webhook payload */ }
          }
        }
      ]
    }
  ]
};
```

---

**End of Technical Specification**

**Document Status**: Ready for Implementation  
**Next Steps**: Begin Phase 1 (Foundation) with US-ULVW5WM  
**Estimated Total Effort**: 10-12 weeks (2 developers)  
**Related Documents**:
- `docs/jira-integration-mvp-research.md`
- `docs/design-studio-implementation.md`
