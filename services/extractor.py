from google import genai
from prompts import TASK_EXTRACTION_PROMPT

client = genai.Client()

def extract_tasks(transcript):

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=TASK_EXTRACTION_PROMPT + transcript
    )

    return response.text