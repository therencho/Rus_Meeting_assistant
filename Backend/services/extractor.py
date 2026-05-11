from prompts import TASK_EXTRACTION_PROMPT
from utils.gemini_helper import generate_response
from utils.json_cleaner import parse_json_response

def extract_tasks(transcript):

    response = generate_response(
        TASK_EXTRACTION_PROMPT + transcript
    )

    return parse_json_response(response)