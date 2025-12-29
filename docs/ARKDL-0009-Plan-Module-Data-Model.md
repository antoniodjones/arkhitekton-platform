# Plan Module Data Model Specification

This document defines the data model attributes, types, and validation rules for the Plan Module. It serves as a reference for external systems, API integrations, or data import/export processes.

## 1. Epics (Value Streams)
High-level strategic initiatives or value streams.

| Field | Type | Required | Description / Constraints |
| :--- | :--- | :--- | :--- |
| `name` | String | **Yes** | The display name of the Epic. |
| `description` | String | No | Detailed description of the Epic's scope. |
| `valueStream` | Enum | **Yes** | Strategic alignment category.<br/>**Values:** `strategy`, `design`, `governance`, `development`, `operations`, `knowledge` |
| `status` | Enum | **Yes** | Lifecycle state.<br/>**Values:** `planned`, `in-progress`, `completed` (Default: `planned`) |
| `priority` | Enum | **Yes** | Relative importance.<br/>**Values:** `low`, `medium`, `high`, `critical` (Default: `medium`) |
| `owner` | String | No | Name or ID of the Epic owner. |
| `startDate` | String | No | Planned start date (e.g., "2025-Q1" or ISO Date). |
| `endDate` | String | No | Planned end date. |
| `targetQuarter` | String | No | Fiscal quarter target (e.g., "Q1 2025"). |

---

## 2. Sprints (Iterations)
Time-boxed iteration containers for work items.

| Field | Type | Required | Description / Constraints |
| :--- | :--- | :--- | :--- |
| `name` | String | **Yes** | e.g., "Sprint 23", "Q4 2025 - Sprint 1" |
| `goal` | String | No | The primary objective of the sprint. |
| `startDate` | Timestamp | **Yes** | ISO 8601 Date String. |
| `endDate` | Timestamp | **Yes** | ISO 8601 Date String. |
| `status` | Enum | **Yes** | **Values:** `planning`, `active`, `completed`, `cancelled` (Default: `planning`) |
| `teamVelocity` | Integer | **Yes** | Planned capacity in story points. (Default: `30`) |

---

## 3. User Stories (Work Items)
Functional requirements or tasks.

| Field | Type | Required | Description / Constraints |
| :--- | :--- | :--- | :--- |
| `title` | String | **Yes** | Summary of the requirement. |
| `description` | String | No | Additional context or details. |
| `acceptanceCriteria` | String | **Yes** | **Must follow Gherkin format** (`Given/When/Then`). |
| `storyPoints` | Integer | **Yes** | Fibonacci scale estimation (1-13). (Default: `3`) |
| `status` | Enum | **Yes** | **Values:** `backlog`, `sprint`, `in-progress`, `review`, `done` (Default: `backlog`) |
| `priority` | Enum | **Yes** | **Values:** `low`, `medium`, `high` (Default: `medium`) |
| `epicId` | String | No | Reference to parent `Epic.id`. |
| `sprintId` | String | No | Reference to `Sprint.id`. |
| `assignee` | String | No | Developer or user assigned to the story. |
| `feature` | String | No | Functional area grouping. |
| `value` | String | No | Business value justification. |
| `requirement` | String | No | Link to external requirement ID. |

---

## 4. Defects (Bugs/Issues)
Quality issues linked to User Stories.

| Field | Type | Required | Description / Constraints |
| :--- | :--- | :--- | :--- |
| `title` | String | **Yes** | Summary of the defect. |
| `description` | String | **Yes** | Steps to reproduce and detailed info. |
| `userStoryId` | String | **Yes** | Reference to the related `UserStory.id`. |
| `severity` | Enum | **Yes** | **Values:** `critical`, `high`, `medium`, `low` (Default: `medium`) |
| `type` | Enum | **Yes** | **Values:** `bug`, `regression`, `performance`, `security`, `usability` (Default: `bug`) |
| `status` | Enum | **Yes** | **Values:** `open`, `in-progress`, `resolved`, `closed`, `rejected` (Default: `open`) |
| `assignedTo` | String | No | Person responsible for fixing the defect. |
| `discoveredBy` | String | No | Person who reported the defect. |

