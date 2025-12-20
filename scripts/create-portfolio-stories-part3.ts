/**
 * Portfolio Management Module - User Stories Part 3
 * Sub-Epic 5: Governance & Workflows (12 stories)
 * Sub-Epic 6: AI & Intelligence (10 stories)
 * Buffer: Polish & Accessibility (4 stories)
 */

// ============================================================================
// SUB-EPIC 5: GOVERNANCE & WORKFLOWS (12 stories)
// ============================================================================

export const GOVERNANCE_STORIES = [
  {
    id: 'US-PORT-053',
    title: 'Status Change Workflow',
    storyPoints: 5,
    priority: 'high',
    description: `As a **Portfolio Manager**,
I want status changes to follow a defined workflow,
So that transitions are controlled and documented.

**Acceptance Criteria:**
- Define allowed status transitions
- Require reason/comment for status change
- Notify stakeholders on status change
- Block invalid transitions
- Audit log of all changes

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Status Change Workflow
  As a Portfolio Manager
  I want controlled status transitions
  So that changes are documented

  Background:
    Given initiative "CX Modernization" has status "In Progress"

  Scenario: Allow valid status transition
    Given valid transitions from "In Progress" are:
      | target status |
      | On Hold |
      | Completed |
      | Cancelled |
    When I change status to "On Hold"
    Then the change should be allowed
    And I should be prompted for a reason

  Scenario: Block invalid status transition
    Given "Completed" cannot transition back to "In Progress"
    When the initiative is "Completed"
    And I try to change to "In Progress"
    Then I should see an error "Cannot transition from Completed to In Progress"
    And a link to available transitions

  Scenario: Require reason for status change
    Given I am changing status from "In Progress" to "On Hold"
    When I don't provide a reason
    Then I should see an error "Please provide a reason for this status change"
    When I enter "Waiting for budget approval"
    Then the change should be accepted

  Scenario: Notify stakeholders
    Given "Sarah Chen" is the Executive Sponsor
    When status changes to "At Risk"
    Then Sarah Chen should receive an email notification
    And the notification should include the reason

  Scenario: View status change history
    Given the initiative has had 4 status changes
    When I view the status history
    Then I should see:
      | date | from | to | by | reason |
      | Nov 15 | Planning | In Progress | Michael T | Kickoff completed |
      | Dec 1 | In Progress | On Hold | Lisa W | Budget review |
\`\`\``,
  },
  {
    id: 'US-PORT-054',
    title: 'Approval Workflow for Initiatives',
    storyPoints: 8,
    priority: 'high',
    description: `As an **Executive**,
I want to approve initiatives before they start,
So that only authorized work begins.

**Acceptance Criteria:**
- Submit initiative for approval
- Define approval chain (who needs to approve)
- Track approval status
- Approve/reject with comments
- Auto-approve for low-budget initiatives

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Approval Workflow for Initiatives
  As an Executive
  I want approval workflows
  So that initiatives are authorized

  Background:
    Given initiative "Data Lake Project" is in "Pending Approval"
    And budget is $300,000

  Scenario: Submit for approval
    Given I created a new initiative
    When I click "Submit for Approval"
    Then the status should change to "Pending Approval"
    And approvers should be notified
    And I should see pending approval badge

  Scenario: View approval chain
    Given budget requires 2 levels of approval
    Then I should see approval chain:
      | level | approver | status |
      | 1 | Department Head | Pending |
      | 2 | VP Technology | Waiting |

  Scenario: Approve at first level
    Given I am the Department Head
    When I click "Approve"
    And I add comment "Aligned with strategy"
    Then level 1 should show "Approved"
    And level 2 approver should be notified

  Scenario: Reject with feedback
    Given I am an approver
    When I click "Reject"
    And I provide feedback "Need updated business case"
    Then the initiative should return to "Draft"
    And the submitter should be notified with feedback

  Scenario: Auto-approve low-budget initiatives
    Given an initiative with budget < $10,000
    When I submit for approval
    Then it should be auto-approved
    And I should see "Auto-approved per policy"
\`\`\``,
  },
  {
    id: 'US-PORT-055',
    title: 'Retirement Workflow for Applications',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Technology Owner**,
I want a structured retirement process for applications,
So that deprecation is handled safely.

**Acceptance Criteria:**
- Initiate retirement request
- Retirement checklist completion
- Impact assessment required
- Stakeholder sign-off
- Transition to retired status

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Retirement Workflow for Applications
  As a Technology Owner
  I want retirement workflows
  So that deprecation is safe

  Background:
    Given application "Legacy CRM" is marked "deprecated"

  Scenario: Initiate retirement request
    Given I am the owner of "Legacy CRM"
    When I click "Request Retirement"
    Then a retirement workflow should start
    And a target retirement date should be requested

  Scenario: Complete retirement checklist
    Given retirement is initiated
    Then I should see a checklist:
      | item | status |
      | Data migration plan | Pending |
      | User notification | Pending |
      | Dependent system updates | Pending |
      | Backup verification | Pending |
    And each item must be completed before retirement

  Scenario: Impact assessment requirement
    Given the checklist is in progress
    When I try to proceed without impact assessment
    Then I should see "Impact assessment must be completed"
    When I run impact assessment
    And it shows 2 dependent applications
    Then migration plan for each must be documented

  Scenario: Stakeholder sign-off
    Given all checklist items are complete
    Then stakeholder sign-off should be requested
    When all required stakeholders sign off
    Then the application can be retired

  Scenario: Complete retirement
    Given all steps are completed
    When I click "Complete Retirement"
    Then application status should change to "Retired"
    And a retirement report should be generated
    And it should be excluded from active dashboards
\`\`\``,
  },
  {
    id: 'US-PORT-056',
    title: 'Audit Trail and History',
    storyPoints: 5,
    priority: 'high',
    description: `As a **Compliance Officer**,
I want a complete audit trail of all changes,
So that I can demonstrate governance compliance.

**Acceptance Criteria:**
- Log all create, update, delete operations
- Capture who, when, what changed
- Before/after values for updates
- Searchable audit log
- Export for compliance reporting

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Audit Trail and History
  As a Compliance Officer
  I want complete audit trails
  So that I demonstrate compliance

  Background:
    Given audit logging is enabled

  Scenario: Log creation
    When I create a new initiative "Data Governance"
    Then an audit entry should be created:
      | field | value |
      | action | create |
      | entity | initiative |
      | user | michael.torres |
      | timestamp | [current time] |

  Scenario: Log update with before/after
    When I update initiative status from "Planning" to "In Progress"
    Then the audit entry should show:
      | field | before | after |
      | status | Planning | In Progress |

  Scenario: Log deletion
    When I delete application "Legacy Tool"
    Then an audit entry should capture:
      | field | value |
      | action | delete |
      | entity | application |
      | entity_data | [full record at time of deletion] |

  Scenario: Search audit log
    Given there are 1000 audit entries
    When I search for "initiative" and "status changed"
    Then I should see filtered results
    And I can further filter by date range

  Scenario: Export audit report
    When I click "Export Audit Report"
    And I select date range and entity types
    Then a CSV/PDF should be generated
    With all matching audit entries
\`\`\``,
  },
  {
    id: 'US-PORT-057',
    title: 'Version History for Entities',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **User**,
I want to see version history of initiatives and applications,
So that I can understand how they evolved.

**Acceptance Criteria:**
- Track version on each save
- View historical versions
- Compare versions side-by-side
- Restore previous version
- Version comments

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Version History for Entities
  As a User
  I want version history
  So that I understand evolution

  Background:
    Given initiative "CX Modernization" has been edited 10 times

  Scenario: View version list
    When I click "Version History"
    Then I should see a list:
      | version | date | by | comment |
      | v10 | Nov 20 | Sarah C | Updated budget |
      | v9 | Nov 15 | Michael T | Added milestone |
      | v8 | Nov 10 | Lisa W | Status update |

  Scenario: View historical version
    When I click on version 8
    Then I should see the initiative as it was at v8
    And read-only mode should be indicated
    And I can navigate between versions

  Scenario: Compare versions
    When I select v8 and v10 for comparison
    Then I should see a diff view showing:
      | field | v8 | v10 |
      | budget | $400,000 | $500,000 |
      | status | Planning | In Progress |
    And changes should be highlighted

  Scenario: Restore previous version
    Given I am viewing v8
    When I click "Restore This Version"
    Then I should see a confirmation warning
    When I confirm
    Then the initiative should revert to v8 values
    And a new version v11 should be created

  Scenario: Add version comment
    When I save changes
    Then I should be prompted for a version comment
    When I enter "Quarterly budget review"
    Then the comment should be saved with the version
\`\`\``,
  },
  {
    id: 'US-PORT-058',
    title: 'Compliance Checklist',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Compliance Officer**,
I want compliance checklists for initiatives,
So that regulatory requirements are met.

**Acceptance Criteria:**
- Define compliance checklists per initiative type
- Track checklist completion
- Evidence attachment for items
- Compliance dashboard
- Alerts for incomplete checklists

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Compliance Checklist
  As a Compliance Officer
  I want compliance checklists
  So that requirements are met

  Background:
    Given initiative "Customer Data Platform" involves PII data

  Scenario: Assign compliance checklist
    Given the initiative type triggers PII compliance requirements
    Then a compliance checklist should be automatically assigned:
      | item |
      | Privacy Impact Assessment |
      | Data Classification |
      | Encryption Requirements |
      | Retention Policy |

  Scenario: Complete checklist item with evidence
    Given I am completing "Privacy Impact Assessment"
    When I mark it as complete
    Then I should be required to attach evidence
    When I upload "PIA-Document.pdf"
    Then the item should show as completed with attachment

  Scenario: View compliance dashboard
    Given there are 5 initiatives with compliance checklists
    When I view the compliance dashboard
    Then I should see:
      | initiative | completion | status |
      | Customer Data Platform | 75% | In Progress |
      | Analytics Platform | 100% | Compliant |
      | Legacy Migration | 25% | At Risk |

  Scenario: Alert on overdue compliance
    Given an initiative is 80% complete
    And compliance checklist is only 30% complete
    Then an alert should be raised
    And the initiative should show compliance warning

  Scenario: Compliance sign-off
    Given all checklist items are complete
    When I request compliance sign-off
    Then designated compliance officer should be notified
    When they approve
    Then initiative should show "Compliance Verified"
\`\`\``,
  },
  {
    id: 'US-PORT-059',
    title: 'Business Case Template',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Program Manager**,
I want a business case template for initiatives,
So that I can document justification consistently.

**Acceptance Criteria:**
- Structured business case template
- Auto-populate from initiative data
- Cost-benefit section
- Risk assessment section
- Approval integration

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Business Case Template
  As a Program Manager
  I want business case templates
  So that justification is consistent

  Background:
    Given I am creating a new initiative

  Scenario: Access business case template
    When I click "Create Business Case"
    Then I should see a structured template with sections:
      | section |
      | Executive Summary |
      | Problem Statement |
      | Proposed Solution |
      | Cost Analysis |
      | Benefit Analysis |
      | Risk Assessment |
      | Timeline |
      | Recommendation |

  Scenario: Auto-populate from initiative
    Given initiative has name, budget, and timeline defined
    Then the business case should auto-populate:
      | field | source |
      | Project Name | initiative.name |
      | Budget Request | initiative.budget |
      | Timeline | initiative.startDate - targetDate |

  Scenario: Cost-benefit analysis
    When I fill in the cost-benefit section
    Then I should be able to enter:
      | type | year 1 | year 2 | year 3 |
      | Costs | $500k | $100k | $100k |
      | Benefits | $0 | $300k | $500k |
    And ROI should auto-calculate

  Scenario: Submit business case with initiative
    When I complete the business case
    And I submit the initiative for approval
    Then the business case should be attached
    And approvers should review it

  Scenario: Export business case
    When I click "Export"
    Then I should get a formatted PDF or Word document
    With all sections properly formatted
\`\`\``,
  },
  {
    id: 'US-PORT-060',
    title: 'Risk Register for Initiatives',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Risk Manager**,
I want a risk register for each initiative,
So that I can track and mitigate risks.

**Acceptance Criteria:**
- Add risks with probability and impact
- Define mitigation strategies
- Track mitigation status
- Risk owner assignment
- Risk trend tracking

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Risk Register for Initiatives
  As a Risk Manager
  I want risk registers
  So that I track and mitigate risks

  Background:
    Given I am viewing initiative "Cloud Migration"
    And I navigate to the Risk Register tab

  Scenario: Add a risk
    When I click "Add Risk"
    And I enter:
      | field | value |
      | title | Data Loss During Migration |
      | category | Technical |
      | probability | High |
      | impact | Critical |
      | mitigation | Implement backup verification |
      | owner | John Smith |
    Then the risk should be added to the register

  Scenario: View risk matrix position
    Given the risk has High probability and Critical impact
    Then it should appear in the red zone of the risk matrix
    And be flagged for immediate attention

  Scenario: Update mitigation status
    Given a risk has mitigation "Implement backup verification"
    When I update mitigation status to "In Progress"
    Then the risk should show mitigation underway
    And residual risk should be recalculated

  Scenario: Close a risk
    Given a risk has been fully mitigated
    When I mark it as "Closed"
    Then the risk should move to closed risks
    And no longer appear in active risk count

  Scenario: View risk trend
    Given risks have been tracked for 3 months
    When I view risk trend
    Then I should see how total risk score has changed
    And how many risks were opened vs closed each month
\`\`\``,
  },
  {
    id: 'US-PORT-061',
    title: 'Change Request Tracking',
    storyPoints: 5,
    priority: 'low',
    description: `As a **Program Manager**,
I want to track change requests for initiatives,
So that scope changes are controlled.

**Acceptance Criteria:**
- Submit change request
- Change impact assessment
- Approval workflow
- Change history
- Link changes to milestones/budget

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Change Request Tracking
  As a Program Manager
  I want change request tracking
  So that scope is controlled

  Background:
    Given initiative "CX Modernization" is in progress

  Scenario: Submit change request
    When I click "Request Change"
    And I fill in:
      | field | value |
      | title | Add Mobile App |
      | description | Extend scope to include mobile |
      | type | Scope Change |
      | impact | +$100k budget, +2 month timeline |
    Then the change request should be created

  Scenario: Impact assessment
    Given a change request is submitted
    Then I should see impact analysis:
      | dimension | current | after change |
      | Budget | $500,000 | $600,000 |
      | Timeline | Dec 2024 | Feb 2025 |
      | Affected Milestones | 2 |

  Scenario: Approve change request
    Given I am an approver for change requests
    When I review the change request
    And I click "Approve"
    Then the initiative should be updated:
      | field | new value |
      | budget | $600,000 |
      | targetDate | Feb 2025 |
    And change history should be recorded

  Scenario: Reject change request
    Given I review the change request
    When I click "Reject" with reason "Not aligned with current priorities"
    Then the request should be marked rejected
    And the submitter should be notified

  Scenario: View change history
    Given 3 change requests have been processed
    When I view change history
    Then I should see all requests with status
    And the cumulative impact on the initiative
\`\`\``,
  },
  {
    id: 'US-PORT-062',
    title: 'Ownership Transfer Workflow',
    storyPoints: 3,
    priority: 'low',
    description: `As a **Portfolio Administrator**,
I want a workflow for transferring ownership,
So that handoffs are smooth and documented.

**Acceptance Criteria:**
- Initiate ownership transfer
- Pending acceptance by new owner
- Knowledge transfer checklist
- Historical owner tracking
- Notification to stakeholders

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Ownership Transfer Workflow
  As a Portfolio Administrator
  I want ownership transfers
  So that handoffs are smooth

  Background:
    Given application "Order System" is owned by "John Smith"

  Scenario: Initiate transfer
    When I click "Transfer Ownership"
    And I select new owner "Sarah Chen"
    And I provide reason "Team reorganization"
    Then a transfer request should be created
    And Sarah should be notified

  Scenario: Accept transfer
    Given I am Sarah Chen
    And I received a transfer request
    When I click "Accept Transfer"
    Then ownership should transfer to me
    And John should be notified of completion

  Scenario: Complete knowledge transfer checklist
    Given transfer is initiated
    Then a checklist should be presented:
      | item |
      | Documentation reviewed |
      | Access granted to new owner |
      | Stakeholders introduced |
      | Pending issues discussed |
    And both parties should complete their items

  Scenario: Decline transfer
    Given I received a transfer request
    When I click "Decline" with reason "Already at capacity"
    Then the transfer should be cancelled
    And the initiator should be notified

  Scenario: View ownership history
    Given the application has changed owners 3 times
    When I view ownership history
    Then I should see:
      | from | to | date | reason |
      | John S | Sarah C | Nov 2024 | Reorg |
      | Mike T | John S | Mar 2023 | Departure |
\`\`\``,
  },
  {
    id: 'US-PORT-063',
    title: 'Notification Preferences',
    storyPoints: 3,
    priority: 'medium',
    description: `As a **User**,
I want to configure my notification preferences,
So that I receive relevant alerts without noise.

**Acceptance Criteria:**
- Select notification categories
- Choose channels (email, in-app, Slack)
- Set frequency (immediate, daily digest)
- Mute specific initiatives/applications
- Quiet hours setting

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Notification Preferences
  As a User
  I want notification preferences
  So that I control alert noise

  Background:
    Given I navigate to Settings > Notifications

  Scenario: Configure notification categories
    Then I should see toggles for:
      | category | email | in-app |
      | Status Changes | on/off | on/off |
      | Milestone Updates | on/off | on/off |
      | Comments on My Items | on/off | on/off |
      | Approval Requests | on/off | on/off |

  Scenario: Set notification frequency
    Given I enabled email for Status Changes
    When I select frequency "Daily Digest"
    Then I should receive one email per day with all status changes
    Instead of individual emails

  Scenario: Mute specific initiative
    Given I am getting many notifications for "Legacy Migration"
    When I click "Mute" on that initiative
    Then I should stop receiving notifications for it
    And the mute should be shown in my preferences

  Scenario: Set quiet hours
    When I set quiet hours "10 PM - 7 AM"
    Then no notifications should be sent during those hours
    And they should be bundled for morning delivery

  Scenario: Test notification
    Given I configure my preferences
    When I click "Send Test Notification"
    Then I should receive a test via each enabled channel
\`\`\``,
  },
  {
    id: 'US-PORT-064',
    title: 'Role-Based Field Visibility',
    storyPoints: 5,
    priority: 'low',
    description: `As a **Security Administrator**,
I want to control field visibility by role,
So that sensitive data is protected.

**Acceptance Criteria:**
- Define field visibility rules per role
- Hide sensitive fields (budget, costs)
- Read-only vs editable by role
- Audit access to sensitive fields
- Emergency access override

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Role-Based Field Visibility
  As a Security Administrator
  I want field visibility controls
  So that sensitive data is protected

  Background:
    Given I am configuring field visibility rules

  Scenario: Configure visibility by role
    Then I should see a matrix:
      | field | Admin | Manager | Viewer |
      | name | Edit | Edit | View |
      | budget | Edit | View | Hidden |
      | costs | Edit | View | Hidden |
    And I can modify each cell

  Scenario: Hide budget from viewers
    Given a Viewer views an initiative
    Then budget field should not be displayed
    And any budget-related charts should be hidden

  Scenario: View-only for managers
    Given a Manager views an initiative
    Then they should see budget as read-only
    And no edit button for budget field

  Scenario: Audit sensitive field access
    Given budget is marked as sensitive
    When an Admin views the budget
    Then an audit entry should be logged
    With user, timestamp, and field accessed

  Scenario: Emergency access override
    Given a Viewer needs to see budget for urgent issue
    When an Admin grants temporary access
    Then the Viewer can see budget for 24 hours
    And this is logged with justification
\`\`\``,
  },
];

