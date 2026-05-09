def consolidate_meeting_data(
   
    tasks,
    execution_gaps,
    operational_risks,
    communication_intents
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

    return meeting_context