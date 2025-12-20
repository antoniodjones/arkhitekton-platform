/**
 * Portfolio Management Module - User Stories Part 2
 * Sub-Epic 3: Analytics & Dashboards (12 stories)
 * Sub-Epic 4: Integrations & Dependencies (14 stories)
 */

// ============================================================================
// SUB-EPIC 3: ANALYTICS & DASHBOARDS (12 stories)
// ============================================================================

export const ANALYTICS_STORIES = [
  {
    id: 'US-PORT-027',
    title: 'Portfolio Summary Dashboard',
    storyPoints: 8,
    priority: 'high',
    description: `As an **Executive**,
I want a portfolio summary dashboard with key metrics,
So that I can understand portfolio health at a glance.

**Acceptance Criteria:**
- Initiative count by status (planning, in-progress, completed)
- Application count by lifecycle status
- Budget summary (allocated vs spent)
- Health indicator distribution
- Recent activity feed
- Drill-down capability

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Portfolio Summary Dashboard
  As an Executive
  I want a portfolio dashboard
  So that I can understand portfolio health

  Background:
    Given I am logged in as an Executive
    And the portfolio contains 15 initiatives and 50 applications

  Scenario: View initiative status summary
    Given I am on the Portfolio dashboard
    Then I should see an initiative status widget showing:
      | status | count |
      | Planning | 3 |
      | In Progress | 8 |
      | Completed | 4 |
    And the widget should use a donut chart visualization

  Scenario: View application lifecycle distribution
    Given I am on the Portfolio dashboard
    Then I should see application status distribution:
      | status | count |
      | Active | 35 |
      | Deprecated | 10 |
      | Retired | 5 |
    And I can click a segment to filter the applications list

  Scenario: View budget summary
    Then I should see a budget summary card showing:
      | metric | value |
      | Total Allocated | $5,000,000 |
      | Total Spent | $3,200,000 |
      | Remaining | $1,800,000 |
      | Spent Percentage | 64% |
    And a progress bar should visualize the spend

  Scenario: View health indicator distribution
    Then I should see initiative health distribution:
      | health | count |
      | Green | 10 |
      | Yellow | 4 |
      | Red | 1 |
    And each color should be a clickable filter

  Scenario: Drill down to details
    Given I see "8 In Progress" initiatives
    When I click on that metric
    Then I should navigate to the Initiatives tab
    And the filter should be set to "In Progress"
\`\`\``,
  },
  {
    id: 'US-PORT-028',
    title: 'Initiative Health Heatmap',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Portfolio Manager**,
I want a heatmap showing initiative health by dimension,
So that I can identify problem areas quickly.

**Acceptance Criteria:**
- Matrix view with initiatives on one axis, health dimensions on another
- Color coding: green, yellow, red
- Dimensions: schedule, budget, scope, resources
- Click cell for details
- Export capability

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Initiative Health Heatmap
  As a Portfolio Manager
  I want a health heatmap
  So that I can identify problems quickly

  Background:
    Given there are 10 active initiatives
    And I navigate to Analytics > Health Heatmap

  Scenario: Display heatmap grid
    Then I should see a matrix with:
      | row | initiatives |
      | columns | Schedule, Budget, Scope, Resources |
    And each cell should be color-coded (green/yellow/red)

  Scenario: Identify initiatives with multiple issues
    Given "Digital Transformation" has red in Budget and Scope
    Then the row for "Digital Transformation" should stand out
    And a summary column should show "2 issues"

  Scenario: Click cell for details
    Given I click the Budget cell for "CX Modernization"
    Then a tooltip/modal should show:
      | Budget Allocated | $500,000 |
      | Budget Spent | $480,000 |
      | Remaining | $20,000 |
      | Status | Yellow - 96% spent |

  Scenario: Filter by health status
    When I click "Show only Red"
    Then only initiatives with at least one red dimension should display

  Scenario: Export heatmap
    When I click "Export to Excel"
    Then an Excel file should download
    And it should contain the heatmap data with color-coding
\`\`\``,
  },
  {
    id: 'US-PORT-029',
    title: 'Budget Burn-Down Charts',
    storyPoints: 5,
    priority: 'high',
    description: `As a **Program Manager**,
I want to see budget burn-down charts for initiatives,
So that I can monitor spending against plan.

**Acceptance Criteria:**
- Line chart showing planned vs actual spend over time
- Forecast line based on current burn rate
- Alert when projected overspend
- Monthly/quarterly view toggle
- Multiple initiatives comparison

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Budget Burn-Down Charts
  As a Program Manager
  I want budget burn-down charts
  So that I can monitor spending

  Background:
    Given initiative "Data Platform" has a $600,000 budget
    And it started January 2024 with target end December 2024
    And I am on the Budget Analytics page

  Scenario: View burn-down chart
    Then I should see a line chart with:
      | line | description |
      | Planned | Linear spend from 0 to $600k |
      | Actual | Actual spend points monthly |
    And current month should be highlighted

  Scenario: View forecast projection
    Given current spend is $400k in month 8
    Then a dashed forecast line should project to December
    And the forecast should show "Projected: $600k" (on track)

  Scenario: Alert on projected overspend
    Given current spend is $500k in month 8
    And the forecast projects $750k by December
    Then a warning should display "Projected overspend: $150k"
    And the forecast line should be red

  Scenario: Toggle monthly/quarterly view
    Given I am viewing monthly data
    When I click "Quarterly"
    Then the chart should aggregate to quarterly totals
    And the x-axis should show Q1, Q2, Q3, Q4

  Scenario: Compare multiple initiatives
    When I select "CX Modernization" and "Data Platform"
    Then both burn-down lines should appear on the same chart
    And I can toggle each on/off
\`\`\``,
  },
  {
    id: 'US-PORT-030',
    title: 'Application Criticality Matrix',
    storyPoints: 5,
    priority: 'medium',
    description: `As an **Enterprise Architect**,
I want a criticality vs complexity matrix for applications,
So that I can prioritize modernization efforts.

**Acceptance Criteria:**
- 2D scatter plot (criticality x complexity)
- Quadrant labels (strategic, niche, legacy, commodity)
- Click application to view details
- Bubble size by cost or user count
- Filter by status, type

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Application Criticality Matrix
  As an Enterprise Architect
  I want a criticality matrix
  So that I can prioritize modernization

  Background:
    Given there are 50 applications with criticality and complexity ratings
    And I navigate to Analytics > Application Matrix

  Scenario: Display scatter plot matrix
    Then I should see a 2D chart with:
      | axis | dimension |
      | X | Complexity (Low to High) |
      | Y | Criticality (Low to High) |
    And each application should be a bubble

  Scenario: View quadrant labels
    Then I should see four quadrants labeled:
      | quadrant | meaning |
      | Top-Right | Strategic - High criticality, high complexity |
      | Top-Left | Foundation - High criticality, low complexity |
      | Bottom-Right | Review - Low criticality, high complexity |
      | Bottom-Left | Commodity - Low criticality, low complexity |

  Scenario: Bubble size represents cost
    Given I select "Size by: Annual Cost"
    Then applications with higher costs should have larger bubbles
    And a legend should explain the size scale

  Scenario: Click bubble for details
    When I click on an application bubble
    Then I should see a tooltip with:
      | Application | Order Management |
      | Criticality | Critical |
      | Complexity | High |
      | Annual Cost | $150,000 |
      | Recommendation | Strategic investment |

  Scenario: Filter matrix
    When I filter by status "Active"
    Then only active applications should appear
    And the matrix should re-render with filtered data
\`\`\``,
  },
  {
    id: 'US-PORT-031',
    title: 'Technology Stack Distribution',
    storyPoints: 5,
    priority: 'medium',
    description: `As an **Enterprise Architect**,
I want to see technology stack distribution across applications,
So that I can identify standardization opportunities.

**Acceptance Criteria:**
- Bar/pie chart by technology category
- Drill-down to see applications using each technology
- Trend over time (adoption/decline)
- Highlight non-standard technologies
- Export capability

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Technology Stack Distribution
  As an Enterprise Architect
  I want technology distribution charts
  So that I can standardize technology choices

  Background:
    Given there are 50 applications with defined technology stacks
    And I navigate to Analytics > Technology

  Scenario: View technology distribution
    Then I should see charts showing distribution by category:
      | category | top technologies |
      | Frontend | React (25), Angular (15), Vue (10) |
      | Backend | Node.js (30), Java (15), Python (5) |
      | Database | PostgreSQL (35), MongoDB (10), MySQL (5) |

  Scenario: Drill down to applications
    When I click on "React" in the Frontend chart
    Then I should see a list of 25 applications using React
    And I can click any to view its details

  Scenario: View technology adoption trend
    When I select "View Trend" for Backend technologies
    Then I should see a line chart over 3 years showing:
      | technology | trend |
      | Node.js | increasing |
      | Java | stable |
      | Legacy COBOL | declining |

  Scenario: Highlight non-standard technologies
    Given "Vue" is marked as non-standard
    Then "Vue" should be highlighted in the chart
    And a warning icon should indicate it's not recommended

  Scenario: Export technology report
    When I click "Export Report"
    Then a PDF should download with all charts
    And a summary table of technology usage
\`\`\``,
  },
  {
    id: 'US-PORT-032',
    title: 'Cost Analysis Dashboard',
    storyPoints: 8,
    priority: 'high',
    description: `As a **Finance Manager**,
I want a cost analysis dashboard for the application portfolio,
So that I can understand IT spending and identify savings.

**Acceptance Criteria:**
- Total portfolio cost by category
- Cost per application with ranking
- Cost trend over time
- Cost by business unit/department
- Savings opportunities identification

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Cost Analysis Dashboard
  As a Finance Manager
  I want cost analysis
  So that I can optimize IT spending

  Background:
    Given the portfolio has cost data for 50 applications
    And I navigate to Analytics > Cost Analysis

  Scenario: View total portfolio cost breakdown
    Then I should see a pie chart with categories:
      | category | amount |
      | Infrastructure | $1,200,000 |
      | Licenses | $800,000 |
      | Support & Maintenance | $600,000 |
      | Development | $400,000 |
    And total should show $3,000,000

  Scenario: View top 10 costly applications
    Then I should see a ranked list:
      | rank | application | cost |
      | 1 | ERP System | $450,000 |
      | 2 | Customer Portal | $320,000 |
      | 3 | Data Warehouse | $280,000 |

  Scenario: View cost trend
    When I select "View 3-Year Trend"
    Then I should see a line chart showing:
      | year | total cost |
      | 2022 | $2,500,000 |
      | 2023 | $2,800,000 |
      | 2024 | $3,000,000 |
    And year-over-year change percentages

  Scenario: Identify savings opportunities
    Given I click "Identify Savings"
    Then I should see recommendations:
      | type | description | potential savings |
      | Consolidation | Merge 3 similar CRM tools | $150,000 |
      | Retirement | Retire 5 unused applications | $200,000 |
      | License Optimization | Reduce unused licenses | $75,000 |

  Scenario: Filter by department
    When I filter by "Marketing Department"
    Then costs should filter to Marketing-owned applications
    And the charts should update accordingly
\`\`\``,
  },
  {
    id: 'US-PORT-033',
    title: 'Progress Trend Charts',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Portfolio Manager**,
I want to see progress trends for initiatives,
So that I can identify slowing or accelerating work.

**Acceptance Criteria:**
- Progress percentage over time for each initiative
- Comparison against planned trajectory
- Velocity calculation (progress per week)
- Alerts for stalled initiatives
- Aggregate portfolio progress

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Progress Trend Charts
  As a Portfolio Manager
  I want progress trends
  So that I can identify velocity issues

  Background:
    Given there are 10 active initiatives with weekly progress updates
    And I navigate to Analytics > Progress Trends

  Scenario: View individual initiative progress
    When I select "CX Modernization"
    Then I should see a line chart with:
      | line | description |
      | Planned | Expected progress curve |
      | Actual | Recorded progress points |
    And the gap between lines indicates ahead/behind status

  Scenario: Calculate velocity
    Given "CX Modernization" has progressed 40% over 8 weeks
    Then velocity should show "5% per week"
    And at current velocity, completion date should be calculated

  Scenario: Identify stalled initiatives
    Given "Legacy Migration" has 0% progress for 3 weeks
    Then it should be flagged as "Stalled"
    And appear in the "Attention Needed" section

  Scenario: View portfolio aggregate progress
    When I select "Portfolio View"
    Then I should see an aggregate progress chart
    And average velocity across all initiatives

  Scenario: Compare multiple initiatives
    When I select 3 initiatives to compare
    Then all 3 progress lines should display on one chart
    And I can identify which is progressing fastest
\`\`\``,
  },
  {
    id: 'US-PORT-034',
    title: 'Risk Assessment Visualization',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Risk Manager**,
I want to visualize portfolio risks,
So that I can understand risk exposure and prioritize mitigation.

**Acceptance Criteria:**
- Risk matrix (probability x impact)
- Risk distribution by category
- Risk trend over time
- Mitigation status tracking
- Heat map by initiative

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Risk Assessment Visualization
  As a Risk Manager
  I want risk visualization
  So that I can manage portfolio risk

  Background:
    Given initiatives have defined risks with probability and impact ratings
    And I navigate to Analytics > Risk Assessment

  Scenario: View risk matrix
    Then I should see a 5x5 probability vs impact matrix
    And each cell should show the count of risks in that zone
    And high probability + high impact should be red

  Scenario: View risk distribution
    Then I should see risk distribution by category:
      | category | count |
      | Technical | 12 |
      | Resource | 8 |
      | Budget | 6 |
      | External | 4 |
    And a bar chart should visualize this

  Scenario: Track risk trend
    When I select "View Risk Trend"
    Then I should see how total risk count changed over months
    And separate lines for open vs mitigated risks

  Scenario: View mitigation status
    Given I click on "Technical" risks
    Then I should see a list with:
      | risk | probability | impact | mitigation status |
      | API Integration Failure | High | High | Mitigation in progress |
      | Data Loss | Medium | Critical | Mitigation planned |

  Scenario: Initiative risk heatmap
    When I select "By Initiative"
    Then I should see each initiative with a risk score
    And high-risk initiatives should be highlighted
\`\`\``,
  },
  {
    id: 'US-PORT-035',
    title: 'Stakeholder Coverage Report',
    storyPoints: 3,
    priority: 'low',
    description: `As a **Program Manager**,
I want a stakeholder coverage report,
So that I can ensure all initiatives have proper sponsorship.

**Acceptance Criteria:**
- List initiatives with key stakeholder roles
- Highlight gaps (missing sponsor, owner, etc.)
- Stakeholder workload view
- Export capability

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Stakeholder Coverage Report
  As a Program Manager
  I want stakeholder coverage visibility
  So that initiatives are properly sponsored

  Background:
    Given there are 10 initiatives with various stakeholder assignments
    And I navigate to Analytics > Stakeholder Coverage

  Scenario: View coverage matrix
    Then I should see a table with:
      | initiative | sponsor | owner | pm | tech lead |
    And cells should show stakeholder names or "VACANT"

  Scenario: Highlight coverage gaps
    Given "Data Migration" has no Executive Sponsor
    Then the Sponsor cell should be highlighted red
    And a warning should indicate "Missing required role"

  Scenario: View stakeholder workload
    When I click "Stakeholder Workload"
    Then I should see how many initiatives each person is assigned to:
      | stakeholder | initiatives |
      | Sarah Chen | 5 |
      | Michael Torres | 3 |
    And highlight anyone with more than 4 assignments

  Scenario: Export report
    When I click "Export"
    Then I should get an Excel file with:
      | sheet | content |
      | Coverage Matrix | Initiatives and stakeholders |
      | Gaps | Missing assignments |
      | Workload | Stakeholder load |
\`\`\``,
  },
  {
    id: 'US-PORT-036',
    title: 'Milestone Completion Tracker',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Portfolio Manager**,
I want to track milestone completion across all initiatives,
So that I can monitor delivery performance.

**Acceptance Criteria:**
- Milestones due this period with status
- On-time vs late completion rate
- Upcoming milestones calendar
- Overdue milestone alerts
- Trend of delivery performance

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Milestone Completion Tracker
  As a Portfolio Manager
  I want milestone tracking
  So that I can monitor delivery

  Background:
    Given there are 50 milestones across all initiatives
    And I navigate to Analytics > Milestone Tracker

  Scenario: View milestones due this month
    Then I should see a list of milestones due in current month:
      | milestone | initiative | due date | status |
      | MVP Launch | CX Modernization | Nov 15 | On Track |
      | Data Migration | Data Platform | Nov 20 | At Risk |
      | UAT Complete | Security Upgrade | Nov 30 | On Track |

  Scenario: View completion rate
    Then I should see completion metrics:
      | metric | value |
      | Completed This Quarter | 12 |
      | On-Time | 10 (83%) |
      | Late | 2 (17%) |
    And a gauge should visualize the on-time rate

  Scenario: View upcoming calendar
    When I click "Calendar View"
    Then I should see a calendar with milestones as events
    And milestones should be color-coded by status
    And I can navigate to previous/next months

  Scenario: Alert on overdue milestones
    Given 3 milestones are past due
    Then an alert banner should show "3 Overdue Milestones"
    And clicking should list them with days overdue

  Scenario: View delivery trend
    When I select "View Trend"
    Then I should see quarterly on-time completion rate over 2 years
    And identify if performance is improving or declining
\`\`\``,
  },
  {
    id: 'US-PORT-037',
    title: 'ROI Calculator',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Finance Manager**,
I want an ROI calculator for initiatives,
So that I can evaluate investment returns.

**Acceptance Criteria:**
- Input costs (investment, ongoing)
- Input benefits (savings, revenue)
- Calculate ROI, NPV, payback period
- Scenario comparison
- Export business case

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: ROI Calculator
  As a Finance Manager
  I want ROI calculations
  So that I can evaluate investments

  Background:
    Given I am viewing initiative "Automation Platform"
    And I navigate to the ROI Calculator section

  Scenario: Input investment data
    When I enter:
      | field | value |
      | Initial Investment | $500,000 |
      | Annual Operating Cost | $50,000 |
      | Project Duration | 5 years |
    Then the calculator should accept these inputs

  Scenario: Input benefit data
    When I enter:
      | field | value |
      | Annual Cost Savings | $200,000 |
      | Revenue Increase | $50,000 |
    And I click "Calculate"
    Then I should see results:
      | metric | value |
      | Total ROI | 150% |
      | NPV (8% discount) | $425,000 |
      | Payback Period | 2.5 years |

  Scenario: Compare scenarios
    When I click "Add Scenario"
    And I create "Conservative" with lower benefits
    Then I should see side-by-side comparison:
      | metric | Base | Conservative |
      | ROI | 150% | 80% |
      | Payback | 2.5 years | 3.5 years |

  Scenario: Export business case
    When I click "Export Business Case"
    Then a PDF should be generated with:
      | section |
      | Executive Summary |
      | Investment Details |
      | Benefit Analysis |
      | Financial Metrics |
      | Risk Considerations |
\`\`\``,
  },
  {
    id: 'US-PORT-038',
    title: 'Executive Summary Export',
    storyPoints: 5,
    priority: 'medium',
    description: `As an **Executive**,
I want to export a portfolio executive summary,
So that I can present to leadership and board.

**Acceptance Criteria:**
- One-page summary with key metrics
- Status of top initiatives
- Budget summary
- Key risks and issues
- PDF and PowerPoint export

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Executive Summary Export
  As an Executive
  I want exportable summaries
  So that I can present to leadership

  Background:
    Given I am on the Portfolio dashboard
    And I click "Generate Executive Summary"

  Scenario: Configure summary content
    Then I should see options to include:
      | section | default |
      | Portfolio Overview | checked |
      | Top 5 Initiatives | checked |
      | Budget Summary | checked |
      | Key Risks | checked |
      | Upcoming Milestones | unchecked |

  Scenario: Preview summary
    When I configure sections
    And I click "Preview"
    Then I should see a formatted preview
    And it should fit on one page

  Scenario: Export to PDF
    When I click "Export PDF"
    Then a PDF should download with:
      | element |
      | Company logo |
      | Date generated |
      | All selected sections |
      | Professional formatting |

  Scenario: Export to PowerPoint
    When I click "Export PPTX"
    Then a PowerPoint file should download
    And each section should be on its own slide
    And charts should be editable

  Scenario: Schedule recurring export
    When I click "Schedule"
    And I set to "Monthly on 1st"
    Then the summary should be emailed monthly
    And to the configured recipients
\`\`\``,
  },
];