// ============================================================================
// SUB-EPIC 6: AI & INTELLIGENCE (10 stories)
// ============================================================================

export const AI_STORIES = [
  {
    id: 'US-PORT-065',
    title: 'AI Application Discovery Recommendations',
    storyPoints: 8,
    priority: 'medium',
    description: `As a **Portfolio Administrator**,
I want AI to suggest applications to add to the portfolio,
So that I maintain complete inventory coverage.

**Acceptance Criteria:**
- Analyze existing applications for patterns
- Scan available data sources for gaps
- Suggest applications to add
- Provide confidence score
- One-click add functionality

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: AI Application Discovery
  As a Portfolio Administrator
  I want AI discovery suggestions
  So that inventory is complete

  Background:
    Given AI discovery is enabled
    And the portfolio has 50 applications

  Scenario: Generate discovery suggestions
    When I click "Run AI Discovery"
    Then the AI should analyze patterns
    And suggest potential applications:
      | suggestion | source | confidence |
      | Data Warehouse | Referenced in integrations | 85% |
      | Authentication Service | Common dependency | 78% |
      | Mobile Backend | API references | 72% |

  Scenario: Review suggestion details
    When I click on "Data Warehouse" suggestion
    Then I should see:
      | field | value |
      | Why Suggested | Referenced 12 times in integrations |
      | Similar Existing | Analytics Platform, BI Tool |
      | Estimated Type | Database |
    And option to "Add to Portfolio"

  Scenario: Accept suggestion
    When I click "Add to Portfolio" on a suggestion
    Then an application form should open
    Pre-filled with AI-suggested data
    And I can edit before saving

  Scenario: Dismiss suggestion
    When I click "Dismiss" on a suggestion
    Then it should be removed from the list
    And AI should learn from this feedback

  Scenario: Schedule regular discovery
    When I enable "Weekly AI Discovery"
    Then suggestions should be generated weekly
    And I should be notified of new suggestions
\`\`\``,
  },
  {
    id: 'US-PORT-066',
    title: 'AI Health Status Predictions',
    storyPoints: 8,
    priority: 'medium',
    description: `As a **Portfolio Manager**,
I want AI to predict initiative health status,
So that I can take proactive action.

**Acceptance Criteria:**
- Analyze historical health patterns
- Predict future health status
- Identify contributing factors
- Suggest preventive actions
- Confidence intervals on predictions

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: AI Health Status Predictions
  As a Portfolio Manager
  I want AI health predictions
  So that I can act proactively

  Background:
    Given initiative "Data Platform" is currently "Green"
    And has 3 months of history

  Scenario: View health prediction
    When I view the initiative health section
    Then I should see:
      | current | predicted (30 days) | confidence |
      | Green | Yellow | 72% |

  Scenario: View contributing factors
    Given a Yellow prediction
    When I click "Why this prediction?"
    Then I should see:
      | factor | impact |
      | Budget burn rate accelerating | High |
      | 2 milestones at risk | Medium |
      | Similar initiatives went Yellow | Context |

  Scenario: View suggested actions
    Given a Yellow prediction
    Then I should see suggestions:
      | action | expected impact |
      | Review budget with sponsor | May prevent budget issue |
      | Accelerate at-risk milestones | Reduce timeline risk |

  Scenario: Override prediction
    Given I disagree with the prediction
    When I mark it as "Override - Will remain Green"
    And provide reason "Additional funding approved"
    Then the prediction should be noted as overridden

  Scenario: Track prediction accuracy
    When I view AI Performance
    Then I should see historical accuracy:
      | predictions | correct | accuracy |
      | 100 | 78 | 78% |
\`\`\``,
  },
  {
    id: 'US-PORT-067',
    title: 'AI Budget Forecasting',
    storyPoints: 8,
    priority: 'medium',
    description: `As a **Finance Manager**,
I want AI to forecast budget consumption,
So that I can plan for funding needs.

**Acceptance Criteria:**
- Analyze spending patterns
- Project future spending
- Identify potential overruns
- Scenario modeling
- Portfolio-level forecasts

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: AI Budget Forecasting
  As a Finance Manager
  I want budget forecasts
  So that I can plan funding

  Background:
    Given initiative "Cloud Migration" has $500k budget
    And 60% has been spent in 6 months

  Scenario: View budget forecast
    When I view the budget section
    Then I should see:
      | metric | value |
      | Current Spent | $300,000 |
      | AI Forecast (at completion) | $520,000 |
      | Variance | +$20,000 (4% over) |

  Scenario: View forecast assumptions
    When I click "View Forecast Details"
    Then I should see:
      | assumption |
      | Spending rate: $50k/month |
      | Project duration: remaining 4 months |
      | Seasonal adjustment: +5% for Q4 |

  Scenario: Run scenario analysis
    When I click "What If: Extend by 2 months"
    Then the forecast should update:
      | scenario | forecast |
      | Base | $520,000 |
      | +2 months | $620,000 |

  Scenario: Alert on predicted overrun
    Given forecast exceeds budget by > 10%
    Then an alert should be generated
    And stakeholders should be notified
    And it should appear in risk assessment

  Scenario: Portfolio-level forecast
    When I view the portfolio budget dashboard
    Then I should see aggregate forecast:
      | total budget | forecast spend | variance |
      | $5,000,000 | $5,200,000 | +4% |
\`\`\``,
  },
  {
    id: 'US-PORT-068',
    title: 'AI Duplicate Suggestion',
    storyPoints: 5,
    priority: 'low',
    description: `As a **Portfolio Administrator**,
I want AI to identify potential duplicate applications,
So that I can consolidate the portfolio.

**Acceptance Criteria:**
- Analyze application attributes for similarity
- Suggest potential duplicates
- Show similarity score and reasons
- Merge workflow integration
- Learn from user decisions

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: AI Duplicate Suggestion
  As a Portfolio Administrator
  I want AI duplicate detection
  So that I can consolidate

  Background:
    Given the portfolio has 100 applications
    And AI duplicate detection is enabled

  Scenario: View duplicate suggestions
    When I navigate to Portfolio Health > Duplicates
    Then I should see suggested duplicates:
      | app 1 | app 2 | similarity | reason |
      | CRM Tool | Customer CRM | 85% | Similar name, same owner |
      | Order API | Order Service | 78% | Same technology, similar function |

  Scenario: Review duplicate pair
    When I click on "CRM Tool / Customer CRM"
    Then I should see side-by-side comparison:
      | field | CRM Tool | Customer CRM |
      | name | CRM Tool | Customer CRM |
      | owner | Sales Team | Sales Team |
      | tech stack | Salesforce | Salesforce |
      | users | 50 | 45 |

  Scenario: Confirm as duplicate
    When I click "Confirm Duplicate"
    Then I should enter the merge workflow
    And choose which record to keep
    And merge data as appropriate

  Scenario: Mark as not duplicate
    When I click "Not Duplicate"
    And provide reason "Different business functions"
    Then the pair should be removed from suggestions
    And AI should learn from this feedback

  Scenario: Run on-demand scan
    When I click "Re-scan for Duplicates"
    Then a new analysis should run
    And new suggestions should appear
\`\`\``,
  },
  {
    id: 'US-PORT-069',
    title: 'Natural Language Search',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **User**,
I want to search the portfolio using natural language,
So that I can find information without knowing exact terms.

**Acceptance Criteria:**
- Accept natural language queries
- Understand intent and context
- Return relevant results
- Support follow-up questions
- Suggest related queries

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Natural Language Search
  As a User
  I want natural language search
  So that I can find things easily

  Background:
    Given I am on the Portfolio page
    And I click the search bar

  Scenario: Simple natural language query
    When I type "show me all critical applications"
    Then the search should interpret as: criticality = "critical"
    And display matching applications

  Scenario: Complex query
    When I type "initiatives that are behind schedule and over budget"
    Then the search should interpret:
      | filter |
      | health_status = "Red" or milestone overdue |
      | budget_spent > budget |
    And display matching initiatives

  Scenario: Question format
    When I type "which applications use PostgreSQL?"
    Then results should show applications with PostgreSQL in tech stack
    And highlight where PostgreSQL appears

  Scenario: Follow-up query
    Given I searched "critical applications"
    When I type "of those, which are deprecated?"
    Then the search should understand context
    And filter to critical AND deprecated

  Scenario: Query suggestions
    When I start typing "applications owned by"
    Then I should see suggestions:
      | suggestion |
      | applications owned by [team name] |
      | applications owned by Sales Team |
    Based on available data
\`\`\``,
  },
  {
    id: 'US-PORT-070',
    title: 'AI-Generated Executive Summary',
    storyPoints: 5,
    priority: 'low',
    description: `As an **Executive**,
I want AI to generate executive summaries,
So that I get concise portfolio insights.

**Acceptance Criteria:**
- Generate summary from portfolio data
- Highlight key insights and risks
- Customizable focus areas
- Natural language output
- Export to document

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: AI-Generated Executive Summary
  As an Executive
  I want AI summaries
  So that I get quick insights

  Background:
    Given the portfolio has 15 initiatives and 50 applications

  Scenario: Generate summary
    When I click "Generate AI Summary"
    Then I should see a natural language summary:
      """
      Portfolio Overview (Q4 2024):
      
      The technology portfolio consists of 15 active initiatives 
      and 50 applications. Overall health is GOOD with 80% of 
      initiatives on track. Key highlights:
      
      - CX Modernization (65% complete) is the flagship initiative
      - 3 applications are candidates for retirement
      - Total portfolio investment: $5M (64% utilized)
      
      Areas of attention:
      - Data Platform initiative is showing budget concerns
      - 2 critical applications have no backup owner
      """

  Scenario: Customize focus
    When I select focus areas "Risks" and "Budget"
    And regenerate
    Then the summary should emphasize those areas

  Scenario: Ask follow-up
    Given I see the summary
    When I ask "Tell me more about the budget concerns"
    Then AI should provide more detail on that topic

  Scenario: Export summary
    When I click "Export to Word"
    Then a formatted document should download
    With proper headings and structure

  Scenario: Schedule summary
    When I enable "Weekly AI Summary"
    Then a summary should be emailed weekly
    To configured recipients
\`\`\``,
  },
  {
    id: 'US-PORT-071',
    title: 'Anomaly Detection Alerts',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Portfolio Manager**,
I want AI to detect anomalies in portfolio data,
So that unusual situations are flagged early.

**Acceptance Criteria:**
- Detect unusual patterns in data
- Alert on significant deviations
- Provide context for anomalies
- Adjustable sensitivity
- Learn from dismissed alerts

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Anomaly Detection Alerts
  As a Portfolio Manager
  I want anomaly detection
  So that issues are flagged early

  Background:
    Given AI anomaly detection is enabled

  Scenario: Detect spending anomaly
    Given an initiative normally spends $50k/month
    When this month's spend is $120k
    Then an anomaly alert should be raised:
      | alert | Unusual spending pattern |
      | initiative | Data Platform |
      | normal | $50k/month |
      | current | $120k |
      | deviation | +140% |

  Scenario: Detect progress anomaly
    Given an initiative progresses ~5% per week
    When it hasn't progressed in 3 weeks
    Then an alert should be raised: "Stalled progress detected"

  Scenario: View anomaly context
    When I click on an anomaly alert
    Then I should see:
      | context |
      | Historical pattern |
      | Comparison to similar initiatives |
      | Possible explanations |

  Scenario: Dismiss false positive
    When I dismiss an alert as "Expected - Year-end purchases"
    Then the alert should be closed
    And AI should factor this into future detection

  Scenario: Adjust sensitivity
    When I set anomaly sensitivity to "Low"
    Then only major deviations should trigger alerts
    Reducing noise from minor variations
\`\`\``,
  },
  {
    id: 'US-PORT-072',
    title: 'Smart Categorization Suggestions',
    storyPoints: 5,
    priority: 'low',
    description: `As a **Portfolio Administrator**,
I want AI to suggest categorizations for applications,
So that classification is consistent.

**Acceptance Criteria:**
- Analyze application attributes
- Suggest type, category, criticality
- Learn from existing classifications
- Bulk suggestion review
- Confidence scoring

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Smart Categorization Suggestions
  As a Portfolio Administrator
  I want AI categorization
  So that classification is consistent

  Background:
    Given an application "Analytics Dashboard" is created
    And minimal information is provided

  Scenario: Suggest categorization on create
    Given I entered name "Analytics Dashboard"
    And description "Visualize business metrics"
    Then AI should suggest:
      | field | suggestion | confidence |
      | type | Web Application | 85% |
      | category | Analytics | 90% |
      | criticality | Medium | 70% |

  Scenario: Accept suggestions
    When I click "Apply Suggestions"
    Then all suggested values should be populated
    And I can still modify them

  Scenario: Suggest based on similar apps
    Given 5 applications contain "Dashboard" in name
    And all are type "Web Application"
    Then AI should use this pattern in suggestions

  Scenario: Bulk review suggestions
    Given 20 applications have missing categorizations
    When I run "AI Categorization Review"
    Then I should see a list of suggestions
    And I can approve/reject each in bulk

  Scenario: Improve accuracy over time
    Given I've corrected 50 AI suggestions
    Then the AI should learn from corrections
    And future suggestions should be more accurate
\`\`\``,
  },
  {
    id: 'US-PORT-073',
    title: 'AI Modernization Recommendations',
    storyPoints: 5,
    priority: 'medium',
    description: `As an **Enterprise Architect**,
I want AI to recommend applications for modernization,
So that I can prioritize technical debt reduction.

**Acceptance Criteria:**
- Analyze technology age and patterns
- Score modernization priority
- Recommend modernization approach
- Estimate effort and impact
- Track recommendation outcomes

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: AI Modernization Recommendations
  As an Enterprise Architect
  I want AI modernization recommendations
  So that I can reduce technical debt

  Background:
    Given the portfolio has 50 applications
    And technology stack data is populated

  Scenario: Generate modernization recommendations
    When I navigate to AI Insights > Modernization
    Then I should see recommendations:
      | application | priority | approach | reason |
      | Legacy CRM | Critical | Replace | Tech stack EOL |
      | Order System | High | Replatform | Performance issues |
      | Analytics v1 | Medium | Refactor | Outdated framework |

  Scenario: View recommendation details
    When I click on "Legacy CRM"
    Then I should see:
      | field | value |
      | Current Stack | VB6, SQL Server 2008 |
      | Issue | Both technologies end-of-life |
      | Recommended | Migrate to modern CRM platform |
      | Estimated Effort | 6-9 months |
      | Business Impact | High - core business function |

  Scenario: Link to initiative
    When I click "Create Initiative from Recommendation"
    Then an initiative should be created
    Pre-filled with modernization details

  Scenario: Dismiss recommendation
    When I click "Dismiss" with reason "Already planned"
    Then the recommendation should be removed
    And linked to existing initiative

  Scenario: Track outcomes
    Given I acted on a recommendation
    When the modernization is complete
    Then I can mark the outcome
    And AI should track success rate
\`\`\``,
  },
  {
    id: 'US-PORT-074',
    title: 'Predictive Risk Scoring',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Risk Manager**,
I want AI to predict risk scores for initiatives,
So that I can focus on highest-risk items.

**Acceptance Criteria:**
- Calculate risk score from multiple factors
- Predict future risk trajectory
- Identify risk drivers
- Compare across initiatives
- Historical risk accuracy

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Predictive Risk Scoring
  As a Risk Manager
  I want AI risk scoring
  So that I focus on highest risks

  Background:
    Given the portfolio has 15 active initiatives

  Scenario: View portfolio risk scores
    When I navigate to Risk Dashboard
    Then I should see initiatives ranked by risk:
      | initiative | risk score | trend |
      | Legacy Migration | 85 | ↑ |
      | Cloud Migration | 62 | → |
      | CX Modernization | 35 | ↓ |

  Scenario: View risk score factors
    When I click on "Legacy Migration"
    Then I should see factor breakdown:
      | factor | weight | score |
      | Complexity | 25% | 90 |
      | Resource Risk | 20% | 80 |
      | Technical Risk | 30% | 85 |
      | Timeline Risk | 25% | 80 |

  Scenario: Predict future risk
    Given current risk score is 62
    When I view 30-day prediction
    Then I should see:
      | prediction | risk score | confidence |
      | 30 days | 72 | 75% |
    And factors driving the increase

  Scenario: Compare initiatives
    When I select 3 initiatives to compare
    Then I should see risk scores side by side
    And identify which factors differ most

  Scenario: Track prediction accuracy
    When I view AI performance
    Then I should see:
      | metric | value |
      | Predictions made | 200 |
      | Within 10% accuracy | 85% |
      | Average error | 8 points |
\`\`\``,
  },
];

