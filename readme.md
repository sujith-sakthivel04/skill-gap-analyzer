# Skill Gap Analyzer

AI-assisted resume analysis and role-based learning roadmap generation.

## What This Project Does

Skill Gap Analyzer helps users understand the gap between their current resume and a target job role.

The application:

- Accepts a PDF resume
- Allows the user to select a target role
- Analyzes the resume against the required skills for that role
- Identifies skills already evidenced in the resume
- Identifies missing skills
- Organizes skills into:
  - Foundational
  - Specialization
  - Tools
- Provides detailed information for individual skills
- Generates a structured learning journey from skill sub-topics
- Allows users to mark roadmap stages as learned
- Tracks learning progress locally in the browser
- Automatically changes the learning status of a skill as progress increases

The application does not require user accounts or login.

---

## How the Application Works

The overall workflow is:

```text
Upload Resume
      ↓
Select Target Role
      ↓
Resume Text Extraction
      ↓
Skill Analysis
      ↓
Verified Skills + Missing Skills
      ↓
Select a Skill
      ↓
LLM / Fallback Skill Details
      ↓
Interactive Learning Roadmap
      ↓
Mark Stages as Learned
      ↓
Track Progress in Browser
```

---

## Main Features

### Resume Analysis

Users can upload a PDF resume and select the role they are targeting.

The backend:

1. Temporarily processes the uploaded PDF.
2. Extracts resume text using `pdfplumber`.
3. Splits the resume into meaningful text segments.
4. Uses `sentence-transformers` to compare resume content with required role skills.
5. Verifies skills using direct matching and semantic similarity.
6. Returns the analysis result to the frontend.
7. Deletes the temporary PDF after processing.

---

### Role-Based Skill Gap Analysis

The application loads available roles from:

```text
data/job_skills.json
```

Each role contains skill categories such as:

- Foundational skills
- Specialization skills
- Tools and libraries

The user's resume is evaluated against the selected role.

Skills are categorized as:

- **Verified** — the skill is evidenced in the resume
- **Missing** — the skill is not sufficiently evidenced in the resume

---

### Interactive Skill Browser

The `OrbitalSkillViewer` provides an interactive interface for browsing skills by category.

Available categories:

```text
Foundational
Specialization
Tools
```

Users can select a category and then choose an individual skill to inspect.

The skill browser also reflects learning progress.

Examples:

```text
VERIFIED
VERIFIED — Learning 40%
COMPLETED
MISSING
IN PROGRESS — 40%
LEARNED
```

Resume verification and learning progress are treated as separate concepts.

For example:

```text
Resume Status: Missing
Learning Status: Learned
```

is a valid state.

This means the user did not demonstrate the skill in the original resume but has since completed the corresponding learning roadmap.

---

## Interactive Skill Roadmap

The `SkillRoadmap` turns the selected skill into a structured learning journey.

For each selected skill, the backend returns:

- A skill description
- An ordered list of sub-topics

Each sub-topic becomes a roadmap stage.

Example:

```text
Stage 01
      ↓
Stage 02
      ↓
Stage 03
      ↓
Stage 04
      ↓
Stage 05
```

The roadmap supports:

- Alternating left/right stage cards on desktop
- Vertical progression path
- Mobile-friendly single-column layout
- Stage expansion
- Current-stage highlighting
- Stage completion
- Progress percentage
- Completed-stage indicators
- Reset progress
- Dynamic roadmap lengths
- Restoring previously completed stages

The application does not hardcode the roadmap to five stages. It can render all available sub-topics returned by the backend.

---

## Learning Progress

Learning progress is intentionally stored **only in the user's browser** using `localStorage`.

No account is required.

Progress is organized by:

```text
Role
  └── Skill
       └── Completed Stage Indexes
```

Example:

```json
{
  "Data Scientist": {
    "Python": {
      "completedStages": [0, 1, 2],
      "totalStages": 7,
      "updatedAt": 1712345678900
    }
  }
}
```

### Learning Status

The roadmap uses the following states:

```text
0 / N
→ NOT STARTED

1 / N through N-1 / N
→ IN PROGRESS

N / N
→ LEARNED
```

For example:

```text
0 / 6  → 0%   → NOT STARTED
3 / 6  → 50%  → IN PROGRESS
5 / 6  → 83%  → IN PROGRESS
6 / 6  → 100% → LEARNED
```

When all roadmap stages are completed, the skill browser automatically reflects the skill as learned.

---

## Local Progress Privacy

The application intentionally does not use a user-account system.

Learning progress is stored locally in the browser and is associated with the current browser/device.

This means:

- Progress survives page refreshes
- Progress survives closing and reopening the browser
- Progress is available when returning from the same browser/device

However:

- Progress is not synchronized across different browsers
- Progress is not synchronized across different devices
- Clearing browser/site storage removes the locally stored progress

No cloud synchronization is currently implemented.

---

## Resume Privacy & Data Persistence

The application is designed to avoid persistent storage of user resumes.

### Resume Processing

The resume lifecycle is:

```text
PDF Upload
     ↓
Temporary File
     ↓
PDF Text Extraction
     ↓
Resume Analysis
     ↓
Return Analysis Result
     ↓
Delete Temporary File
```

Resume PDFs are processed using a temporary file and deleted after processing completes, including when processing fails.

### Resume Text

Extracted resume text is used only for the active analysis request.

It is not persisted by the application.

### Server Storage

The backend does not persist:

- Resume PDFs
- Extracted resume text
- Resume filenames
- Resume-analysis history
- User learning progress
- User account information

The backend is stateless with respect to user data.

---

## LLM-Powered Skill Details

The application can optionally use Google Gemini to generate skill details.

The skill-details response contains:

```json
{
  "description": "...",
  "subtopics": [
    "...",
    "...",
    "..."
  ]
}
```

The LLM is used to provide:

- A concise explanation of the skill
- Critical sub-topics for learning the skill

If Gemini is unavailable or no API key is configured, the backend uses a fallback skill-detail generator.

This allows the application to continue functioning without requiring Gemini.

---

## Backend Skill Analysis

The main analysis pipeline uses:

### PDF Extraction

`pdfplumber`

Used to extract text from uploaded PDF resumes.

### Sentence Embeddings

`sentence-transformers`

Model:

```text
all-MiniLM-L6-v2
```

The model is used to generate sentence embeddings and compare resume content against target skills.

### Skill Verification

The system combines:

- Direct skill-name matching
- Semantic similarity
- Context verification

The context verification checks whether the skill appears in meaningful resume content rather than relying only on a raw keyword occurrence.

---

## API Endpoints

### `GET /health`

Lightweight backend health check.

Example response:

```json
{
  "status": "ok"
}
```

---

### `GET /roles`

Returns the available role names from:

```text
data/job_skills.json
```

Example:

```json
{
  "roles": [
    "Data Scientist",
    "Machine Learning Engineer"
  ]
}
```

---

### `POST /analyze-resume`

Analyzes a resume against a selected target role.

Accepts:

- `file` — PDF resume
- `role` — selected target role name

Returns:

- Role metadata
- Found skills
- Categorized role skills
- Dependency-aware roadmap data

The uploaded PDF is handled through temporary processing and is deleted after analysis.

---

### `GET /skill-details`

Example:

```text
/skill-details?skill_name=Python&role_name=Data%20Scientist
```

Returns:

- `description`
- `subtopics`

These sub-topics are used to construct the interactive learning roadmap.

---

## Project Structure

```text
Skill Gap Analyzer/
│
├── backend/
│   ├── main.py
│   ├── logic.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── OrbitalSkillViewer.jsx
│   │   │   ├── SkillRoadmap.jsx
│   │   │   └── FooterSection.jsx
│   │   │
│   │   ├── utils/
│   │   │   └── progressStorage.js
│   │   │
│   │   └── data/
│   │       └── roleVideoLibrary.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── data/
│   ├── job_skills.json
│   └── skill_dependencies.json
│
├── .gitignore
└── readme.md
```

---

## Tech Stack

### Backend

- FastAPI
- Uvicorn
- pdfplumber
- sentence-transformers
- `all-MiniLM-L6-v2`
- python-multipart
- python-dotenv
- Optional Google Gemini (`google-generativeai`)

### Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- `@xyflow/react` where used by the frontend

### Storage

- Browser `localStorage` for anonymous learning progress
- No application database
- No persistent resume storage

---

## Environment Variables

### Backend

Create:

```text
backend/.env
```

based on:

```text
backend/.env.example
```

Example:

```text
GEMINI_API_KEY=
FRONTEND_URL=http://localhost:5173
```

### `GEMINI_API_KEY`

Optional.

When provided, Gemini can generate dynamic skill descriptions and sub-topics.

Without it, the application uses fallback skill-detail generation.

### `FRONTEND_URL`

Used by FastAPI CORS configuration.

For local development:

```text
http://localhost:5173
```

For production, set it to the actual deployed frontend origin.

---

## Frontend Environment Variables

Create:

```text
frontend/.env
```

based on:

```text
frontend/.env.example
```

Example:

```text
VITE_API_URL=http://localhost:8000
```

For production, this should point to the deployed backend URL.

Example:

```text
VITE_API_URL=https://your-backend.onrender.com
```

`VITE_API_URL` is a frontend configuration value and should not contain secrets.

---

## Local Development

### 1. Backend

Run these commands from the project root:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

Start the backend:

```bash
uvicorn backend.main:app --reload --port 8000
```

Backend:

```text
http://localhost:8000
```

Health check:

```text
http://localhost:8000/health
```

---

### 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Make sure:

```text
frontend/.env
```

contains:

```text
VITE_API_URL=http://localhost:8000
```

---

## Production Deployment

The intended deployment architecture is:

```text
Frontend
   ↓
Vercel

Backend
   ↓
Render

Learning Progress
   ↓
Browser localStorage

Resume Processing
   ↓
Temporary backend processing only
```

### Frontend — Vercel

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Production environment variable:

```text
VITE_API_URL=<deployed Render backend URL>
```

---

### Backend — Render

Build command:

```bash
pip install -r requirements.txt
```

Start command:

```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

Production environment variables:

```text
FRONTEND_URL=<deployed Vercel frontend URL>
GEMINI_API_KEY=<optional Gemini API key>
```

The backend does not require:

```text
DATABASE_URL
```

because the current architecture does not use PostgreSQL or SQLAlchemy.

---

## Free-Tier Deployment Considerations

The application is designed so that its core hosting architecture can run without a paid database or user-management service.

However, free hosting tiers can have practical limitations.

Potential considerations include:

- Backend cold starts after periods of inactivity
- Limited CPU and memory on free backend instances
- Initial model loading time
- `sentence-transformers` model memory requirements
- External Gemini API quotas and usage limits

The application includes fallback skill-detail generation so that Gemini is not the only mechanism for obtaining skill details.

Actual performance depends on the hosting provider's current free-tier limits.

---

## Current Privacy Architecture

The application intentionally follows this model:

```text
              USER
                │
                ▼
           Upload PDF
                │
                ▼
        Temporary Processing
                │
                ▼
         Resume Analysis
                │
                ▼
         Return Results
                │
                ▼
        Delete Temporary PDF
                │
                ▼
      Interactive Learning
                │
                ▼
        Browser localStorage
                │
                ▼
       Anonymous Progress
```

There is currently no:

```text
Login
User Account
Password
User Database
Resume Database
Progress Database
Cloud Progress Sync
```

---

## Design Goals

The project is built around four main ideas:

### 1. Personalized

The roadmap is generated based on the selected target role and detected skill gaps.

### 2. Explainable

The application shows which skills are evidenced in the resume and which areas still need improvement.

### 3. Actionable

Missing skills are transformed into structured learning stages rather than simply being displayed as a list.

### 4. Privacy-Friendly

Resume data is processed temporarily and learning progress is kept locally in the user's browser without requiring an account.

---

## Notes

- Resume uploads are currently limited to PDF files.
- Learning progress is stored locally in the browser.
- Clearing browser/site data removes locally stored learning progress.
- Learning progress is not currently synchronized between devices or browsers.
- The backend does not persist resume files or resume-analysis history.
- Gemini is optional.
- Without Gemini, the backend uses fallback skill-detail generation.
- Free-tier hosting may introduce cold starts and resource limitations.
- The `all-MiniLM-L6-v2` sentence-transformers model is loaded by the backend and may require significant memory on constrained hosting environments.
- Production deployments must configure `VITE_API_URL` on the frontend and `FRONTEND_URL` on the backend.
- Do not commit real `.env` files or API keys to the repository.
