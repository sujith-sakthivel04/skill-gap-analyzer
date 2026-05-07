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

The latest UI includes:

- `HeroSection` for role selection + file upload + analysis trigger
- `OrbitalSkillViewer` for category-based skill browsing
- `SkillRoadmap` for detailed step-by-step sub-topic progression
- `FooterSection`

---

## Tech stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- `pdfplumber`
- `sentence-transformers` (`all-MiniLM-L6-v2`)
- Optional: Google Gemini (`google-generativeai`) for dynamic skill details

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion
- Lucide icons

---

## Current analysis flow

1. Fetch available roles from `GET /roles`
2. Upload resume PDF + selected role to `POST /analyze-resume`
3. Backend extracts text and verifies role skills from resume context
4. Frontend displays categorized skills and verified/missing status
5. Clicking a skill calls `GET /skill-details`
6. `SkillRoadmap` displays the selected skill’s full sub-topic journey

---

## Roadmap behavior (latest)

`SkillRoadmap` now:

- Uses the returned sub-topic list without truncating to 5
- Renders all sub-topics provided by backend
- Uses alternating left/right milestone cards
- Connects milestones to the route path visually
- Maintains stage index numbering in sequence

---

## API endpoints

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
│   ├── logic.py
│   ├── models.py
│   └── database.py
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── OrbitalSkillViewer.jsx
│   │   │   ├── SkillRoadmap.jsx
│   │   │   ├── UploadAnalyzeSection.jsx
│   │   │   └── FooterSection.jsx
│   │   └── data/
│   │       └── roleVideoLibrary.js
│   └── package.json
├── data/
│   ├── job_skills.json
│   └── skill_dependencies.json
└── readme.md
```

---

## Setup

## 1) Backend

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

Backend runs on: `http://localhost:8000`

### Optional environment variable

If you want LLM-generated skill details:

- add `GEMINI_API_KEY` to `.env`

Without this key, backend uses fallback skill detail generation.

---

## 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Notes

- Backend CORS currently allows `http://localhost:5173`
- Resume upload currently accepts PDF only
- Database records are stored via `resume_analyses` model