"use client";
import React, { useState, useEffect, useCallback } from "react";
import { TextFlippingBoard } from "./ui/text-flipping-board";

const MESSAGES: string[] = [
 "TURN MEETINGS\nINTO ACTION",

  "FROM TRANSCRIPTS\nTO EXECUTION",

  "EXTRACT RISKS\nBEFORE THEY ESCALATE",

  "CLARITY\nACCOUNTABILITY\nEXECUTION",

  "TASKS\nRISKS\nFOLLOW-UPS",

  "BUILT BY\nRENCHO\nSHAAREF • Özgur",

  "RUS\nUNDERSTANDS\nYOUR MEETINGS",

];

export function TextFlippingBoardDemo() {
  const [msgIdx, setMsgIdx] = useState(0);

  const next = useCallback(
    () => setMsgIdx((i) => (i + 1) % MESSAGES.length),
    [],
  );

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 py-20">
      <TextFlippingBoard text={MESSAGES[msgIdx]} />
    </div>
  );
}
