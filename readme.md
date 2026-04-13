# 🚀 AI-Driven Skill Gap Analyzer

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![spaCy](https://img.shields.io/badge/spaCy-NLP-09A3D5?style=flat)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

> **Intelligent Resume Analysis & Career Roadmapping Platform**  
> Transform resumes into actionable learning paths using semantic NLP and dependency-aware skill mapping.

An intelligent, full-stack application designed to parse resumes, verify technical skills using advanced Natural Language Processing (NLP), and generate a dependency-aware learning roadmap for transitioning into Data Science roles.

**Unlike standard keyword-matching ATS systems**, this application utilizes context-aware semantic matching to ensure a candidate actually possesses the skills they list, rather than just recognizing buzzwords.

---

## 💡 Why This Matters

- **Beyond Buzzwords:** Traditional ATS systems fail to distinguish between merely listing "Machine Learning" and actually implementing it. Our system validates *true skill possession* through contextual analysis.
- **Smart Prerequisites:** Not all skills can be learned at once. Our roadmap intelligently phases skills based on whether prerequisites are met, preventing wasted effort on locked goals.
- **Semantic Intelligence:** Understands synonyms, related technologies, and implicit skills—if you've used TensorFlow, you likely understand neural networks.

---

## ✨ Key Features

- **🔍 Advanced NLP Skill Extraction**  
  Utilizes `spaCy` (`en_core_web_md`) for token-level semantic similarity (vector math) to identify skills even if synonyms or variations are used (e.g., "Django" matches "web framework experience").

- **✓ Context Verification Engine**  
  Implements a two-pass sentence-level segmentation pipeline. Verifies the presence of engineering "Action Verbs" (e.g., *developed, engineered, optimized*) alongside the skill to eliminate false positives from resume fluff.

- **🗺️ Dependency-Aware Roadmap**  
  Maps missing skills against a relational prerequisite database (JSON). Automatically sorts missing skills into actionable **Phase 1** goals or locked **Phase 2** goals based on the candidate's verified background.

- **⚡ Full-Stack Integration**  
  Robust `FastAPI` backend connected to `PostgreSQL` database via `SQLAlchemy` ORM, serving a responsive `React` + `Tailwind CSS` dashboard with real-time skill analysis.

---

## 🧠 How It Works

### The 3-Step Intelligence Pipeline

```
Resume Upload
     ↓
┌────────────────────────────────────────┐
│  1. EXTRACTION (spaCy NLP Pipeline)    │
│  • Parse PDF/text → Sentences          │
│  • Extract nouns, proper nouns, verbs  │
│  • Build semantic vector embeddings    │
└────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────┐
│  2. VALIDATION (Context Awareness)     │
│  • Match vectors against skill matrix  │
│  • Threshold: >0.85 similarity         │
│  • Verify action verbs in context      │
│  • Eliminate false positives           │
└────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────┐
│  3. ROADMAPPING (Dependency Sorting)   │
│  • Calculate skill delta vs. target    │
│  • Resolve prerequisites               │
│  • Phase 1: Ready to learn             │
│  • Phase 2: Requires prerequisites     │
└────────────────────────────────────────┘
     ↓
Actionable Learning Roadmap
```

### The "Magnet" Logic (Semantic Matching)
The system extracts text via `pdfplumber` and processes it through a custom NLP pipeline:
1. **Segmentation:** Breaks the text block into distinct sentences while preserving context.
2. **Vector Comparison:** Compares `NOUN` and `PROPN` tokens against a required skills matrix using tuned >0.85 similarity threshold for accurate matching.
3. **Contextual Validation:** 
   - **Checks for Action Verbs:** Verifies the sentence contains authentic action verbs like: `develop`, `build`, `create`, `manage`, `analyze`, `design`, `implement`, `write`, `lead`, `use`, `utilize`, `deploy`, `evaluate`, `train`, `optimize`, `model`, `test`, `engineer`
   - **Skill List Recognition:** Identifies comma-separated skill lists (< 12 tokens) without verbs as valid—e.g., "Skills: Python, SQL, Pandas"
   - **Eliminates False Positives:** Ignores mere mentions of technologies without context of actual use

### The "Smart" Sorting Logic (Roadmap Generation)
Once skills are verified, the engine calculates the delta against the target role (Data Scientist).
- **Phase 1 (Actionable):** Skills with zero missing prerequisites—learner can start immediately
- **Phase 2 (Locked):** Advanced skills blocked by missing foundational prerequisites, with specific blocking skills identified

**Example:** Machine Learning requires both Statistics *and* Linear Algebra. If a learner has only Python, both Statistics and Linear Algebra are listed as blocking prerequisites.

---

## 📊 Supported Target Role

Currently, the system is optimized for the following career path:

### Data Scientist

**Core Skills:** Python, SQL, Statistics, Linear Algebra, Calculus

**Advanced Skills:** Machine Learning, Deep Learning, Dimensionality Reduction, Model Evaluation

**Tools & Libraries:** Pandas, NumPy, Scikit-Learn, PostgreSQL, AWS

**Prerequisite Dependencies:**
- Pandas requires: Python
- NumPy requires: Python, Linear Algebra
- Scikit-Learn requires: Python, Pandas, NumPy
- Machine Learning requires: Python, Statistics, Linear Algebra
- Deep Learning requires: Machine Learning, Calculus
- And more (see [skill_dependencies.json](data/skill_dependencies.json))

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | FastAPI, Uvicorn, Python 3.13 |
| **AI & NLP** | spaCy (`en_core_web_md`), pdfplumber, semantic vectors |
| **Database** | PostgreSQL v15+, SQLAlchemy ORM, psycopg2 |
| **Frontend** | React 18+, Vite, Tailwind CSS, responsive UI |
| **Deployment** | Docker-ready, environment-configurable |

---

## 📊 Sample Output

**Input:** A resume highlighting: "Developed Python data pipelines using Pandas and SQL"

**Output JSON Response:**
```json
{
  "record_id": 1,
  "filename": "resume.pdf",
  "data": {
    "found_skills": [
      "Python",
      "SQL",
      "Pandas"
    ],
    "roadmap": {
      "phase_1_immediate": [
        {
          "skill": "Statistics",
          "requires": []
        },
        {
          "skill": "Linear Algebra",
          "requires": []
        }
      ],
      "phase_2_locked": [
        {
          "skill": "Machine Learning",
          "requires": ["Python", "Statistics", "Linear Algebra"],
          "blocking_prereqs": ["Statistics", "Linear Algebra"]
        },
        {
          "skill": "Deep Learning",
          "requires": ["Machine Learning", "Calculus"],
          "blocking_prereqs": ["Calculus", "Machine Learning"]
        }
      ]
    }
  }
}
```

**What This Means:**
- ✅ **Found Skills**: Python, SQL, Pandas (verified through action verbs like "developed")
- 🔓 **Phase 1 (Ready to Learn)**: Statistics, Linear Algebra (no prerequisites blocking you)
- 🔒 **Phase 2 (Locked)**: Machine Learning, Deep Learning (requires Phase 1 skills first)

---

## 🛠️ Quick Start & Installation

### Prerequisites
- **Python:** 3.13+
- **Node.js:** 16+
- **PostgreSQL:** 15+ (Running on localhost:5432)
- **Git:** For cloning the repository

### Step 1: PostgreSQL Setup

Before running the backend, ensure PostgreSQL is running with the correct credentials:

```bash
# Create the database (if not exists)
createdb skillgap_db

# Default credentials used:
# Username: postgres
# Password: root
# Host: localhost
# Port: 5432
# Database: skillgap_db
```

**Note:** If your PostgreSQL credentials differ, update the connection string in [backend/database.py](backend/database.py):
```python
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:root@localhost/skillgap_db"
```

### Step 2: Backend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/skill-gap-analyzer.git
cd skill-gap-analyzer

# Create and activate Python virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate

# Install dependencies from requirements.txt
pip install -r requirements.txt

# Download spaCy language model (1.4 GB - required for NLP)
python -m spacy download en_core_web_md

# Start FastAPI backend server
uvicorn backend.main:app --reload --port 8000
```

**Backend is running when you see:**
```
Uvicorn running on http://127.0.0.1:8000
```

The backend will:
- Start on port 8000
- Auto-reload on code changes
- Create PostgreSQL tables automatically
- Enable CORS for frontend communication

### Step 3: Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

**Frontend is running at:** [http://localhost:5173](http://localhost:5173)

### Step 4: Test the Application

1. Open [http://localhost:5173](http://localhost:5173) in your browser
2. Upload a PDF resume
3. Click "Analyze Resume"
4. View verified skills and learning roadmap

---

## 📖 API Endpoints

### Main Endpoint: Resume Analysis
```http
POST /analyze-resume
Content-Type: multipart/form-data

Request:
{
  "file": <resume.pdf>  // Required: PDF file upload
}

Response (200 OK):
{
  "record_id": 1,
  "filename": "resume.pdf",
  "data": {
    "found_skills": ["Python", "SQL", "Pandas"],
    "roadmap": {
      "phase_1_immediate": [
        {"skill": "Statistics", "requires": []}
      ],
      "phase_2_locked": [
        {
          "skill": "Machine Learning",
          "requires": ["Python", "Statistics", "Linear Algebra"],
          "blocking_prereqs": ["Statistics", "Linear Algebra"]
        }
      ]
    }
  }
}
```

### API Documentation
Access the interactive Swagger UI at [http://localhost:8000/docs](http://localhost:8000/docs) to explore all endpoints and test them directly.

**Features:**
- PDF file upload and processing
- Real-time NLP skill extraction
- Automatic prerequisite resolution
- PostgreSQL persistence of analysis results

---

## ⚙️ Configuration & Environment

### Database Configuration
The PostgreSQL connection is configured in [backend/database.py](backend/database.py):

```python
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:root@localhost/skillgap_db"
```

**To customize:**
1. Update the connection string with your PostgreSQL credentials
2. Create the database before running the backend:
   ```bash
   createdb skillgap_db
   ```
3. Tables are created automatically on first backend startup

### CORS Configuration
The backend has CORS enabled for the frontend URL:
- **Allowed Origin:** `http://localhost:5173` (Vite development server)
- **Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Credentials:** Allowed

**To change for production:**
Update `allow_origins` in [backend/main.py](backend/main.py):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Change this
    ...
)
```

### Data Files
- **[data/job_skills.json](data/job_skills.json)** — Defines target role (Data Scientist) and required skills
- **[data/skill_dependencies.json](data/skill_dependencies.json)** — Maps skill prerequisites

### Database Schema
The backend automatically creates the following table on startup:

**Table: `resume_analyses`**
| Column | Type | Purpose |
|--------|------|---------|
| id | Integer (PK) | Unique analysis record ID |
| filename | String | Original resume filename |
| found_skills | JSONB | Array of verified skills found |
| roadmap | JSONB | Phase 1 and Phase 2 learning recommendations |
| created_at | Timestamp | When analysis was performed |

**Example stored record:**
```json
{
  "id": 1,
  "filename": "resume.pdf",
  "found_skills": ["Python", "SQL", "Pandas"],
  "roadmap": {
    "phase_1_immediate": [{"skill": "Statistics", "requires": []}],
    "phase_2_locked": [...]
  },
  "created_at": "2024-04-13T10:30:00"
}
```

---

## 🎯 Use Cases

- **Career Transition:** Identify skill gaps when switching to Data Science roles
- **Resume Verification:** For recruiters validating technical claims in applications
- **Learning Path Planning:** Generate personalized learning roadmaps based on current skills
- **HR Analytics:** Understand team skill distributions and training needs
- **Educational Institutions:** Guide students toward relevant skill development

---

## 📁 Project Structure

```
skill-gap-analyzer/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── models.py            # Database models (SQLAlchemy)
│   ├── logic.py             # Core NLP & skill analysis logic
│   ├── database.py          # PostgreSQL configuration
│   └── __init__.py
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── main.jsx         # React entry point
│   │   └── assets/          # Images, icons
│   ├── package.json
│   └── vite.config.js
├── data/
│   ├── job_skills.json      # Target role skill definitions
│   ├── skill_dependencies.json # Prerequisite relationships
│   └── test_resume.txt      # Sample resume for testing
├── README.md                # This file
├── requirements.txt         # Python dependencies
└── .gitignore              # Git ignore patterns
```

---

## 🧪 Testing & Development

### Test Data
A sample resume is included in [data/test_resume.txt](data/test_resume.txt) for quick testing:

```bash
# You can use this test resume with the API to validate the system works correctly
```

### Manual API Testing
```bash
# Test the backend is running
curl http://localhost:8000/docs

