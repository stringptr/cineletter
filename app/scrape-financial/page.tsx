"use client";

import { useEffect, useState } from "react";

export default function ScrapeFinancialPage() {
  const [progress, setProgress] = useState({
    processed: 0,
    success: 0,
    failed: 0,
    total: 0,
  });

  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState("00:00:00");

  // Update elapsed time every second
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (running && startTime) {
      interval = setInterval(() => {
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");
        setElapsed(`${hrs}:${mins}:${secs}`);
      }, 1000);
    } else {
      setElapsed("00:00:00");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running, startTime]);

  const startScrape = () => {
    setRunning(true);
    setStartTime(Date.now());

    const eventSource = new EventSource("/api/scrape/financial");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data);

      if (data.processed === data.total) {
        eventSource.close();
        setRunning(false);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setRunning(false);
    };
  };

  const pct = progress.total
    ? Math.round((progress.processed / progress.total) * 100)
    : 0;

  return (
    <div className="p-8 text-white space-y-6">
      <h1 className="text-3xl font-bold">Scrape Movie Financial Data</h1>

      {/* Time elapsed */}
      <div className="text-lg">
        ⏱️ Time Elapsed: <span className="font-bold">{elapsed}</span>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-3 gap-6 text-lg">
        <div>Processed: {progress.processed} / {progress.total}</div>
        <div className="text-green-400">Success: {progress.success}</div>
        <div className="text-red-400">Failed: {progress.failed}</div>
      </div>

      {/* Progress bar */}
      {progress.total > 0 && (
        <div className="w-full bg-gray-700 rounded overflow-hidden h-5">
          <div
            className="bg-blue-500 h-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      <button
        onClick={startScrape}
        disabled={running}
        className={`px-6 py-3 rounded font-semibold ${
          running
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500"
        }`}
      >
        {running ? "Scraping..." : "Start Scraping"}
      </button>
    </div>
  );
}
