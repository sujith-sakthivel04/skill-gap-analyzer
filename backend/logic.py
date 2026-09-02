import pdfplumber
import json
import os
import time
from sentence_transformers import SentenceTransformer, util
from dotenv import load_dotenv
try:
    import google.generativeai as genai
except ImportError:
    genai = None

load_dotenv()

# Load once at module level - this replaces spaCy
model = SentenceTransformer("all-MiniLM-L6-v2")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "../data")

ACTION_VERBS = {
    "develop", "build", "create", "manage", "analyze", "design",
    "implement", "write", "lead", "use", "utilize", "deploy",
    "evaluate", "train", "optimize", "model", "test", "engineer",
    "architect", "integrate", "automate", "research", "fine-tune"
}

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + " "
    return text

def split_into_sentences(text):
    """
    Simple sentence splitter - avoids spaCy dependency entirely.
    Splits on newlines and periods followed by space/caps.
    """
    import re
    # Split on newlines first (resume lines are natural units)
    lines = text.split("\n")
    sentences = []
    for line in lines:
        line = line.strip()
        if len(line) > 3:
            # Further split long lines on ". "
            parts = re.split(r'\.\s+', line)
            sentences.extend([p.strip() for p in parts if len(p.strip()) > 3])
    return sentences

def has_action_verb(sentence):
    """Check if sentence contains an action verb from our list."""
    words = sentence.lower().split()
    return any(word.rstrip('eding').rstrip('ed') in ACTION_VERBS 
               or word in ACTION_VERBS for word in words)

def is_skill_list_line(sentence):
    """Detect comma-separated skill lists (e.g., 'Skills: Python, SQL, ML')"""
    comma_count = sentence.count(",")
    word_count = len(sentence.split())
    return comma_count >= 2 and word_count < 20

def verify_skill_in_resume(skill, sentences, sentence_embeddings, skill_embedding, threshold=0.45):
    """
    Two-pass verification:
    Pass 1 - Direct string match (catches exact mentions like 'Python', 'SQL')
    Pass 2 - Semantic embedding match (catches 'built predictive models' → 'Machine Learning')
    """
    for i, sentence in enumerate(sentences):
        sent_has_skill = False

        # Pass 1: Direct mention
        if skill.lower() in sentence.lower():
            sent_has_skill = True
        else:
            # Pass 2: Semantic similarity of full sentence vs skill phrase
            similarity = util.cos_sim(sentence_embeddings[i], skill_embedding).item()
            if similarity > threshold:
                sent_has_skill = True

        if sent_has_skill:
            # Context verification - same logic as before, now cleaner
            if has_action_verb(sentence) or is_skill_list_line(sentence):
                return True

    return False

def generate_roadmap(resume_text, target_role_name=None):
    """
    Upgraded pipeline:
    - sentence-transformers replaces spaCy similarity
    - Role selection by name (not hardcoded index)
    - Same roadmap staging logic preserved
    """
    with open(os.path.join(DATA_DIR, "job_skills.json"), "r") as f:
        job_data = json.load(f)
    with open(os.path.join(DATA_DIR, "skill_dependencies.json"), "r") as f:
        dep_map = json.load(f)

    # Role selection - use name if provided, else default to first
    roles = job_data["roles"]
    if target_role_name:
        target_role = next(
            (r for r in roles if r["name"].lower() == target_role_name.lower()),
            roles[0]  # fallback
        )
    else:
        target_role = roles[0]

    role_name = target_role.get("name", "Unknown")
    core_skills = target_role.get("core_skills", [])
    advanced_skills = target_role.get("advanced_skills", [])
    tools_and_libraries = target_role.get("tools_and_libraries", [])

    required_skills = core_skills + advanced_skills + tools_and_libraries

    # Pre-compute all embeddings in one batch - this is fast and efficient
    sentences = split_into_sentences(resume_text)
    if not sentences:
        return {
            "name": role_name,
            "core_skills": core_skills,
            "advanced_skills": advanced_skills,
            "tools_and_libraries": tools_and_libraries,
            "found_skills": [],
            "roadmap": {"phase_1_immediate": [], "phase_2_locked": []}
        }

    # Batch encode everything at once (much faster than one-by-one)
    sentence_embeddings = model.encode(sentences, convert_to_tensor=True)
    skill_embeddings = model.encode(required_skills, convert_to_tensor=True)

    # Verify each skill
    found_skills = []
    for i, skill in enumerate(required_skills):
        if verify_skill_in_resume(skill, sentences, sentence_embeddings, skill_embeddings[i]):
            found_skills.append(skill)

    # Roadmap staging logic - unchanged from your original
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
        "name": role_name,
        "core_skills": core_skills,
        "advanced_skills": advanced_skills,
        "tools_and_libraries": tools_and_libraries,
        "found_skills": found_skills,
        "roadmap": {
            "phase_1_immediate": phase_1_immediate,
            "phase_2_locked": phase_2_locked
        }
    }


