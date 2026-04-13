import spacy
import pdfplumber
import json
import os

# Load the heavy model once
nlp = spacy.load("en_core_web_md")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "../data")

# ---------------------------------------------------------
# NEW: Our Dictionary of "Action Verbs"
# We check if the applicant actually *used* the skill.
# ---------------------------------------------------------
ACTION_VERBS = {
    "develop", "build", "create", "manage", "analyze", "design",
    "implement", "write", "lead", "use", "utilize", "deploy",
    "evaluate", "train", "optimize", "model", "test", "engineer"
}

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + " "
    return text

def generate_roadmap(resume_text):
    """
    THE ADVANCED SORTER:
    Uses Sentence-Level context to verify actual experience.
    """
    with open(os.path.join(DATA_DIR, "job_skills.json"), "r") as f:
        job_data = json.load(f)
    with open(os.path.join(DATA_DIR, "skill_dependencies.json"), "r") as f:
        dep_data = json.load(f)["dependencies"]

    dep_map = {item["skill"]: item["prerequisites"] for item in dep_data}
    target_role = job_data["roles"][0] 
    required_skills = target_role["core_skills"] + target_role["advanced_skills"]

    # Process the entire resume
    resume_doc = nlp(resume_text)
    found_skills = []

    for skill in required_skills:
        skill_doc = nlp(skill)
        skill_verified = False

        # ADVANCED NLP: Iterate through sentences, not just words
        for sent in resume_doc.sents:
            sent_has_skill = False
            
            # 1. Did they mention the skill in this sentence?
            if skill.lower() in sent.text.lower():
                sent_has_skill = True
            else:
                for token in sent:
                    if token.pos_ in ["NOUN", "PROPN"] and token.similarity(skill_doc) > 0.85: # Bumped threshold for stricter math
                        sent_has_skill = True
                        break

            # 2. If the skill is in the sentence, VERIFY THE CONTEXT
            if sent_has_skill:
                # Rule A: Does the sentence have an action verb?
                has_action_verb = any(
                    token.pos_ == "VERB" and token.lemma_.lower() in ACTION_VERBS 
                    for token in sent
                )
                
                # Rule B: Is this just a "Skills" comma-separated list? 
                # (Lists usually lack verbs and have many commas/short lengths)
                is_skill_list = len(sent) < 12 or "," in sent.text

                if has_action_verb or is_skill_list:
                    skill_verified = True
                    break # We proved they have this skill, move to the next one!

        if skill_verified:
            found_skills.append(skill)

    # The Roadmap Logic remains identical
    missing_skills = list(set(required_skills) - set(found_skills))
    phase_1_immediate = [] 
    phase_2_locked = [] 

    for skill in missing_skills:
        all_prereqs = dep_map.get(skill, [])
        missing_prereqs = [p for p in all_prereqs if p not in found_skills]

        skill_details = {
            "skill": skill,
            "requires": all_prereqs
        }

        if not all_prereqs or len(missing_prereqs) == 0:
            phase_1_immediate.append(skill_details)
        else:
            skill_details["blocking_prereqs"] = missing_prereqs
            phase_2_locked.append(skill_details)

    return {
        "found_skills": found_skills,
        "roadmap": {
            "phase_1_immediate": phase_1_immediate,
            "phase_2_locked": phase_2_locked
        }
    }