# Design Decisions - ARKHITEKTON

## Requirements & Traceability Standards

### All requirements must be documented in the plan as a feature and acceptance criteria that follows the gherkin language
### Product requirements must be converted to feature and gherkin as criteria

**User Story ID Format**: `US-XXXXXXX` (7 random characters)
- Must be unique across the platform
- Referenced in commit messages: `feat: Add feature [US-HCMCP76]`
- Traceable from strategy to deployment

**Acceptance Criteria Format (Gherkin)**:
```gherkin
Given [context/precondition]
When [action/trigger]
Then [expected outcome]
And [additional conditions]
```

**Story Status Workflow**:
- `backlog` → `in-progress` → `review` → `ready` → `done`
- Status syncs with GitHub events (branch creation, PR status)
- Complete traceability via `githubCommits` array

## Color System

### Primary Brand Colors
- **Primary**: Orange/Amber gradient (#f97316 to #fb923c) - ARKHITEKTON brand identity
- **Background**: White (light mode), Dark slate (dark mode)
- **Text**: Black (primary), Muted foreground (secondary)
- **Accent**: Orange for CTAs and highlights
- **Status Colors**:
  - Success: Green (#10b981)
  - Warning: Yellow (#f59e0b)
  - Error: Red (#ef4444)
  - Info: Blue (#3b82f6)

### Typography Hierarchy
- **Main Header**: Large bold text with orange gradient
- **Page Titles**: Black text (2xl-3xl) for main content titles
- **Descriptions**: Muted foreground for subtitle text
- **Body**: Default foreground, readable line height (1.6)

### Button Standards
- **Primary**: Orange background, white text, hover state darkens
- **Secondary**: Outline with orange border, orange text
- **Ghost**: Transparent with hover background
- **Destructive**: Red background for delete actions
- **Always include**: hover state, focus ring, disabled state

### Layout Patterns
- Consistent page header structure: Orange accent followed by black page title
- Sidebar navigation with active state highlighting
- Use flexbox for most layouts, CSS Grid only for complex 2D layouts
- Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)

## Component Standards

### Headers
```tsx
<div className="flex items-center justify-between mb-8">
  <div>
    <h1 className="text-3xl font-bold">Page Title</h1>
    <p className="text-muted-foreground">Page description</p>
  </div>
  <Button>Primary Action</Button>
</div>
```

### Data Display
- Use shadcn/ui components (Table, Card, Dialog, etc.)
- Always include loading states (Skeleton components)
- Error states with retry functionality
- Empty states with helpful guidance

### Forms
- React Hook Form + Zod validation
- Use Form, FormField, FormItem components from shadcn
- Inline validation errors
- Disabled state during submission

## Accessibility
- All colors meet WCAG AA contrast requirements (4.5:1 for normal text)
- Focus states clearly visible with orange ring styling
- Proper semantic HTML structure maintained
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly announcements

## ARKHITEKTON Architecture Standards

### Object-Oriented Model Design
- **Everything is an Object**: Components, connections, stories, tasks
- **Intelligent Connections**: Objects know how to link to each other
- **Full Traceability**: Every object tracks its relationships and history
- **Metadata Driven**: Use JSON fields for flexible properties

### State Management & Versioning
- **Single Current State**: One authoritative version in database
- **Transition States**: Track changes through workflow states
- **Checkpoint System**: Git-like snapshots for rollback capability
- **Audit Trail**: All changes logged with user, timestamp, reason

### Storage Layer Pattern
```typescript
// Storage interface defines contract
interface IStorage {
  getEntity(id: string): Promise<Entity | undefined>;
  createEntity(data: InsertEntity): Promise<Entity>;
  updateEntity(id: string, updates: Partial<Entity>): Promise<Entity>;
  deleteEntity(id: string): Promise<boolean>;
}

// Dual implementation:
// - MemStorage: In-memory for development/testing
// - DatabaseStorage: PostgreSQL via Drizzle ORM for production
```

### Schema-First Development
**Always start with data model in `shared/schema.ts`**:

```typescript
// 1. Define Drizzle schema
export const entities = pgTable('entities', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow()
});

// 2. Generate insert schema with Zod
export const insertEntitySchema = createInsertSchema(entities).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// 3. Export types
export type Entity = typeof entities.$inferSelect;
export type InsertEntity = z.infer<typeof insertEntitySchema>;
```

**Benefits**:
- Type safety across frontend and backend
- Automatic validation with Zod
- Single source of truth
- No type drift

### API Design Patterns

**Thin Routes, Fat Storage**:
```typescript
// ❌ BAD: Business logic in route
app.post('/api/entities', async (req, res) => {
  const entity = req.body;
  const result = await db.insert(entities).values(entity);
  // ... complex logic here
});

// ✅ GOOD: Logic in storage layer
app.post('/api/entities', async (req, res) => {
  try {
    const validated = insertEntitySchema.parse(req.body);
    const entity = await storage.createEntity(validated);
    res.status(201).json(entity);
  } catch (error) {
    res.status(400).json({ message: "Validation failed" });
  }
});
```

**Validation Strategy**:
- Always validate request bodies with Zod schemas
- Use insert schemas from drizzle-zod
- Return clear error messages
- Consistent status codes (200, 201, 400, 404, 500)

**Error Handling**:
```typescript
try {
  // Operation
} catch (error) {
  console.error('Context:', error);
  res.status(500).json({ 
    message: "User-friendly message",
    // Never expose internal details in production
  });
}
```

### Security Standards

**Encryption for Sensitive Data**:
```typescript
// Use AES-256-CBC with unique IV per value
import { encrypt, decrypt } from './encryption';

// Before storage
const encryptedToken = encrypt(sensitiveValue);

// On retrieval  
const decryptedToken = decrypt(storedValue);

// In API responses - always mask
const response = {
  ...setting,
  value: setting.isSensitive ? '••••••••' : setting.value
};
```

**Secret Management**:
- ❌ **NEVER** hardcode secrets in code
- ❌ **NEVER** commit `.env` files
- ✅ Use environment variables
- ✅ Require critical secrets (fail fast if missing)
- ✅ Use secrets management in production (AWS KMS, Azure Key Vault)

**Frontend Security**:
```typescript
// ❌ BAD: Overwrite existing secrets
const saveToken = () => {
  save({ token: maskedValue }); // Saves "••••••••"
};

// ✅ GOOD: Preserve existing secrets
const saveToken = () => {
  if (token && token !== '••••••••') {
    save({ token }); // Only save if user entered new value
  }
};
```

### Frontend Architecture

**Data Fetching with TanStack Query**:
```typescript
// Query for data
const { data, isLoading, error } = useQuery({
  queryKey: ['/api/entities', id], // Hierarchical keys for invalidation
  // No queryFn needed - default fetcher configured
});

// Mutation for updates
const mutation = useMutation({
  mutationFn: async (data) => {
    return apiRequest('/api/entities', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/entities'] });
    toast({ title: 'Success' });
  }
});
```

**Form Handling Pattern**:
```typescript
// 1. Define validation schema
const formSchema = insertEntitySchema.extend({
  customField: z.string().min(3, "Too short")
});

// 2. Initialize form with defaults
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: { name: '', customField: '' }
});

// 3. Handle submission
const onSubmit = (data) => {
  mutation.mutate(data);
};

// 4. Render with FormField components
<Form {...form}>
  <FormField name="name" render={({ field }) => (
    <FormItem>
      <FormLabel>Name</FormLabel>
      <FormControl>
        <Input {...field} data-testid="input-name" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )} />
</Form>
```

**Testing & Accessibility**:
```typescript
// Add data-testid to all interactive elements
<Button data-testid="button-submit">Submit</Button>
<Input data-testid="input-email" />
<Link data-testid="link-profile">Profile</Link>

// For dynamic lists
{items.map(item => (
  <Card key={item.id} data-testid={`card-item-${item.id}`}>
    {item.name}
  </Card>
))}
```

### Naming Conventions

**File & Folder Structure**:
```
client/src/
  components/ui/    # shadcn components (button.tsx, dialog.tsx)
  pages/           # Route pages (plan.tsx, settings.tsx)
  lib/             # Utilities (queryClient.ts, utils.ts)

server/
  routes.ts        # All API routes
  storage.ts       # Storage implementations
  encryption.ts    # Security utilities

shared/
  schema.ts        # All Drizzle schemas and types
```

**Naming Patterns**:
- **Files**: `kebab-case.tsx` or `camelCase.ts`
- **Components**: `PascalCase` (UserProfile, TaskBoard)
- **Functions**: `camelCase` (getUserById, calculateTotal)
- **Constants**: `SCREAMING_SNAKE_CASE` (API_BASE_URL, MAX_RETRIES)
- **Types/Interfaces**: `PascalCase` (UserStory, InsertTask)
- **Database Tables**: `snake_case` (user_stories, github_commits)
- **API Routes**: `/api/resource` pattern (RESTful)

**Boolean Naming**:
```typescript
// ✅ GOOD: Clear intent
const isAuthenticated = true;
const hasPermission = false;
const canEdit = true;
const shouldValidate = false;

// ❌ BAD: Ambiguous
const authenticated = true;
const permission = false;
```

## Clean Code Principles

This codebase follows Clean Code principles alongside Clean Architecture, Domain Driven Design, and Atomic Design to ensure maintainability, readability, and scalability.

### No Hardcoding Principle
- **Dynamic Discovery**: Components should discover data dynamically, not use hardcoded lists
- **Configuration Over Code**: Use configuration files or database queries instead of hardcoded arrays
- **Database-Driven**: UI elements like status options should come from database
- **Benefits**: Easier maintenance, automatic updates when new items added, follows Open/Closed Principle

### Function Design
- **Single Responsibility**: Each function does one thing well
- **Small Functions**: Aim for 5-20 lines; extract complex logic into named functions
- **Few Arguments**: Prefer 0-2 arguments; use objects for 3+ parameters
- **No Side Effects**: Pure functions when possible; clearly indicate mutations
- **Command Query Separation**: Functions either do something OR return something, not both

### Code Organization
- **DRY Principle**: Don't Repeat Yourself - extract common logic
- **Separation of Concerns**: Business logic separate from UI, data access separate from business rules
- **Dependency Direction**: Dependencies point inward (UI → Business Logic → Data)
- **Error Handling**: Use try-catch blocks; fail fast with meaningful error messages
- **Null Safety**: Always check for null/undefined before calling methods like `toLowerCase()`

### Comments and Documentation
- **Code Should Self-Document**: Write clear code that explains itself
- **Comments Explain Why, Not What**: Use comments for business rules, not obvious code
- **TODO Comments**: Include ticket numbers (US-XXXXXXX) and assignee when possible
- **JSDoc for Public APIs**: Document function parameters, return types, and examples

### Testing Philosophy
- **Test Behavior, Not Implementation**: Focus on what code does, not how
- **Arrange-Act-Assert Pattern**: Clear test structure
- **One Assertion Per Test**: Keep tests focused and easy to debug
- **Meaningful Test Names**: `should_returnUser_when_validIdProvided`

### Refactoring Guidelines
- **Boy Scout Rule**: Leave code cleaner than you found it
- **Incremental Improvements**: Small, safe refactorings over big rewrites
- **Extract Method**: Break down complex functions into smaller, named pieces
- **Replace Magic Numbers**: Use named constants (`MAX_UPLOAD_SIZE` not `5242880`)
- **Simplify Conditionals**: Extract complex conditions into well-named functions

### Code Smells to Avoid
- ❌ Long functions (>50 lines)
- ❌ Large classes (>300 lines)
- ❌ Long parameter lists (>3 parameters)
- ❌ Duplicate code
- ❌ Dead code (commented out or unused)
- ❌ Magic numbers and strings
- ❌ Nested conditionals (>3 levels deep)
- ❌ God objects (classes that do too much)

### TypeScript Best Practices
- **Strict Type Safety**: Enable strict mode, avoid `any`
- **Interface Over Type**: Use interfaces for object shapes
- **Discriminated Unions**: For complex state management
- **Type Guards**: Create custom type guards for runtime safety
- **Immutability**: Prefer `const` and readonly properties
- **Shared Types**: Export from `shared/schema.ts` for consistency

### Performance Considerations
- **Premature Optimization**: Avoid until proven necessary
- **Measure First**: Use profiling before optimizing
- **Memoization**: Cache expensive calculations when appropriate
- **Lazy Loading**: Load components and data only when needed
- **Database Queries**: Minimize N+1 queries, use proper indexing
- **TanStack Query Cache**: Leverage query invalidation for optimal updates

### Database Standards

**Schema Design**:
```typescript
// ✅ GOOD: Flexible with JSON, indexed properly
export const userStories = pgTable('user_stories', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull(),
  acceptanceCriteria: jsonb('acceptance_criteria').$type<string[]>(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  // Only add timestamps if needed for auditing
});

// Index for common queries
CREATE INDEX idx_stories_status ON user_stories(status);
```

**Migration Strategy**:
- Use `npm run db:push` for schema sync (development)
- Use `npm run db:push --force` if regular push fails
- NEVER manually write SQL migrations
- ❌ **CRITICAL**: Never change existing ID column types (serial ↔ varchar)
- Always check current database schema before changes

### GitHub Integration Standards

**Commit Message Format**:
```bash
type(scope): description [US-XXXXXXX]

Detailed explanation if needed

- Bullet points for changes
- Link to user story with ID
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Acceptance Criteria Validation**:
- Must follow Gherkin format (Given/When/Then)
- Required for story to receive commits
- Validated on PR creation
- AI assists with generation from commits

### Example: Before and After Clean Code

**Before (Code Smells)**:
```typescript
// ❌ BAD: Hardcoded, long function, magic strings
function processData(d: any) {
  if (d.type === "user_story") {
    if (d.status === "backlog") {
      // 50+ lines of logic
      const x = d.data.split(",");
      // ... more code
    }
  }
}
```

**After (Clean Code)**:
```typescript
// ✅ GOOD: Typed, focused, self-documenting
function processUserStory(story: UserStory): ProcessedStory {
  if (!isInBacklog(story)) {
    return story;
  }
  
  return {
    ...story,
    data: parseStoryData(story.data),
    status: StoryStatus.IN_PROGRESS
  };
}

function isInBacklog(story: UserStory): boolean {
  return story.status === StoryStatus.BACKLOG;
}

function parseStoryData(data: string): string[] {
  return data.split(STORY_DATA_DELIMITER);
}
```

### Integration with Other Principles

**Clean Code + Clean Architecture:**
- Clean Code focuses on implementation details (how we write code)
- Clean Architecture focuses on system structure (how we organize code)
- Together they create maintainable, testable, scalable systems

**Clean Code + Domain Driven Design:**
- Use ubiquitous language in code (match business terminology)
- Domain entities should have clean, intention-revealing methods
- Business rules should be explicit and easy to understand
- ARKHITEKTON entities: UserStory, ArchitectureElement, Task

**Clean Code + Atomic Design:**
- Components should follow Single Responsibility Principle
- Atoms should be simple, focused, reusable (Button, Input, Badge)
- Molecules should compose atoms with clear purpose (FormField, TableRow)
- Organisms should orchestrate without becoming god components (TaskBoard, StoryList)
- Templates define page structure
- Pages wire everything together with data

## ARKHITEKTON-Specific Patterns

### Traceability Pattern
```typescript
// Every entity tracks its relationships
interface TraceableEntity {
  id: string;
  linkedStories?: string[];      // US-XXXXXXX references
  githubCommits?: GitHubCommit[]; // Code changes
  jiraIssues?: string[];          // External tickets
  createdBy: string;
  updatedBy: string;
  auditLog: AuditEntry[];
}
```

### Intelligent Connection Pattern
```typescript
// Objects know how to link to each other
class ArchitectureElement {
  async linkToStory(storyId: string): Promise<void> {
    // Validates story exists
    // Creates bidirectional link
    // Updates both entities
    // Records in audit log
  }
}
```

### Flexible Metadata Pattern
```typescript
// Use JSON for extensible properties
interface ExtensibleEntity {
  id: string;
  name: string;
  metadata: {
    customProps?: Record<string, any>;
    integrations?: {
      github?: { repo: string; branch: string };
      jira?: { projectKey: string; issueType: string };
    };
    tags?: string[];
    [key: string]: any; // Allow future extensions
  };
}
```

## Summary Checklist

**Before Committing Code**:
- [ ] Schema defined in `shared/schema.ts`
- [ ] Zod validation on all inputs
- [ ] Error handling with try-catch
- [ ] No hardcoded values
- [ ] No `any` types
- [ ] Null safety checks
- [ ] data-testid on interactive elements
- [ ] Loading states for async operations
- [ ] TypeScript strict mode passing
- [ ] Functions < 50 lines
- [ ] Clear, intention-revealing names
- [ ] Comments explain why, not what
- [ ] Commit message includes story ID [US-XXXXXXX]
- [ ] Acceptance criteria in Gherkin format
- [ ] No secrets in code or comments

**Architecture Verification**:
- [ ] Business logic in storage layer, not routes
- [ ] Frontend uses TanStack Query for data
- [ ] Forms use React Hook Form + Zod
- [ ] Sensitive data encrypted before storage
- [ ] API responses mask sensitive values
- [ ] Database queries optimized (no N+1)
- [ ] Proper indexing on common queries
- [ ] Follows object-oriented model design
- [ ] Complete traceability maintained
