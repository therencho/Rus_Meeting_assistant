from services.extractor import extract_tasks
from services.execution_gap import extract_execution_gaps
from services.risk_analyzer import analyze_risks
from services.communication_intent import extract_communication_intents
from services.summary_generator import generate_summary
from services.consolidator import consolidate_meeting_data
from services.email_context_builder import build_email_contexts



with open("transcript.txt", "r") as file:
    transcript = file.read()

tasks = extract_tasks(transcript)

execution_gaps = extract_execution_gaps(transcript)

operational_risks = analyze_risks(transcript)

communication_intents = extract_communication_intents(transcript)

summary = generate_summary(transcript)

meeting_context = consolidate_meeting_data(
   
    tasks,
    execution_gaps,
    operational_risks,
    communication_intents
)

email_contexts = build_email_contexts(

    meeting_context

)

print(email_contexts)