
/**
 * Export Plan Module Data to CSV
 * 
 * Exports Epics, Sprints, User Stories, and Defects to a CSV file.
 * 
 * Run with: npx tsx scripts/export-plan-data.ts
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { epics, sprints, userStories, defects } from '../shared/schema';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

async function exportPlanData() {
  console.log('📊 Exporting Plan Module Data Elements...\n');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  // Fetch all data
  const allEpics = await db.select().from(epics);
  const allSprints = await db.select().from(sprints);
  const allStories = await db.select().from(userStories);
  const allDefects = await db.select().from(defects);

  console.log(`Found:
  - ${allEpics.length} Epics
  - ${allSprints.length} Sprints
  - ${allStories.length} User Stories
  - ${allDefects.length} Defects`);

  // Define CSV Columns
  const columns = [
    'Entity Type',
    'ID',
    'Title',
    'Status',
    'Priority',
    'Points/Complexity',
    'Parent ID (Epic/Story)',
    'Context (Sprint/Value Stream)',
    'Assignee',
    'Description'
  ];

  const rows: string[] = [columns.join(',')];

  // Helper to escape CSV fields
  const escape = (str: string | number | null | undefined) => {
    if (str === null || str === undefined) return '';
    const stringValue = String(str).replace(/"/g, '""'); // Double quote escape
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue}"`;
    }
    return stringValue;
  };

  // Transform Epics
  for (const e of allEpics) {
    rows.push([
      'Epic',
      escape(e.id),
      escape(e.name),
      escape(e.status),
      escape(e.priority),
      escape(e.totalStoryPoints),
      '', // No parent
      escape(e.valueStream),
      escape(e.owner),
      escape(e.description)
    ].join(','));
  }

  // Transform Sprints
  for (const s of allSprints) {
    rows.push([
      'Sprint',
      escape(s.id),
      escape(s.name),
      escape(s.status),
      '', // No priority
      escape(s.teamVelocity), // Velocity as 'points' proxy
      '', // No parent
      escape(`${s.startDate?.toISOString().split('T')[0]} to ${s.endDate?.toISOString().split('T')[0]}`),
      '',
      escape(s.goal)
    ].join(','));
  }

  // Transform User Stories
  for (const s of allStories) {
    rows.push([
      'User Story',
      escape(s.id),
      escape(s.title),
      escape(s.status),
      escape(s.priority),
      escape(s.storyPoints),
      escape(s.epicId),
      escape(s.sprintId),
      escape(s.assignee),
      escape(s.description)
    ].join(','));
  }

  // Transform Defects
  for (const d of allDefects) {
    rows.push([
      'Defect',
      escape(d.id),
      escape(d.title),
      escape(d.status),
      escape(d.severity), // Priority proxy
      '', // No points usually
      escape(d.userStoryId),
      '',
      escape(d.assignedTo),
      escape(d.description)
    ].join(','));
  }

  // Write file
  const exportDir = path.join(process.cwd(), 'docs', 'exports');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const filePath = path.join(exportDir, 'plan-module-data.csv');
  fs.writeFileSync(filePath, rows.join('\n'));

  console.log(`\n✅ Exported ${rows.length - 1} records to: ${filePath}`);
  await pool.end();
}

exportPlanData().catch(console.error);