# Example: Upload the test resume
curl -X POST http://localhost:8000/analyze-resume \
  -H "Content-Type: multipart/form-data" \
  -F "file=@data/test_resume.txt"
```

### Frontend Testing
- Open [http://localhost:5173](http://localhost:5173) in your browser
- Try uploading the test resume to see the analysis in action
- Verify that Phase 1 and Phase 2 skills are correctly categorized

### Database Verification
```bash
# Connect to PostgreSQL and check stored analyses
psql -U postgres -d skillgap_db

# View all resume analyses
SELECT id, filename, created_at FROM resume_analyses;
```

---

## � Troubleshooting

### Backend Issues

**"Module not found: spacy"**
```bash
# Make sure you've downloaded the NLP model
python -m spacy download en_core_web_md
```

**"Connection refused" on PostgreSQL**
```bash
# Ensure PostgreSQL is running
# Windows: Start PostgreSQL service
# macOS: brew services start postgresql
# Linux: sudo service postgresql start

# Verify connection
psql -U postgres -d skillgap_db
```

**"CORS error in browser"**
- Ensure backend is running on `http://localhost:8000`
- Ensure frontend is running on `http://localhost:5173` (default Vite port)
- If using different ports, update `allow_origins` in [backend/main.py](backend/main.py)

**"Failed to connect to database"**
- Verify credentials in [backend/database.py](backend/database.py)
- Create database: `createdb skillgap_db`
- Check PostgreSQL is running: `pg_isready`

