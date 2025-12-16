// scripts/generate-wiki-html.js
const fs = require('fs');
const path = require('path');

const implementationDocs = [
    {
      id: 'IMPL-001',
      title: 'ARKHITEKTON Foundation Architecture',
      content: `
## Overview
Established the foundational architecture for ARKHITEKTON using modern React/TypeScript stack with emphasis on performance, maintainability, and user experience.

## Implementation Details
- **Frontend**: React 18 with TypeScript for type safety and modern development practices
- **Build System**: Vite for fast development and optimized production builds
- **UI Framework**: shadcn/ui + Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens and warm orange architectural theme
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing

## Key Achievements
- Sub-second hot reload development experience
- Type-safe data layer with shared schema definitions
- Responsive design system that scales from mobile to desktop
- Consistent design language with sophisticated orange palette

## Impact
This foundation enables rapid feature development while maintaining code quality and user experience standards that exceed traditional enterprise software.
      `,
      category: 'Architecture Patterns',
      subcategory: 'Foundation',
      author: 'ARKHITEKTON Team',
      lastModified: '2025-09-02',
      lastEditor: 'Development Team',
      views: 1,
      likes: 0,
      status: 'Published',
      tags: ['react', 'typescript', 'foundation', 'architecture'],
      relatedPages: [],
      linkedDecisions: [],
      linkedCapabilities: [],
      attachments: [],
      version: '1.0',
      contributors: ['Development Team']
    },
    {
      id: 'IMPL-002',
      title: 'Orange Theme System Implementation',
      content: `
## Overview
Implemented a sophisticated warm orange color palette throughout ARKHITEKTON to differentiate from generic green EA tools and evoke architectural heritage.

## Design Philosophy
The orange theme represents:
- **Warmth & Creativity**: Inspiring architects to innovate
- **Architectural Heritage**: Connecting to traditional building materials (brick, wood, stone)
- **Differentiation**: Standing apart from the sea of green enterprise tools
- **Energy**: Dynamic and engaging user experience

## Implementation Details
- CSS custom properties for consistent color tokens across light/dark themes
- Gradient applications for depth and visual interest
- Accessibility-compliant color contrasts
- Apple-style theme switcher with Light/Dark/Auto modes

## Key Components
- Primary orange palette from 50-950 with warm undertones
- Accent colors for different interaction states
- Dark mode variants that maintain warmth while providing eye comfort
- Semantic color assignments for status, warnings, and success states

## Impact
Creates a distinctive, professional identity that architects associate with creativity and excellence rather than mundane enterprise bureaucracy.
      `,
      category: 'Best Practices',
      subcategory: 'Design System',
      author: 'ARKHITEKTON Team',
      lastModified: '2025-09-02',
      lastEditor: 'Development Team',
      views: 1,
      likes: 0,
      status: 'Published',
      tags: ['design', 'theme', 'orange', 'ui-ux'],
      relatedPages: ['IMPL-001'],
      linkedDecisions: [],
      linkedCapabilities: [],
      attachments: [],
      version: '1.0',
      contributors: ['Development Team']
    }
  ];

  const pages = [
    {
      id: 'WIKI-001',
      title: 'Enterprise Architecture Governance Framework',
      content: 'Comprehensive framework defining governance processes, roles, and responsibilities for enterprise architecture management...',
      category: 'Governance',
      subcategory: 'Framework',
      author: 'Sarah Chen',
      lastModified: '2024-08-29',
      lastEditor: 'Michael Torres',
      views: 245,
      likes: 18,
      status: 'Published',
      tags: ['governance', 'framework', 'process'],
      relatedPages: ['WIKI-002', 'WIKI-005'],
      linkedDecisions: ['ADR-001'],
      linkedCapabilities: ['Cybersecurity & Risk Management'],
      attachments: ['governance-framework.pdf', 'process-diagram.png'],
      version: '2.1',
      contributors: ['Sarah Chen', 'Michael Torres', 'Elena Rodriguez']
    },
    {
      id: 'WIKI-002',
      title: 'Architecture Decision Record Template',
      content: 'Standard template for documenting architectural decisions including context, decision, consequences, and alternatives...',
      category: 'Templates',
      subcategory: 'ADR',
      author: 'Michael Torres',
      lastModified: '2024-08-27',
      lastEditor: 'Michael Torres',
      views: 189,
      likes: 25,
      status: 'Published',
      tags: ['template', 'adr', 'documentation'],
      relatedPages: ['WIKI-001', 'WIKI-006'],
      linkedDecisions: ['ADR-002', 'ADR-003'],
      linkedCapabilities: [],
      attachments: ['adr-template.md'],
      version: '1.3',
      contributors: ['Michael Torres', 'David Kim']
    },
    {
      id: 'WIKI-003',
      title: 'Cloud Security Standards and Guidelines',
      content: 'Comprehensive security standards for cloud infrastructure including zero trust principles, identity management, and compliance requirements...',
      category: 'Standards',
      subcategory: 'Security',
      author: 'David Kim',
      lastModified: '2024-08-25',
      lastEditor: 'Lisa Wang',
      views: 156,
      likes: 12,
      status: 'Published',
      tags: ['security', 'cloud', 'standards', 'compliance'],
      relatedPages: ['WIKI-004', 'WIKI-007'],
      linkedDecisions: ['ADR-002'],
      linkedCapabilities: ['Cybersecurity & Risk Management', 'Cloud Infrastructure Management'],
      attachments: ['security-standards.pdf', 'compliance-checklist.xlsx'],
      version: '3.0',
      contributors: ['David Kim', 'Lisa Wang', 'Michael Torres']
    },
    {
      id: 'WIKI-004',
      title: 'Data Architecture Patterns and Best Practices',
      content: 'Collection of proven data architecture patterns including data lakehouse, event streaming, and analytics platforms...',
      category: 'Architecture Patterns',
      subcategory: 'Data',
      author: 'Elena Rodriguez',
      lastModified: '2024-08-24',
      lastEditor: 'Elena Rodriguez',
      views: 203,
      likes: 31,
      status: 'Published',
      tags: ['data', 'patterns', 'analytics', 'architecture'],
      relatedPages: ['WIKI-003', 'WIKI-008'],
      linkedDecisions: ['ADR-003'],
      linkedCapabilities: ['Data Analytics & Intelligence'],
      attachments: ['data-patterns.pdf', 'reference-architectures.png'],
      version: '2.2',
      contributors: ['Elena Rodriguez', 'Sarah Chen']
    },
    {
      id: 'WIKI-005',
      title: 'Architecture Review Process and Checklist',
      content: 'Step-by-step process for conducting architecture reviews including preparation, review criteria, and decision workflows...',
      category: 'Procedures',
      subcategory: 'Review Process',
      author: 'Sarah Chen',
      lastModified: '2024-08-22',
      lastEditor: 'David Kim',
      views: 167,
      likes: 14,
      status: 'Published',
      tags: ['process', 'review', 'checklist', 'quality'],
      relatedPages: ['WIKI-001', 'WIKI-002'],
      linkedDecisions: [],
      linkedCapabilities: [],
      attachments: ['review-checklist.pdf', 'process-flowchart.png'],
      version: '1.8',
      contributors: ['Sarah Chen', 'David Kim', 'Michael Torres']
    },
    {
      id: 'WIKI-006',
      title: 'Microservices Design Guidelines',
      content: 'Comprehensive guidelines for designing microservices including service boundaries, communication patterns, and deployment strategies...',
      category: 'Best Practices',
      subcategory: 'Microservices',
      author: 'Michael Torres',
      lastModified: '2024-08-20',
      lastEditor: 'Sarah Chen',
      views: 298,
      likes: 42,
      status: 'Published',
      tags: ['microservices', 'design', 'guidelines', 'patterns'],
      relatedPages: ['WIKI-004', 'WIKI-007'],
      linkedDecisions: ['ADR-001'],
      linkedCapabilities: ['Customer Experience Management'],
      attachments: ['microservices-guide.pdf', 'design-patterns.md'],
      version: '3.1',
      contributors: ['Michael Torres', 'Sarah Chen', 'Elena Rodriguez']
    },
    {
      id: 'WIKI-007',
      title: 'API Design and Governance Standards',
      content: 'Standards for API design including REST principles, GraphQL guidelines, versioning strategies, and governance processes...',
      category: 'Standards',
      subcategory: 'API',
      author: 'David Kim',
      lastModified: '2024-08-18',
      lastEditor: 'Elena Rodriguez',
      views: 134,
      likes: 19,
      status: 'Under Review',
      tags: ['api', 'standards', 'governance', 'design'],
      relatedPages: ['WIKI-003', 'WIKI-006'],
      linkedDecisions: ['ADR-004'],
      linkedCapabilities: [],
      attachments: ['api-standards.yaml', 'governance-model.md'],
      version: '2.0',
      contributors: ['David Kim', 'Elena Rodriguez']
    },
    {
      id: 'WIKI-008',
      title: 'Capability Mapping Methodology',
      content: 'Methodology for identifying, mapping, and assessing business capabilities including maturity models and improvement strategies...',
      category: 'Procedures',
      subcategory: 'Capability Management',
      author: 'Elena Rodriguez',
      lastModified: '2024-08-15',
      lastEditor: 'Sarah Chen',
      views: 89,
      likes: 8,
      status: 'Draft',
      tags: ['capability', 'methodology', 'assessment', 'maturity'],
      relatedPages: ['WIKI-004', 'WIKI-001'],
      linkedDecisions: [],
      linkedCapabilities: ['Customer Experience Management', 'Data Analytics & Intelligence'],
      attachments: ['capability-methodology.docx'],
      version: '0.9',
      contributors: ['Elena Rodriguez', 'Sarah Chen']
    }
  ];

