import { db } from "../server/db";
import { userStories, epics } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Seed User Stories for Minimal Canvas (Option C)
 * Focus: Basic draw.io-style shapes and connections
 * 
 * New Stories:
 * - US-CVS-010: Basic Shape Library (12 generic shapes)
 * - US-CVS-011: Connection Routing (orthogonal/straight)
 */

async function seedCanvasBasicShapesStories() {
  console.log(`\n🎨 Seeding Canvas Basic Shapes User Stories...\n`);
  
  // Verify EPIC-IDE-02 exists
  const epic = await db.select().from(epics).where(eq(epics.id, "EPIC-IDE-02")).limit(1);
  
  if (epic.length === 0) {
    console.error(`❌ EPIC-IDE-02 (Modeling Canvas Engine) not found`);
    process.exit(1);
  }
  
  console.log(`✅ Found epic: ${epic[0].name}`);
  
  const newStories = [
    {
      id: "US-CVS-010",
      epicId: "EPIC-IDE-02",
      title: "Basic Shape Library",
      description: `**As an** architect or designer
**I want** a palette of basic diagramming shapes (rectangle, circle, diamond, etc.)
**So that** I can create general-purpose diagrams without needing framework-specific icons

**Context**:
This story delivers draw.io-style basic shapes for universal diagramming needs. Unlike framework-specific libraries (AWS, Azure, BPMN), these are geometric primitives that work for any diagram type.

**Shape Categories**:
1. **Geometric**: Rectangle, Rounded Rectangle, Circle, Ellipse, Diamond, Triangle, Hexagon, Cylinder
2. **Flowchart**: Process Box, Decision Diamond, Start/End Pill, Document, Database
3. **Containers**: Frame/Group Box, Swimlane, Cloud Shape
4. **Text**: Text Box, Note/Sticky

**Total**: 12-15 core shapes for MVP`,
      acceptanceCriteria: `Feature: Basic Shape Library
  As an architect or designer
  I want basic geometric and flowchart shapes
  So that I can create general-purpose diagrams

  Scenario: Browse basic shapes in palette
    Given I am on the Design Canvas page
    When I look at the left sidebar palette
    Then I should see a "Basic Shapes" section
    And I should see categories: "Geometric", "Flowchart", "Containers", "Text"
    And each category should display shape icons with labels

  Scenario: Drag rectangle onto canvas
    Given I am viewing the Basic Shapes palette
    When I click and drag the "Rectangle" shape
    And I drop it onto the canvas at position (x: 200, y: 150)
    Then a new rectangle should appear at that position
    And the rectangle should be 120px wide by 80px tall (default size)
    And the rectangle should have a light fill and dark border

  Scenario: Add different shape types
    Given I am on the canvas
    When I drag a "Circle" from the palette and drop it
    Then a circle should appear (100px diameter)
    When I drag a "Diamond" and drop it
    Then a diamond (rotated square) should appear
    When I drag a "Hexagon" and drop it
    Then a hexagon should appear

  Scenario: Shapes have default styling
    Given I add a new Rectangle to the canvas
    Then it should have:
      | Property | Value |
      | Fill | #f0f0f0 (light gray) |
      | Stroke | #333333 (dark gray) |
      | Stroke Width | 2px |
      | Opacity | 1.0 |

  Scenario: Shape palette is collapsible
    Given the shape palette is open
    When I click the collapse icon
    Then the palette should collapse to just icons
    And more canvas space should be available
    When I click to expand
    Then labels should reappear`,
      storyPoints: 5,
      status: "backlog" as const,
      priority: "high" as const,
      assignee: null,
      feature: "Design Canvas - Shape Library",
      value: "Enables basic diagramming without framework dependencies",
      requirement: "TRS-CANVAS-001, TDS-CANVAS-002",
    },
    {
      id: "US-CVS-011",
      epicId: "EPIC-IDE-02",
      title: "Connection Routing (Orthogonal & Straight)",
      description: `**As an** architect or designer
**I want** connections between shapes to route intelligently (orthogonal or straight)
**So that** my diagrams look professional and connections don't overlap shapes

**Context**:
This story implements smart connection routing between shapes. Unlike basic point-to-point arrows, this provides:
- **Orthogonal (Elbow) routing**: 90° angles, most common in technical diagrams
- **Straight routing**: Direct line between shapes
- **Auto-routing**: Connections update when shapes move

**Connection Types**:
1. **Straight Arrow**: Direct line from source to target
2. **Orthogonal (Elbow)**: Right-angle bends, avoids center-to-center overlap
3. **Dashed Line**: For optional/planned connections
4. **Bidirectional**: Arrow heads on both ends

**Routing Algorithm**:
- Detect which sides of shapes to connect (top, right, bottom, left)
- Calculate path with minimal bends
- Avoid overlapping the shape boundaries
- Update dynamically as shapes move`,
      acceptanceCriteria: `Feature: Connection Routing
  As an architect or designer
  I want intelligent connection routing between shapes
  So that my diagrams are professional and readable

  Scenario: Create straight connection
    Given I have two rectangles on the canvas: "Rect A" and "Rect B"
    When I click "Rect A"
    And I click the connection tool (or press "C")
    And I click "Rect B"
    Then a straight arrow should appear connecting them
    And the arrow should go from the edge of Rect A to the edge of Rect B
    And the arrow should have a clear arrowhead pointing to Rect B

  Scenario: Create orthogonal (elbow) connection
    Given I have two shapes: "Shape 1" at (100, 100) and "Shape 2" at (300, 200)
    When I create a connection with routing mode set to "Orthogonal"
    Then the connection should have right-angle bends
    And it should connect at the nearest edges of each shape
    And it should avoid passing through the center of shapes

  Scenario: Connection updates when shape moves
    Given I have a connection between "Shape A" and "Shape B"
    When I drag "Shape A" to a new position
    Then the connection should update in real-time
    And the connection path should recalculate to maintain proper routing
    And the connection should remain attached to "Shape A"

  Scenario: Connection style options
    Given I have selected a connection between two shapes
    When I right-click the connection (future: properties panel)
    Then I should be able to change:
      | Property | Options |
      | Line Type | Solid, Dashed, Dotted |
      | Arrow Style | None, Single, Bidirectional |
      | Color | Color picker |
      | Thickness | 1px, 2px, 3px, 4px |

  Scenario: Delete connection
    Given I have a connection between two shapes
    When I click to select the connection
    And I press "Delete" or "Backspace"
    Then the connection should be removed from the canvas
    But the connected shapes should remain

  Scenario: Connection routing algorithm
    Given "Shape A" is positioned to the left of "Shape B"
    When I create an orthogonal connection
    Then the connection should:
      - Exit from the right edge of Shape A
      - Enter from the left edge of Shape B
      - Use 1-2 bends if shapes are not horizontally aligned
      - Maintain a minimum 20px clearance from shape corners

  Scenario: Multi-connection support
    Given I have "Shape A" on the canvas
    When I create connections from Shape A to Shape B, Shape C, and Shape D
    Then all three connections should be visible
    And each should route independently
    And connections should not overlap if possible`,
      storyPoints: 5,
      status: "backlog" as const,
      priority: "high" as const,
      assignee: null,
      feature: "Design Canvas - Connections",
      value: "Professional diagram appearance with smart routing",
      requirement: "TRS-CANVAS-001, TDS-CANVAS-002",
    },
  ];
  
  // Insert stories
  let createdCount = 0;
  
  for (const story of newStories) {
    try {
      const existing = await db.select().from(userStories).where(eq(userStories.id, story.id)).limit(1);
      
      if (existing.length === 0) {
        await db.insert(userStories).values(story);
        console.log(`✅ Created ${story.id}: ${story.title}`);
        console.log(`   → Points: ${story.storyPoints} | Epic: ${story.epicId}`);
        createdCount++;
      } else {
        console.log(`⚠️  ${story.id} already exists, skipping`);
      }
    } catch (error) {
      console.error(`❌ Error creating ${story.id}:`, error);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Stories Created: ${createdCount}`);
  console.log(`   Total Points: ${newStories.reduce((sum, s) => sum + s.storyPoints, 0)}`);
  console.log(`   Epic: EPIC-IDE-02 (Modeling Canvas Engine)`);
  console.log(`\n🎯 Minimal Canvas (Option C) - Ready to Build:`);
  console.log(`   US-CVS-001: Infinite Canvas Pan/Zoom (8 pts)`);
  console.log(`   US-CVS-004: Basic Shape Drag & Drop (8 pts)`);
  console.log(`   US-CVS-010: Basic Shape Library (5 pts) ✨ NEW`);
  console.log(`   US-CVS-006: Connection Creation (10 pts)`);
  console.log(`   US-CVS-011: Connection Routing (5 pts) ✨ NEW`);
  console.log(`   US-CVS-008: Multi-Selection (5 pts)`);
  console.log(`   ----------------------------------------`);
  console.log(`   TOTAL: 41 points (6 stories)`);
  console.log(`\n🚀 Next: Update implementation plan & start building!`);
}

seedCanvasBasicShapesStories()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Failed:", error);
    process.exit(1);
  });

