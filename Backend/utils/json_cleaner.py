import json

def parse_json_response(text):

    cleaned = (
        text
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    return json.loads(cleaned)