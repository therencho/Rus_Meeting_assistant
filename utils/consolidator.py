from datetime import datetime


def consolidate_meeting_data(

    tasks,
    execution_gaps,
    operational_risks,
    communication_intents,

    summary=None,
    email_contexts=None,

    final=False
):

    meeting_context = {

        "tasks": tasks.get("tasks", []),

        "execution_gaps": execution_gaps.get(
            "execution_gaps", []
        ),

        "operational_risks": operational_risks.get(
            "operational_risks", []
        ),

        "communication_intents": communication_intents.get(
            "communication_intents", []
        )
    }

    # FINAL ENRICHMENT STAGE
    if final:
        meeting_context["meeting_title"] = (
    summary.get("meeting_title", "")
)

        meeting_context["summary"] = (
            summary.get("summary", "")
            if summary else ""
        )

        meeting_context["email_contexts"] = (
            email_contexts.get(
                "email_contexts", []
            )
            if email_contexts else []
        )

        meeting_context["timestamp"] = (
            datetime.now().isoformat()
        )

    return meeting_context