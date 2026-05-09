from fastapi import FastAPI
from pydantic import BaseModel
from utils.retrieval import (
    load_meeting,
    list_meetings
)
from analyzer import analyzing_pipeline

app = FastAPI()


class TranscriptRequest(BaseModel):
    transcript: str


@app.post("/analyze")
def analyze_meeting(data: TranscriptRequest):

    print("API request received.")
    print("Transcript length:", len(data.transcript))

    try:

        result = analyzing_pipeline(
            data.transcript
        )

        return result

    except Exception as e:

        print("ERROR:", e)

        return {
            "status": "error",
            "message": str(e)
        }
@app.get("/meeting/{meeting_id}")
def get_meeting(meeting_id: str):

    try:

        meeting_data = load_meeting(
            meeting_id
        )

        return meeting_data

    except Exception as e:

        print("ERROR:", e)

        return {
            "status": "error",
            "message": str(e)
        }
    
@app.get("/meeting/{meeting_id}")
def get_meeting(meeting_id: str):

    try:

        meeting_data = load_meeting(
            meeting_id
        )

        return meeting_data

    except Exception as e:

        print("ERROR:", e)

        return {
            "status": "error",
            "message": str(e)
        }
    
@app.get("/meetings")
def get_meetings():

    try:

        meetings = list_meetings()

        return meetings

    except Exception as e:

        print("ERROR:", e)

        return {
            "status": "error",
            "message": str(e)
        }