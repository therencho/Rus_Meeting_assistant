"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  IconFileText,
  IconMicrophone,
  IconPlayerRecordFilled,
  IconPlayerStopFilled,
} from "@tabler/icons-react";
import SpeakerReview, { type Speaker } from "./speaker-review";

type AudioProcessResult = {
  cleaned_transcript: string;
  speakers: Speaker[];
};

type RecordingState = "idle" | "choosing" | "recording";

export default function MeetingWorkspace() {

  const router = useRouter();

  // File input refs
  const audioInputRef      = useRef<HTMLInputElement>(null);
  const transcriptInputRef = useRef<HTMLInputElement>(null);

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef        = useRef<BlobPart[]>([]);
  const streamRef        = useRef<MediaStream | null>(null);

  // State
  const [transcript,      setTranscript]      = useState("");
  const [loading,         setLoading]         = useState(false);
  const [processingAudio, setProcessingAudio] = useState(false);
  const [error,           setError]           = useState("");
  const [audioData,       setAudioData]       = useState<AudioProcessResult | null>(null);
  const [recordingState,  setRecordingState]  = useState<RecordingState>("idle");

  // ── Analyze text transcript ───────────────────────────────────────────────

  async function analyzeMeeting(transcriptText?: string) {

    const text = transcriptText ?? transcript;

    if (!text.trim()) {
      setError("Please enter a transcript.");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });

      const data = await res.json();

      if (data.status === "success") {
        router.push(`/meeting/${data.data}`);
      } else {
        setError("Analysis failed.");
      }

    } catch (err) {
      console.error(err);
      setError("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  }

  // ── Shared: send FormData to a processing endpoint ────────────────────────

  async function processUpload(endpoint: string, formData: FormData) {

    setProcessingAudio(true);
    setError("");

    try {

      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        setAudioData({
          cleaned_transcript: data.cleaned_transcript,
          speakers: data.speakers,
        });
      } else {
        setError(data.message ?? "Processing failed.");
      }

    } catch (err) {
      console.error(err);
      setError("Processing failed. Is the backend running?");
    } finally {
      setProcessingAudio(false);
    }
  }

  // ── Audio file upload ─────────────────────────────────────────────────────

  function handleAudioFile(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    processUpload("/upload-audio", fd);
  }

  // ── Transcript file upload (.txt / .docx) ─────────────────────────────────

  function handleTranscriptFile(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    processUpload("/upload-transcript-file", fd);
  }

  // ── Recording ─────────────────────────────────────────────────────────────

  async function startRecording(source: "mic" | "system") {

    setRecordingState("recording");
    setError("");
    chunksRef.current = [];

    try {

      let stream: MediaStream;

      if (source === "mic") {

        stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      } else {

        // getDisplayMedia for system audio — requires video in most browsers
        const display = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
          video: true,
        });

        // Keep only audio tracks, stop the video track immediately
        display.getVideoTracks().forEach((t) => t.stop());
        stream = new MediaStream(display.getAudioTracks());
      }

      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const file = new File([blob], "recording.webm", { type: mimeType });
        const fd   = new FormData();
        fd.append("file", file);
        processUpload("/upload-audio", fd);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      recorder.start();
      mediaRecorderRef.current = recorder;

    } catch (err) {
      console.error(err);
      setError("Could not access audio. Please check browser permissions.");
      setRecordingState("idle");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setRecordingState("idle");
  }

  // ── Speaker review confirmed ───────────────────────────────────────────────

  function handleSpeakerConfirm(finalTranscript: string) {
    setAudioData(null);
    setTranscript(finalTranscript);
    analyzeMeeting(finalTranscript);
  }

  // ─────────────────────────────────────────────────────────────────────────

  const isLocked = loading || processingAudio || recordingState === "recording";

  return (

    <>

      {/* Speaker Review Overlay */}
      {audioData && (
        <SpeakerReview
          cleanedTranscript={audioData.cleaned_transcript}
          speakers={audioData.speakers}
          onConfirm={handleSpeakerConfirm}
          onCancel={() => setAudioData(null)}
        />
      )}

      {/* Recording Source Choice Overlay */}
      {recordingState === "choosing" && (
        <div
          className="
            fixed inset-0 z-50
            bg-black/70 backdrop-blur-sm
            flex items-center justify-center
            px-6
          "
        >
          <div
            className="
              bg-[#141821]
              border border-white/10
              rounded-[32px]
              p-10
              max-w-md w-full
              text-center
            "
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              Record Meeting
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              Choose your audio source.
            </p>

            <div className="flex flex-col gap-4">

              <button
                onClick={() => startRecording("mic")}
                className="
                  bg-[#1b2130] hover:bg-[#222840]
                  border border-white/10
                  rounded-2xl px-6 py-4
                  text-white font-medium
                  transition-all
                "
              >
                🎙 Microphone Only
                <p className="text-gray-500 text-xs font-normal mt-1">
                  Captures your voice via mic
                </p>
              </button>

              <button
                onClick={() => startRecording("system")}
                className="
                  bg-[#1b2130] hover:bg-[#222840]
                  border border-white/10
                  rounded-2xl px-6 py-4
                  text-white font-medium
                  transition-all
                "
              >
                🖥 Full Meeting Audio
                <p className="text-gray-500 text-xs font-normal mt-1">
                  Captures system audio (browser tab, call, etc.)
                </p>
              </button>

              <button
                onClick={() => setRecordingState("idle")}
                className="
                  text-gray-500 hover:text-gray-300
                  text-sm mt-2
                  transition-colors
                "
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleAudioFile(file);
          e.target.value = "";
        }}
      />
      <input
        ref={transcriptInputRef}
        type="file"
        accept=".txt,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleTranscriptFile(file);
          e.target.value = "";
        }}
      />

      <section
        className="
          w-full max-w-6xl
          mx-auto px-6 py-24
        "
      >
        <div
          className="
            bg-white/5
            border border-white/10
            rounded-[32px]
            p-8 md:p-10
            backdrop-blur-xl shadow-2xl
          "
        >

          {/* Heading */}
          <div className="mb-8">
            <h2
              className="
                text-3xl md:text-4xl
                font-bold text-white tracking-tight
              "
            >
              Analyze Meeting
            </h2>
            <p className="text-gray-400 mt-3 text-base md:text-lg">
              Paste a transcript, upload a file, or record live.
            </p>
          </div>

          {/* Buttons — 3 across */}
          <div
            className="
              grid grid-cols-1
              md:grid-cols-3
              gap-4 mb-8
            "
          >

            {/* Upload Transcript */}
            <button
              onClick={() => transcriptInputRef.current?.click()}
              disabled={isLocked}
              className="
                flex items-center justify-center gap-3
                bg-[#151925] hover:bg-[#1b2130]
                disabled:opacity-50 disabled:cursor-not-allowed
                border border-white/10
                rounded-2xl px-4 py-4
                text-gray-300
                transition-all duration-200
              "
            >
              <IconFileText size={20} />
              <span className="text-sm font-medium">Upload Transcript</span>
            </button>

            {/* Upload Audio */}
            <button
              onClick={() => audioInputRef.current?.click()}
              disabled={isLocked}
              className="
                flex items-center justify-center gap-3
                bg-[#151925] hover:bg-[#1b2130]
                disabled:opacity-50 disabled:cursor-not-allowed
                border border-white/10
                rounded-2xl px-4 py-4
                text-gray-300
                transition-all duration-200
              "
            >
              <IconMicrophone size={20} />
              <span className="text-sm font-medium">
                {processingAudio ? "Processing..." : "Upload Audio"}
              </span>
            </button>

            {/* Record Meeting / Stop */}
            {recordingState === "recording" ? (
              <button
                onClick={stopRecording}
                className="
                  flex items-center justify-center gap-3
                  bg-red-500/20 hover:bg-red-500/30
                  border border-red-500/40
                  rounded-2xl px-4 py-4
                  text-red-300
                  transition-all duration-200
                "
              >
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <IconPlayerStopFilled size={20} />
                <span className="text-sm font-medium">Stop Recording</span>
              </button>
            ) : (
              <button
                onClick={() => setRecordingState("choosing")}
                disabled={isLocked}
                className="
                  flex items-center justify-center gap-3
                  bg-[#151925] hover:bg-[#1b2130]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  border border-white/10
                  rounded-2xl px-4 py-4
                  text-gray-300
                  transition-all duration-200
                "
              >
                <IconPlayerRecordFilled size={20} />
                <span className="text-sm font-medium">Record Meeting</span>
              </button>
            )}

          </div>

          {/* Processing banner */}
          {processingAudio && (
            <div
              className="
                mb-6
                bg-slate-700/20 border border-slate-500/30
                rounded-2xl px-6 py-4
                text-slate-300 text-sm
                flex items-center gap-3
              "
            >
              <div
                className="
                  w-4 h-4 rounded-full
                  border-2 border-slate-400 border-t-transparent
                  animate-spin flex-shrink-0
                "
              />
              Processing audio — this may take a minute...
            </div>
          )}

          {/* Transcript textarea */}
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here..."
            className="
              w-full min-h-[340px]
              bg-[#19191c]
              border border-white/10
              rounded-[28px] p-6
              text-gray-200 placeholder:text-gray-500
              outline-none resize-none
              focus:border-slate-500/50
              transition-all duration-200
              text-sm md:text-base leading-relaxed
            "
          />

          {/* Bottom row */}
          <div
            className="
              mt-8
              flex flex-col md:flex-row
              items-start md:items-center
              justify-between gap-6
            "
          >
            <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
              Rus extracts tasks, risks, execution gaps, and
              communication contexts from business meetings.
            </p>

            <button
              onClick={() => analyzeMeeting()}
              disabled={isLocked}
              className="
                bg-slate-700 hover:bg-slate-600
                disabled:opacity-50 disabled:cursor-not-allowed
                text-white font-semibold
                px-8 py-4 rounded-2xl
                transition-all duration-200
                shadow-lg shadow-blue-500/20
              "
            >
              {loading ? "Analyzing..." : "Analyze Meeting"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 text-red-400 text-sm">{error}</div>
          )}

        </div>
      </section>

    </>
  );
}
