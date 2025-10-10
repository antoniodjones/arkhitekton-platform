# GitHub Actions Integration Plan for ARKHITEKTON

## Overview

This document outlines the comprehensive GitHub Actions integration for ARKHITEKTON that ensures **every code change is automatically linked to user stories with acceptance criteria**. This transforms the Plan page into a powerful project management hub with complete traceability from strategy to deployment.

## Vision

Transform ARKHITEKTON into an enterprise-grade platform where:
- Every commit is traceable to a documented user story
- No code can be merged without proper acceptance criteria
- Story status automatically syncs with GitHub branch/PR activity
- Complete visibility into code-to-story relationships

## Architecture Components

### 1. Settings Infrastructure ✅ COMPLETE

**Schema: `application_settings` table**
```typescript
{
  id: uuid,
  key: string (unique),
  value: string (encrypted for sensitive),
  category: string ('github', 'jira', 'automation', 'preferences'),
  isSensitive: boolean,
  metadata: jsonb
}
```

**API Endpoints:**
- `GET /api/settings?category={category}` - List settings by category
- `GET /api/settings/:key` - Get specific setting (masked if sensitive)
- `POST /api/settings` - Create new setting (encrypts sensitive values)
- `PATCH /api/settings/:key` - Update setting (preserves encrypted secrets)
- `DELETE /api/settings/:key` - Delete setting

**Security:**
- AES-256-CBC encryption for sensitive values
- Environment-based encryption key (ENCRYPTION_KEY)
- Sensitive values masked in API responses (••••••••)
- Frontend preserves existing secrets during updates

### 2. GitHub Integration Configuration ✅ COMPLETE

**Settings Page UI:**
- Repository URL configuration
- Personal Access Token (PAT) with required scopes: `repo`, `write:repo_hook`
- Default branch selection
- Auto-generated webhook URL
- Connection test functionality
- Persist settings with encryption

**Stored Settings:**
- `github.repo_url` (plain text)
- `github.token` (encrypted)
- `github.default_branch` (plain text)

### 3. GitHub Webhook Handler 🔄 IN PROGRESS

**Endpoint:** `/api/webhooks/github`

**Functionality:**
- Receives GitHub push events
- Extracts user story IDs from commit messages (US-XXXXXXX format)
- Validates story IDs against database
- Updates `githubCommits` array for each story
- Logs invalid story IDs for review
- Returns webhook processing confirmation

**Commit Message Format:**
```
feat: Add new feature [US-HCMCP76]

- Implement feature X
- Update component Y
```

**Story Update:**
```typescript
userStory.githubCommits = [
  ...existingCommits,
  {
    sha: "abc123",
    message: "feat: Add new feature",
    author: "developer@example.com",
    timestamp: "2025-10-10T03:00:00Z"
  }
]
```

### 4. Story Enforcement Rules Engine 📋 PLANNED

**Validation Rules:**
1. **Commit must reference valid user story ID**
   - Reject commits without US-XXXXXXX format
   - Verify story exists in database
   
2. **Story must have acceptance criteria**
   - Block commits to stories without acceptance criteria
   - Enforce Gherkin format (Given/When/Then)
   
3. **Story must be in valid status**
   - Warn if committing to backlog stories
   - Allow: in-progress, review
   - Flag: backlog, done

**Violation Handling:**
- Log violations in Plan dashboard
- Send notifications to team
- Generate violation reports

### 5. Acceptance Criteria Validator 📋 PLANNED

**Gherkin Format Validation:**
```gherkin
Given a user is authenticated
When they submit the form
Then the data is saved to the database
And a confirmation message is displayed
```

**Validation Rules:**
- Must contain "Given" clause (context)
- Must contain "When" clause (action)
- Must contain "Then" clause (outcome)
- Optional "And" clauses for additional steps

**Integration Points:**
- Pre-commit validation via GitHub Actions
- Status check on user story transitions
- Automated feedback on format issues

### 6. GitHub Actions Workflow Generator 🚀 PLANNED

**Generated Workflows:**

**a) PR Story Validation** (`.github/workflows/pr-story-validation.yml`)
```yaml
name: Validate User Story
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Extract Story IDs
        # Parse PR description and commits for US-XXXXXXX
      
      - name: Validate Stories
        # Check stories have acceptance criteria
        # Verify stories are in correct status
      
      - name: Post Status
        # Update PR with validation results
```