### Frontend Issues

**"Blank page or cannot connect to backend"**
- Verify backend is running: `curl http://localhost:8000/docs`
- Check browser console for CORS errors
- Ensure correct backend URL is used in [frontend/src/App.jsx](frontend/src/App.jsx)

**"Vite build errors"**
```bash
cd frontend
npm install
npm run build  # Check for build errors
```

### PDF Upload Issues

**"Processing failed on resume upload"**
- Ensure PDF is valid and readable
- Try with the test resume in `data/test_resume.txt`
- Check backend logs for detailed error

---

## 📋 Project Files Reference

| File | Purpose |
|------|---------|
| [backend/main.py](backend/main.py) | FastAPI application with `/analyze-resume` endpoint |
| [backend/logic.py](backend/logic.py) | Core NLP pipeline and roadmap generation logic |
| [backend/models.py](backend/models.py) | SQLAlchemy database models |
| [backend/database.py](backend/database.py) | PostgreSQL connection configuration |
| [frontend/src/App.jsx](frontend/src/App.jsx) | React UI with upload and results dashboard |
| [data/job_skills.json](data/job_skills.json) | Target role definition (Data Scientist skills) |
| [data/skill_dependencies.json](data/skill_dependencies.json) | Skill prerequisite mappings |
| [data/test_resume.txt](data/test_resume.txt) | Sample resume for testing |

