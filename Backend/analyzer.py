from services.extractor import extract_tasks
from services.execution_gap import (
    extract_execution_gaps
)
from services.risk_analyzer import (
    analyze_risks
)
from services.communication_intent import (
    extract_communication_intents
)
from services.summary_generator import (
    generate_summary
)

from utils.consolidator import (
    consolidate_meeting_data
)

from services.email_context_builder import (
    build_email_contexts
)

from utils.storage import save_meeting


def analyzing_pipeline(transcript):

    print("Starting task extraction...")
    tasks = extract_tasks(transcript)
    print("Tasks extracted.")

    print("Starting execution gaps...")
    execution_gaps = extract_execution_gaps(
        transcript
    )
    print("Execution gaps extracted.")

    print("Starting risk analysis...")
    operational_risks = analyze_risks(
        transcript
    )
    print("Risks extracted.")

    print("Starting communication intents...")
    communication_intents = (
        extract_communication_intents(
            transcript
        )
    )
    print("Communication intents extracted.")

    print("Starting summary generation...")
    summary = generate_summary(transcript)
    print("Summary generated.")

    print("Building meeting context...")
    meeting_context = consolidate_meeting_data(

        tasks,
        execution_gaps,
        operational_risks,
        communication_intents
    )
    print("Meeting context built.")

    print("Building email contexts...")
    email_contexts = build_email_contexts(
        meeting_context
    )
    print("Email contexts built.")

    print("Building final meeting data...")
    final_meeting_data = (
        consolidate_meeting_data(

            tasks,
            execution_gaps,
            operational_risks,
            communication_intents,

            summary=summary,
            email_contexts=email_contexts,

            final=True
        )
    )
    print("Final meeting data built.")

    print("Saving meeting...")
    meeting_id = save_meeting(
        final_meeting_data,
        transcript
    )

    print(f"Meeting saved: {meeting_id}")

    return {
        "status": "success",
        "data": meeting_id
    }