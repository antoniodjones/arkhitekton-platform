import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';

// Load environment variables
config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function updateStoryStatus() {
  console.log('🚀 Updating US-PDF-001 status to "done"...\n');

  try {
    await db.update(schema.userStories)
      .set({ 
        status: 'done',
        updatedAt: new Date()
      })
      .where(eq(schema.userStories.id, 'US-PDF-001'));

    console.log('✅ Successfully updated US-PDF-001 to "done"');
    console.log('\n📋 Implementation complete:');
    console.log('- Created PDF export utility (client/src/lib/pdf-export.ts)');
    console.log('- Added jsPDF and html2canvas dependencies');
    console.log('- Integrated "Export to PDF" button in story dialog');
    console.log('- PDF includes: Header (Story Name | ID | Feature), all metadata, acceptance criteria');
    console.log('- Auto-downloads with format: {story-id}_{story-title}.pdf');

  } catch (error) {
    console.error('❌ Error updating story:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

updateStoryStatus();

