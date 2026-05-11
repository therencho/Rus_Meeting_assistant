import json
import os
from datetime import datetime


def save_meeting(meeting_data, transcript):

    # Create folders
    os.makedirs(
        "data/meetings",
        exist_ok=True
    )

    os.makedirs(
        "data/transcripts",
        exist_ok=True
    )

    # Generate meeting ID
    timestamp = datetime.now()

    meeting_id = timestamp.strftime(
        "meeting_%Y%m%d_%H%M%S"
    )

    # File paths
    meeting_filepath = (
        f"data/meetings/{meeting_id}.json"
    )

    transcript_filepath = (
        f"data/transcripts/{meeting_id}.txt"
    )

    # Save transcript
    with open(transcript_filepath, "w") as file:

        file.write(transcript)

    # Add metadata to meeting data
    meeting_data["meeting_id"] = meeting_id

    meeting_data["timestamp"] = (
        timestamp.isoformat()
    )

    meeting_data["transcript_path"] = (
        transcript_filepath
    )

    # Save meeting JSON
    with open(meeting_filepath, "w") as file:

        json.dump(
            meeting_data,
            file,
            indent=4
        )

  
    return meeting_id