import time
from google import genai
from config import MODEL_NAME

client = genai.Client()

def generate_response(prompt, retries=3):

    for attempt in range(retries):

        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )

            return response.text

        except Exception as e:

            print(f"Attempt {attempt + 1} failed: {e}")

            time.sleep(3)

    raise Exception("Gemini API failed after retries.")