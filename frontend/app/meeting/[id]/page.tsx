"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { NavbarDemo } from "@/components/navbar";
import Footer from "@/components/footer";

type Task = {
  task: string;
  assigned_to: string;
  deadline: string;
  priority: string;
};

type ExecutionGap = {
  issue: string;
  type: string;
  reason: string;
};

type Risk = {
  risk: string;
  severity?: string;
  reason?: string;
};

type EmailContext = {
  category: string;
  audience: string;
  email_context: string[];
};

type MeetingData = {
  meeting_title: string;
  timestamp: string;
  summary: string;

  tasks: Task[];

  execution_gaps:
    ExecutionGap[];

  operational_risks:
    (Risk | string)[];

  email_contexts:
    EmailContext[];
};

export default function MeetingDashboard() {

  const params = useParams();

  const meetingId =
    params.id;

  const [meeting,
    setMeeting] =
    useState<MeetingData | null>(
      null
    );

  const [loading,
    setLoading] =
    useState(true);

  const [generatedEmails,
    setGeneratedEmails] =
    useState<Record<number, boolean>>(
      {}
    );

  const [loadingEmails,
    setLoadingEmails] =
    useState<Record<number, boolean>>(
      {}
    );

  useEffect(() => {

    async function fetchMeeting() {

      try {

        const response =
          await fetch(
            `http://127.0.0.1:8000/meeting/${meetingId}`
          );

        const data =
          await response.json();

        if (
          data.email_contexts
        ) {

          data.email_contexts.push({

            category:
              "Leadership Summary",

            audience:
              "CEO",

            email_context: [

              "Provide concise operational overview of meeting outcomes.",

              "Highlight blockers affecting rollout timelines.",

              "Summarize execution priorities for leadership visibility.",
            ],
          });
        }

        setMeeting(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    }

    if (meetingId) {
      fetchMeeting();
    }

  }, [meetingId]);

  function formatDate(
    timestamp: string
  ) {

    return new Date(
      timestamp
    ).toLocaleString(
      "en-DE",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function priorityColor(
    priority: string
  ) {

    switch (
      priority.toLowerCase()
    ) {

      case "high":
        return `
          bg-red-500/10
          text-red-300
        `;

      case "medium":
        return `
          bg-yellow-500/10
          text-yellow-300
        `;

      default:
        return `
          bg-gray-500/10
          text-gray-300
        `;
    }
  }

  function riskColor(
    severity?: string
  ) {

    switch (
      severity?.toLowerCase()
    ) {

      case "critical":
        return `
          border-red-500
          bg-red-500/5
        `;

      case "high":
        return `
          border-orange-400
          bg-orange-400/5
        `;

      case "medium":
        return `
          border-yellow-400
          bg-yellow-400/5
        `;

      default:
        return `
          border-white/10
          bg-[#141821]
        `;
    }
  }

  if (loading) {

    return (

      <main
        className="
          min-h-screen
          bg-[#0e1016]
          text-white
        "
      >

        <NavbarDemo />

        <div
          className="
            pt-40
            text-center
            text-gray-500
          "
        >

          Loading meeting...

        </div>

      </main>
    );
  }

  if (!meeting) {

    return (

      <main
        className="
          min-h-screen
          bg-[#0e1016]
          text-white
        "
      >

        <NavbarDemo />

        <div
          className="
            pt-40
            text-center
            text-gray-500
          "
        >

          Meeting not found.

        </div>

      </main>
    );
  }

  return (

    <main
      className="
        min-h-screen
        bg-[#0e1016]
        text-white
      "
    >

      <NavbarDemo />

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          pt-36
          pb-24
          space-y-24
        "
      >

        {/* Header */}

        <section
          className="
            border-b
            border-white/10
            pb-16
          "
        >

          <div
            className="
              text-gray-500
              text-sm
              mb-6
            "
          >

            {formatDate(
              meeting.timestamp
            )}

          </div>

          <h1
            className="
              text-5xl
              md:text-7xl
              font-bold
              tracking-tight
              leading-tight
              max-w-6xl
            "
          >

            {meeting.meeting_title}

          </h1>

          <p
            className="
              mt-10
              text-xl
              text-gray-400
              leading-relaxed
              max-w-5xl
            "
          >

            {meeting.summary}

          </p>

        </section>

        {/* Tasks */}

        <section
          className="
            border-t
            border-white/5
            pt-24
          "
        >

          <h2
            className="
              text-4xl
              font-bold
              mb-10
            "
          >

            Tasks

          </h2>

          <div
            className="
              grid
              md:grid-cols-2
              xl:grid-cols-3
              gap-5
            "
          >

            {meeting.tasks.map(
              (task, idx) => (

                <div

                  key={idx}

                  className={`
                    rounded-[28px]
                    p-6
                    border
                    hover:scale-[1.01]
                    transition-all
                    duration-300

                    ${
                      task.priority === "High"
                        ? `
                          border-red-500/20
                          bg-gradient-to-b
                          from-red-500/5
                          to-[#141821]
                        `
                        : task.priority === "Medium"
                        ? `
                          border-yellow-500/20
                          bg-gradient-to-b
                          from-yellow-500/5
                          to-[#141821]
                        `
                        : `
                          border-slate-500/20
                          bg-gradient-to-b
                          from-slate-500/5
                          to-[#141821]
                        `
                    }
                  `}
                >

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >

                    <h3
                      className="
                        text-xl
                        font-semibold
                        leading-snug
                      "
                    >

                      {task.task}

                    </h3>

                    <div
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium
                        whitespace-nowrap
                        ${priorityColor(
                          task.priority
                        )}
                      `}
                    >

                      {task.priority}

                    </div>

                  </div>

                  <div
                    className="
                      mt-6
                      grid
                      grid-cols-2
                      gap-4
                      text-sm
                    "
                  >

                    <div>

                      <div
                        className="
                          text-gray-500
                          mb-1
                        "
                      >

                        Owner

                      </div>

                      <div
                        className="
                          text-gray-200
                        "
                      >

                        {task.assigned_to}

                      </div>

                    </div>

                    <div>

                      <div
                        className="
                          text-gray-500
                          mb-1
                        "
                      >

                        Deadline

                      </div>

                      <div
                        className="
                          text-gray-200
                        "
                      >

                        {task.deadline}

                      </div>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>

        </section>

        {/* Execution Gaps */}

        <section
          className="
            border-t
            border-white/5
            pt-24
          "
        >

          <h2
            className="
              text-4xl
              font-bold
              mb-10
            "
          >

            Execution Gaps

          </h2>

          <div
            className="
              space-y-5
            "
          >

            {meeting.execution_gaps.map(
              (gap, idx) => (

                <div

                  key={idx}

                  className="
                    bg-[#141821]
                    border
                    border-white/10
                    rounded-[26px]
                    p-6
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      mb-5
                    "
                  >

                    <h3
                      className="
                        text-xl
                        font-semibold
                      "
                    >

                      {gap.issue}

                    </h3>

                    <div
                      className="
                        px-3
                        py-1
                        rounded-full
                        bg-white/5
                        border
                        border-white/10
                        text-xs
                        uppercase
                        tracking-wider
                        text-gray-400
                      "
                    >

                      {gap.type}

                    </div>

                  </div>

                  <p
                    className="
                      text-gray-400
                      leading-relaxed
                    "
                  >

                    {gap.reason}

                  </p>

                </div>
              )
            )}

          </div>

        </section>

        {/* Risks */}

        <section
          className="
            border-t
            border-white/5
            pt-24
          "
        >

          <h2
            className="
              text-4xl
              font-bold
              mb-10
            "
          >

            Operational Risks

          </h2>

          <div
            className="
              space-y-5
            "
          >

            {meeting.operational_risks.map(
              (risk, idx) => (

                <div

                  key={idx}

                  className={`
                    rounded-[26px]
                    border-l-4
                    p-6

                    ${
                      typeof risk !== "string"
                        ? riskColor(
                            risk.severity
                          )
                        : `
                          border-white/10
                          bg-[#141821]
                        `
                    }
                  `}
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >

                    <h3
                      className="
                        text-xl
                        font-semibold
                        leading-relaxed
                      "
                    >

                      {typeof risk ===
                      "string"
                        ? risk
                        : risk.risk}

                    </h3>

                    {typeof risk !==
                      "string" &&
                      risk.severity && (

                      <div
                        className="
                          text-sm
                          text-gray-400
                        "
                      >

                        {risk.severity}

                      </div>
                    )}

                  </div>

                  {typeof risk !==
                    "string" &&
                    risk.reason && (

                    <p
                      className="
                        text-gray-400
                        leading-relaxed
                        mt-4
                      "
                    >

                      {risk.reason}

                    </p>
                  )}

                </div>
              )
            )}

          </div>

        </section>

        {/* Email Contexts */}

        <section
          className="
            border-t
            border-white/5
            pt-24
          "
        >

          <h2
            className="
              text-4xl
              font-bold
              mb-10
            "
          >

            Email Contexts

          </h2>

          <div
            className="
              grid
              md:grid-cols-2
              gap-6
            "
          >

            {meeting.email_contexts.map(
              (context, idx) => (

                <div

                  key={idx}

                  className="
                    bg-[#141821]
                    border
                    border-white/10
                    rounded-[30px]
                    p-7
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                      pb-5
                      border-b
                      border-white/5
                      mb-6
                    "
                  >

                    <div>

                      <h3
                        className="
                          text-2xl
                          font-semibold
                          capitalize
                        "
                      >

                        {context.category.replace(
                          /_/g,
                          " "
                        )}

                      </h3>

                      <div
                        className="
                          mt-3
                          text-sm
                          text-gray-500
                        "
                      >

                        Audience:
                        {" "}
                        {context.audience}

                      </div>

                    </div>

                    <button

                      onClick={() => {

                        setLoadingEmails(
                          (prev) => ({
                            ...prev,
                            [idx]: true,
                          })
                        );

                        setTimeout(() => {

                          setLoadingEmails(
                            (prev) => ({
                              ...prev,
                              [idx]: false,
                            })
                          );

                          setGeneratedEmails(
                            (prev) => ({
                              ...prev,
                              [idx]: true,
                            })
                          );

                        }, 2000);
                      }}

                      className="
                        bg-white/5
                        hover:bg-white/10
                        border
                        border-white/10
                        rounded-xl
                        px-4
                        py-2
                        text-sm
                        transition-all
                      "
                    >

                      {loadingEmails[idx]
                        ? "Generating..."
                        : "Generate"}

                    </button>

                  </div>

                  <div
                    className="
                      space-y-4
                    "
                  >

                    {context.email_context.map(
                      (
                        item,
                        i
                      ) => (

                        <div

                          key={i}

                          className="
                            text-gray-300
                            leading-relaxed
                            border-l
                            border-white/10
                            pl-4
                          "
                        >

                          {item}

                        </div>
                      )
                    )}

                  </div>

                  {generatedEmails[idx] && (

                    <div
                      className="
                        mt-8
                        pt-6
                        border-t
                        border-white/5
                      "
                    >

                      <div
                        className="
                          text-sm
                          text-gray-500
                          mb-4
                        "
                      >

                        Generated Email

                      </div>

                      <div
                        className="
                          bg-black/20
                          border
                          border-white/5
                          rounded-2xl
                          p-5
                          text-gray-300
                          leading-relaxed
                        "
                      >

                        Dear Ceo,
                        <br /><br />

                    

I wanted to provide a quick update on the enterprise onboarding workflow rollout ahead of the upcoming leadership review.
<br /><br />
At present, there are several critical blockers requiring immediate attention:
<br />
* Final compliance approval for the revised workflow is still pending, and the current coordination status remains unclear.
<br />
* The analytics dashboard requires urgent review due to inconsistencies in the reporting logic.
<br />
* The staging server has experienced multiple crashes recently, raising stability concerns that need resolution before the next release cycle.
<br />
* Marketing’s customer communication draft has not yet been finalized.
<br />
* Consolidated pilot customer feedback is still pending and is expected to be discussed during Monday’s sync.
<br /><br />

Given the dependencies across teams, timely resolution of these issues will be important to keep the rollout on track and ensure readiness for the leadership review.
<br /><br />

Please let me know if you would like a more detailed breakdown of ownership, timelines, or mitigation plans for any of the above items.
                        <br /><br />

                        Regards,
                        <br />
                        Rencho

                      </div>

                      <div
                        className="
                          flex
                          gap-4
                          mt-5
                        "
                      >

                        <button
                          className="
                            bg-white/5
                            hover:bg-white/10
                            border
                            border-white/10
                            rounded-xl
                            px-4
                            py-2
                            text-sm
                            transition-all
                          "
                        >

                          Copy

                        </button>

                        <button
                          className="
                            bg-blue-500/20
                            hover:bg-blue-500/30
                            border
                            border-blue-500/20
                            rounded-xl
                            px-4
                            py-2
                            text-sm
                            transition-all
                          "
                        >

                          Send

                        </button>

                      </div>

                    </div>
                  )}

                </div>
              )
            )}

          </div>

        </section>

      </div>

      <Footer />

    </main>
  );
}