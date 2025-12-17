# Technical Strategy: Microservices vs. Modular Monolith (API-First)

**Date:** December 16, 2025
**Context:** Decision on when to adopt a Microservices architecture versus maintaining the current Monolithic structure for Arkhitekton.

## Executive Summary
**Stay with a Modular Monolith for the core platform.** 
"API-First" and "Microservices" are orthogonal. We will remain **API-First** (designing contracts before implementation) but deploy as a **Modular Monolith** to preserve developer velocity and performance. Microservices will be introduced *only* for specific, isolated use cases like heavy compute or AI processing.

---

## The Core Concept: API-First vs. Microservices
*   **API-First:** A design philosophy where the API contract (schema/routes) is the primary product, enabling frontend/backend decoupling. Arkhitekton effectively does this via `schema.ts` and `routes.ts`.
*   **Microservices:** An infrastructure choice to deploy distinct business domains as separate processes/servers.

## 1. The Strategy: "Modular Monolith"
Arkhitekton currently operates as distinct logical domains (Wiki, Design, APM, Plan) within a single process (`express`).

*   **Recommendation:** **Maintain this structure.**
*   **Reasoning:** 
    *   **Data Coupling:** Our "Killer Feature" is the tight linkage between entities (Requirements → Designs → Code). Distributed transactions across microservices to maintain these links would create immense complexity.
    *   **Latency:** Real-time collaboration (Yjs/WebSockets) benefits from shared memory. The latency of internal HTTP/gRPC calls between services degrades the user experience.
    *   **Velocity:** Refactoring code across modules is trivial in a monolith but expensive across repo boundaries.

## 2. When to Extract a Microservice (The Triggers)
We will split a component into a separate service **ONLY** when it meets one of these specific criteria:

### A. The "Heavy Compute" Trigger (Parser Service)
*   **Scenario:** Analyzing a 5GB GitHub repository to reverse-engineer architecture.
*   **Problem:** AST parsing is CPU-intensive and blocks the Node.js Event Loop, freezing the UI for all users.
*   **Solution:** A dedicated **Parser Service** (possibly Rust/Go) that accepts a repo URL and returns JSON.

### B. The "Polyglot" Trigger (AI Agent)
*   **Scenario:** Running local LLM inference or complex RAG pipelines.
*   **Problem:** Python ecosystem (PyTorch, LangChain) is superior to Node.js for these tasks.
*   **Solution:** An **AI Service** (Python/FastAPI) handling vector search and generation, exposed via REST to the main Node.js app.

### C. The "Stateful Scale" Trigger (Real-Time Server)
*   **Scenario:** 10,000+ concurrent users collaborating on diagrams.
*   **Problem:** WebSockets are stateful and memory-bound, while REST APIs are stateless and CPU-bound. Scaling them together is inefficient.
*   **Solution:** A dedicated **Collaboration Service** (Hocuspocus/Yjs) that handles *only* sync traffic.

## Strategic Verdict
1.  **Core Platform (Wiki, Plan, APM, Governance):** **Modular Monolith**. Keep these loosely coupled in code but deployed together.
2.  **Specialized Workloads (AI, AST Parsing):** **Microservices**. Extract these as they are built to avoid blocking the core application.

**Action:** Continue building in `server/routes.ts` but enforce strict module boundaries to facilitate future extraction if needed.

