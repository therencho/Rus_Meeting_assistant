from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from utils.retrieval import (
    load_meeting,
    list_meetings
)
from analyzer import analyzing_pipeline
from services.email_generator import generate_email

app = FastAPI()
app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

class TranscriptRequest(BaseModel):
    transcript: str


class EmailRequest(BaseModel):
    meeting_id: str
    category: str
    audience: str
    email_context: List[str]


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


@app.post("/generate-email")
def generate_email_endpoint(data: EmailRequest):

    try:

        meeting_data = load_meeting(
            data.meeting_id
        )

        result = generate_email(
            meeting_data,
            data.category,
            data.audience,
            data.email_context
        )

        return {
            "status": "success",
            "subject": result.get("subject", ""),
            "body": result.get("body", "")
        }

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