"use client";

import { useState } from "react";

export type Speaker = {
  label: string;
  guessed_name: string;
  role: string;
  brief: string;
};

type Props = {
  cleanedTranscript: string;
  speakers: Speaker[];
  onConfirm: (finalTranscript: string) => void;
  onCancel: () => void;
};

export default function SpeakerReview({
  cleanedTranscript,
  speakers,
  onConfirm,
  onCancel,
}: Props) {

  const [names, setNames] = useState<Record<string, string>>(
    Object.fromEntries(
      speakers.map((s) => [
        s.label,
        s.guessed_name === "Unknown" ? "" : s.guessed_name,
      ])
    )
  );

  function handleConfirm() {

    let finalTranscript = cleanedTranscript;

    for (const speaker of speakers) {

      const confirmedName = names[speaker.label]?.trim();

      if (confirmedName) {
        // Replace all occurrences of "Speaker X" with the confirmed name
        finalTranscript = finalTranscript.replace(
          new RegExp(`Speaker ${speaker.label}\\b`, "g"),
          confirmedName
        );
      }
    }

    onConfirm(finalTranscript);
  }

  const labelColors: Record<string, string> = {
    A: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    B: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    C: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    D: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    E: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    F: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  };

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        bg-[#0e1016]/95
        backdrop-blur-sm
        flex
        flex-col
        overflow-y-auto
      "
    >

      <div
        className="
          max-w-4xl
          mx-auto
          w-full
          px-6
          py-16
        "
      >

        {/* Header */}

        <div className="mb-12">

          <h2
            className="
              text-4xl
              md:text-5xl
              font-bold
              tracking-tight
              text-white
            "
          >
            Review Speakers
          </h2>

          <p
            className="
              text-gray-400
              mt-4
              text-lg
              max-w-2xl
            "
          >
            Rus has identified the speakers below. Confirm or correct
            their names before analysis begins.
          </p>

        </div>

        {/* Speaker Cards */}

        <div
          className="
            grid
            md:grid-cols-2
            gap-5
            mb-12
          "
        >

          {speakers.map((speaker) => (

            <div
              key={speaker.label}
              className="
                bg-[#141821]
                border
                border-white/10
                rounded-[28px]
                p-6
              "
            >

              {/* Label + Role */}

              <div
                className="
                  flex
                  items-center
                  gap-4
                  mb-5
                "
              >

                <div
                  className={`
                    w-12
                    h-12
                    rounded-2xl
                    border
                    flex
                    items-center
                    justify-center
                    text-xl
                    font-bold
                    flex-shrink-0
                    ${labelColors[speaker.label] ?? "bg-white/10 text-white border-white/20"}
                  `}
                >
                  {speaker.label}
                </div>

                <div>

                  <div
                    className="
                      text-white
                      font-semibold
                      text-base
                    "
                  >
                    {speaker.role}
                  </div>

                  <div
                    className="
                      text-gray-500
                      text-sm
                      mt-0.5
                    "
                  >
                    {speaker.brief}
                  </div>

                </div>

              </div>

              {/* Name Input */}

              <div>

                <label
                  className="
                    text-xs
                    text-gray-500
                    uppercase
                    tracking-wider
                    mb-2
                    block
                  "
                >
                  Name
                  {speaker.guessed_name !== "Unknown" && (
                    <span className="ml-2 text-blue-400 normal-case tracking-normal">
                      — AI guessed
                    </span>
                  )}
                </label>

                <input
                  type="text"
                  value={names[speaker.label] ?? ""}
                  onChange={(e) =>
                    setNames((prev) => ({
                      ...prev,
                      [speaker.label]: e.target.value,
                    }))
                  }
                  placeholder={`Speaker ${speaker.label} (leave blank to keep label)`}
                  className="
                    w-full
                    bg-[#0e1016]
                    border
                    border-white/10
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    placeholder:text-gray-600
                    outline-none
                    focus:border-slate-500/50
                    transition-all
                    text-sm
                  "
                />

              </div>

            </div>
          ))}

        </div>

        {/* Actions */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <button
            onClick={handleConfirm}
            className="
              bg-slate-700
              hover:bg-slate-600
              text-white
              font-semibold
              px-8
              py-4
              rounded-2xl
              transition-all
              duration-200
            "
          >
            Confirm & Analyze
          </button>

          <button
            onClick={onCancel}
            className="
              bg-white/5
              hover:bg-white/10
              border
              border-white/10
              text-gray-400
              font-medium
              px-8
              py-4
              rounded-2xl
              transition-all
              duration-200
            "
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}
