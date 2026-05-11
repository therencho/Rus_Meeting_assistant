from Backend.prompts import SUMMARY_PROMPT
from Backend.utils.gemini_helper import generate_response
from Backend.utils.json_cleaner import parse_json_response

def generate_summary(transcript):

    response = generate_response(
        SUMMARY_PROMPT + transcript
    )

    return parse_json_response(response)