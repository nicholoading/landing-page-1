"use client";
import { useEffect } from "react";
import Teams from "@/components/Teams";

export default function Status() {
  useEffect(() => {
    // Optional: Update title dynamically if needed
    document.title = "BugCrusher Status";
  }, []);

  return (
    <main>
      <Teams />
    </main>
  );
}