function marked(markdown) {
    if (!markdown) return '';
    // Very simple markdown replacement
    return markdown
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\n/gim, '<br />')
        .replace(/- (.*$)/gim, '<li>$1</li>');
}

const allPages = [...implementationDocs, ...pages];
const outputDir = path.join(process.cwd(), 'docs', 'wiki-current-state');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate Index
let indexContent = `<!DOCTYPE html>
<html>
<head>
    <title>Arkhitekton Wiki - Current State</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #333; }
        h1 { color: #ea580c; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .page-list { list-style: none; padding: 0; }
        .page-item { border: 1px solid #eee; padding: 15px; margin-bottom: 10px; border-radius: 6px; transition: all 0.2s; }
        .page-item:hover { border-color: #ea580c; background: #fff7ed; }
        .meta { font-size: 0.85em; color: #666; margin-top: 5px; }
        a { text-decoration: none; color: inherit; display: block; }
        .status { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 0.75em; font-weight: 600; }
        .status.Published { background: #dcfce7; color: #166534; }
        .status.Draft { background: #dbeafe; color: #1e40af; }
    </style>
</head>
<body>
    <h1>Arkhitekton Knowledge Base</h1>
    <p>Current State Snapshot - Generated ${new Date().toLocaleDateString()}</p>
    <ul class="page-list">
`;

