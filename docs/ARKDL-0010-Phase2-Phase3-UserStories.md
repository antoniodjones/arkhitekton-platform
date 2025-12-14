# ARKDL-0010: ArchLens — Phase 2 & Phase 3 User Stories
## Detailed Requirements with Gherkin Acceptance Criteria

---

| Field | Value |
|-------|-------|
| **Document ID** | ARKDL-0010-P2P3 |
| **Version** | 1.0 |
| **Date** | December 2024 |
| **Parent Document** | ARKDL-0010 |
| **Status** | Draft |

---

## Table of Contents

1. [Phase 2: Intelligence](#phase-2-intelligence)
   - EPIC-AL-03: Version Comparison
   - EPIC-AL-04: Impact Analysis & Heatmaps
2. [Phase 3: Collaboration](#phase-3-collaboration)
   - EPIC-AL-05: AI Change Insights
   - EPIC-AL-06: Collaboration Timeline
3. [Story Point Summary](#story-point-summary)

---

# Phase 2: Intelligence

*Adds analytical capabilities that go beyond simple history viewing.*

---

## EPIC-AL-03: Version Comparison

**Objective**: Enable visual comparison between element versions with multiple comparison modes.

**User Value**: Architects can visually understand exactly what changed between any two versions.

### High-Level Requirements

| HLR ID | Requirement | Priority |
|--------|-------------|----------|
| HLR-AL-020 | The system shall provide visual diff between two element versions. | Must |
| HLR-AL-021 | Comparison modes shall include: Side-by-side, Overlay, and Unified. | Should |
| HLR-AL-022 | Users shall be able to compare across branches. | Should |
| HLR-AL-023 | Changed properties shall be highlighted with add/modify/delete indicators. | Must |
| HLR-AL-024 | Users shall be able to compare the current state with any historical commit. | Must |
| HLR-AL-025 | The system shall support comparing two arbitrary commits. | Should |

---

### US-AL-020: Compare Element with Previous Version

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to compare an element's current state with its previous version, so that I can see exactly what changed in the last commit. |
| **Story Points** | 5 |
| **Priority** | Must |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Compare with Previous Version
  As an architect
  I want to quickly compare the current state with the previous version
  So that I can understand recent changes at a glance

  Background:
    Given I am viewing an architecture model
    And I have selected the element "DataLakehouse"
    And the element has at least 2 versions in history

  Scenario: Quick compare with previous version
    When I press "Cmd+D" (Mac) or "Ctrl+D" (Windows)
    Then the Compare View should open
    And the left panel should show the previous version
    And the right panel should show the current version
    And changed properties should be highlighted

  Scenario: Compare from context menu
    Given I right-click on "DataLakehouse"
    When I select "ArchLens" > "Compare with Previous"
    Then the Compare View should open showing previous vs current

  Scenario: Compare from history panel
    Given I am viewing the History tab in Properties Panel
    When I click the compare icon next to a commit entry
    Then the Compare View should open
    And it should compare that commit with the current state

  Scenario: No previous version available
    Given the element "NewElement" has only 1 version (just created)
    When I try to compare with previous
    Then I should see a message "No previous version available"
    And I should be offered to view current state details instead
```

---

### US-AL-021: Side-by-Side Comparison View

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to view two versions side-by-side, so that I can easily scan differences between them. |
| **Story Points** | 8 |
| **Priority** | Must |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Side-by-Side Comparison
  As an architect
  I want to see two versions displayed next to each other
  So that I can compare them visually

  Background:
    Given I am in the Compare View
    And I am comparing version "aa1bb2c" with version "a7f3e2d"

  Scenario: Display side-by-side layout
    Then I should see a split view with two panels
    And the left panel should be labeled "aa1bb2c (Dec 10)"
    And the right panel should be labeled "a7f3e2d (Dec 13) - Current"
    And both panels should show the same property list

  Scenario: Highlight changed properties
    Given the "status" property changed from "Approved" to "Deployed"
    Then the "status" row should be highlighted in both panels
    And the left panel should show "Approved" with yellow background
    And the right panel should show "Deployed" with green background

  Scenario: Highlight added properties
    Given the "encryption" property was added in the newer version
    Then the left panel should show an empty row for "encryption"
    And the right panel should show "AES-256" with green background
    And the row should have a "+" indicator

  Scenario: Highlight deleted properties
    Given the "legacyField" property was removed in the newer version
    Then the left panel should show "legacyField" with red background
    And the right panel should show an empty row
    And the row should have a "−" indicator

  Scenario: Synchronized scrolling
    Given there are more than 20 properties
    When I scroll in the left panel
    Then the right panel should scroll in sync
    And corresponding properties should remain aligned
```

---

### US-AL-022: Overlay Comparison Mode

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to see changes overlaid on a single view, so that I can focus on what changed without visual splitting. |
| **Story Points** | 5 |
| **Priority** | Should |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Overlay Comparison Mode
  As an architect
  I want to see changes highlighted on a single element view
  So that I can understand changes in context

  Background:
    Given I am in the Compare View
    And I have selected "Overlay" mode from the view toggle

  Scenario: Display overlay with inline changes
    Then I should see a single element view
    And changed properties should show both old and new values
    And the format should be: "old value → new value"

  Scenario: Color coding in overlay mode
    Given the "status" property changed from "Approved" to "Deployed"
    Then I should see "Approved → Deployed" in the status row
    And "Approved" should be styled with strikethrough and red color
    And "Deployed" should be styled with green color

  Scenario: Added properties in overlay
    Given "encryption" was added
    Then I should see "+ encryption: AES-256"
    And the entire row should have a green tint

  Scenario: Deleted properties in overlay
    Given "legacyField" was removed
    Then I should see "− legacyField: oldValue"
    And the entire row should have a red tint with strikethrough

  Scenario: Toggle between comparison modes
    When I click the mode toggle
    Then I should see options: "Side-by-Side", "Overlay", "Unified"
    And clicking each should switch the view immediately
```

---

### US-AL-023: Unified Diff View

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to see a unified list of all changes, so that I can quickly scan only what's different. |
| **Story Points** | 5 |
| **Priority** | Should |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Unified Diff View
  As an architect
  I want a focused list showing only changes
  So that I can quickly understand the delta without noise

  Background:
    Given I am in the Compare View
    And I have selected "Unified" mode

  Scenario: Display only changed properties
    Given the element has 15 properties
    And only 3 properties changed between versions
    Then I should see only 3 rows in the unified view
    And unchanged properties should not be displayed

  Scenario: Unified diff format
    Then each change should display:
      | Field          | Example                          |
      | Property name  | status                           |
      | Change type    | Modified                         |
      | Old value      | Approved                         |
      | New value      | Deployed                         |
      | Commit         | a7f3e2d                          |
      | Author         | EA Team                          |

  Scenario: Group changes by type
    Given there are added, modified, and deleted properties
    Then changes should be grouped:
      | Group     | Header                    |
      | Added     | "+ Added (2 properties)"  |
      | Modified  | "~ Modified (3 properties)"|
      | Deleted   | "− Deleted (1 property)"  |

  Scenario: Expand/collapse change groups
    When I click on a group header
    Then the group should collapse/expand
    And the count badge should remain visible when collapsed
```

---

### US-AL-024: Compare Across Branches

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to compare an element between branches, so that I can understand how feature branches diverge from main. |
| **Story Points** | 8 |
| **Priority** | Should |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Cross-Branch Comparison
  As an architect
  I want to compare element versions across branches
  So that I can review branch changes before merging

  Background:
    Given I am in the Compare View
    And the element "DataLakehouse" exists on branches "main" and "feature/data-platform"

  Scenario: Select branches for comparison
    When I click "Select versions to compare"
    Then I should see a branch selector dropdown
    And I can select "main" for the left panel
    And I can select "feature/data-platform" for the right panel

  Scenario: Display branch labels
    Given I am comparing "main" with "feature/data-platform"
    Then the left panel header should show "main @ a7f3e2d"
    And the right panel header should show "feature/data-platform @ w1x2y3z"
    And branch names should be color-coded by branch color

  Scenario: Show common ancestor
    Given the branches diverged from commit "e9d2f7a"
    Then I should see an info banner: "Common ancestor: e9d2f7a (Dec 11)"
    And clicking the banner should show the element state at that point

  Scenario: Compare with merge preview
    When I click "Preview Merge"
    Then I should see three columns:
      | Column         | Content                        |
      | Base           | Common ancestor state          |
      | Source         | Feature branch state           |
      | Target         | Main branch state              |
    And conflicts (if any) should be highlighted in red
```

---

### US-AL-025: Compare Arbitrary Commits

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to compare any two commits in history, so that I can understand evolution between any two points in time. |
| **Story Points** | 5 |
| **Priority** | Should |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Arbitrary Commit Comparison
  As an architect
  I want to pick any two points in history to compare
  So that I can analyze changes over any time period

  Background:
    Given I am viewing the Element History page for "DataLakehouse"
    And the element has 7 commits in history

  Scenario: Select two commits for comparison
    When I hold Shift and click on commit "dd3ee4f"
    And I Shift+click on commit "a7f3e2d"
    Then both commits should be selected (highlighted)
    And a "Compare Selected" button should appear
    When I click "Compare Selected"
    Then the Compare View should open
    And it should compare dd3ee4f (older) with a7f3e2d (newer)

  Scenario: Comparison order (older on left)
    Given I selected commits in order: newer first, older second
    Then the Compare View should still show older on left
    And newer on right
    And a note should say "Showing chronological order"

  Scenario: Date range indicator
    Given I am comparing commits from Dec 8 and Dec 13
    Then a header should show "5 days of changes"
    And list intermediate commits: "3 commits between selected points"
```

---

## EPIC-AL-04: Impact Analysis & Heatmaps

**Objective**: Provide AI-powered impact analysis and activity visualization.

**User Value**: Architects understand the consequences of changes before making them and can identify hotspots.

### High-Level Requirements

| HLR ID | Requirement | Priority |
|--------|-------------|----------|
| HLR-AL-030 | The system shall analyze and display impact of proposed changes. | Must |
| HLR-AL-031 | Impact analysis shall include upstream and downstream dependencies. | Must |
| HLR-AL-032 | The system shall provide activity heatmaps showing change frequency. | Should |
| HLR-AL-033 | Heatmaps shall be configurable by time window and author. | Should |
| HLR-AL-034 | AI shall provide severity scoring for change impacts. | Should |
| HLR-AL-035 | The system shall warn before committing high-impact changes. | Must |

---

### US-AL-030: View Impact Analysis Before Commit

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to see what will be affected by my changes before committing, so that I can avoid unintended consequences. |
| **Story Points** | 8 |
| **Priority** | Must |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Pre-Commit Impact Analysis
  As an architect
  I want to understand the impact of my changes before committing
  So that I can make informed decisions and avoid breaking things

  Background:
    Given I have made changes to the element "DataLakehouse"
    And I am about to commit my changes

  Scenario: Display impact analysis on commit
    When I click "Commit Changes"
    Then an Impact Analysis panel should appear
    And it should show:
      | Section                  | Content                              |
      | Direct Dependencies      | Elements that reference DataLakehouse|
      | Downstream Impact        | Elements affected transitively       |
      | Affected Views           | Diagrams containing this element     |
      | Risk Assessment          | Low/Medium/High impact score         |

  Scenario: Show upstream dependencies
    Given "MLPlatform" and "AnalyticsDashboard" reference "DataLakehouse"
    Then the "Direct Dependencies" section should list:
      | Element              | Relationship  | Risk      |
      | MLPlatform           | uses          | Medium    |
      | AnalyticsDashboard   | serves        | Low       |

  Scenario: Show downstream cascade
    Given "ReportingService" depends on "AnalyticsDashboard"
    Then the "Downstream Impact" section should show:
      | Element              | Path                                    |
      | ReportingService     | DataLakehouse → AnalyticsDashboard → ReportingService |

  Scenario: Display risk scoring
    Given my changes affect 5 dependent elements
    Then the Risk Assessment should show "Medium Impact"
    And display: "5 elements may be affected by this change"
    And show a visual gauge from Low to High

  Scenario: Proceed or cancel commit
    Given the Impact Analysis is displayed
    When I click "Commit Anyway"
    Then the commit should proceed
    And the impact analysis should be logged with the commit
    When I click "Cancel"
    Then the commit should be cancelled
    And I should return to editing mode
```

---

### US-AL-031: Dependency Graph Visualization

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to see a visual graph of element dependencies, so that I can understand the relationship network. |
| **Story Points** | 8 |
| **Priority** | Should |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Dependency Graph
  As an architect
  I want to visualize the dependency network of an element
  So that I can understand its connections at a glance

  Background:
    Given I am viewing the Impact Analysis for "DataLakehouse"
    And I click "View Dependency Graph"

  Scenario: Display dependency graph
    Then I should see a visual graph with:
      | Node Type    | Representation                    |
      | Current      | Central node, highlighted orange  |
      | Upstream     | Nodes positioned above/left       |
      | Downstream   | Nodes positioned below/right      |
      | Edges        | Arrows showing relationship type  |

  Scenario: Graph interactivity
    When I hover over an edge
    Then I should see the relationship type (e.g., "uses", "serves")
    When I click on a dependent node
    Then I should see that element's summary popup
    And option to "Navigate to Element"

  Scenario: Depth control
    Given the full dependency tree has 4 levels
    Then I should see a depth slider (1-4)
    And default should show 2 levels
    When I increase to 3 levels
    Then additional nodes should appear with animation

  Scenario: Filter by relationship type
    When I click "Filter" and select only "uses" relationships
    Then only "uses" edges and their connected nodes should display
    And other relationships should be hidden
```

---

### US-AL-032: Activity Heatmap on Canvas

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to see a heatmap overlay on the canvas showing change frequency, so that I can identify volatile areas of the architecture. |
| **Story Points** | 8 |
| **Priority** | Should |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Activity Heatmap
  As an architect
  I want to visualize which elements change most frequently
  So that I can identify areas that may need stabilization

  Background:
    Given I am viewing an architecture model on the canvas
    And ArchLens is enabled

  Scenario: Enable heatmap overlay
    When I click the ArchLens icon in Activity Bar
    And I select "Show Activity Heatmap"
    Then all elements on the canvas should display color-coded overlays
    And the color should indicate change frequency

  Scenario: Heatmap color scale
    Then elements should be colored according to:
      | Frequency       | Color        | Description          |
      | 10+ changes/week| Red (#EF4444)| Very High activity   |
      | 5-10/week       | Orange       | High activity        |
      | 2-5/week        | Yellow       | Medium activity      |
      | 1/week          | Green        | Low activity         |
      | 0/week          | Blue         | Stable               |

  Scenario: Display legend
    Given the heatmap is active
    Then I should see a legend in the corner showing:
      | Color  | Label                |
      | Red    | Very High (10+/week) |
      | Orange | High (5-10/week)     |
      | Yellow | Medium (2-5/week)    |
      | Green  | Low (1/week)         |
      | Blue   | Stable (0/week)      |

  Scenario: Hover for details
    Given the heatmap is active
    When I hover over an element colored orange
    Then I should see a tooltip:
      | Field              | Example            |
      | Element            | DataLakehouse      |
      | Changes this week  | 7                  |
      | Changes this month | 15                 |
      | Top contributors   | D. Patel (4), A. Wong (3) |

  Scenario: Configure time window
    When I click "Heatmap Settings"
    Then I should see time window options:
      | Option      |
      | Last 7 days |
      | Last 30 days|
      | Last 90 days|
      | Custom range|
    When I select "Last 30 days"
    Then the heatmap colors should recalculate based on 30-day data
```

---

### US-AL-033: Filter Heatmap by Author

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to filter the heatmap by author, so that I can see which areas each team member has been working on. |
| **Story Points** | 5 |
| **Priority** | Should |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Author-Filtered Heatmap
  As an architect
  I want to see activity from specific authors
  So that I can understand contribution patterns

  Background:
    Given the activity heatmap is displayed
    And multiple authors have made changes

  Scenario: Filter by single author
    When I open heatmap filters
    And I select author "D. Patel"
    Then only elements changed by D. Patel should show heat colors
    And other elements should be grayed out or blue (stable)

  Scenario: Filter by multiple authors
    When I select authors "D. Patel" and "A. Wong"
    Then elements changed by either author should show heat colors
    And the tooltip should show contribution breakdown

  Scenario: Filter by team
    Given users belong to teams (Data Platform, Security, Cloud)
    When I select team "Data Platform"
    Then only elements changed by Data Platform members should show heat

  Scenario: Clear filters
    Given I have author filters applied
    When I click "Clear Filters"
    Then the heatmap should show all activity from all authors
```

---

### US-AL-034: Change Hotspot Alerts

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to receive alerts about elements with unusually high change frequency, so that I can investigate potential issues. |
| **Story Points** | 5 |
| **Priority** | Should |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Hotspot Alerts
  As an architect
  I want automatic detection of volatile elements
  So that I can proactively address instability

  Background:
    Given ArchLens is analyzing change patterns
    And element "DataLakehouse" has changed 12 times in 2 weeks

  Scenario: Display hotspot indicator
    Then "DataLakehouse" should have a hotspot badge (🔥)
    And the badge should pulse to draw attention
    And hovering should show: "High activity: 12 changes in 14 days"

  Scenario: Hotspot summary in ArchLens panel
    When I open the ArchLens panel in Activity Bar
    Then I should see a "Hotspots" section
    And it should list elements with above-threshold activity:
      | Element        | Changes | Period  | Trend    |
      | DataLakehouse  | 12      | 14 days | ↑ Rising |
      | KafkaCluster   | 8       | 14 days | → Stable |

  Scenario: Configure hotspot threshold
    When I open ArchLens settings
    Then I should see "Hotspot Threshold" setting
    And I can set: "Alert when changes exceed X in Y days"
    And default should be: "5 changes in 7 days"

  Scenario: Drill into hotspot history
    Given I click on a hotspot element
    Then I should see its full change history
    And a chart showing change frequency over time
    And AI insight: "This element may need architectural review"
```

---

# Phase 3: Collaboration

*Transforms ArchLens into a team collaboration and AI insight tool.*

---

## EPIC-AL-05: AI Change Insights

**Objective**: Provide AI-generated insights about change patterns and recommendations.

**User Value**: Architects receive proactive guidance about architecture evolution.

### High-Level Requirements

| HLR ID | Requirement | Priority |
|--------|-------------|----------|
| HLR-AL-040 | The system shall detect and surface change patterns. | Must |
| HLR-AL-041 | AI shall provide recommendations based on change history. | Should |
| HLR-AL-042 | The system shall suggest when ADRs might be warranted. | Should |
| HLR-AL-043 | AI shall identify co-change correlations between elements. | Should |
| HLR-AL-044 | The system shall detect potential architectural debt. | Should |

---

### US-AL-040: AI Pattern Detection

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want AI to detect patterns in change history, so that I can understand trends without manual analysis. |
| **Story Points** | 8 |
| **Priority** | Must |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: AI Pattern Detection
  As an architect
  I want AI to analyze and surface change patterns
  So that I can benefit from automated insights

  Background:
    Given ArchLens AI analysis is enabled
    And sufficient change history exists (30+ days)

  Scenario: Detect oscillating values
    Given the "technology" property has changed:
      | Date   | Value          |
      | Dec 1  | Delta Lake     |
      | Dec 5  | Iceberg        |
      | Dec 8  | Delta Lake     |
      | Dec 12 | Delta + Iceberg|
    Then AI should detect pattern: "Oscillating values"
    And surface insight: "The 'technology' property has alternated between values 3 times. This may indicate unresolved technical decision."
    And suggest: "Consider documenting an ADR to stabilize this choice."

  Scenario: Detect frequent small changes
    Given an element has 15 changes in 10 days
    And each change modified only 1-2 properties
    Then AI should detect pattern: "Incremental refinement"
    And surface insight: "This element is being refined frequently. Consider batching changes or establishing target state."

  Scenario: Detect abandoned elements
    Given an element was created 60 days ago
    And has only 1 commit (creation)
    And status is still "Proposed"
    Then AI should detect pattern: "Stale element"
    And surface insight: "This element was created 60 days ago but hasn't progressed. Consider reviewing or archiving."

  Scenario: Detect co-change correlation
    Given elements A, B, and C are changed together in 80% of commits
    Then AI should detect pattern: "Co-change cluster"
    And surface insight: "These 3 elements change together 80% of the time. Consider grouping them into a component."
```

---

### US-AL-041: Proactive Recommendations

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want AI to provide actionable recommendations, so that I can improve architecture quality. |
| **Story Points** | 8 |
| **Priority** | Should |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: AI Recommendations
  As an architect
  I want actionable recommendations based on patterns
  So that I can take concrete steps to improve

  Background:
    Given AI has analyzed the architecture and change history

  Scenario: Display recommendations in ArchLens panel
    When I open the ArchLens panel
    Then I should see an "AI Insights" section
    And it should display prioritized recommendations:
      | Priority | Recommendation                                           |
      | High     | "DataLakehouse needs ADR: technology decision unstable"  |
      | Medium   | "Consider extracting KafkaConfig into separate element"  |
      | Low      | "SecurityPolicy hasn't been reviewed in 90 days"         |

  Scenario: Recommendation details
    When I click on a recommendation
    Then I should see:
      | Field          | Content                                          |
      | Summary        | The recommendation text                          |
      | Evidence       | Data supporting this recommendation              |
      | Suggested action| Concrete next step                              |
      | Dismiss option | "Dismiss" / "Snooze for 30 days" / "Resolved"   |

  Scenario: ADR suggestion
    Given AI detected oscillating technology decisions
    When I view the recommendation
    Then I should see "Create ADR" button
    When I click "Create ADR"
    Then a new ADR document should be created
    And pre-populated with:
      | Field      | Content                                    |
      | Title      | "ADR: DataLakehouse Technology Selection"  |
      | Context    | Auto-filled from change history            |
      | Options    | List of values that were tried             |
      | Decision   | Current value (to be confirmed)            |

  Scenario: Dismiss recommendation
    When I click "Dismiss" on a recommendation
    Then I should select a reason:
      | Option                    |
      | Not applicable            |
      | Already addressed         |
      | Will address later        |
      | Disagree with suggestion  |
    And the recommendation should be hidden
    And logged for analytics
```

---

### US-AL-042: Architecture Debt Detection

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want AI to identify potential architectural debt, so that I can address issues before they compound. |
| **Story Points** | 8 |
| **Priority** | Should |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Architecture Debt Detection
  As an architect
  I want visibility into accumulating technical debt
  So that I can prioritize remediation

  Background:
    Given AI analysis is running continuously

  Scenario: Detect complexity debt
    Given an element has grown to 25+ properties
    Then AI should flag: "Complexity debt"
    And insight: "DataLakehouse has 27 properties. Consider decomposing into smaller elements."

  Scenario: Detect orphaned elements
    Given an element has no incoming or outgoing relationships
    Then AI should flag: "Orphaned element"
    And insight: "LegacyAdapter has no connections. It may be unused or missing relationships."

  Scenario: Detect circular dependencies
    Given Element A → B → C → A
    Then AI should flag: "Circular dependency"
    And insight: "Circular dependency detected: A → B → C → A. This may cause maintenance issues."
    And show visual diagram of the cycle

  Scenario: Debt dashboard
    When I navigate to "ArchLens" > "Debt Dashboard"
    Then I should see:
      | Debt Type          | Count | Trend     |
      | Complexity         | 3     | ↑ Rising  |
      | Orphaned Elements  | 5     | → Stable  |
      | Circular Deps      | 1     | ↓ Falling |
      | Stale Elements     | 8     | ↑ Rising  |
    And total debt score: "Medium (23 items)"
```

---

### US-AL-043: Co-Change Analysis

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to see which elements frequently change together, so that I can identify hidden dependencies. |
| **Story Points** | 5 |
| **Priority** | Should |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Co-Change Analysis
  As an architect
  I want to identify elements that change together
  So that I can discover implicit coupling

  Background:
    Given I am viewing the ArchLens Co-Change report
    And sufficient commit history exists

  Scenario: Display co-change matrix
    Then I should see a correlation matrix showing:
      | Element A      | Element B         | Correlation |
      | DataLakehouse  | KafkaCluster      | 85%         |
      | DataLakehouse  | MLPlatform        | 70%         |
      | KafkaCluster   | StreamProcessor   | 92%         |

  Scenario: Visualize co-change clusters
    When I click "View Clusters"
    Then I should see a cluster diagram
    And elements that change together should be grouped
    And cluster boundaries should be visually distinct

  Scenario: Explain correlation
    When I click on a correlation entry
    Then I should see:
      | Field              | Content                              |
      | Co-change count    | "Changed together in 17 of 20 commits"|
      | Sample commits     | List of commits where both changed   |
      | AI interpretation  | "These elements have implicit coupling. Consider formalizing with a relationship." |

  Scenario: Suggest component extraction
    Given a cluster of 4+ elements with 80%+ correlation
    Then AI should suggest: "These elements form a cohesive unit. Consider extracting as a named component."
```

---

## EPIC-AL-06: Collaboration Timeline

**Objective**: Provide real-time visibility into team architecture activity.

**User Value**: Teams have shared awareness of architecture evolution and can coordinate effectively.

### High-Level Requirements

| HLR ID | Requirement | Priority |
|--------|-------------|----------|
| HLR-AL-050 | The system shall display real-time activity feed. | Must |
| HLR-AL-051 | Users shall see presence indicators for active editors. | Must |
| HLR-AL-052 | The system shall support architecture review workflows. | Should |
| HLR-AL-053 | Activity feed shall be filterable by author, element, and time. | Should |
| HLR-AL-054 | The system shall support commenting on commits and elements. | Should |

---

### US-AL-050: Real-Time Activity Feed

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to see real-time activity from my team, so that I stay aware of architecture changes as they happen. |
| **Story Points** | 8 |
| **Priority** | Must |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Real-Time Activity Feed
  As an architect
  I want to see what my teammates are doing in real-time
  So that I can stay informed and avoid conflicts

  Background:
    Given I am viewing the architecture model
    And ArchLens Collaboration is enabled
    And team members are actively working

  Scenario: Display activity feed in panel
    When I open the ArchLens panel
    And I click the "Activity" tab
    Then I should see a real-time activity feed
    And new activities should appear at the top
    And each entry should show:
      | Field     | Example                              |
      | Avatar    | User profile image                   |
      | Author    | D. Patel                             |
      | Action    | "modified DataLakehouse"             |
      | Time      | "Just now" / "2 minutes ago"         |
      | Details   | "Changed status from Approved to Deployed" |

  Scenario: Live updates without refresh
    Given the activity feed is open
    When a teammate commits a change
    Then a new entry should appear immediately
    And a subtle animation should highlight the new entry
    And a sound notification should play (if enabled)

  Scenario: Click to navigate
    When I click on an activity entry
    Then the canvas should navigate to the affected element
    And the element should be selected and highlighted
    And the Properties Panel should open showing the change

  Scenario: Group related activities
    Given a teammate made 5 changes in 1 minute
    Then activities should be grouped: "D. Patel made 5 changes"
    And expanding should show individual changes
```

---

### US-AL-051: Presence Indicators

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to see who else is viewing or editing the model, so that I can coordinate and avoid conflicts. |
| **Story Points** | 5 |
| **Priority** | Must |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Presence Indicators
  As an architect
  I want to see who is currently in the model
  So that I can coordinate with them

  Background:
    Given I am viewing an architecture model
    And 3 other team members are also viewing

  Scenario: Display active users
    Then I should see presence avatars in the header/toolbar
    And each avatar should show the user's profile picture
    And hovering should show their name and status

  Scenario: Show user cursors on canvas
    Given "A. Wong" is also viewing the canvas
    Then I should see a colored cursor for A. Wong
    And the cursor should have a name label
    And the cursor should move in real-time as they navigate

  Scenario: Show user focus
    Given "A. Wong" has selected "KafkaCluster"
    Then "KafkaCluster" should have a colored ring matching A. Wong's color
    And a label should show "A. Wong is viewing"

  Scenario: Show editing indicator
    Given "D. Patel" is editing "DataLakehouse"
    Then "DataLakehouse" should show an edit indicator
    And the indicator should pulse
    And hovering should show "D. Patel is editing..."

  Scenario: Conflict prevention
    Given "D. Patel" is editing "DataLakehouse"
    When I try to edit "DataLakehouse"
    Then I should see a warning: "D. Patel is currently editing this element"
    And I can choose: "Wait" / "Edit Anyway (may cause conflicts)"
```

---

### US-AL-052: Architecture Review Workflow

| Field | Value |
|-------|-------|
| **Story** | As an architecture team lead, I want to request and manage reviews of architecture changes, so that changes are validated before deployment. |
| **Story Points** | 8 |
| **Priority** | Should |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Architecture Review Workflow
  As an architecture team lead
  I want to review changes before they're finalized
  So that architecture quality is maintained

  Background:
    Given I am an architecture reviewer
    And team members can request reviews

  Scenario: Request a review
    Given I have made changes to 5 elements
    When I click "Request Review" in the commit dialog
    Then I should select reviewers from my team
    And add a description of the changes
    And submit the review request

  Scenario: Review notification
    Given a review has been requested from me
    Then I should receive a notification
    And the notification should show:
      | Field       | Content                                |
      | Requester   | D. Patel                               |
      | Elements    | 5 elements changed                     |
      | Summary     | "Data platform architecture updates"   |
      | Link        | "View Changes"                         |

  Scenario: Review interface
    When I open the review
    Then I should see:
      | Section        | Content                              |
      | Summary        | List of changed elements             |
      | Diff view      | Before/after for each element        |
      | Comments       | Thread for discussion                |
      | Actions        | Approve / Request Changes / Reject   |

  Scenario: Add review comments
    When I click on a specific change
    Then I can add an inline comment
    And the comment should tag the change author
    And the author should be notified

  Scenario: Approve review
    When I click "Approve"
    Then the review status should change to "Approved"
    And the requester should be notified
    And the changes should be marked as "Reviewed"

  Scenario: Request changes
    When I click "Request Changes"
    Then I must provide feedback
    And the requester should be notified
    And the status should change to "Changes Requested"
```

---

### US-AL-053: Comment on Elements and Commits

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to comment on elements and commits, so that I can discuss changes with my team asynchronously. |
| **Story Points** | 5 |
| **Priority** | Should |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Commenting System
  As an architect
  I want to discuss changes with comments
  So that I can collaborate asynchronously

  Background:
    Given I am viewing an architecture model
    And the commenting feature is enabled

  Scenario: Add comment to element
    When I right-click on "DataLakehouse"
    And I select "Add Comment"
    Then a comment input should appear
    And I can type my comment
    And I can @mention teammates
    When I submit the comment
    Then it should appear attached to the element
    And mentioned teammates should be notified

  Scenario: View element comments
    Given "DataLakehouse" has 3 comments
    Then I should see a comment indicator (💬3) on the element
    When I click the indicator
    Then a comment thread should open
    And comments should be ordered chronologically

  Scenario: Reply to comment
    Given I am viewing a comment thread
    When I click "Reply"
    Then I can type a response
    And the original commenter should be notified

  Scenario: Comment on commit
    When I view a commit in history
    Then I should see "Add Comment" option
    And I can comment on the overall commit
    And the comment should appear in commit details

  Scenario: Resolve comment thread
    Given I am the thread owner or a reviewer
    When I click "Resolve"
    Then the thread should collapse
    And show "Resolved by [name]"
    And it can be reopened if needed
```

---

### US-AL-054: Filter Activity Feed

| Field | Value |
|-------|-------|
| **Story** | As an architect, I want to filter the activity feed, so that I can focus on relevant updates. |
| **Story Points** | 3 |
| **Priority** | Should |
| **Acceptance Criteria** | See Gherkin below |

```gherkin
Feature: Activity Feed Filters
  As an architect
  I want to filter the activity feed
  So that I see only what's relevant to me

  Background:
    Given the activity feed is open
    And there are many activities

  Scenario: Filter by author
    When I click "Filter" and select author "D. Patel"
    Then only activities from D. Patel should display

  Scenario: Filter by element
    When I filter by element "DataLakehouse"
    Then only activities affecting DataLakehouse should display

  Scenario: Filter by time
    When I select "Today" from time filter
    Then only today's activities should display
    Options should include: Today, This Week, This Month, Custom Range

  Scenario: Filter by activity type
    When I filter by type "Commits"
    Then only commit activities should display
    And not comments, reviews, or presence events

  Scenario: Combine filters
    When I set author "D. Patel" AND time "This Week"
    Then only D. Patel's activities from this week should display

  Scenario: Save filter preset
    Given I have configured filters
    When I click "Save as Preset"
    Then I can name the preset (e.g., "My Team This Week")
    And quickly apply it later
```

---

# Story Point Summary

## Phase 2: Intelligence

| EPIC | Story ID | Title | Points |
|------|----------|-------|--------|
| AL-03 | US-AL-020 | Compare Element with Previous Version | 5 |
| AL-03 | US-AL-021 | Side-by-Side Comparison View | 8 |
| AL-03 | US-AL-022 | Overlay Comparison Mode | 5 |
| AL-03 | US-AL-023 | Unified Diff View | 5 |
| AL-03 | US-AL-024 | Compare Across Branches | 8 |
| AL-03 | US-AL-025 | Compare Arbitrary Commits | 5 |
| AL-04 | US-AL-030 | View Impact Analysis Before Commit | 8 |
| AL-04 | US-AL-031 | Dependency Graph Visualization | 8 |
| AL-04 | US-AL-032 | Activity Heatmap on Canvas | 8 |
| AL-04 | US-AL-033 | Filter Heatmap by Author | 5 |
| AL-04 | US-AL-034 | Change Hotspot Alerts | 5 |
| | | **Phase 2 Total** | **70** |

## Phase 3: Collaboration

| EPIC | Story ID | Title | Points |
|------|----------|-------|--------|
| AL-05 | US-AL-040 | AI Pattern Detection | 8 |
| AL-05 | US-AL-041 | Proactive Recommendations | 8 |
| AL-05 | US-AL-042 | Architecture Debt Detection | 8 |
| AL-05 | US-AL-043 | Co-Change Analysis | 5 |
| AL-06 | US-AL-050 | Real-Time Activity Feed | 8 |
| AL-06 | US-AL-051 | Presence Indicators | 5 |
| AL-06 | US-AL-052 | Architecture Review Workflow | 8 |
| AL-06 | US-AL-053 | Comment on Elements and Commits | 5 |
| AL-06 | US-AL-054 | Filter Activity Feed | 3 |
| | | **Phase 3 Total** | **58** |

## Complete ArchLens Summary

| Phase | Focus | Stories | Points |
|-------|-------|---------|--------|
| Phase 1 | Foundation | 11 | 50 |
| Phase 2 | Intelligence | 11 | 70 |
| Phase 3 | Collaboration | 9 | 58 |
| **Total** | | **31** | **178** |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2024 | Arkhitekton Team | Initial Phase 2/3 specifications |

---

*End of Document*