// ============================================================================
// SUB-EPIC 4: INTEGRATIONS & DEPENDENCIES (14 stories)
// ============================================================================

export const INTEGRATION_STORIES = [
  {
    id: 'US-PORT-039',
    title: 'Dependency Matrix Visualization',
    storyPoints: 8,
    priority: 'high',
    description: `As an **Enterprise Architect**,
I want a matrix view of initiative-application dependencies,
So that I can see all relationships at a glance.

**Acceptance Criteria:**
- Matrix with initiatives as rows, applications as columns
- Cell indicates relationship type
- Color coding by impact type
- Click cell for relationship details
- Export to Excel

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Dependency Matrix Visualization
  As an Enterprise Architect
  I want a dependency matrix
  So that I see all relationships at once

  Background:
    Given there are 10 initiatives and 30 applications
    And 45 dependency links exist
    And I navigate to Dependencies > Matrix View

  Scenario: Display dependency matrix
    Then I should see a grid with:
      | rows | initiatives (10) |
      | columns | applications (30) |
    And cells with dependencies should be colored
    And empty cells should be blank

  Scenario: Color coding by impact type
    Then cells should be colored by impact:
      | color | impact type |
      | Blue | modernized |
      | Red | replaced |
      | Green | supports |
      | Yellow | impacted |

  Scenario: Click cell for details
    Given I click a cell at "CX Modernization" x "Customer Portal"
    Then a popup should show:
      | Initiative | CX Modernization |
      | Application | Customer Portal |
      | Impact Type | modernized |
      | Description | Upgrading to new UI framework |

  Scenario: Filter matrix
    When I filter to show only "replaced" relationships
    Then only red cells should remain visible
    And other cells should be dimmed

  Scenario: Export matrix
    When I click "Export to Excel"
    Then an Excel file should download
    And it should contain the full matrix with colors
\`\`\``,
  },
  {
    id: 'US-PORT-040',
    title: 'Impact Cascade Analysis',
    storyPoints: 8,
    priority: 'high',
    description: `As an **Enterprise Architect**,
I want to see cascade impacts when retiring an application,
So that I can assess the full impact of changes.

**Acceptance Criteria:**
- Select an application for analysis
- Show all initiatives depending on it
- Show downstream application dependencies
- Risk assessment for retirement
- What-if scenarios

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Impact Cascade Analysis
  As an Enterprise Architect
  I want cascade analysis
  So that I can assess change impacts

  Background:
    Given "Identity Service" is a core application
    And 5 initiatives depend on it
    And 12 applications integrate with it
    And I navigate to Dependencies > Impact Analysis

  Scenario: Select application for analysis
    When I select "Identity Service"
    Then I should see:
      | metric | value |
      | Dependent Initiatives | 5 |
      | Integrated Applications | 12 |
      | Criticality | Critical |

  Scenario: View initiative impacts
    Given I selected "Identity Service"
    Then I should see a list of impacted initiatives:
      | initiative | impact |
      | Zero Trust Security | depends_on |
      | CX Modernization | supports |
    And their current status and progress

  Scenario: View application cascade
    When I click "View Application Dependencies"
    Then I should see a tree/graph showing:
      | level | applications |
      | 1 (direct) | Customer Portal, Order System |
      | 2 (indirect) | Payment Gateway, Analytics |

  Scenario: Retirement risk assessment
    When I click "Assess Retirement Risk"
    Then I should see:
      | risk factor | level |
      | Initiative Impact | High (5 initiatives) |
      | Integration Complexity | Critical (12 apps) |
      | Business Criticality | Critical |
      | Overall Risk | CRITICAL - Not recommended |

  Scenario: What-if scenario
    When I click "What If: Retire in 6 months"
    Then I should see a timeline of required changes
    And affected initiatives with new target dates
    And estimated effort to decouple
\`\`\``,
  },
  {
    id: 'US-PORT-041',
    title: 'Bulk Dependency Linking',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Portfolio Manager**,
I want to link multiple applications to an initiative at once,
So that I can efficiently set up relationships.

**Acceptance Criteria:**
- Multi-select applications from list
- Bulk assign to an initiative
- Set impact type for all selected
- Option to set individual impact types
- Import from CSV

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Bulk Dependency Linking
  As a Portfolio Manager
  I want bulk linking
  So that I can efficiently create relationships

  Background:
    Given initiative "Cloud Migration" exists
    And 50 applications exist in the portfolio
    And I am linking applications to "Cloud Migration"

  Scenario: Multi-select applications
    Given I am in the bulk link interface
    When I check 10 applications
    Then the selection count should show "10 selected"
    And the "Link to Initiative" button should be enabled

  Scenario: Bulk assign with same impact type
    Given I selected 10 applications
    When I click "Link to Initiative"
    And I select "Cloud Migration" as the initiative
    And I select "modernized" as the impact type
    And I confirm
    Then 10 dependency links should be created
    And all should have impact type "modernized"

  Scenario: Set individual impact types
    Given I selected 10 applications
    When I click "Link with Individual Impact Types"
    Then I should see a table to set each:
      | application | impact type |
      | App 1 | [dropdown] |
      | App 2 | [dropdown] |
    And I can set different types for each

  Scenario: Import from CSV
    When I click "Import from CSV"
    And I upload a file with:
      | initiative | application | impact_type |
      | Cloud Migration | Customer Portal | modernized |
      | Cloud Migration | Legacy CRM | replaced |
    Then the links should be created from the file
    And I should see a summary of created links
\`\`\``,
  },
  {
    id: 'US-PORT-042',
    title: 'Orphan Application Detection',
    storyPoints: 3,
    priority: 'medium',
    description: `As a **Portfolio Administrator**,
I want to identify orphan applications without initiatives,
So that I can review and potentially retire them.

**Acceptance Criteria:**
- List applications not linked to any initiative
- Filter by last activity date
- Suggest retirement candidates
- Bulk actions on orphans

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Orphan Application Detection
  As a Portfolio Administrator
  I want to find orphan applications
  So that I can review them for retirement

  Background:
    Given there are 50 applications
    And 15 have no initiative links
    And I navigate to Dependencies > Orphan Detection

  Scenario: View orphan applications
    Then I should see a list of 15 applications
    And each should show:
      | field | description |
      | Name | Application name |
      | Status | Current status |
      | Last Activity | Last update date |
      | Owner | Responsible team |

  Scenario: Filter by last activity
    When I filter "Last Activity > 1 year ago"
    Then I should see a reduced list
    And a warning "5 applications have no activity for over a year"

  Scenario: Suggest retirement candidates
    Given I click "Suggest Retirement Candidates"
    Then applications should be scored based on:
      | factor | weight |
      | No initiative links | High |
      | Inactive > 1 year | Medium |
      | Low criticality | Medium |
      | Deprecated status | High |
    And top candidates should be highlighted

  Scenario: Bulk mark for review
    Given I select 5 orphan applications
    When I click "Mark for Review"
    Then a review task should be created for each
    And notifications should go to the owners
\`\`\``,
  },
  {
    id: 'US-PORT-043',
    title: 'Circular Dependency Detection',
    storyPoints: 5,
    priority: 'medium',
    description: `As an **Enterprise Architect**,
I want the system to detect circular dependencies,
So that I can identify and resolve problematic relationships.

**Acceptance Criteria:**
- Automatic detection of circular references
- Visual highlighting in graphs
- Alert when creating circular link
- List of all circular chains
- Resolution suggestions

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Circular Dependency Detection
  As an Enterprise Architect
  I want circular dependency detection
  So that I can avoid problematic relationships

  Background:
    Given applications A, B, C exist
    And A depends on B, B depends on C

  Scenario: Detect circular dependency on creation
    When I try to create a dependency from C to A
    Then I should see a warning "This would create a circular dependency: A → B → C → A"
    And I should be asked to confirm or cancel

  Scenario: View all circular dependencies
    Given there are 3 circular chains in the portfolio
    When I navigate to Dependencies > Circular Detection
    Then I should see a list:
      | chain |
      | App A → App B → App C → App A |
      | Init X → App D → App E → Init X |

  Scenario: Highlight in dependency graph
    Given I am viewing the dependency graph
    Then circular chains should be highlighted in red
    And a legend should indicate "Circular Dependency"

  Scenario: Resolution suggestions
    Given I view circular chain "A → B → C → A"
    When I click "Suggest Resolution"
    Then I should see options:
      | option | description |
      | Remove C → A | Break the circle at weakest link |
      | Refactor B | Decouple B from C |

  Scenario: Dismiss circular warning
    Given I understand the circular relationship
    When I add the dependency anyway with confirmation
    Then it should be created
    And flagged with a warning icon
\`\`\``,
  },
  {
    id: 'US-PORT-044',
    title: 'Initiative-to-Initiative Dependencies',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Program Manager**,
I want to link dependencies between initiatives,
So that I can track program interdependencies.

**Acceptance Criteria:**
- Link one initiative as dependent on another
- Dependency types (blocks, requires, related)
- Impact on scheduling
- Visualization in roadmap
- Alert on delayed dependencies

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Initiative-to-Initiative Dependencies
  As a Program Manager
  I want initiative dependencies
  So that I can track program interdependencies

  Background:
    Given initiatives "Identity Platform" and "Zero Trust Security" exist
    And "Zero Trust" requires "Identity Platform"

  Scenario: Create initiative dependency
    Given I am editing "Zero Trust Security"
    When I add a dependency:
      | field | value |
      | Depends On | Identity Platform |
      | Type | requires |
      | Description | Needs identity before security |
    Then the dependency should be saved
    And visible in both initiatives

  Scenario: View in roadmap
    Given I am viewing the initiative roadmap
    Then I should see an arrow from "Identity Platform" to "Zero Trust"
    And "Zero Trust" should be positioned after "Identity Platform" ends

  Scenario: Alert on delayed dependency
    Given "Identity Platform" target date slips by 2 months
    Then an alert should be generated for "Zero Trust Security"
    And the message should indicate the impact on its schedule

  Scenario: Block scheduling conflicts
    Given "Identity Platform" ends in December 2024
    When I try to set "Zero Trust" start to November 2024
    Then I should see a warning "Dependency not completed until December"
    And I should be asked to adjust the date or override

  Scenario: View dependency chain
    Given "Initiative C" depends on "B", which depends on "A"
    When I view the dependency chain for "C"
    Then I should see the full chain: A → B → C
    And estimated completion based on chain
\`\`\``,
  },
  {
    id: 'US-PORT-045',
    title: 'Application-to-Application Dependencies',
    storyPoints: 5,
    priority: 'medium',
    description: `As an **Enterprise Architect**,
I want to track dependencies between applications,
So that I can understand integration coupling.

**Acceptance Criteria:**
- Direct dependency links between applications
- Integration type (API, database, file, message)
- Data flow direction
- Coupling strength indicator
- Visualization in architecture diagram

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Application-to-Application Dependencies
  As an Enterprise Architect
  I want app-to-app dependencies
  So that I can understand coupling

  Background:
    Given applications "Order System" and "Inventory" exist

  Scenario: Create application dependency
    Given I am editing "Order System"
    When I add a dependency:
      | field | value |
      | Depends On | Inventory |
      | Integration Type | REST API |
      | Direction | Bidirectional |
      | Coupling | Tight |
    Then the dependency should be saved

  Scenario: View in architecture diagram
    Given I am viewing the application architecture diagram
    Then I should see a line connecting "Order System" and "Inventory"
    And the line should have arrows showing bidirectional flow
    And thickness should indicate tight coupling

  Scenario: List all dependencies for an app
    Given "Order System" has 5 dependencies
    When I view its dependencies tab
    Then I should see:
      | app | type | direction | coupling |
      | Inventory | REST API | Bidirectional | Tight |
      | Payment Gateway | REST API | Outbound | Loose |

  Scenario: Impact analysis for changes
    Given "Inventory" API is changing
    When I run impact analysis
    Then I should see "Order System" as affected
    And severity based on coupling (tight = high impact)

  Scenario: Identify highly coupled applications
    When I run "Coupling Analysis"
    Then I should see a ranked list by total coupling score
    And recommendations to reduce coupling where possible
\`\`\``,
  },
  {
    id: 'US-PORT-046',
    title: 'Jira Initiative Sync',
    storyPoints: 8,
    priority: 'low',
    description: `As a **Program Manager**,
I want to sync initiatives with Jira,
So that progress is reflected in both systems.

**Acceptance Criteria:**
- Connect to Jira instance
- Map initiative to Jira epic/project
- Sync progress and status bidirectionally
- Handle conflicts gracefully
- Configurable sync frequency

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Jira Initiative Sync
  As a Program Manager
  I want Jira synchronization
  So that progress syncs automatically

  Background:
    Given Jira integration is configured

  Scenario: Connect initiative to Jira epic
    Given I am editing initiative "CX Modernization"
    When I click "Connect to Jira"
    And I search for "CX-EPIC-001"
    And I select it
    Then the initiative should be linked to the Jira epic

  Scenario: Sync progress from Jira
    Given the initiative is linked to Jira
    And the Jira epic is 60% complete
    When the sync runs
    Then the initiative progress should update to 60%
    And a sync timestamp should be recorded

  Scenario: Sync status bidirectionally
    Given the initiative status is "In Progress"
    When I change it to "On Hold" in Portfolio
    Then the Jira epic status should update to "On Hold"

  Scenario: Handle sync conflicts
    Given both systems updated the same field
    When a sync conflict is detected
    Then I should see a notification
    And be prompted to choose which value to keep

  Scenario: Configure sync schedule
    Given I access integration settings
    When I set sync frequency to "Every 15 minutes"
    Then syncs should occur at that interval
    And I can also trigger manual sync
\`\`\``,
  },
  {
    id: 'US-PORT-047',
    title: 'ServiceNow CMDB Import',
    storyPoints: 8,
    priority: 'low',
    description: `As a **Portfolio Administrator**,
I want to import applications from ServiceNow CMDB,
So that I don't have to manually enter data.

**Acceptance Criteria:**
- Connect to ServiceNow instance
- Browse CMDB configuration items
- Map CMDB fields to application fields
- Import selected items
- Scheduled refresh

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: ServiceNow CMDB Import
  As a Portfolio Administrator
  I want CMDB import
  So that I can populate applications automatically

  Background:
    Given ServiceNow integration is configured

  Scenario: Browse CMDB items
    Given I navigate to Integrations > ServiceNow Import
    When I click "Browse CMDB"
    Then I should see a list of configuration items
    And I can search and filter

  Scenario: Map fields
    Given I am on the field mapping screen
    Then I should see:
      | CMDB Field | Portfolio Field |
      | Name | name |
      | Description | description |
      | Operational Status | status |
    And I can modify the mappings

  Scenario: Import selected items
    Given I selected 10 CMDB items
    When I click "Import"
    Then 10 applications should be created
    And a log should show what was imported

  Scenario: Handle duplicates
    Given "Customer Portal" already exists
    When I import a CMDB item with the same name
    Then I should be prompted:
      | option | description |
      | Skip | Don't import |
      | Update | Merge with existing |
      | Create New | Create as new record |

  Scenario: Schedule refresh
    Given I imported 20 items
    When I enable "Scheduled Refresh"
    Then CMDB changes should sync daily
    And I can view the refresh history
\`\`\``,
  },
  {
    id: 'US-PORT-048',
    title: 'CSV Import for Applications',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Portfolio Administrator**,
I want to import applications from a CSV file,
So that I can bulk load data from spreadsheets.

**Acceptance Criteria:**
- Upload CSV file
- Preview data before import
- Map columns to fields
- Validate data and show errors
- Import summary with results

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: CSV Import for Applications
  As a Portfolio Administrator
  I want CSV import
  So that I can bulk load applications

  Background:
    Given I navigate to Applications > Import

  Scenario: Upload CSV file
    When I upload a CSV file with 50 rows
    Then I should see a preview of the first 10 rows
    And column headers should be detected

  Scenario: Map columns to fields
    Given the CSV has columns "App Name", "App Type", "Owner"
    Then I should see a mapping interface:
      | CSV Column | Maps To |
      | App Name | name |
      | App Type | type |
      | Owner | owner |
    And I can change the mappings

  Scenario: Validate data before import
    Given some rows have invalid data
    When I click "Validate"
    Then I should see validation results:
      | row | field | error |
      | 5 | type | Invalid value "unknown" |
      | 12 | name | Required field is empty |
    And I can fix issues before importing

  Scenario: Import valid data
    Given 48 of 50 rows are valid
    When I click "Import Valid Rows"
    Then 48 applications should be created
    And I should see a summary:
      | metric | value |
      | Imported | 48 |
      | Skipped | 2 |
      | Errors | 2 |

  Scenario: Download error report
    Given there were import errors
    When I click "Download Error Report"
    Then I should get a CSV with failed rows and reasons
\`\`\``,
  },
  {
    id: 'US-PORT-049',
    title: 'CSV/Excel Export',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **User**,
I want to export portfolio data to CSV or Excel,
So that I can analyze data in spreadsheets.

**Acceptance Criteria:**
- Export applications, initiatives, or dependencies
- Choose columns to include
- Apply current filters to export
- Excel with formatting or plain CSV
- Large dataset handling

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: CSV/Excel Export
  As a User
  I want data export
  So that I can analyze in spreadsheets

  Background:
    Given I am on the Applications list with 200 applications

  Scenario: Quick export to CSV
    When I click "Export" > "CSV"
    Then all visible columns should export
    And current filters should be applied
    And a CSV file should download

  Scenario: Choose columns for export
    When I click "Export" > "Custom Export"
    Then I should see a column selector:
      | column | include |
      | Name | checked |
      | Status | checked |
      | Owner | checked |
      | Technology Stack | unchecked |
    And I can check/uncheck columns

  Scenario: Export to Excel with formatting
    When I click "Export" > "Excel"
    Then an .xlsx file should download
    And it should include:
      | feature |
      | Header row with bold |
      | Column filters |
      | Freeze header row |

  Scenario: Export filtered data
    Given I have filtered to "deprecated" status
    When I export
    Then only deprecated applications should be in the file
    And a note should indicate the filter applied

  Scenario: Handle large datasets
    Given there are 5000 applications
    When I export to CSV
    Then the export should complete without timeout
    And a progress indicator should show during export
\`\`\``,
  },
  {
    id: 'US-PORT-050',
    title: 'API Documentation',
    storyPoints: 3,
    priority: 'low',
    description: `As a **Developer**,
I want API documentation for portfolio endpoints,
So that I can build integrations.

**Acceptance Criteria:**
- OpenAPI/Swagger documentation
- Interactive API explorer
- Authentication examples
- Request/response samples
- Error code reference

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: API Documentation
  As a Developer
  I want API documentation
  So that I can build integrations

  Background:
    Given I navigate to /api/docs or API Documentation link

  Scenario: View API endpoint list
    Then I should see documented endpoints:
      | method | path | description |
      | GET | /api/applications | List all applications |
      | POST | /api/applications | Create application |
      | GET | /api/initiatives | List all initiatives |

  Scenario: View endpoint details
    When I expand "GET /api/applications"
    Then I should see:
      | section | content |
      | Parameters | query params with types |
      | Response | sample JSON response |
      | Status Codes | 200, 400, 401, 500 |

  Scenario: Try API in explorer
    Given I am authenticated
    When I use the "Try it out" feature for GET /api/applications
    And I click Execute
    Then I should see the actual API response

  Scenario: View authentication examples
    When I view the Authentication section
    Then I should see examples for:
      | auth type | example |
      | API Key | Header: X-API-Key: xxx |
      | Bearer Token | Authorization: Bearer xxx |

  Scenario: Download OpenAPI spec
    When I click "Download OpenAPI Spec"
    Then I should get an openapi.json or openapi.yaml file
    And it should be compatible with Swagger tools
\`\`\``,
  },
  {
    id: 'US-PORT-051',
    title: 'Webhook Notifications',
    storyPoints: 5,
    priority: 'low',
    description: `As a **System Administrator**,
I want to configure webhooks for portfolio events,
So that external systems can react to changes.

**Acceptance Criteria:**
- Configure webhook endpoints
- Select events to trigger
- Payload format configuration
- Delivery retry logic
- Webhook history and debugging

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Webhook Notifications
  As a System Administrator
  I want webhooks
  So that external systems react to changes

  Background:
    Given I navigate to Settings > Webhooks

  Scenario: Create a webhook
    When I click "Add Webhook"
    And I configure:
      | field | value |
      | URL | https://example.com/hook |
      | Events | initiative.created, initiative.status_changed |
      | Secret | my-secret-key |
    And I save
    Then the webhook should be created
    And it should be enabled by default

  Scenario: Test webhook
    Given a webhook is configured
    When I click "Test Webhook"
    Then a test payload should be sent
    And I should see the delivery status
    And the response from the endpoint

  Scenario: View webhook payload
    Given event "initiative.created" fires
    Then the payload should include:
      | field |
      | event_type |
      | timestamp |
      | initiative object |
      | actor (who made change) |

  Scenario: Retry failed deliveries
    Given a webhook delivery failed (endpoint down)
    Then it should retry 3 times with exponential backoff
    And after 3 failures, mark as failed

  Scenario: View delivery history
    Given webhooks have been firing
    When I view webhook history
    Then I should see:
      | time | event | status | response |
    And I can filter by status (success/failed)
\`\`\``,
  },
  {
    id: 'US-PORT-052',
    title: 'Slack/Teams Integration',
    storyPoints: 5,
    priority: 'low',
    description: `As a **Team Member**,
I want Slack/Teams notifications for portfolio events,
So that I stay informed in my communication tool.

**Acceptance Criteria:**
- Connect to Slack/Teams workspace
- Configure channel for notifications
- Select event types to notify
- Rich message formatting
- Interactive actions (approve, view)

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Slack/Teams Integration
  As a Team Member
  I want chat notifications
  So that I stay informed

  Background:
    Given I navigate to Settings > Integrations > Slack

  Scenario: Connect to Slack workspace
    When I click "Connect to Slack"
    Then I should be redirected to Slack OAuth
    When I authorize the app
    Then I should return to the settings page
    And see "Connected to: MyWorkspace"

  Scenario: Configure notification channel
    Given Slack is connected
    When I select channel "#portfolio-updates"
    And I enable events:
      | event |
      | Initiative status changed |
      | Milestone completed |
      | At-risk health status |
    Then notifications should be configured

  Scenario: Receive rich notification
    Given an initiative status changes to "Completed"
    Then a Slack message should post to the channel:
      | element |
      | Initiative name |
      | Old status → New status |
      | Changed by |
      | Link to view |

  Scenario: Interactive approval
    Given an initiative needs approval
    Then a Slack message should include "Approve" and "Reject" buttons
    When I click "Approve" in Slack
    Then the initiative should be approved in the system
    And the message should update to show "Approved by [user]"

  Scenario: Personal notification preferences
    Given I am a stakeholder
    When I configure my preferences
    Then I can opt-in to:
      | preference |
      | DM me for my initiatives |
      | Mention me in channel |
      | No Slack notifications |
\`\`\``,
  },
];

console.log('Story definitions Part 2 loaded.');
console.log('Analytics stories:', ANALYTICS_STORIES.length);
console.log('Integration stories:', INTEGRATION_STORIES.length);

