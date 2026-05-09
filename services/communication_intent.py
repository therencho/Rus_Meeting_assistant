from prompts import COMMUNICATION_INTENT_PROMPT
from utils.gemini_helper import generate_response
from utils.json_cleaner import parse_json_response

def extract_communication_intents(transcript):

    response = generate_response(
        COMMUNICATION_INTENT_PROMPT + transcript
    )

    return parse_json_response(response)