**b) Commit-to-Story Linking** (`.github/workflows/commit-linking.yml`)
```yaml
name: Link Commits to Stories
on:
  push:
    branches: ['main', 'develop']

jobs:
  link:
    runs-on: ubuntu-latest
    steps:
      - name: Extract Story IDs from Commits
      
      - name: Update Stories via Webhook
        # POST to /api/webhooks/github
```

**c) Status Automation** (`.github/workflows/status-sync.yml`)
```yaml
name: Sync Story Status
on:
  pull_request:
    types: [opened, closed]
  create:
    branches: ['*']

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Update Story Status
        # branch created → in-progress
        # PR opened → review
        # PR merged → done
```

### 7. Real-time Story Status Updates 🔄 PLANNED

**GitHub Event → Story Status Mapping:**

| GitHub Event | Story Status Transition |
|--------------|------------------------|
| Branch created with `US-XXX` in name | backlog → in-progress |
| Pull request opened | in-progress → review |
| Pull request approved | review → ready |
| Pull request merged | ready → done |
| Pull request closed (not merged) | review → in-progress |

**Implementation:**
- Webhook handler processes GitHub events
- Validates story exists and user has permissions
- Updates story status with audit trail
- Triggers notifications to stakeholders

### 8. Traceability Dashboard 📊 PLANNED

**Plan Page Enhancement:**

**New Tab: "Traceability"**

**Sections:**
1. **Stories with Commits**
   - Story ID, Title, Commit Count
   - Latest commit info
   - Status indicator

2. **Orphan Commits (Violations)**
   - Commits without story IDs
   - Highlighted in red
   - Quick action to create story

3. **Stories Without Criteria**
   - Stories missing acceptance criteria
   - Blocked from receiving commits
   - Edit button for quick fix

4. **GitHub Activity Feed**
   - Real-time commit stream
   - PR events
   - Status changes
   - Team activity

**Filtering:**
- Date range selector
- Developer filter
- Status filter
- Repository filter

### 9. AI Story Generation 🤖 FUTURE

**Auto-generate stories from orphan commits:**

**Workflow:**
1. Detect commit without story ID
2. Analyze commit message and diff
3. Use AI to generate:
   - Story title (from commit message)
   - Description (from diff analysis)
   - Acceptance criteria template
4. Create draft story with `AI-GENERATED` label
5. Link commit to new story
6. Notify developer for review

**AI Prompts:**
```
Analyze this commit and generate a user story:

Commit: "Add user authentication endpoint"
Diff: [code changes]

Generate:
1. Story title (action-oriented)
2. Description (what and why)
3. Acceptance criteria (Given/When/Then format)
```

### 10. Jira Integration 🔌 FUTURE

**Bidirectional Sync:**
- ARKHITEKTON story ↔ Jira issue
- Status sync
- Comment sync
- Attachment sync

**Field Mapping:**
```typescript
{
  arkhitekton: {
    id: "US-HCMCP76",
    title: "Story title",
    status: "in-progress"
  },
  jira: {
    key: "PROJ-123",
    summary: "Story title",
    status: "In Progress"
  }
}
```

## Implementation Timeline

### Phase 1: Foundation ✅ COMPLETE
- [x] Settings infrastructure
- [x] GitHub integration UI
- [x] Encryption for sensitive data
- [x] Database persistence

### Phase 2: Core Integration 🔄 CURRENT
- [ ] GitHub webhook handler
- [ ] Commit-to-story linking
- [ ] Story enforcement rules
- [ ] Acceptance criteria validator

### Phase 3: Automation
- [ ] GitHub Actions workflow generator
- [ ] Status automation
- [ ] Traceability dashboard

### Phase 4: Advanced Features
- [ ] AI story generation
- [ ] Jira integration
- [ ] Settings export/import
- [ ] Analytics and reporting

## User Stories

All 12 user stories have been created in the Plan:

