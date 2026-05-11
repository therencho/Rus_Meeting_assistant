import json

from prompts import EMAIL_CONTEXT_PROMPT
from utils.gemini_helper import generate_response
from utils.json_cleaner import parse_json_response


def build_email_contexts(meeting_context):

    prompt = (
        EMAIL_CONTEXT_PROMPT
        + json.dumps(meeting_context, indent=2)
    )

    response = generate_response(prompt)

    return parse_json_response(response)