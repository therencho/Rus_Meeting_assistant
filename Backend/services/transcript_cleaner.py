from prompts import TRANSCRIPT_CLEANING_PROMPT
from utils.gemini_helper import generate_response
from utils.json_cleaner import parse_json_response


def clean_transcript(raw_transcript: str) -> str:
    """
    Remove fillers, fix misheard words, clean false starts.
    Preserves speaker labels and meaning faithfully.
    """

    response = generate_response(
        TRANSCRIPT_CLEANING_PROMPT + raw_transcript
    )

    result = parse_json_response(response)

    return result.get("cleaned_transcript", raw_transcript)
