/**
 * Seed Epic and User Stories for Structured Reproduction Steps
 * PRD: PRD-QC-003-Structured-Reproduction-Steps.md
 */

import { db } from '../server/db';
import { epics, userStories } from '../shared/schema';
import { eq } from 'drizzle-orm';
import type { InsertEpic, InsertUserStory } from '../shared/schema';

async function seedStructuredReproStepsStories() {
  console.log('📝 Seeding Epic and User Stories for Structured Reproduction Steps\n');

  // Create Epic: EPIC-QC-003
  const epic: InsertEpic = {
    id: 'EPIC-QC-003',
    name: 'Structured Reproduction Steps',
    description: 'Enable structured, traceable reproduction step management for defects where each step has a unique identifier (e.g., DEF-003-S001), can be added, removed, and reordered, enabling better defect analysis, test case generation, and cross-reference traceability.',
    valueStream: 'governance',
    status: 'planned',
    priority: 'high',
    estimatedPoints: 34,
    createdAt: new Date(),
  };

  const existingEpic = await db.select().from(epics).where(eq(epics.id, epic.id!)).limit(1);
  if (existingEpic.length === 0) {
    console.log(`📦 Creating epic: ${epic.id}`);
    await db.insert(epics).values(epic);
  } else {
    console.log(`⚠️  Epic ${epic.id} already exists, skipping...`);
  }
  console.log(`   📦 ${epic.id}`);
  console.log(`   📋 ${epic.name}`);
  console.log(`   📊 ${epic.estimatedPoints} story points\n`);

  // Product Stories
  const productStories: InsertUserStory[] = [
    {
      id: 'US-QC-010',
      epicId: 'EPIC-QC-003',
      title: 'Individual Step Creation with Unique IDs',
      description: `As a QA Engineer, I want to create individual reproduction steps with unique IDs, so that each step can be traced, referenced, and analyzed independently.

## User Story
**As a** QA Engineer  
**I want to** create individual reproduction steps with unique IDs  
**So that** each step can be traced, referenced, and analyzed independently`,
      acceptanceCriteria: `**Scenario: Create first reproduction step**
- Given I am viewing a defect detail page
- And the Steps to Reproduce section is empty
- When I click the "+Add Step" button
- Then a new step input field appears
- And the step is automatically assigned ID "<DEFECT_ID>-S001"
- And the step has a sequence number "1"
- And I can enter step description text
- And the step is saved when I blur the input or click save

**Scenario: Create additional reproduction steps**
- Given I have 2 existing steps (S001, S002)
- When I click "+Add Step"
- Then a new step appears with ID "<DEFECT_ID>-S003"
- And the sequence number is "3"
- And the new step is appended to the end of the list

**Scenario: View step IDs for reference**
- Given I have 5 reproduction steps
- When I view the Steps to Reproduce section
- Then each step displays its ID badge (e.g., "S001", "S002")
- And the ID is visually distinct from the description
- And I can copy the step ID to clipboard by clicking the badge

**Scenario: Edit existing step description**
- Given I have a step with ID "DEF-003-S002"
- When I click the edit icon for that step
- Then the step description becomes editable
- And I can update the text
- And the step ID remains unchanged
- And the updated timestamp is recorded`,
      status: 'planned',
      priority: 'high',
      estimatedPoints: 8,
      createdAt: new Date(),
    },
    {
      id: 'US-QC-011',
      epicId: 'EPIC-QC-003',
      title: 'Remove Reproduction Steps',
      description: `As a QA Engineer, I want to remove incorrect or duplicate reproduction steps, so that the defect analysis remains accurate and concise.

## User Story
**As a** QA Engineer  
**I want to** remove incorrect or duplicate reproduction steps  
**So that** the defect analysis remains accurate and concise`,
      acceptanceCriteria: `**Scenario: Remove a single step**
- Given I have 5 reproduction steps (S001-S005)
- When I click the remove icon on step "S003"
- Then a confirmation dialog appears
- And the dialog shows "Remove step S003? This cannot be undone."
- When I confirm the removal
- Then step S003 is removed from the list
- And the remaining steps maintain their original IDs
- And sequence numbers are recalculated (1, 2, 3, 4)

**Scenario: Prevent accidental deletion**
- Given I have 1 reproduction step
- When I click the remove icon
- Then a confirmation dialog appears
- And the dialog warns "This is the last step. Remove anyway?"
- And I must explicitly confirm to proceed

**Scenario: Remove middle step preserves IDs**
- Given I have steps S001, S002, S003, S004
- When I remove step S002
- Then the remaining steps are S001, S003, S004
- And their IDs do not change
- And sequence numbers are 1, 2, 3
- And any references to S002 show as "deleted" or "removed"

**Scenario: Cannot remove step if referenced**
- Given step S002 is referenced in a test case or commit
- When I attempt to remove step S002
- Then the system shows a warning "This step is referenced in 2 places"
- And lists the references (test case TC-123, commit abc123)
- And I can force remove with acknowledgment`,
      status: 'planned',
      priority: 'high',
      estimatedPoints: 5,
      createdAt: new Date(),
    },
    {
      id: 'US-QC-012',
      epicId: 'EPIC-QC-003',
      title: 'Reorder Reproduction Steps',
      description: `As a QA Engineer, I want to reorder reproduction steps via drag-and-drop or arrow buttons, so that the steps reflect the correct sequence without recreating them.

## User Story
**As a** QA Engineer  
**I want to** reorder reproduction steps via drag-and-drop or arrow buttons  
**So that** the steps reflect the correct sequence without recreating them`,
      acceptanceCriteria: `**Scenario: Drag-and-drop reordering**
- Given I have steps S001, S002, S003, S004, S005
- When I drag step S004 to position 2
- Then the new order is S001, S004, S002, S003, S005
- And the step IDs remain unchanged
- And the sequence numbers update to 1, 2, 3, 4, 5
- And the database reflects the new sequence

**Scenario: Use up arrow to move step**
- Given I have steps S001, S002, S003
- And step S003 is currently sequence #3
- When I click the up arrow on step S003
- Then step S003 moves to sequence #2
- And the order becomes S001, S003, S002
- And step IDs remain S001, S002, S003

**Scenario: Use down arrow to move step**
- Given I have steps S001, S002, S003
- And step S001 is currently sequence #1
- When I click the down arrow on step S001
- Then step S001 moves to sequence #2
- And the order becomes S002, S001, S003
- And step IDs remain S001, S002, S003

**Scenario: Disable arrows at boundaries**
- Given I have steps S001, S002, S003
- When viewing step S001 (first in sequence)
- Then the up arrow is disabled
- When viewing step S003 (last in sequence)
- Then the down arrow is disabled

**Scenario: Visual feedback during drag**
- Given I am dragging step S003
- Then the step has a "dragging" visual style
- And a drop target indicator shows where the step will be placed
- And other steps shift to show the new position`,
      status: 'planned',
      priority: 'high',
      estimatedPoints: 8,
      createdAt: new Date(),
    },
    {
      id: 'US-QC-013',
      epicId: 'EPIC-QC-003',
      title: 'Copy and Reference Individual Steps',
      description: `As a Developer or QA Engineer, I want to copy step IDs and reference them in comments, commits, or test cases, so that I can precisely communicate which step is failing or being addressed.

## User Story
**As a** Developer or QA Engineer  
**I want to** copy step IDs and reference them in comments, commits, or test cases  
**So that** I can precisely communicate which step is failing or being addressed`,
      acceptanceCriteria: `**Scenario: Copy step ID to clipboard**
- Given I am viewing step S003
- When I click the step ID badge "S003"
- Then the full step ID "DEF-003-S003" is copied to clipboard
- And a toast notification confirms "Step ID copied: DEF-003-S003"

**Scenario: Deep link to specific step**
- Given a defect URL "/quality/defects/DEF-003"
- When I append "?step=S003"
- Then the page loads and scrolls to step S003
- And step S003 is highlighted for 2 seconds

**Scenario: Reference step in commit message**
- Given I am committing a fix for defect DEF-003
- When I reference "DEF-003-S003" in the commit message
- Then the system detects the reference
- And creates a backlink from the step to the commit
- And the step shows "Referenced in commit abc123"

**Scenario: Show step references**
- Given step S002 is referenced in 3 places
- When I hover over or click the step ID
- Then a popover shows all references:
  • Test Case TC-456 (step 2)
  • Commit abc123 (line 45)
  • Comment by @dev1 on 12/20/2025`,
      status: 'planned',
      priority: 'medium',
      estimatedPoints: 5,
      createdAt: new Date(),
    },
    {
      id: 'US-QC-014',
      epicId: 'EPIC-QC-003',
      title: 'Migrate Existing Textarea Steps to Structured Format',
      description: `As a System Administrator, I want to automatically migrate existing textarea reproduction steps to structured steps, so that historical defects gain the benefits of structured steps without manual rework.

## User Story
**As a** System Administrator  
**I want to** automatically migrate existing textarea reproduction steps to structured steps  
**So that** historical defects gain the benefits of structured steps without manual rework`,
      acceptanceCriteria: `**Scenario: Auto-detect numbered steps in textarea**
- Given a defect has Steps to Reproduce as textarea:
  """
  1. Open the login page
  2. Enter invalid credentials
  3. Click submit
  4. Observe error message
  """
- When I click "Convert to Structured Steps"
- Then the system creates 4 steps with IDs S001-S004
- And each step description matches the original text
- And the sequence numbers are 1, 2, 3, 4

**Scenario: Handle unstructured textarea**
- Given a defect has Steps to Reproduce:
  """
  Open the page, enter data, and submit the form.
  Check that the error appears.
  """
- When I click "Convert to Structured Steps"
- Then the system creates 2 steps by detecting sentence boundaries
- And each step is assigned an ID
- And I can manually edit and split further if needed

**Scenario: Preserve original textarea as backup**
- Given I convert textarea steps to structured steps
- Then the original textarea is stored in a "legacy_steps" field
- And I can view the original via a "Show Original" link
- And I can revert if the conversion was incorrect`,
      status: 'planned',
      priority: 'medium',
      estimatedPoints: 8,
      createdAt: new Date(),
    },
  ];

  // Implementation Stories
  const implementationStories: InsertUserStory[] = [
    {
      id: 'US-QC-IMPL-010',
      epicId: 'EPIC-QC-003',
      parentStoryId: 'US-QC-010',
      title: 'Database Schema for Reproduction Steps',
      description: `Create database table and relationships for individual reproduction steps with unique IDs, sequence ordering, and soft delete support.

## Technical Details

**Create Table: \`reproduction_steps\`**
\`\`\`sql
CREATE TABLE reproduction_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  defect_id VARCHAR(50) NOT NULL REFERENCES defects(id) ON DELETE CASCADE,
  step_id VARCHAR(10) NOT NULL, -- e.g., "S001", "S002"
  sequence INTEGER NOT NULL,
  description TEXT NOT NULL,
  expected_result TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  CONSTRAINT unique_defect_step UNIQUE (defect_id, step_id)
);

CREATE INDEX idx_repro_steps_defect ON reproduction_steps(defect_id);
CREATE INDEX idx_repro_steps_sequence ON reproduction_steps(defect_id, sequence);
\`\`\`

**Tasks:**
- Create Drizzle schema definition
- Create database migration script
- Add indexes for performance
- Add foreign key constraints
- Test cascade deletion behavior`,
      acceptanceCriteria: `- ✅ Table created with proper constraints
- ✅ Foreign key cascades on defect deletion
- ✅ Indexes optimize step retrieval by defect
- ✅ Soft delete preserves step IDs for references
- ✅ Unique constraint prevents duplicate step IDs per defect
- ✅ Migration script runs successfully
- ✅ Drizzle schema generates correct TypeScript types`,
      status: 'planned',
      priority: 'high',
      estimatedPoints: 3,
      createdAt: new Date(),
    },
    {
      id: 'US-QC-IMPL-011',
      epicId: 'EPIC-QC-003',
      parentStoryId: 'US-QC-010',
      title: 'API Endpoints for Step CRUD Operations',
      description: `Create RESTful API endpoints for managing reproduction steps with auto-generated IDs, sequence management, and soft delete.

## Endpoints

**GET /api/defects/:defectId/steps**
- List all non-deleted steps for a defect
- Ordered by sequence number
- Returns step ID, description, sequence, timestamps

**POST /api/defects/:defectId/steps**
- Create new step
- Auto-generate step ID (find max + 1, e.g., S005)
- Set sequence to max + 1
- Returns created step with full ID

**PUT /api/defects/:defectId/steps/:stepId**
- Update step description and/or expected result
- Step ID and sequence cannot be changed via this endpoint
- Returns updated step

**DELETE /api/defects/:defectId/steps/:stepId**
- Soft delete (set deleted_at timestamp)
- Preserve step ID for references
- Recalculate sequence numbers for remaining steps

**PUT /api/defects/:defectId/steps/reorder**
- Bulk update sequence numbers
- Accepts array of {stepId, newSequence}
- Validates no duplicate sequences
- Atomic transaction`,
      acceptanceCriteria: `- ✅ All endpoints return proper JSON responses
- ✅ Step ID auto-generation follows format <DEFECT_ID>-S### (e.g., DEF-003-S001)
- ✅ Reorder endpoint validates sequence integrity
- ✅ Delete endpoint performs soft delete
- ✅ API enforces step ownership by defect
- ✅ Error handling for invalid defect IDs
- ✅ Rate limiting and validation middleware applied`,
      status: 'planned',
      priority: 'high',
      estimatedPoints: 5,
      createdAt: new Date(),
    },
    {
      id: 'US-QC-IMPL-012',
      epicId: 'EPIC-QC-003',
      parentStoryId: 'US-QC-010',
      title: 'React Component - StepManager',
      description: `Create React component for managing structured reproduction steps with drag-and-drop, add/remove, and inline editing.

## Component: \`StepManager\`

**Props:**
- \`defectId\`: string
- \`steps\`: ReproductionStep[]
- \`onStepsChange\`: (steps: ReproductionStep[]) => void
- \`editable\`: boolean (default: false)

**Features:**
- Step list with sequence numbers and IDs
- "+Add Step" button at bottom
- Inline edit mode for step descriptions
- Remove button per step (trash icon)
- Drag handle icon for reordering
- Up/Down arrow buttons as alternative to drag
- Copy-to-clipboard on ID badge click
- Loading states during API calls
- Error handling with toast notifications

**Libraries:**
- \`@dnd-kit/core\` for drag-and-drop
- \`@dnd-kit/sortable\` for sortable list
- \`react-query\` for API state management
- Shadcn UI components (Button, Badge, Input, Tooltip)`,
      acceptanceCriteria: `- ✅ Component renders list of steps with sequence numbers
- ✅ Drag-and-drop uses @dnd-kit library
- ✅ Add/remove operations update local state and API
- ✅ Optimistic UI updates with rollback on error
- ✅ Accessible (keyboard navigation, ARIA labels)
- ✅ Confirmation dialog for step removal
- ✅ Copy ID badge shows toast "Step ID copied"
- ✅ Visual feedback during drag (opacity, drop target)
- ✅ Arrow buttons disabled at list boundaries
- ✅ Empty state shows placeholder text`,
      status: 'planned',
      priority: 'high',
      estimatedPoints: 8,
      createdAt: new Date(),
    },
    {
      id: 'US-QC-IMPL-013',
      epicId: 'EPIC-QC-003',
      parentStoryId: 'US-QC-013',
      title: 'Step Reference Detection & Backlinks',
      description: `Implement step reference detection in commits, comments, and test cases with backlink tracking.

## Components

**1. Reference Detection Service**
- Regex pattern: \`/DEF-\\w+-S\\d{3}/g\`
- Scan commit messages via GitHub webhook
- Scan comments and test case descriptions
- Extract step IDs and create references

**2. Database Table: \`step_references\`**
\`\`\`sql
CREATE TABLE step_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  step_id UUID NOT NULL REFERENCES reproduction_steps(id) ON DELETE CASCADE,
  reference_type VARCHAR(50) NOT NULL, -- 'commit', 'comment', 'test_case'
  reference_id VARCHAR(100) NOT NULL,
  reference_url TEXT,
  reference_text TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_step_refs_step ON step_references(step_id);
CREATE INDEX idx_step_refs_type ON step_references(reference_type, reference_id);
\`\`\`

**3. API Endpoints**
- \`GET /api/reproduction-steps/:stepId/references\` - List all references
- \`POST /api/reproduction-steps/:stepId/references\` - Create reference
- \`DELETE /api/reproduction-steps/references/:refId\` - Remove reference

**4. UI Component: \`StepReferencePopover\`**
- Shows reference count badge
- Popover with list of references
- Links to commits, test cases, comments
- "Copy step ID" button`,
      acceptanceCriteria: `- ✅ System detects step IDs in commit messages
- ✅ References are stored in database
- ✅ UI shows reference count badge on step
- ✅ Clicking badge shows reference list with links
- ✅ Deep links work (e.g., /defects/DEF-003?step=S002)
- ✅ Background job processes commits within 5 minutes
- ✅ Manual reference creation via UI supported`,
      status: 'planned',
      priority: 'medium',
      estimatedPoints: 8,
      createdAt: new Date(),
    },
    {
      id: 'US-QC-IMPL-014',
      epicId: 'EPIC-QC-003',
      parentStoryId: 'US-QC-014',
      title: 'Migration Tool - Textarea to Structured Steps',
      description: `Build migration utility to convert existing textarea reproduction steps to structured format with auto-detection of numbered and bulleted lists.

## Components

**1. Parser Module**
\`\`\`typescript
interface ParsedStep {
  sequence: number;
  description: string;
}

function parseNumberedList(text: string): ParsedStep[]
function parseBulletList(text: string): ParsedStep[]
function parseSentences(text: string): ParsedStep[]
\`\`\`

**2. Migration Script**
- Scan all defects with \`steps_to_reproduce\` populated
- Detect format (numbered, bullets, unstructured)
- Parse into individual steps
- Create \`reproduction_steps\` records
- Store original in \`legacy_steps_to_reproduce\` column
- Log success/failure for audit

**3. UI Button in Defect Detail**
- "Convert to Structured Steps" button
- Shows preview of parsed steps
- Allow manual editing before save
- "Revert to Original" option

**4. Validation**
- Test on 100 sample defects
- Manual review of edge cases
- Success rate target: 95%+`,
      acceptanceCriteria: `- ✅ Parser handles common step formats (numbered, bullets)
- ✅ Script successfully migrates 95%+ of defects
- ✅ Original text preserved in legacy field
- ✅ Manual conversion UI allows editing before save
- ✅ Conversion logs success/failure for audit
- ✅ Idempotent (can re-run without duplicates)
- ✅ Rollback mechanism if migration fails`,
      status: 'planned',
      priority: 'medium',
      estimatedPoints: 5,
      createdAt: new Date(),
    },
  ];

  // Seed product stories
  console.log('📝 Creating 5 product stories...\n');
  for (const story of productStories) {
    const existing = await db.select().from(userStories).where(eq(userStories.id, story.id!)).limit(1);
    if (existing.length === 0) {
      await db.insert(userStories).values(story);
      console.log(`   ✓ ${story.id}`);
      console.log(`      📋 ${story.title}`);
      console.log(`      📊 ${story.estimatedPoints} points | Status: ${story.status}\n`);
    } else {
      console.log(`   ⚠️  ${story.id} already exists, skipping...\n`);
    }
  }

  // Seed implementation stories
  console.log('📝 Creating 5 implementation stories...\n');
  for (const story of implementationStories) {
    const existing = await db.select().from(userStories).where(eq(userStories.id, story.id!)).limit(1);
    if (existing.length === 0) {
      await db.insert(userStories).values(story);
      console.log(`   ✓ ${story.id}`);
      console.log(`      📋 ${story.title}`);
      console.log(`      📊 ${story.estimatedPoints} points | Status: ${story.status}`);
      console.log(`      🔗 Implements: ${story.parentStoryId}\n`);
    } else {
      console.log(`   ⚠️  ${story.id} already exists, skipping...\n`);
    }
  }

  console.log('✅ Successfully seeded all stories!\n');
  console.log('📊 Summary:');
  console.log(`   • 1 Epic: EPIC-QC-003 (${epic.estimatedPoints} pts)`);
  console.log(`   • 5 Product Stories (34 pts total)`);
  console.log(`   • 5 Implementation Stories (29 pts total)`);
  console.log(`   • Grand Total: 63 story points\n`);
  console.log('🔗 Story Relationships:');
  console.log('   EPIC-QC-003: Structured Reproduction Steps');
  console.log('   ├─ US-QC-010: Individual Step Creation (8 pts)');
  console.log('   │  ├─ US-QC-IMPL-010: Database Schema (3 pts)');
  console.log('   │  ├─ US-QC-IMPL-011: API Endpoints (5 pts)');
  console.log('   │  └─ US-QC-IMPL-012: React Component (8 pts)');
  console.log('   ├─ US-QC-011: Remove Steps (5 pts)');
  console.log('   ├─ US-QC-012: Reorder Steps (8 pts)');
  console.log('   ├─ US-QC-013: Reference Steps (5 pts)');
  console.log('   │  └─ US-QC-IMPL-013: Reference Detection (8 pts)');
  console.log('   └─ US-QC-014: Migrate Textarea Steps (8 pts)');
  console.log('      └─ US-QC-IMPL-014: Migration Tool (5 pts)\n');
  console.log('📄 PRD: docs/PRD-QC-003-Structured-Reproduction-Steps.md\n');
}

seedStructuredReproStepsStories().catch((error) => {
  console.error('❌ Error seeding stories:', error);
  process.exit(1);
});

