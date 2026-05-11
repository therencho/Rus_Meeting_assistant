import json
import os


def load_meeting(meeting_id):

    filepath = (
        f"data/meetings/{meeting_id}.json"
    )

    with open(filepath, "r") as file:

        meeting_data = json.load(file)

    return meeting_data


def list_meetings():

    meetings = []

    meetings_folder = "data/meetings"

    for filename in os.listdir(meetings_folder):

        if filename.endswith(".json"):

            filepath = (
                f"{meetings_folder}/{filename}"
            )

            with open(filepath, "r") as file:

                meeting_data = json.load(file)

            meetings.append({

                "meeting_id":
                    meeting_data.get(
                        "meeting_id"
                    ),

                "meeting_title":
                    meeting_data.get(
                        "meeting_title"
                    ),

                "timestamp":
                    meeting_data.get(
                        "timestamp"
                    )
            })

    meetings.reverse()

    return meetings