from services.extractor import extract_tasks

with open("transcript.txt", "r") as file:
    transcript = file.read()

tasks = extract_tasks(transcript)

print(tasks)