def get_skill_details(skill_name, role_name):
    """
    Returns mock skill detail content for the UI drawer.
    Keep this as a clean function so it can be replaced by an LLM-backed
    generator later without changing API wiring.
    """
    return _generate_skill_details_with_fallback(skill_name=skill_name, role_name=role_name)


def _build_mock_skill_details(skill_name, role_name):
    normalized_skill = (skill_name or "").strip()
    normalized_role = (role_name or "the selected role").strip() or "the selected role"

    description = (
        f"{normalized_skill} is a foundational technical capability used to design, "
        f"build, and maintain production-grade software systems. Historically, the "
        f"discipline around {normalized_skill} matured as engineering teams shifted from "
        f"single-service applications to large-scale, distributed platforms that demand "
        f"reliability, security, and maintainability. For a {normalized_role}, strong "
        f"fluency in {normalized_skill} directly improves delivery speed, technical quality, "
        f"and long-term system evolution."
    )

    subtopics = [
        f"{normalized_skill} Fundamentals",
        f"{normalized_skill} Architecture Patterns",
        f"{normalized_skill} Performance and Optimization",
        f"{normalized_skill} Security and Best Practices",
        f"{normalized_skill} Production Use Cases for {normalized_role}"
    ]

    return {
        "description": description,
        "subtopics": subtopics
    }


def _extract_json_block(raw_text):
    cleaned = (raw_text or "").strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip().startswith("```"):
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()
    return cleaned


def _generate_skill_details_with_fallback(skill_name, role_name):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or genai is None:
        return _build_mock_skill_details(skill_name=skill_name, role_name=role_name)

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = (
            f"You are an expert technical career advisor. The user is targeting the role of '{role_name}' "
            f"and needs to understand the skill '{skill_name}'. Provide your response STRICTLY as a JSON object "
            "with two keys: 'description' and 'subtopics'. For 'description', write exactly 2 to 3 concise "
            f"sentences explaining what this skill is and why it is essential for a {role_name}. For "
            "'subtopics', provide an array of EXACTLY 5 to 7 strings listing the most critical fundamental "
            "concepts a learner must master. Keep the strings short."
        )

        response = None
        for attempt in range(2):
            try:
                response = model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"},
                    request_options={"timeout": 60.0}
                )
                break
            except Exception as request_error:
                error_text = str(request_error).lower()
                is_retryable = "504" in error_text or "timeout" in error_text
                if attempt == 0 and is_retryable:
                    print("Retrying Gemini API call...")
                    time.sleep(2)
                    continue
                raise

        parsed = json.loads(response.text)

        description = parsed.get("description")
        subtopics = parsed.get("subtopics")

        if not isinstance(description, str) or not description.strip():
            raise ValueError("Invalid description from LLM")
        if not isinstance(subtopics, list):
            raise ValueError("Invalid subtopics from LLM")

        cleaned_subtopics = [str(topic).strip() for topic in subtopics if str(topic).strip()]
        if not cleaned_subtopics:
            raise ValueError("Empty subtopics from LLM")

        return {
            "description": description.strip(),
            "subtopics": cleaned_subtopics
        }
    except Exception as e:
        if response is not None and getattr(response, "text", None):
            print(f"🚨 LLM RAW RESPONSE: {response.text}")
        print(f"🚨 LLM GENERATION FAILED: {repr(e)}")
        return _build_mock_skill_details(skill_name=skill_name, role_name=role_name)