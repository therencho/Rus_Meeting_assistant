"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meetings, setMeetings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/meetings"
        );

        const data = await response.json();

        setMeetings(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchMeetings();
  }, []);

  async function analyzeMeeting() {
    if (!transcript.trim()) {
      setError("Please enter a transcript.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            transcript,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        router.push(`/meeting/${data.data}`);
      } else {
        setError("Analysis failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Backend connection failed.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0b1020] text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Rus
            </h1>
            <p className="text-sm text-gray-400">
              AI Meeting Intelligence Assistant
            </p>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <span>AI Analysis</span>
            <span>Meeting Intelligence</span>
            <span>Email Contexts</span>
            <span>
              Previous Meetings: {meetings.length}
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-7xl w-full grid lg:grid-cols-[1.3fr_0.7fr] gap-10 items-start">
          {/* Left Side */}
          <div>
            <div className="text-center lg:text-left mb-12">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                Turn Meetings Into
                <span className="block text-blue-400">
                  Operational Intelligence
                </span>
              </h2>

              <p className="text-lg text-gray-400 max-w-3xl leading-relaxed">
                Rus analyzes business meetings to extract tasks,
                execution gaps, operational risks,
                communication intents, and stakeholder-ready
                email contexts.
              </p>
            </div>

            {/* Analysis Box */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    Analyze Meeting Transcript
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Paste your meeting transcript below.
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                  Backend Connected
                </div>
              </div>

              <textarea
                className="w-full h-80 rounded-2xl bg-[#12182b] border border-white/10 p-5 text-sm outline-none focus:border-blue-500 resize-none text-gray-200"
                placeholder="Paste meeting transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />

              {error && (
                <div className="mt-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                <div className="text-sm text-gray-400">
                  Rus will extract structured operational insights.
                </div>

                <button
                  onClick={analyzeMeeting}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-400 transition-all duration-200 px-8 py-4 rounded-2xl font-semibold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Analyzing Meeting..." : "Analyze Meeting"}
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-4 gap-4 mt-10">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="font-semibold mb-2 text-blue-300">
                  Tasks
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Extract action items, deadlines, and ownership.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="font-semibold mb-2 text-yellow-300">
                  Execution Gaps
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Detect vague ownership and missing accountability.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="font-semibold mb-2 text-red-300">
                  Risks
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Highlight operational and rollout blockers.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="font-semibold mb-2 text-green-300">
                  Email Contexts
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Prepare stakeholder-ready communication contexts.
                </p>
              </div>
            </div>
          </div>

          {/* Previous Meetings Sidebar */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-fit sticky top-28">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">
                Previous Meetings
              </h3>

              <div className="text-sm text-gray-400">
                {meetings.length} total
              </div>
            </div>

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
              {meetings.length === 0 && (
                <div className="text-gray-500 text-sm">
                  No meetings analyzed yet.
                </div>
              )}

              {meetings.map((meeting, index) => (
                <button
                  key={index}
                  onClick={() =>
                    router.push(
                      `/meeting/${meeting.meeting_id}`
                    )
                  }
                  className="w-full text-left bg-[#12182b] hover:bg-[#18213b] transition-all border border-white/5 rounded-2xl p-4"
                >
                  <div className="font-semibold text-white mb-2 line-clamp-2">
                    {meeting.meeting_title}
                  </div>

                  <div className="text-xs text-gray-400 break-words">
                    {meeting.timestamp}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-6 text-center text-sm text-gray-500">
        Rus • AI Meeting Intelligence Platform
      </footer>
    </main>
  );
}