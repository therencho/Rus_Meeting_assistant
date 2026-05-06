TASK_EXTRACTION_PROMPT = """
You are an AI business operations assistant.

Extract all actionable tasks from the meeting transcript.

For each task identify:
- task
- assigned_to
- deadline
- priority

Return ONLY valid JSON in this format:

{
  "tasks": [
    {
      "task": "",
      "assigned_to": "",
      "deadline": "",
      "priority": ""
    }
  ]
}

Transcript:
"""