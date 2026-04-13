# Skill Gap Analyzer - Complete Project Report

Generated on: 2026-04-13  
Repository: `C:/Users/sujit/Documents/Skill Gap Analyzer`

## 1) Executive Overview

This project is an AI-assisted resume analysis platform that identifies a candidate's existing skills and generates a dependency-aware learning roadmap for a target role (currently Data Scientist).  

At a high level:
- The **backend** is functional and implements resume ingestion, NLP-based skill verification, roadmap generation, and PostgreSQL persistence.
- The **frontend** currently behaves as a **static visualization/demo UI** with mocked data and no live API integration for resume upload.
- Documentation is ambitious and mostly accurate for backend concepts, but several parts are ahead of current frontend implementation.

## 2) Product Intent and "Behind the Project"

The design intent is to solve a common problem in resume screening and career planning:
- move beyond naive keyword matching,
- validate skills with contextual evidence,
- and produce a practical learning sequence based on prerequisites.

The technical philosophy behind the project is visible in:
- semantic NLP matching with spaCy vectors (`backend/logic.py`),
- context rules using action verbs and sentence-level checks (`backend/logic.py`),
- structured role/skill/prerequisite definitions in data files (`data/job_skills.json`, `data/skill_dependencies.json`),
- persistence of analysis output (`backend/models.py`, `backend/main.py`).

## 3) Repository Structure (What Each Area Does)

- `backend/`
  - `main.py`: FastAPI app, CORS, `/analyze-resume`, DB write path.
  - `logic.py`: PDF text extraction + skill verification + roadmap algorithm.
  - `database.py`: SQLAlchemy session/engine setup via `DATABASE_URL`.
  - `models.py`: `ResumeAnalysis` table model.
- `frontend/`
  - `src/App.jsx`: dashboard UI shell and static sample analysis data.
  - `src/RoadmapGraph.jsx`, `src/CustomSkillNode.jsx`: interactive skill graph rendering.
  - `package.json`: frontend scripts and dependencies.
  - Tailwind/PostCSS/Vite/ESLint config files present.
- `data/`
  - `job_skills.json`: target role skill matrix.
  - `skill_dependencies.json`: prerequisite graph.
  - `test_resume.txt`, `test_resume.pdf`: sample resume files.
- Root files:
  - `readme.md`: product documentation and setup guide.
  - `requirements.txt`: backend package list.
  - `.env`: database connection configuration.

## 4) Backend Deep Dive

### Framework and Runtime
- FastAPI application with a single main endpoint: `POST /analyze-resume` (`backend/main.py`).
- CORS currently allows local Vite origin: `http://localhost:5173`.

### Processing Pipeline
1. Upload file received as `UploadFile`.
2. Saved temporarily as `temp_<filename>`.
3. Text extracted via `pdfplumber`.
4. NLP verification and roadmap generation via `generate_roadmap()`.
5. Result persisted in PostgreSQL (`resume_analyses` table).
6. API responds with `record_id`, `filename`, and computed `data`.

### NLP and Matching Logic
- spaCy model loaded once: `en_core_web_md`.
- Role skills loaded from JSON dataset.
- Skill is marked as found if:
  - directly mentioned in a sentence **or**
  - semantically similar token (NOUN/PROPN) exceeds threshold (`> 0.85`),
  - and context passes action-verb or short-list heuristic.
- Missing skills are categorized into:
  - `phase_1_immediate` (no unresolved prerequisites),
  - `phase_2_locked` (blocked by missing prerequisites).

### Data Persistence
- SQLAlchemy with PostgreSQL.
- `ResumeAnalysis` uses JSONB columns for flexible skill/roadmap structures.
- Table creation is currently done at startup with `create_all`.

## 5) Frontend Deep Dive

### Current State
- React + Vite + Tailwind project with a polished visual dashboard.
- Shows verified skills, phase cards, and interactive graph.
- Uses static `useMemo` data in `App.jsx` (not API-driven).

### Not Yet Implemented in Frontend
- Resume upload control bound to backend.
- HTTP call to `POST /analyze-resume`.
- Loading/error states around analysis requests.
- Dynamic replacement of mocked UI data with backend response.

This creates a **functional gap**: backend is real, frontend is currently a showcase/static simulation.

## 6) Data and Domain Model

### Role Dataset
- Currently optimized for one role: Data Scientist.
- Skill categories include foundational, advanced, and tool-oriented skills.

### Dependency Graph
- Skill prerequisites are modeled cleanly in JSON.
- Supports deterministic roadmap staging without hardcoding in Python.