// ============================================================================
// BUFFER: POLISH & ACCESSIBILITY (4 stories)
// ============================================================================

export const POLISH_STORIES = [
  {
    id: 'US-PORT-075',
    title: 'Responsive Mobile Layout',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **User**,
I want the portfolio module to work on mobile devices,
So that I can access information on the go.

**Acceptance Criteria:**
- Responsive layout for all views
- Touch-friendly interactions
- Collapsible navigation
- Optimized data tables for small screens
- Critical actions accessible on mobile

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Responsive Mobile Layout
  As a User
  I want mobile access
  So that I can work on the go

  Background:
    Given I am using a mobile device (< 768px width)

  Scenario: View portfolio on mobile
    When I navigate to Portfolio
    Then the layout should be single column
    And navigation should be in a hamburger menu
    And tabs should be scrollable horizontally

  Scenario: View list on mobile
    Given I am on the Applications list
    Then the table should show key columns only:
      | column |
      | Name |
      | Status |
      | Actions |
    And I can expand a row for full details

  Scenario: Touch-friendly interactions
    Then buttons should be at least 44px tap target
    And swipe gestures should work for common actions
    And pull-to-refresh should reload data

  Scenario: Create item on mobile
    When I tap "Add Application"
    Then the form should be full-screen modal
    And keyboard should not obscure inputs
    And I can successfully submit

  Scenario: Charts on mobile
    Given I view the dashboard
    Then charts should resize appropriately
    And remain legible and interactive
\`\`\``,
  },
  {
    id: 'US-PORT-076',
    title: 'Accessibility Compliance (WCAG 2.1)',
    storyPoints: 5,
    priority: 'high',
    description: `As a **User with disabilities**,
I want the portfolio module to be fully accessible,
So that I can use it with assistive technologies.

**Acceptance Criteria:**
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation for all features
- Sufficient color contrast
- ARIA labels and landmarks

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Accessibility Compliance
  As a User with disabilities
  I want accessibility
  So that I can use assistive tech

  Scenario: Screen reader navigation
    Given I am using a screen reader
    When I navigate to Portfolio
    Then I should hear appropriate page title
    And tab list should be announced
    And I can navigate with landmarks

  Scenario: Keyboard-only navigation
    Given I am using keyboard only (no mouse)
    When I navigate all portfolio features
    Then I can access all interactive elements
    And focus is always visible
    And no keyboard traps exist

  Scenario: Color contrast
    Then all text should have contrast ratio >= 4.5:1
    And large text should have ratio >= 3:1
    And focus indicators should be visible

  Scenario: Form accessibility
    Given I am in the initiative form
    Then all inputs should have labels
    And error messages should be announced
    And required fields should be indicated

  Scenario: Data table accessibility
    Given I am viewing the applications table
    Then table should have proper headers
    And row data should be associated with headers
    And I can navigate cells with arrow keys
\`\`\``,
  },
  {
    id: 'US-PORT-077',
    title: 'Dark Mode Support',
    storyPoints: 3,
    priority: 'low',
    description: `As a **User**,
I want dark mode support in the portfolio module,
So that I can reduce eye strain in low-light environments.

**Acceptance Criteria:**
- Full dark mode theme
- Charts and visualizations adapt
- Respects system preference
- Manual toggle available
- Consistent with rest of application

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Dark Mode Support
  As a User
  I want dark mode
  So that I reduce eye strain

  Scenario: System preference respected
    Given my system is set to dark mode
    When I open the portfolio module
    Then it should display in dark mode
    Without needing manual setting

  Scenario: Manual toggle
    Given I am in light mode
    When I click the theme toggle
    Then the interface should switch to dark mode
    And my preference should be saved

  Scenario: Charts in dark mode
    Given I am in dark mode
    Then all charts should use dark-friendly colors
    And labels should be visible
    And no elements should be unreadable

  Scenario: Consistent styling
    Given I switch between portfolio tabs
    Then dark mode should be consistent
    And all components should be properly themed

  Scenario: Print from dark mode
    Given I am in dark mode
    When I print a view
    Then the print should use light mode colors
    For better paper readability
\`\`\``,
  },
  {
    id: 'US-PORT-078',
    title: 'Performance Optimization',
    storyPoints: 5,
    priority: 'high',
    description: `As a **User**,
I want the portfolio module to load quickly,
So that I can work efficiently without delays.

**Acceptance Criteria:**
- Initial load < 2 seconds
- Large lists virtualized
- Lazy loading for detail pages
- Optimistic updates for interactions
- Efficient API calls with caching

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Performance Optimization
  As a User
  I want fast loading
  So that I work efficiently

  Scenario: Fast initial load
    When I navigate to Portfolio
    Then the page should be interactive within 2 seconds
    And skeleton loaders should show during data fetch

  Scenario: Large list performance
    Given there are 1000 applications
    When I view the applications list
    Then only visible rows should be rendered
    And scrolling should be smooth (60 fps)

  Scenario: Optimistic updates
    When I update an initiative status
    Then the UI should update immediately
    Without waiting for server response
    And show error if server fails

  Scenario: Cached data
    Given I viewed the initiatives list
    When I navigate away and return
    Then cached data should show instantly
    And fresh data should load in background

  Scenario: Efficient search
    Given 1000 applications exist
    When I type in the search box
    Then results should appear within 300ms
    And debouncing should prevent excess API calls
\`\`\``,
  },
];

console.log('Story definitions Part 3 loaded.');
console.log('Governance stories:', GOVERNANCE_STORIES.length);
console.log('AI stories:', AI_STORIES.length);
console.log('Polish stories:', POLISH_STORIES.length);
console.log('TOTAL STORIES:', GOVERNANCE_STORIES.length + AI_STORIES.length + POLISH_STORIES.length);

