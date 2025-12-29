import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "../db/database.db");
const db = new Database(dbPath);

console.log("🔍 Seeding test code changes for PR/Commit search feature...\n");

// Test commit SHA that we'll use for testing
const TEST_COMMIT_SHA = "3f4e05f";
const TEST_PR_NUMBER = 123;
const TEST_BRANCH = "feature/US-SEARCH-006-clickable-tooltips";
const TEST_AUTHOR = "antoniodjones";

// First, ensure we have the test stories
const stories = [
  {
    id: "US-SEARCH-006",
    title: "Keyboard Shortcuts",
    description: "Implement keyboard shortcuts for global search",
  },
  {
    id: "US-SEARCH-IMPL-001",
    title: "Create Global Search Modal",
    description: "Create the global search modal component",
  },
  {
    id: "US-SEARCH-IMPL-002",
    title: "Integrate Search Hook",
    description: "Integrate search hook with modal",
  },
];

// Ensure we have a defect
const defect = {
  id: "DEF-SEARCH-001",
  title: "Global Search Not Opening",
  description: "CMD+K does not open global search modal",
  severity: "critical",
  status: "resolved",
};

try {
  // Check if defect exists, if not create it
  const existingDefect = db.prepare("SELECT id FROM defects WHERE id = ?").get(defect.id);
  
  if (!existingDefect) {
    console.log(`✅ Creating defect: ${defect.id}`);
    db.prepare(`
      INSERT INTO defects (id, title, description, severity, status, priority, userStoryId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, 'high', 'US-SEARCH-006', datetime('now'), datetime('now'))
    `).run(defect.id, defect.title, defect.description, defect.severity, defect.status);
  }

  // Delete existing code changes for this commit to avoid duplicates
  console.log(`🗑️  Removing old code changes for commit ${TEST_COMMIT_SHA}...`);
  db.prepare("DELETE FROM codeChanges WHERE commitSha = ?").run(TEST_COMMIT_SHA);

  // Create code changes for the defect and all stories
  const codeChanges = [
    {
      entityType: "defect",
      entityId: defect.id,
      order: 1,
    },
    {
      entityType: "user_story",
      entityId: "US-SEARCH-006",
      order: 2,
    },
    {
      entityType: "user_story",
      entityId: "US-SEARCH-IMPL-001",
      order: 3,
    },
    {
      entityType: "user_story",
      entityId: "US-SEARCH-IMPL-002",
      order: 4,
    },
  ];

  console.log(`✅ Creating ${codeChanges.length} code change records...\n`);

  for (const change of codeChanges) {
    const id = `CC-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    db.prepare(`
      INSERT INTO codeChanges (
        id, 
        entityType, 
        entityId, 
        commitSha, 
        prNumber, 
        branchName, 
        commitMessage, 
        prTitle, 
        authorUsername, 
        createdAt, 
        updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
      id,
      change.entityType,
      change.entityId,
      TEST_COMMIT_SHA,
      TEST_PR_NUMBER,
      TEST_BRANCH,
      `feat: US-SEARCH-007 - Add clickable hover tooltips for linked items`,
      `Add clickable tooltips to PR/Commit search results`,
      TEST_AUTHOR
    );

    console.log(`   ✓ ${change.entityType.padEnd(12)} | ${change.entityId.padEnd(25)} | ${TEST_COMMIT_SHA}`);
  }

  console.log(`\n✅ Successfully seeded ${codeChanges.length} code changes!`);
  console.log(`\n📝 Test Instructions:`);
  console.log(`   1. Open the app and press CMD+K (or CTRL+K)`);
  console.log(`   2. Search for: ${TEST_COMMIT_SHA}`);
  console.log(`   3. You should see: ${defect.id} (primary result)`);
  console.log(`   4. Look for "Fixed in: ${TEST_COMMIT_SHA.substring(0, 7)}" metadata`);
  console.log(`   5. Hover over "+ 3 other stories"`);
  console.log(`   6. Click on any linked item to open story detail sheet`);
  console.log(`   7. Close sheet to return to search results`);
  console.log(`\n🔍 Other test searches:`);
  console.log(`   - PR Number: #${TEST_PR_NUMBER} or ${TEST_PR_NUMBER}`);
  console.log(`   - Branch: ${TEST_BRANCH}`);
  console.log(`   - Author: ${TEST_AUTHOR} or @${TEST_AUTHOR}`);
  console.log(`   - Commit Message: "clickable"`);
  console.log(`   - PR Title: "tooltips"\n`);

} catch (error) {
  console.error("❌ Error seeding test code changes:", error);
  process.exit(1);
} finally {
  db.close();
}

