import json

from prompts import EMAIL_GENERATION_PROMPT
from utils.gemini_helper import generate_response
from utils.json_cleaner import parse_json_response


def generate_email(meeting_data, category, audience, email_context):

    payload = {
        "meeting_title": meeting_data.get("meeting_title", ""),
        "summary": meeting_data.get("summary", ""),
        "email_category": category,
        "audience": audience,
        "key_points": email_context,
    }

    prompt = (
        EMAIL_GENERATION_PROMPT
        + json.dumps(payload, indent=2)
    )

    response = generate_response(prompt)

    return parse_json_response(response)
