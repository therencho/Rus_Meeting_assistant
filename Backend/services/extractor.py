from Backend.prompts import TASK_EXTRACTION_PROMPT
from Backend.utils.gemini_helper import generate_response
from Backend.utils.json_cleaner import parse_json_response

def extract_tasks(transcript):

    response = generate_response(
        TASK_EXTRACTION_PROMPT + transcript
    )

    return parse_json_response(response)