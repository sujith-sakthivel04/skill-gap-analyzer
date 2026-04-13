from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware # 1. Import this!
from sqlalchemy.orm import Session
import shutil
import os

from backend.logic import extract_text_from_pdf, generate_roadmap
from backend.database import SessionLocal, engine
from backend import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Skill Gap Analyzer API")

# 2. ADD THIS BLOCK RIGHT HERE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # This is Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... the rest of your get_db() and @app.post code stays exactly the same ...

# 2. THE DATABASE DEPENDENCY
def get_db():
    """
    Creates a new database session for a request and closes it once the request is done.
    This prevents the "Too many clients" error.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db) # Injecting the database session here
):
    """
    Accepts a PDF, runs the NLP pipeline, and saves the results to PostgreSQL.
    """
    temp_path = f"temp_{file.filename}"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Step A: Extract Text
        raw_text = extract_text_from_pdf(temp_path)
        
        # Step B: Generate the JSON Roadmap using spaCy
        analysis_result = generate_roadmap(raw_text)
        
        # Step C: SAVE TO POSTGRESQL
        # We map the Python dictionary results to our SQLAlchemy model
        db_record = models.ResumeAnalysis(
            filename=file.filename,
            found_skills=analysis_result["found_skills"],
            roadmap=analysis_result["roadmap"]
        )
        
        # Add to the session and commit (save) to the database
        db.add(db_record)
        db.commit()
        
        # Refresh grabs the new generated ID from PostgreSQL
        db.refresh(db_record)

        # Return the results PLUS the new database record ID
        return {
            "record_id": db_record.id,
            "filename": db_record.filename,
            "data": analysis_result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)