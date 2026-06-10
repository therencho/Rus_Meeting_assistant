from concurrent.futures import ThreadPoolExecutor, as_completed

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

    # Stage 1: all 5 independent Gemini calls in parallel
    print("Starting parallel extraction (tasks, gaps, risks, intents, summary)...")

    stage1 = {
        "tasks":                  extract_tasks,
        "execution_gaps":         extract_execution_gaps,
        "operational_risks":      analyze_risks,
        "communication_intents":  extract_communication_intents,
        "summary":                generate_summary,
    }

    results = {}

    with ThreadPoolExecutor(max_workers=5) as executor:

        futures = {
            executor.submit(fn, transcript): key
            for key, fn in stage1.items()
        }

        for future in as_completed(futures):
            key = futures[future]
            results[key] = future.result()
            print(f"{key} done.")

    tasks                 = results["tasks"]
    execution_gaps        = results["execution_gaps"]
    operational_risks     = results["operational_risks"]
    communication_intents = results["communication_intents"]
    summary               = results["summary"]

    # Stage 2: email contexts depend on stage 1
    print("Building meeting context...")
    meeting_context = consolidate_meeting_data(
        tasks,
        execution_gaps,
        operational_risks,
        communication_intents
    )

    print("Building email contexts...")
    email_contexts = build_email_contexts(meeting_context)
    print("Email contexts built.")

    # Stage 3: final consolidation + save
    print("Building final meeting data...")
    final_meeting_data = consolidate_meeting_data(
        tasks,
        execution_gaps,
        operational_risks,
        communication_intents,
        summary=summary,
        email_contexts=email_contexts,
        final=True
    )

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
