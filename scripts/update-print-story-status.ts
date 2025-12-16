import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';

// Load environment variables
config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function updateStoryStatuses() {
  console.log('🖨️  Updating Print story statuses...\n');

  try {
    // Update US-PRINT-001 and US-PRINT-002 to "done"
    const storiesToUpdate = ['US-PRINT-001', 'US-PRINT-002'];

    for (const storyId of storiesToUpdate) {
      await db.update(schema.userStories)
        .set({ 
          status: 'done',
          updatedAt: new Date()
        })
        .where(eq(schema.userStories.id, storyId));
      
      console.log(`✅ Updated ${storyId} to "done"`);
    }

    console.log('\n📋 Implementation complete:');
    console.log('- Created print CSS stylesheet (client/src/styles/print.css)');
    console.log('- Imported print styles in index.css');
    console.log('- Added "Print Story" button in story dialog');
    console.log('- Implemented print-only HTML structure');
    console.log('- Print header format: Story Name | Story ID | Feature (orange background)');
    console.log('- Print layout matches PDF template design');
    console.log('- Supports browser native print (Ctrl+P / Cmd+P)');
    console.log('- Proper page breaks and margins for A4/Letter paper');
    
    console.log('\n✨ Implemented Stories:');
    console.log('  ✅ US-PRINT-001: Print Single User Story to Local/Network Printer');
    console.log('  ✅ US-PRINT-002: Optimize Print CSS for Story Dialog');
    
    console.log('\n📌 Remaining Stories (Backlog):');
    console.log('  - US-PRINT-003: Print Multiple User Stories in Batch (8 pts)');
    console.log('  - US-PRINT-004: Print Settings and Layout Options (5 pts)');
    console.log('  - US-PRINT-005: Print Epic Summary with All Related Stories (8 pts)');
    console.log('  - US-PRINT-006: Quick Print Button in Story Card (3 pts)');

  } catch (error) {
    console.error('❌ Error updating stories:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

updateStoryStatuses();

