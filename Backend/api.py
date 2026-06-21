from dotenv import load_dotenv

load_dotenv()

import os
import shutil
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from utils.retrieval import (
    load_meeting,
    list_meetings
)
from analyzer import analyzing_pipeline
from services.email_generator import generate_email
from services.transcriber import transcribe_audio
from services.transcript_cleaner import clean_transcript
from services.speaker_identifier import identify_speakers

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


@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):

    suffix = Path(file.filename).suffix if file.filename else ".mp3"

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix
    ) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:

        print(f"Starting transcription: {file.filename}")
        raw_transcript = transcribe_audio(tmp_path)
        print("Transcription done.")

        # Run cleaning + speaker ID in parallel (both work on raw transcript)
        print("Starting cleaning and speaker identification in parallel...")
        with ThreadPoolExecutor(max_workers=2) as executor:
            clean_future = executor.submit(clean_transcript, raw_transcript)
            speaker_future = executor.submit(identify_speakers, raw_transcript)
            cleaned_transcript = clean_future.result()
            speakers = speaker_future.result()
        print("Cleaning and speaker identification done.")

        return {
            "status": "success",
            "cleaned_transcript": cleaned_transcript,
            "speakers": speakers,
        }

    except Exception as e:

        print("ERROR:", e)

        return {
            "status": "error",
            "message": str(e)
        }

    finally:

        os.unlink(tmp_path)


@app.post("/upload-transcript-file")
async def upload_transcript_file(file: UploadFile = File(...)):

    suffix = Path(file.filename).suffix.lower() if file.filename else ""

    if suffix not in (".txt", ".docx"):
        return {
            "status": "error",
            "message": "Only .txt and .docx files are supported."
        }

    try:

        if suffix == ".txt":

            content = await file.read()
            raw_transcript = content.decode("utf-8")

        else:

            # .docx — save to temp, extract with python-docx
            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".docx"
            ) as tmp:
                shutil.copyfileobj(file.file, tmp)
                tmp_path = tmp.name

            try:
                from docx import Document
                doc = Document(tmp_path)
                raw_transcript = "\n".join(
                    p.text for p in doc.paragraphs if p.text.strip()
                )
            finally:
                os.unlink(tmp_path)

        print(f"Transcript file received ({suffix}), {len(raw_transcript)} chars.")

        # Clean + identify speakers in parallel (same as /upload-audio)
        with ThreadPoolExecutor(max_workers=2) as executor:
            clean_future = executor.submit(clean_transcript, raw_transcript)
            speaker_future = executor.submit(identify_speakers, raw_transcript)
            cleaned_transcript = clean_future.result()
            speakers = speaker_future.result()

        print("Cleaning and speaker identification done.")

        return {
            "status": "success",
            "cleaned_transcript": cleaned_transcript,
            "speakers": speakers,
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