1. **US-HCMCP76** - Settings Page Infrastructure ✅
2. **US-HLIA8JH** - Application Settings Database Schema ✅
3. **US-HT08IRF** - GitHub Integration Settings UI ✅
4. **US-I0HASQC** - GitHub Webhook Handler for Commit Events
5. **US-XB3X4EK** - User Story Enforcement Rules Engine
6. **US-XIGJUQ7** - Acceptance Criteria Validator
7. **US-XQ5BNV5** - GitHub Actions Workflow Generator
8. **US-XXTW15E** - Story-to-Code Traceability Dashboard
9. **US-DBTLTHE** - Auto-Generation of Stories from Commits (AI)
10. **US-DJHBJF0** - Jira Integration Settings
11. **US-DRB6K6D** - Settings Export/Import with Encryption
12. **US-DYIDEFD** - Real-time Story Status Updates

## Security Considerations

### Encryption
- AES-256-CBC encryption for sensitive settings
- Unique IV per encrypted value
- Scrypt key derivation (32-byte keys)
- Environment-based encryption key management

### Secret Management
- ENCRYPTION_KEY stored as environment secret
- No hardcoded keys in repository
- Production: Use AWS KMS, Azure Key Vault, or HashiCorp Vault
- Key rotation strategy documented

### API Security
- GitHub webhooks verify signature
- Personal Access Tokens encrypted at rest
- Sensitive values masked in API responses
- HTTPS required for webhook endpoints

## Configuration

### Environment Variables Required

```bash
# GitHub Integration
ENCRYPTION_KEY=<32+ character secure random string>

# Optional: GitHub App credentials (alternative to PAT)
GITHUB_APP_ID=
GITHUB_APP_PRIVATE_KEY=
GITHUB_WEBHOOK_SECRET=
```

### GitHub Repository Setup

1. **Generate Personal Access Token**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Create token with scopes: `repo`, `write:repo_hook`
   - Copy token (shown once)

2. **Configure Webhook**
   - Repository Settings → Webhooks → Add webhook
   - Payload URL: `https://your-arkhitekton.replit.app/api/webhooks/github`
   - Content type: `application/json`
   - Events: `push`, `pull_request`, `create`, `delete`
   - Active: ✓

3. **Set up GitHub Actions**
   - Add generated workflow files to `.github/workflows/`
   - Configure repository secrets for ARKHITEKTON API access
   - Enable Actions in repository settings

## API Reference

### Webhook Payload Processing

**POST /api/webhooks/github**

**Request Headers:**
```
X-GitHub-Event: push
X-Hub-Signature-256: sha256=<signature>
Content-Type: application/json
```

**Request Body (Push Event):**
```json
{
  "ref": "refs/heads/main",
  "commits": [
    {
      "id": "abc123...",
      "message": "feat: Add feature [US-HCMCP76]",
      "author": {
        "name": "Developer",
        "email": "dev@example.com"
      },
      "timestamp": "2025-10-10T03:00:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "processed": 1,
  "linked": 1,
  "stories_updated": ["US-HCMCP76"],
  "violations": []
}
```

## Testing Strategy

### Unit Tests
- Settings encryption/decryption
- Story ID extraction from commits
- Gherkin format validation
- Status transition logic

### Integration Tests
- GitHub webhook processing
- End-to-end commit linking
- Status automation workflow
- Error handling and rollback

### Security Tests
- Encryption key validation
- Secret masking verification
- Webhook signature verification
- SQL injection prevention

## Monitoring and Observability

### Metrics to Track
- Commits linked to stories (%)
- Violations detected (count)
- Average time: commit → story update
- Stories with acceptance criteria (%)
- GitHub Actions workflow success rate

### Logging
- All webhook events
- Validation failures
- Story status changes
- Encryption operations

### Alerts
- Webhook processing failures
- High violation rates
- Missing acceptance criteria trends
- Encryption key issues

## Success Criteria

### Phase 1 (Complete)
✅ Settings page accessible at `/settings`
✅ GitHub configuration saved and encrypted
✅ Sensitive tokens properly secured

### Phase 2 (In Progress)
- [ ] Commits automatically linked to stories
- [ ] Validation rules enforced on commits
- [ ] Acceptance criteria validated

### Phase 3 (Future)
- [ ] GitHub Actions workflows generated
- [ ] Story status syncs with GitHub events
- [ ] Traceability dashboard shows complete history

## Conclusion

This GitHub integration transforms ARKHITEKTON into a comprehensive enterprise architecture platform with complete traceability. Every design decision, every line of code, and every deployment is traceable back to documented requirements with validated acceptance criteria.

**The future of enterprise architecture is traceable, automated, and AI-enhanced.**
