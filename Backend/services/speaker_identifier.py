from prompts import SPEAKER_IDENTIFICATION_PROMPT
from utils.gemini_helper import generate_response
from utils.json_cleaner import parse_json_response


def identify_speakers(transcript: str) -> list:
    """
    Analyze speaker dialogue patterns and infer names, roles, and a brief description.
    Returns a list of speaker dicts: {label, guessed_name, role, brief}
    """

    response = generate_response(
        SPEAKER_IDENTIFICATION_PROMPT + transcript
    )

    result = parse_json_response(response)

    return result.get("speakers", [])
