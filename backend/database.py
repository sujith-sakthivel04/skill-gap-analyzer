import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# This line finds the .env file and loads the variables into Python
load_dotenv()

# We pull the specific URL variable we created
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# If it can't find the variable, throw an error so we know immediately
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("No DATABASE_URL found in .env file")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()