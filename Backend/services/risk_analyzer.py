from Backend.prompts import RISK_ANALYSIS_PROMPT
from Backend.utils.gemini_helper import generate_response
from Backend.utils.json_cleaner import parse_json_response

def analyze_risks(transcript):

    response = generate_response(
        RISK_ANALYSIS_PROMPT + transcript
    )

    return parse_json_response(response)