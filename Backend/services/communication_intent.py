from Backend.prompts import COMMUNICATION_INTENT_PROMPT
from Backend.utils.gemini_helper import generate_response
from Backend.utils.json_cleaner import parse_json_response

def extract_communication_intents(transcript):

    response = generate_response(
        COMMUNICATION_INTENT_PROMPT + transcript
    )

    return parse_json_response(response)