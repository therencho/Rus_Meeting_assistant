from services.extractor import extract_tasks
from services.execution_gap import extract_execution_gaps
from services.risk_analyzer import analyze_risks
from services.communication_intent import extract_communication_intents
from services.summary_generator import generate_summary
from utils.consolidator import consolidate_meeting_data
from services.email_context_builder import build_email_contexts
from utils.storage import save_meeting


def analyzing_pipeline(transcript):
    tasks = extract_tasks(transcript)
    print("tasks extracted")

    execution_gaps = extract_execution_gaps(transcript)

    operational_risks = analyze_risks(transcript)

    communication_intents = extract_communication_intents(transcript)

    summary = generate_summary(transcript)
    print

    meeting_context = consolidate_meeting_data(
    tasks,
    execution_gaps,
    operational_risks,
    communication_intents
)

    email_contexts = build_email_contexts(
    meeting_context
)

    final_meeting_data = consolidate_meeting_data(
    tasks,
    execution_gaps,
    operational_risks,
    communication_intents,
    summary=summary,
    email_contexts=email_contexts,
    final=True
)
    meeting_id = save_meeting(
    final_meeting_data,
    transcript
)

    print(f"Meeting saved to: {meeting_id}")

    return {
        "status": "success",
        "data": meeting_id
    }