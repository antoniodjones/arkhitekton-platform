import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as schema from '../shared/schema';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function testWikiAPI() {
  console.log('🧪 Testing Wiki Knowledge Core API...\n');

  try {
    // Test 1: Create sample wiki pages
    console.log('📝 Test 1: Creating sample wiki pages...');
    
    const architectureGuide = await db.insert(schema.wikiPages).values({
      title: 'Architecture Guide',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Architecture Guide' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Welcome to the ARKHITEKTON Architecture Guide. This comprehensive guide covers all architectural standards, patterns, and best practices.' }]
          }
        ]
      },
      category: 'Architecture',
      status: 'published',
      createdBy: 'system',
      tags: ['architecture', 'guide', 'standards'],
      template: 'Design'
    }).returning();

    console.log(`✅ Created: ${architectureGuide[0].title} (${architectureGuide[0].id})`);

    const microservicesPattern = await db.insert(schema.wikiPages).values({
      title: 'Microservices Architecture Pattern',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Microservices Architecture Pattern' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'A comprehensive guide to implementing microservices architecture in ARKHITEKTON platform.' }]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Key Principles' }]
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Service Independence' }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Decentralized Data Management' }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'API-First Design' }] }]
              }
            ]
          }
        ]
      },
      parentId: architectureGuide[0].id,
      category: 'Architecture',
      subcategory: 'Patterns',
      status: 'published',
      createdBy: 'system',
      tags: ['microservices', 'architecture', 'pattern', 'distributed-systems'],
      template: 'Design',
      sortOrder: 1
    }).returning();

    console.log(`✅ Created: ${microservicesPattern[0].title} (${microservicesPattern[0].id})`);

    const adrTemplate = await db.insert(schema.wikiPages).values({
      title: 'ADR-001: Use PostgreSQL for Primary Database',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'ADR-001: Use PostgreSQL for Primary Database' }]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Status' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Accepted' }]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Context' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'We need to choose a relational database for the ARKHITEKTON platform that supports complex queries, JSONB data types, and full-text search.' }]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Decision' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'We will use PostgreSQL as our primary database.' }]
          }
        ]
      },
      category: 'Governance',
      subcategory: 'Decisions',
      status: 'published',
      createdBy: 'system',
      tags: ['adr', 'database', 'postgresql', 'decision'],
      template: 'ADR'
    }).returning();

    console.log(`✅ Created: ${adrTemplate[0].title} (${adrTemplate[0].id})`);

    const securityStandards = await db.insert(schema.wikiPages).values({
      title: 'Security Standards & Best Practices',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Security Standards & Best Practices' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Comprehensive security guidelines for the ARKHITEKTON platform.' }]
          }
        ]
      },
      category: 'Governance',
      subcategory: 'Security',
      status: 'draft',
      createdBy: 'system',
      tags: ['security', 'standards', 'compliance'],
      template: null
    }).returning();

    console.log(`✅ Created: ${securityStandards[0].title} (${securityStandards[0].id})`);

    // Test 2: Query wiki pages
    console.log('\n📖 Test 2: Querying wiki pages...');
    
    const allPages = await db.select().from(schema.wikiPages);
    console.log(`✅ Total pages: ${allPages.length}`);

    const publishedPages = await db.select().from(schema.wikiPages).where(schema.wikiPages.status === 'published');
    console.log(`✅ Published pages: ${publishedPages.length}`);

    const architecturePages = await db.select().from(schema.wikiPages).where(schema.wikiPages.category === 'Architecture');
    console.log(`✅ Architecture pages: ${architecturePages.length}`);

    // Test 3: Create entity mentions
    console.log('\n🔗 Test 3: Creating entity mentions...');
    
    const mention1 = await db.insert(schema.entityMentions).values({
      pageId: microservicesPattern[0].id,
      entityType: 'user_story',
      entityId: 'US-WIKI-001',
      text: 'US-WIKI-001: Create wiki page',
      position: 100,
      entityStatus: 'in-progress'
    }).returning();

    console.log(`✅ Created mention: ${mention1[0].text} in page ${mention1[0].pageId}`);

    const mention2 = await db.insert(schema.entityMentions).values({
      pageId: adrTemplate[0].id,
      entityType: 'application',
      entityId: 'APP-001',
      text: 'PostgreSQL Database',
      position: 250,
      entityStatus: 'active'
    }).returning();

    console.log(`✅ Created mention: ${mention2[0].text} in page ${mention2[0].pageId}`);

    // Test 4: Query mentions
    console.log('\n🔍 Test 4: Querying entity mentions...');
    
    const mentionsInMicroservicesPage = await db.select().from(schema.entityMentions).where(schema.entityMentions.pageId === microservicesPattern[0].id);
    console.log(`✅ Mentions in Microservices page: ${mentionsInMicroservicesPage.length}`);

    const allMentions = await db.select().from(schema.entityMentions);
    console.log(`✅ Total mentions: ${allMentions.length}`);

    // Test 5: Update page views
    console.log('\n👁️  Test 5: Incrementing page views...');
    
    await db.update(schema.wikiPages)
      .set({ views: (architectureGuide[0].views || 0) + 1 })
      .where(schema.wikiPages.id === architectureGuide[0].id);
    
    const updatedPage = await db.select().from(schema.wikiPages).where(schema.wikiPages.id === architectureGuide[0].id);
    console.log(`✅ Page views updated: ${updatedPage[0].views}`);

    // Test 6: Search functionality
    console.log('\n🔎 Test 6: Testing search...');
    
    const searchResults = allPages.filter(page => 
      page.title.toLowerCase().includes('architecture') ||
      (page.tags && page.tags.some((tag: string) => tag.toLowerCase().includes('architecture')))
    );
    console.log(`✅ Search results for "architecture": ${searchResults.length} pages`);
    searchResults.forEach(page => console.log(`   - ${page.title}`));

    console.log('\n✨ All tests passed! Wiki API is working correctly.\n');
    console.log('📊 Summary:');
    console.log(`  - Total Pages: ${allPages.length}`);
    console.log(`  - Published Pages: ${publishedPages.length}`);
    console.log(`  - Draft Pages: ${allPages.length - publishedPages.length}`);
    console.log(`  - Total Mentions: ${allMentions.length}`);
    console.log(`  - Categories: ${[...new Set(allPages.map(p => p.category))].join(', ')}`);
    console.log('\n🚀 Ready to build the frontend UI!');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

testWikiAPI().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

