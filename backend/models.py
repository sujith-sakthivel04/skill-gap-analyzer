from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.dialects.postgresql import JSONB 
from sqlalchemy.sql import func

# This imports the Base from the database.py file you just made!
from backend.database import Base 

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    found_skills = Column(JSONB) 
    roadmap = Column(JSONB)       
    created_at = Column(DateTime(timezone=True), server_default=func.now())