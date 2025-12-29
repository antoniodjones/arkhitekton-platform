import { db } from '../server/db';
import { defects } from '../shared/schema';
import { like } from 'drizzle-orm';

async function checkDefectData() {
  console.log('🔍 Checking actual defect data in database...\n');

  const refDefects = await db
    .select()
    .from(defects)
    .where(like(defects.id, 'DEF-REF-%'))
    .orderBy(defects.id);

  console.log(`Found ${refDefects.length} defects\n`);

  for (const defect of refDefects) {
    console.log(`\n${defect.id}:`);
    console.log(`  Title: ${defect.title}`);
    console.log(`  Severity: ${defect.severity}`);
    console.log(`  Status: ${defect.status}`);
    console.log(`  Type: ${defect.type}`);
    console.log(`  Story ID: ${defect.userStoryId}`);
    console.log(`  Description: ${defect.description ? defect.description.substring(0, 100) + '...' : 'NULL'}`);
    console.log(`  Root Cause: ${defect.rootCause ? defect.rootCause.substring(0, 100) + '...' : 'NULL'}`);
    console.log(`  Resolution: ${defect.resolution ? defect.resolution.substring(0, 100) + '...' : 'NULL'}`);
    console.log(`  Discovered By: ${defect.discoveredBy || 'NULL'}`);
    console.log(`  Assigned To: ${defect.assignedTo || 'NULL'}`);
    console.log(`  Created: ${defect.createdAt}`);
    console.log(`  Resolved: ${defect.resolvedAt}`);
  }
}

checkDefectData()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

