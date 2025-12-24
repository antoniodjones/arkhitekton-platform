import { db } from '../server/db';
import { defects, epics, userStories } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedDebounceDefect() {
  console.log('🐛 Seeding useDebounce Hook Defect...\n');

  // Ensure parent epic exists (should already exist from previous seeding)
  const epicId = 'EPIC-REF-001';
  let epic = await db.query.epics.findFirst({ where: eq(epics.id, epicId) });
  if (!epic) {
    console.log(`Creating epic: ${epicId}...`);
    await db.insert(epics).values({
      id: epicId,
      name: 'Reference Code: Document Management',
      description: 'Analyze reference codebases (Next.js Google Docs, Storage Management) for best practices, defects, and architectural patterns.',
      valueStream: 'Quality & Security',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date('2025-12-23T19:00:00Z'),
      updatedAt: new Date('2025-12-24T12:00:00Z'),
    });
    console.log(`✅ Created epic: ${epicId}\n`);
  } else {
    console.log(`ℹ️  Epic already exists: ${epicId}\n`);
  }

  // Ensure parent user story exists (should already exist)
  const userStoryId = 'US-REF-001';
  let userStory = await db.query.userStories.findFirst({ where: eq(userStories.id, userStoryId) });
  if (!userStory) {
    console.log(`Creating user story: ${userStoryId}...`);
    await db.insert(userStories).values({
      id: userStoryId,
      epicId: epicId,
      title: 'Analyze Reference Codebases for Defects and Best Practices',
      description: 'As a platform architect, I need to analyze provided reference codebases to identify common pitfalls, security vulnerabilities, and architectural patterns, so that Arkhitekton can learn from them and avoid similar issues.',
      acceptanceCriteria: `Given I have access to the reference codebases (Next.js Google Docs, Storage Management)
When I perform a comprehensive code review
Then I should identify and document at least 10 potential defects or areas for improvement
And I should categorize these findings by severity (Critical, High, Medium, Low)
And I should propose solutions or best practices to address each finding
And all findings should be linked to this user story in the defect tracking system.`,
      storyPoints: 13,
      status: 'in-progress',
      priority: 'critical',
      createdAt: new Date('2025-12-23T19:00:00Z'),
      updatedAt: new Date('2025-12-24T12:00:00Z'),
    });
    console.log(`✅ Created user story: ${userStoryId}\n`);
  } else {
    console.log(`ℹ️  User story already exists: ${userStoryId}\n`);
  }

  // Check if defect already exists
  const defectId = 'DEF-REF-015';
  const existing = await db.query.defects.findFirst({ where: eq(defects.id, defectId) });
  
  if (!existing) {
    console.log(`Creating defect: ${defectId}...`);
    await db.insert(defects).values({
      id: defectId,
      userStoryId: userStoryId,
      title: 'useDebounce hook dependency array defeats debounce mechanism',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/hooks/use-debounce.ts (lines 8-19)

**Issue**: The \`useDebounce\` hook includes \`callback\` in the \`useCallback\` dependency array (line 18: \`[callback, delay]\`). This causes the debounced function to be recreated whenever the callback reference changes. Since consumers of this hook (like document-input.tsx line 29-37) pass inline arrow functions that recreate on every render, the debounced function is also recreated on every render, completely defeating the debounce mechanism.

**Steps to Reproduce**:
1. Use \`useDebounce\` with an inline callback function (as in document-input.tsx)
2. Type rapidly in the document title input
3. Observe that the debounce doesn't work - updates fire immediately or inconsistently

**Expected Behavior**: The debounce hook should work correctly even when passed inline callback functions. The debounced function should remain stable across renders, and only the underlying callback behavior should update.

**Actual Behavior**: Every keystroke creates a new debounced function, so the timeout is reset but the function reference changes, breaking debounce behavior.

**Impact**: High - This defeats the primary purpose of the hook (reducing API calls) and can cause performance issues, excessive network requests, and race conditions in async operations.`,
      severity: 'high' as const,
      type: 'bug' as const,
      status: 'resolved' as const,
      rootCause: `The hook's \`useCallback\` dependency array includes \`callback\`, which changes on every render when consumers pass inline functions. This is a common React Hook anti-pattern: depending on values that change frequently defeats memoization.

The correct pattern is to use a ref to capture the latest callback value, then exclude the callback from the dependency array. This keeps the debounced function stable while still invoking the latest callback.`,
      resolution: `Added \`callbackRef = useRef(callback)\` to store the callback reference, and updated \`callbackRef.current = callback\` on every render. Changed the \`useCallback\` dependency array from \`[callback, delay]\` to \`[delay]\` only. The setTimeout now calls \`callbackRef.current(...args)\` instead of \`callback(...args)\`.

This ensures:
1. The debounced function remains stable across renders
2. The latest callback is always invoked when the timeout fires
3. Inline callbacks work correctly without breaking debounce

Fixed in commit [to be linked].`,
      discoveredBy: 'Code Review',
      assignedTo: 'Platform Team',
      createdAt: new Date('2025-12-24T12:00:00Z'),
      updatedAt: new Date('2025-12-24T12:00:00Z'),
      resolvedAt: new Date('2025-12-24T12:00:00Z'),
    });
    console.log(`✅ Created defect: ${defectId}`);
  } else {
    console.log(`ℹ️  Defect already exists: ${defectId}`);
  }

  console.log('\n✅ useDebounce defect seeded successfully!');
}

seedDebounceDefect()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });

