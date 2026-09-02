# Skill Gap Analyzer

AI-assisted resume analysis and role-based learning roadmap generation.

## What this project does

This app helps users:

- Upload a PDF resume
- Select a target role
- Analyze which role skills are already evidenced in the resume
- View missing skills by category (Foundational, Specialization, Tools)
- Open skill details with descriptions and sub-topics
- Follow a roadmap that renders **all available sub-topics** in sequence
- Track learning progress automatically in the browser

The latest UI includes:

- `HeroSection` for role selection + file upload + analysis trigger
- `OrbitalSkillViewer` for category-based skill browsing
- `SkillRoadmap` for detailed step-by-step sub-topic progression
- `FooterSection`

---

## Tech stack

### Backend
- FastAPI
- `pdfplumber`
- `sentence-transformers` (`all-MiniLM-L6-v2`)
- Optional: Google Gemini (`google-generativeai`) for dynamic skill details

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion
- Lucide icons

---

## Privacy & Data Persistence

The architecture of this application strictly protects user privacy and avoids unnecessary data persistence:

- **Resume privacy**: Resume PDFs are processed temporarily for analysis and are deleted immediately after processing. They are not persisted by the application.
- **Resume text privacy**: Extracted resume text is used solely for the active analysis and is not persisted by the application.
- **Learning progress**: Learning progress is stored locally in the user's browser using `localStorage`.
- **Authentication**: The application does not require an account or login.
- **Server storage**: The server does not persist user learning progress, resume files, or resume-analysis history. The backend is completely stateless and does not use a database.

---

## Current analysis flow

1. Fetch available roles from `GET /roles`
2. Upload resume PDF + selected role to `POST /analyze-resume`
3. Backend extracts text, verifies role skills from resume context, returns JSON, and deletes the temporary PDF.
4. Frontend displays categorized skills and verified/missing status along with stored learning progress.
5. Clicking a skill calls `GET /skill-details`
6. `SkillRoadmap` displays the selected skill’s full sub-topic journey and syncs progress locally.

---

## API endpoints

### `GET /health`
Health check endpoint.

### `GET /roles`
Returns available role names from `data/job_skills.json`.

### `POST /analyze-resume`
Accepts:
- `file` (PDF, required)
- `role` (selected role name, optional but expected from frontend)

Returns:
- Role metadata
- `found_skills`
- categorized role skills
- dependency-aware roadmap data

### `GET /skill-details?skill_name=...&role_name=...`
Returns:
- `description`
- `subtopics` (ordered list used by roadmap)

---

## Project structure

```text
Skill Gap Analyzer/
├── backend/
│   ├── main.py
│   └── logic.py
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── OrbitalSkillViewer.jsx
│   │   │   ├── SkillRoadmap.jsx
│   │   │   └── FooterSection.jsx
│   │   ├── utils/
│   │   │   └── progressStorage.js
│   │   └── data/
│   │       └── roleVideoLibrary.js
│   └── package.json
├── data/
│   ├── job_skills.json
│   └── skill_dependencies.json
└── readme.md
```

---

## Setup & Deployment

The intended deployment architecture is:
- **Frontend** → Vercel
- **Backend** → Render
- **Progress** → Browser `localStorage`
- **Resume processing** → Temporary backend processing only

### 1) Backend

```bash
python -m venv venv
venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

Backend runs on: `http://localhost:8000`

**Environment variables:**
Create `backend/.env` based on `backend/.env.example`.
- `FRONTEND_URL`: Used for CORS. (e.g. `http://localhost:5173`)
- `GEMINI_API_KEY`: (Optional) If you want LLM-generated skill details. Without this key, the backend uses fallback skill detail generation.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

**Environment variables:**
Create `frontend/.env` based on `frontend/.env.example`.
- `VITE_API_URL`: Points to your backend (e.g. `http://localhost:8000`).

---

## Notes
- Ensure your deployment environments set the `VITE_API_URL` (frontend) and `FRONTEND_URL` (backend) appropriately.
- Free-tier deployments (like Render) may experience cold starts, meaning the first analysis request could take slightly longer as the application boots up.
- The `sentence-transformers` model is instantiated at the module level for efficiency but may be subject to memory limitations on constrained free tiers.