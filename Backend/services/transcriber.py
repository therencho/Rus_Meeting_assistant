import os
import assemblyai as aai
from dotenv import load_dotenv

load_dotenv()

aai.settings.api_key = os.environ["ASSEMBLYAI_API_KEY"]


def transcribe_audio(file_path: str) -> str:
    """
    Transcribe an audio file using AssemblyAI with speaker diarization.
    Returns a formatted transcript: "Speaker A: text\nSpeaker B: text\n..."
    """

    config = aai.TranscriptionConfig(
        speech_models=["universal-3-pro", "universal-2"],
        language_detection=True,
        speaker_labels=True,
    )

    transcript = aai.Transcriber().transcribe(file_path, config=config)

    if transcript.status == aai.TranscriptStatus.error:
        raise RuntimeError(f"Transcription failed: {transcript.error}")

    lines = [
        f"Speaker {utterance.speaker}: {utterance.text}"
        for utterance in transcript.utterances
    ]

    return "\n".join(lines)