allPages.forEach(page => {
    const filename = `${page.id}.html`;
    indexContent += `
        <li class="page-item">
            <a href="${filename}">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong>${page.title}</strong>
                    <span class="status ${page.status}">${page.status}</span>
                </div>
                <div class="meta">ID: ${page.id} | Category: ${page.category} | Author: ${page.author}</div>
            </a>
        </li>`;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>${page.title} - Arkhitekton Wiki</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #333; }
        header { border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
        h1 { margin: 0 0 10px 0; color: #ea580c; }
        .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; background: #f9fafb; padding: 20px; border-radius: 8px; font-size: 0.9em; }
        .label { color: #666; font-weight: 500; }
        .content { margin-top: 30px; }
        .tags { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .tag { display: inline-block; background: #f3f4f6; padding: 4px 10px; border-radius: 15px; font-size: 0.85em; margin-right: 8px; color: #4b5563; }
        .back-link { display: inline-block; margin-bottom: 20px; color: #ea580c; text-decoration: none; font-weight: 500; }
        .back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <a href="index.html" class="back-link">← Back to Index</a>
    
    <header>
        <h1>${page.title}</h1>
        <div class="meta-grid">
            <div><span class="label">ID:</span> ${page.id}</div>
            <div><span class="label">Status:</span> ${page.status}</div>
            <div><span class="label">Category:</span> ${page.category}</div>
            <div><span class="label">Author:</span> ${page.author}</div>
            <div><span class="label">Last Modified:</span> ${page.lastModified}</div>
            <div><span class="label">Version:</span> ${page.version}</div>
        </div>
    </header>

    <div class="content">
        ${marked(page.content)}
    </div>

    <div class="tags">
        ${page.tags.map(t => `<span class="tag">#${t}</span>`).join('')}
    </div>
</body>
</html>`;

    fs.writeFileSync(path.join(outputDir, filename), htmlContent);
});

indexContent += `
    </ul>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'index.html'), indexContent);

console.log(`Generated ${allPages.length} HTML files in ${outputDir}`);

