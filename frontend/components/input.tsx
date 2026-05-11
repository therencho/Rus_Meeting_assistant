"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  IconFileText,
  IconMicrophone,
  IconVideo,
  IconPlayerRecordFilled,
} from "@tabler/icons-react";

export default function MeetingWorkspace() {

  const router = useRouter();

  const [transcript, setTranscript] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function analyzeMeeting() {

    if (!transcript.trim()) {

      setError(
        "Please enter a transcript."
      );

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
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            transcript,
          }),
        }
      );

      const data =
        await response.json();

      if (
        data.status === "success"
      ) {

        router.push(
          `/meeting/${data.data}`
        );

      } else {

        setError(
          "Analysis failed."
        );
      }

    } catch (err) {

      console.error(err);

      setError(
        "Backend connection failed."
      );

    } finally {

      setLoading(false);
    }
  }

  const uploadButtons = [

    {
      label: "Upload Transcript",
      icon: IconFileText,
    },

    {
      label: "Upload Audio",
      icon: IconMicrophone,
    },

    {
      label: "Upload Video",
      icon: IconVideo,
    },

    {
      label: "Record Meeting",
      icon: IconPlayerRecordFilled,
    },
  ];

  return (

    <section
      className="
        w-full
        max-w-6xl
        mx-auto
        px-6
        py-24
      "
    >

      <div
        className="
          bg-white/5
          border
          border-white/10
          rounded-[32px]
          p-8
          md:p-10
          backdrop-blur-xl
          shadow-2xl
        "
      >

        {/* Heading */}

        <div
          className="
            mb-8
          "
        >

          <h2
            className="
              text-3xl
              md:text-4xl
              font-bold
              text-white
              tracking-tight
            "
          >

            Analyze Meeting

          </h2>

          <p
            className="
              text-gray-400
              mt-3
              text-base
              md:text-lg
            "
          >

            Paste transcript or prepare
            meeting input for Rus.

          </p>

        </div>

        {/* Upload Buttons */}

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
            mb-8
          "
        >

          {uploadButtons.map(
            (button, idx) => {

              const Icon =
                button.icon;

              return (

                <button
                  key={idx}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-3
                    bg-[#151925]
                    hover:bg-[#1b2130]
                    border
                    border-white/10
                    rounded-2xl
                    px-4
                    py-4
                    text-gray-300
                    transition-all
                    duration-200
                  "
                >

                  <Icon size={20} />

                  <span
                    className="
                      text-sm
                      font-medium
                    "
                  >

                    {button.label}

                  </span>

                </button>
              );
            }
          )}

        </div>

        {/* Transcript Input */}

        <textarea

          value={transcript}

          onChange={(e) =>
            setTranscript(
              e.target.value
            )
          }

          placeholder="
Paste your meeting transcript here..."

          className="
            w-full
            min-h-[340px]
            bg-[#19191c]
            border
            border-white/10
            rounded-[28px]
            p-6
            text-gray-200
            placeholder:text-gray-500
            outline-none
            resize-none
            focus:border-slate-500/50
            transition-all
            duration-200
            text-sm
            md:text-base
            leading-relaxed
          "
        />

        {/* Bottom Row */}

        <div
          className="
            mt-8
            flex
            flex-col
            md:flex-row
            items-start
            md:items-center
            justify-between
            gap-6
          "
        >

          <p
            className="
              text-sm
              text-gray-500
              max-w-xl
              leading-relaxed
            "
          >

            Rus extracts tasks, risks,
            execution gaps, and
            communication contexts from
            business meetings.

          </p>

          <button

            onClick={
              analyzeMeeting
            }

            disabled={loading}

            className="
              bg-slate-700
              hover:bg-slate-600
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-white
              font-semibold
              px-8
              py-4
              rounded-2xl
              transition-all
              duration-200
              shadow-lg
              shadow-blue-500/20
            "
          >

            {loading
              ? "Analyzing..."
              : "Analyze Meeting"}

          </button>

        </div>

        {/* Error */}

        {error && (

          <div
            className="
              mt-6
              text-red-400
              text-sm
            "
          >

            {error}

          </div>
        )}

      </div>

    </section>
  );
}