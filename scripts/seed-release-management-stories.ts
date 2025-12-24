/**
 * Seed Release Management User Stories (US-REL-101 through US-REL-104)
 * These stories are NOT YET IMPLEMENTED - Phase 4
 */

import { db } from '../server/db';
import { epics, userStories } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedReleaseManagementStories() {
  console.log('Seeding Release and Launch Management User Stories\n');

  // Check if epic exists, create if not
  let releaseEpic = await db
    .select()
    .from(epics)
    .where(eq(epics.id, 'EPIC-REL-001'))
    .limit(1);

  if (releaseEpic.length === 0) {
    console.log('Creating EPIC-REL-001: Release and Launch Management');
    await db.insert(epics).values({
      id: 'EPIC-REL-001',
      name: 'Quality Center: Release and Launch Management',
      description: 'Coordinate release activities with launch checklists go/no-go decisions and stakeholder votes. Provides release health metrics and automated release notes generation.',
      status: 'planning',
      priority: 'high',
      estimatedPoints: 23,
      createdAt: new Date(),
    });
    console.log('EPIC-REL-001 created\n');
  } else {
    console.log('EPIC-REL-001 already exists\n');
  }

  // Define user stories
  const stories = [
    {
      id: 'US-REL-101',
      title: 'Release Definition',
      epicId: 'EPIC-REL-001',
      description: `As a Release Manager I want to create releases as containers for epics and stories so that I can track completion and readiness for deployment.

Acceptance Criteria:
- Can create release with version name description target date
- Can set release type major minor patch hotfix
- Can link epics and stories to release
- Release status tracks planning development testing ready released
- Completion percentage calculated from linked stories
- Version tagging applied to defects found in version fixed in version

Implementation: Releases table Release Stories junction table API endpoints Release Dashboard UI`,
      priority: 'high',
      estimatedPoints: 5,
      status: 'planning',
      type: 'feature',
      acceptanceCriteria: 'Given I am Release Manager when I create release then I can specify version name type target date link stories. Given I have release with stories when I view release then I see completion percentage and status.',
      createdAt: new Date('2025-12-24'),
    },
    {
      id: 'US-REL-102',
      title: 'Launch Checklist',
      epicId: 'EPIC-REL-001',
      description: `As a Release Manager I want to manage launch checklists with predefined categories so that I ensure all required activities are completed before release.

Acceptance Criteria:
- Predefined categories Development QA Documentation Infrastructure Stakeholders
- Can add checklist items with owner due date evidence URL
- Can mark items as critical or non-critical
- Can mark items as complete with completion timestamp
- Can add notes and evidence links for each item
- Checklist completion percentage displayed
- Critical items highlighted and required for go decision

Implementation: Launch Checklist Items table API endpoints Checklist UI with categories`,
      priority: 'critical',
      estimatedPoints: 8,
      status: 'planning',
      type: 'feature',
      acceptanceCriteria: 'Given I have release when I manage checklist then I can add items by category assign owners set due dates mark critical. Given I have checklist when I complete item then timestamp recorded evidence linked.',
      createdAt: new Date('2025-12-24'),
    },
    {
      id: 'US-REL-103',
      title: 'Go/No-Go Decision Board',
      epicId: 'EPIC-REL-001',
      description: `As a Release Manager I want a go/no-go decision board with stakeholder votes so that I can make data-driven release decisions with executive visibility.

Acceptance Criteria:
- Visual dashboard shows release health metrics
- Story completion percentage displayed
- Defect counts by severity critical high blockers
- Quality gate status pass fail warning
- Stakeholder vote section with go no-go pending
- Each stakeholder can provide vote and reason
- Auto-generate release notes from completed stories
- Export release summary for stakeholder review

Implementation: Go/No-Go Board UI Stakeholder Votes table Release Notes generator Release Health API`,
      priority: 'high',
      estimatedPoints: 5,
      status: 'planning',
      type: 'feature',
      acceptanceCriteria: 'Given I am on Go/No-Go Board when I view release then I see completion percentage defect counts quality gates stakeholder votes. Given stakeholders cast votes when decision made then release status updated release notes generated.',
      createdAt: new Date('2025-12-24'),
    },
    {
      id: 'US-REL-104',
      title: 'Release Dashboard',
      epicId: 'EPIC-REL-001',
      description: `As a Product Owner I want a release dashboard showing upcoming releases and health metrics so that I can monitor release readiness and velocity.

Acceptance Criteria:
- Timeline view of upcoming releases with target dates
- Release health cards show completion percentage defect counts
- Release velocity metrics average time from planning to released
- Filter releases by status planning development testing ready released
- Quick navigation to release detail and checklist
- Export release roadmap for stakeholder communication

Implementation: Release Dashboard UI Release Metrics API Release Timeline component`,
      priority: 'medium',
      estimatedPoints: 5,
      status: 'planning',
      type: 'feature',
      acceptanceCriteria: 'Given I am on Release Dashboard when I view releases then I see timeline with target dates health cards with metrics velocity stats. Given I click release when I navigate then I see release detail with checklist and go/no-go board.',
      createdAt: new Date('2025-12-24'),
    },
  ];

  // Insert stories
  for (const story of stories) {
    const existing = await db
      .select()
      .from(userStories)
      .where(eq(userStories.id, story.id))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(userStories).values(story);
      console.log(`Created ${story.id}: ${story.title}`);
    } else {
      console.log(`${story.id} already exists skipping`);
    }
  }

  console.log('\nRelease and Launch Management user stories seeded successfully');
  console.log('Summary:');
  console.log('- EPIC-REL-001: Release and Launch Management');
  console.log('- US-REL-101: Release Definition (5 pts) PLANNING');
  console.log('- US-REL-102: Launch Checklist (8 pts) PLANNING');
  console.log('- US-REL-103: Go/No-Go Decision Board (5 pts) PLANNING');
  console.log('- US-REL-104: Release Dashboard (5 pts) PLANNING');
  console.log('\nTotal: 23 story points Phase 4 NOT IMPLEMENTED');
}

seedReleaseManagementStories()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding release management stories:', error);
    process.exit(1);
  });

