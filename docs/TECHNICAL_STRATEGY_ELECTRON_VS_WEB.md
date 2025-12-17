# Technical Strategy: Electron vs. Web (PWA) for Arkhitekton

**Date:** December 16, 2025
**Context:** Decision on whether to build a desktop application (Electron) alongside the web platform.

## Executive Summary
**Do not build an Electron app yet.** 
Adopt a **"Figma First" (Pure Web/PWA)** strategy. Move to an Electron wrapper only when deep local system integration (security/offline/compute) becomes a hard requirement for Enterprise customers.

---

## The Litmus Test: Local File System Access
The deciding factor is whether the application strictly requires direct, unrestricted access to the user's local file system without user interaction.

### 1. The "Figma Model" (Pure Web / PWA) - **RECOMMENDED START**
*   **Architecture:** Browser-based client connecting to cloud APIs (GitHub, GitLab, Bitbucket).
*   **Code Analysis:** Code is analyzed via server-side processing or API calls after being pushed to a repository.
*   **Pros:**
    *   **Zero Friction:** Users just click a link. No installation required.
    *   **Faster Iteration:** CI/CD deploys instantly to all users. No auto-updater infrastructure needed.
    *   **Collaboration:** Optimized for real-time multiplayer (WebSocket/CRDTs).
*   **Cons:**
    *   Cannot easily scan a local folder without user permission prompts.
    *   Dependent on code being pushed to a remote repo first.
*   **Mitigation:** The modern browser [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) allows web apps to read/write local directories with user consent, bridging 80% of the gap.

### 2. The "VS Code Model" (Electron) - **PHASE 3/4 GOAL**
*   **Architecture:** Web app wrapped in a Chromium container with Node.js bindings.
*   **Why VS Code uses it:** It *must* act as a text editor reading/writing directly to `C:\Users\Dev\Project`.
*   **When Arkhitekton needs it:**
    *   **Local-First Security:** Enterprise clients often refuse to upload source code to the cloud for analysis. An Electron app can run parsers *locally* and only send the resulting metadata (diagrams) to the cloud.
    *   **Offline Mode:** True offline capability (e.g., working on architecture on a plane).
    *   **Heavy Compute:** Offloading heavy parsing/graph processing from the cloud server to the user's machine to reduce cloud costs.

## Roadmap Recommendation

| Phase | Technology | Capability Focus |
| :--- | :--- | :--- |
| **Current** | **Web (React/Vite)** | Collaboration, Cloud Repo Integration, ease of access. |
| **Phase 2** | **PWA (Progressive Web App)** | "Installable" web app, File System Access API for local folder scanning. |
| **Phase 3+** | **Electron / Tauri** | **Only if:** Deep offline mode or "Local-Only Analysis" becomes a dealbreaker for Enterprise sales. |

## Strategic Verdict
Winning in the Architecture tool space is about **Collaboration** (Web wins) first, and **Local Execution** (Electron wins) second. **Be Figma before you try to be VS Code.**