---

## 🚀 Future Roadmap

- [ ] **Multiple Target Roles:** Support career paths beyond Data Science (Machine Learning Engineer, Data Engineer, etc.)
- [ ] **Confidence Scoring:** Add probabilistic confidence scores for each skill detection
- [ ] **Resource Recommendations:** Suggest Coursera, Udemy, YouTube courses for missing skills
- [ ] **Resume Upload History:** Track and compare multiple resume uploads over time
- [ ] **Batch Organization Analysis:** Upload multiple resumes to analyze team skill gaps
- [ ] **Skill Assessment Quiz:** Verify claimed skills with short questionnaires
- [ ] **Export Functionality:** Download roadmaps as PDF or personalized learning plans
- [ ] **Mobile App:** React Native app for on-the-go access
- [ ] **Integration:** Connect with LinkedIn, GitHub profiles for automatic skill extraction
- [ ] **Advanced Analytics:** Team-level skill heatmaps and visualizations
- [ ] **Docker Support:** Containerized deployment with docker-compose
- [ ] **Real-time Notifications:** Email reminders for skill milestones

---

## 📄 License

This project is licensed under the **MIT License**—see the LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Here's how to help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use descriptive commit messages
- Add tests for new features
- Update documentation as needed

---

## 💬 Support & Feedback

- 📧 **Email:** support@skillgapanalyzer.com
- 🐛 **Issues:** [Report bugs](https://github.com/yourusername/skill-gap-analyzer/issues)
- 💡 **Discussions:** [Feature requests & ideas](https://github.com/yourusername/skill-gap-analyzer/discussions)

---

## ⭐ Show Your Support

If this project helps you, please give it a star! ⭐

---

**Made with ❤️ by the AI-Driven Skills Team**