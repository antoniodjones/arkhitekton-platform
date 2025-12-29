import { db } from '../server/db';
import { defects } from '../shared/schema';
import { like, sql } from 'drizzle-orm';

/**
 * Verify all reference code defects exist in the database
 */

async function verifyReferenceDefects() {
  console.log('🔍 Verifying reference code defects in database...\n');

  try {
    // Query all defects starting with DEF-REF-
    const refDefects = await db
      .select()
      .from(defects)
      .where(like(defects.id, 'DEF-REF-%'))
      .orderBy(defects.id);

    console.log(`✅ Found ${refDefects.length} reference code defects:\n`);

    if (refDefects.length === 0) {
      console.log('⚠️  NO DEFECTS FOUND! The database might be empty or connection failed.');
      console.log('\n📝 To seed defects, run:');
      console.log('  npx tsx scripts/create-reference-code-defects.ts');
      console.log('  npx tsx scripts/create-reference-code-defects-part2.ts');
      console.log('  npx tsx scripts/create-reference-code-defects-part3.ts');
      console.log('  npx tsx scripts/create-reference-code-defects-part4.ts');
      console.log('  npx tsx scripts/create-reference-code-defects-part5.ts');
      console.log('  npx tsx scripts/create-reference-code-defects-part6.ts');
      console.log('  npx tsx scripts/create-reference-code-defects-part7.ts');
      return;
    }

    // Display in a table format
    console.log('┌──────────────────┬─────────────────────────────────────────────────────────────────┬──────────┬──────────┐');
    console.log('│ Defect ID        │ Title                                                           │ Severity │ Status   │');
    console.log('├──────────────────┼─────────────────────────────────────────────────────────────────┼──────────┼──────────┤');

    for (const defect of refDefects) {
      const id = defect.id.padEnd(16);
      const title = (defect.title.substring(0, 63) + (defect.title.length > 63 ? '...' : '')).padEnd(63);
      const severity = defect.severity.padEnd(8);
      const status = defect.status.padEnd(8);
      console.log(`│ ${id} │ ${title} │ ${severity} │ ${status} │`);
    }

    console.log('└──────────────────┴─────────────────────────────────────────────────────────────────┴──────────┴──────────┘');

    // Summary by severity
    console.log('\n📊 Summary by Severity:');
    const bySeverity = refDefects.reduce((acc, d) => {
      acc[d.severity] = (acc[d.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(bySeverity).forEach(([severity, count]) => {
      const emoji = severity === 'critical' ? '🔴' : severity === 'high' ? '🟠' : severity === 'medium' ? '🟡' : '🟢';
      console.log(`  ${emoji} ${severity.toUpperCase()}: ${count}`);
    });

    // Summary by status
    console.log('\n📊 Summary by Status:');
    const byStatus = refDefects.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(byStatus).forEach(([status, count]) => {
      console.log(`  ✓ ${status}: ${count}`);
    });

    // Check for missing IDs (DEF-REF-001 through DEF-REF-014)
    console.log('\n🔍 Checking for missing defects...');
    const expectedIds = Array.from({ length: 14 }, (_, i) => 
      `DEF-REF-${String(i + 1).padStart(3, '0')}`
    );
    const foundIds = new Set(refDefects.map(d => d.id));
    const missingIds = expectedIds.filter(id => !foundIds.has(id));

    if (missingIds.length > 0) {
      console.log(`⚠️  Missing ${missingIds.length} defects:`);
      missingIds.forEach(id => console.log(`  ❌ ${id}`));
    } else {
      console.log('✅ All 14 expected defects are present!');
    }

    // Detailed list
    console.log('\n📋 Detailed Defect List:\n');
    for (const defect of refDefects) {
      console.log(`${defect.id}: ${defect.title}`);
      console.log(`  Severity: ${defect.severity.toUpperCase()} | Status: ${defect.status} | Story: ${defect.affectedStoryId}`);
      console.log(`  Priority: ${defect.priority}`);
      if (defect.resolvedAt) {
        console.log(`  Resolved: ${defect.resolvedAt.toISOString().split('T')[0]}`);
      }
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error querying database:', error);
    console.error('\nPossible issues:');
    console.error('  1. Database not running');
    console.error('  2. Wrong database credentials');
    console.error('  3. Table "defects" does not exist');
    throw error;
  }
}

verifyReferenceDefects()
  .then(() => {
    console.log('✅ Verification complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  });

