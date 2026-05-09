from prompts import EXECUTION_GAP_PROMPT
from utils.gemini_helper import generate_response
from utils.json_cleaner import parse_json_response

def extract_execution_gaps(transcript):

    response = generate_response(
        EXECUTION_GAP_PROMPT + transcript
    )

    return parse_json_response(response)