### Sample Input Assets
- `test_resume.txt` and `test_resume.pdf` are available for local validation and demos.

## 7) Toolchain, Dependencies, and Scripts

### Backend
- `FastAPI`, `uvicorn`, `SQLAlchemy`, `psycopg2-binary`, `spaCy`, `pdfplumber`, `python-multipart`.
- `pytest` dependencies exist but no test suite files were found.

### Frontend
- Runtime: `react`, `react-dom`, `@xyflow/react`, `framer-motion`.
- Dev: Vite, ESLint ecosystem, Tailwind/PostCSS stack.
- Scripts:
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
  - `npm run preview`

## 8) Environment and Configuration

- Environment key required: `DATABASE_URL` (loaded in backend).
- `.env` currently contains local Postgres credentials.
- CORS origin is hardcoded for local development.
- Editor settings indicate Python environment integration under `.vscode/settings.json`.

## 9) Runbook (Practical Local Execution)

### Backend
1. Create and activate virtual environment.
2. Install `requirements.txt`.
3. Install spaCy model `en_core_web_md`.
4. Ensure PostgreSQL is running and DB exists.
5. Start API with uvicorn on port 8000.

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (default `http://localhost:5173`)

### API Manual Test
- Send multipart file upload to `/analyze-resume`.
- Verify response JSON and DB insert.

## 10) Quality, Testing, and Operational Maturity

### Present
- Frontend lint script.
- Basic backend exception wrapping and request processing.

### Missing / Weak Areas
- No backend unit/integration tests in repository.
- No frontend tests (unit or e2e).
- No CI pipeline observed.
- No migration framework (e.g., Alembic); schema changes rely on `create_all`.

## 11) Security and Privacy Assessment

### Strengths
- Narrow CORS origin in dev mode.
- File cleanup is attempted in `finally` block.

### Risks
- No auth/rate limiting on analysis endpoint.
- Uploaded filename is used in temp path (`temp_<filename>`) without explicit sanitization.
- Resume-derived analysis is stored, but no retention/deletion policy is implemented.
- Local `.env` contains plaintext DB credentials (safe if kept local; risky if exposed).

## 12) Documentation Accuracy Review

Documentation quality is high and detailed, but there are mismatches:
- README implies full upload-driven frontend flow; current `App.jsx` is static.
- README structure references `backend/__init__.py`, which is not present.
- README references MIT `LICENSE` file; this file was not found in the repo root.
- `README` has generic support links/placeholders that may not match current project ownership.

## 13) Git Snapshot (Current Working Tree Context)

Current repository state (at report generation time) includes local modified/untracked files:
- Modified: `frontend/package-lock.json`, `frontend/package.json`, `frontend/src/App.jsx`
- Untracked: `data/test_resume.pdf`, `frontend/src/CustomSkillNode.jsx`, `frontend/src/RoadmapGraph.jsx`, `node_modules/`

This indicates active development in frontend graph visualization and dependencies.

## 14) Key Strengths

- Clear, practical product concept with real user value.
- Backend pipeline is coherent and implementationally meaningful.
- Skill dependency roadmap logic is well-structured and explainable.
- Modern frontend stack and visually strong UI base.
- Project is approachable for extension into multi-role support.

## 15) Key Gaps

- Frontend not integrated with live backend analysis.
- Testing and CI are largely absent.
- Security hardening is minimal for production exposure.
- Documentation and implementation drift needs cleanup.

## 16) Recommended Action Plan (Priority Ordered)

### Priority 1 - Core Product Completion
1. Add real resume upload + API call in frontend.
2. Wire backend response directly into graph and cards.
3. Add request-state UX (loading, error, success).

### Priority 2 - Reliability and Engineering Quality
1. Add backend tests for roadmap logic and API endpoint.
2. Add frontend tests for rendering and graph interactions.
3. Add CI workflow to run lint + tests on every PR.

### Priority 3 - Security and Production Readiness
1. Sanitize temporary filenames / use secure temp APIs.
2. Add authentication and basic rate limiting.
3. Provide data retention/deletion controls.
4. Replace committed credential patterns with `.env.example`.

### Priority 4 - Documentation Alignment
1. Update README to reflect actual current frontend state.
2. Remove/adjust references to non-existing files.
3. Ensure links, support contacts, and license references are correct.

## 17) Final Assessment

This is a promising full-stack AI/NLP project with a solid backend core and a strong UI foundation.  
The main "behind-the-project" story is clear: trustworthy skill validation + structured roadmap planning.  
To become complete and production-credible, the next major milestone is frontend/backend integration followed by tests, security hardening, and doc alignment.
