from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import shutil
import os
import tempfile

from backend.logic import extract_text_from_pdf, generate_roadmap, get_skill_details
from backend.database import SessionLocal, engine
from backend import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Skill Gap Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/roles")
def get_roles():
    """
    Returns all available roles so frontend can populate a dropdown.
    """
    import json, os
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(BASE_DIR, "../data/job_skills.json")
    with open(data_path, "r") as f:
        job_data = json.load(f)
    return {"roles": [r["name"] for r in job_data["roles"]]}

@app.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    role: str = Form(default=None),   # <-- role name from frontend dropdown
    db: Session = Depends(get_db)
):
    """
    Accepts a PDF + target role name, runs the NLP pipeline, saves to PostgreSQL.
    """
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    # Securely create a temporary file that avoids path traversal
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    try:
        shutil.copyfileobj(file.file, temp_file)
    finally:
        # File must be closed on Windows before pdfplumber can open it
        temp_file.close()
    
    temp_path = temp_file.name

    try:
        raw_text = extract_text_from_pdf(temp_path)

        # Pass role name into generate_roadmap
        analysis_result = generate_roadmap(raw_text, target_role_name=role)

        db_record = models.ResumeAnalysis(
            filename=file.filename,
            found_skills=analysis_result["found_skills"],
            roadmap=analysis_result["roadmap"]
        )

        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        return {
            "record_id": db_record.id,
            "filename": db_record.filename,
            "name": analysis_result.get("name", role or "Unknown"),
            "core_skills": analysis_result.get("core_skills", []),
            "advanced_skills": analysis_result.get("advanced_skills", []),
            "tools_and_libraries": analysis_result.get("tools_and_libraries", []),
            "found_skills": analysis_result.get("found_skills", []),
            "roadmap": analysis_result.get("roadmap", {})
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.get("/skill-details")
def skill_details(skill_name: str, role_name: str = "Unknown Role"):
    """
    Returns detail metadata for a clicked skill node.
    """
    if not skill_name.strip():
        raise HTTPException(status_code=400, detail="skill_name is required.")
    return get_skill_details(skill_name=skill_name, role_name=role_name)