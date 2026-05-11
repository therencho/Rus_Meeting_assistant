"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MeetingDashboard() {
  const params = useParams();

  const meetingId = params.id;

  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMeeting() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/meeting/${meetingId}`
        );

        const data = await response.json();

        setMeeting(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load meeting.");
      }

      setLoading(false);
    }

    if (meetingId) {
      fetchMeeting();
    }
  }, [meetingId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b1020] text-white flex items-center justify-center text-xl">
        Loading Meeting Dashboard...
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0b1020] text-red-400 flex items-center justify-center text-xl">
        {error}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b1020] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Rus
            </h1>
            <p className="text-sm text-gray-400">
              Meeting Intelligence Dashboard
            </p>
          </div>

          <div className="text-sm text-gray-400">
            {meeting?.meeting_id}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-4xl font-bold mb-3">
                {meeting?.meeting_title}
              </h2>

              <p className="text-gray-400 max-w-4xl leading-relaxed">
                {meeting?.summary}
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 px-5 py-4 rounded-2xl text-sm text-blue-300 min-w-[220px]">
              <div className="font-semibold mb-1">
                Meeting Timestamp
              </div>

              <div className="text-gray-300 break-words">
                {meeting?.timestamp}
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Tasks */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-2xl font-semibold mb-6 text-blue-300">
              Tasks
            </h3>

            <div className="space-y-4">
              {meeting?.tasks?.map((task: any, index: number) => (
                <div
                  key={index}
                  className="bg-[#12182b] border border-white/5 rounded-2xl p-4"
                >
                  <div className="font-semibold text-lg mb-2">
                    {task.task}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                    <div>
                      <span className="text-gray-500">
                        Assigned:
                      </span>{" "}
                      {task.assigned_to}
                    </div>

                    <div>
                      <span className="text-gray-500">
                        Deadline:
                      </span>{" "}
                      {task.deadline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Execution Gaps */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-2xl font-semibold mb-6 text-yellow-300">
              Execution Gaps
            </h3>

            <div className="space-y-4">
              {meeting?.execution_gaps?.map((gap: any, index: number) => (
                <div
                  key={index}
                  className="bg-[#12182b] border border-white/5 rounded-2xl p-4"
                >
                  <div className="font-semibold text-lg mb-2">
                    {gap.issue}
                  </div>

                  <div className="text-sm text-yellow-400 mb-2 capitalize">
                    {gap.type}
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {gap.reason}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Risks */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-2xl font-semibold mb-6 text-red-300">
              Operational Risks
            </h3>

            <div className="space-y-4">
              {meeting?.operational_risks?.map((risk: any, index: number) => (
                <div
                  key={index}
                  className="bg-[#12182b] border border-white/5 rounded-2xl p-4"
                >
                  <div className="text-gray-200 leading-relaxed">
                    {risk}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Email Contexts */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-2xl font-semibold mb-6 text-green-300">
              Email Contexts
            </h3>

            <div className="space-y-5">
              {meeting?.email_contexts?.map((context: any, index: number) => (
                <div
                  key={index}
                  className="bg-[#12182b] border border-white/5 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <div className="font-semibold text-lg capitalize">
                        {context.category.replaceAll("_", " ")}
                      </div>

                      <div className="text-sm text-gray-400 mt-1">
                        Audience: {context.audience}
                      </div>
                    </div>

                    <button className="bg-green-500 hover:bg-green-400 transition px-4 py-2 rounded-xl text-sm font-medium">
                      Generate Email
                    </button>
                  </div>

                  <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5">
                    {context.email_context.map(
                      (item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      )
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}