"use client";
import { useState } from "react";

const SAMPLE = "Story: User Login with Email and Password\n\nAs a user I want to log in with my email and password so I can access my account.\n\nNotes:\n- Account locks after 5 failed attempts\n- Forgot password option available";

export default function ManualTestsPage() {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const generate = async () => {
   if (!story.trim()) return;
   setLoading(true);
   setResult(null);
   setStatuses({});
   setProgress(0);

   const progressInterval = setInterval(() => {
    setProgress((prev) => (prev < 90 ? prev + Math.random() * 8 : prev));
    }, 300);

   try {
      const res = await fetch("/api/manual-test-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Something went wrong." });
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setLoading(false), 300);
    }
  };

  const setStatus = (id: string, status: string) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const copyAsCsv = () => {
    if (!result?.testCases) return;
    const header = "ID,Title,Precondition,Input Data,Steps,Expected Result,Priority,Status";
    const rows = result.testCases.map((tc: any) => {
      const steps = tc.steps.join(" | ").replace(/"/g, '""');
      return [
        tc.id,
        `"${tc.title}"`,
        `"${tc.precondition}"`,
        `"${tc.inputData}"`,
        `"${steps}"`,
        `"${tc.expectedResult}"`,
        tc.priority,
        statuses[tc.id] || "Not Run",
      ].join(",");
    });
    navigator.clipboard.writeText([header, ...rows].join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const passCount = Object.values(statuses).filter((s) => s === "Pass").length;
  const failCount = Object.values(statuses).filter((s) => s === "Fail").length;

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900">ManualTestCaseAgent</h1>
      <p className="text-gray-400 mt-1 mb-8">
        Generates numbered manual test cases with exact input data — exportable to CSV
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold text-gray-700">Story or feature</p>
          <button onClick={() => setStory(SAMPLE)} className="text-xs text-indigo-500 hover:text-indigo-700">
            Load sample
          </button>
        </div>
        <textarea
          className="w-full h-32 text-sm text-gray-700 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-indigo-400"
          placeholder="Paste your story here..."
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
      </div>

          <button 
            onClick={generate}
            disabled={loading || !story.trim()}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-40 mb-2"
            >
           {loading ? "Writing test cases..." : "📝 Generate Manual Test Cases"}
         </button>

         {loading && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-80 shadow-2xl">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
          <span className="text-2xl animate-pulse">📝</span>
        </div>
      </div>
      <p className="text-center text-sm font-semibold text-gray-800 mb-1">
        ManualTestCaseAgent
      </p>
      <p className="text-center text-xs text-gray-400 mb-5">
        {progress < 30 ? "Reading your story..." :
         progress < 60 ? "Thinking through test scenarios..." :
         progress < 90 ? "Writing input data and steps..." :
         "Almost done..."}
      </p>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">{Math.round(progress)}%</p>
    </div>
  </div>
)}

      {result?.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-500 text-sm">{result.error}</p>
        </div>
      )}

      {result?.testCases && (
        <>
          <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{result.testCases.length}</span> test cases ·{" "}
              <span className="text-green-600 font-semibold">{passCount} passed</span> ·{" "}
              <span className="text-red-500 font-semibold">{failCount} failed</span>
            </p>
            <button
              onClick={copyAsCsv}
              className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg"
            >
              {copied ? "✓ Copied CSV!" : "📋 Copy as CSV"}
            </button>
          </div>

          <div className="space-y-3">
            {result.testCases.map((tc: any) => (
              <div key={tc.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-mono text-indigo-500">{tc.id}</span>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{tc.title}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 ${
                    tc.priority === "P0" ? "bg-red-50 text-red-500" :
                    tc.priority === "P1" ? "bg-amber-50 text-amber-600" :
                    "bg-gray-50 text-gray-500"
                  }`}>{tc.priority}</span>
                </div>

                <div className="text-xs text-gray-500 mb-2">
                  <span className="font-medium text-gray-400">Precondition:</span> {tc.precondition}
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  <span className="font-medium text-gray-400">Input data:</span>{" "}
                  <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded">{tc.inputData}</span>
                </div>

                <div className="text-sm text-gray-700 space-y-1 mb-3">
                  {tc.steps.map((step: string, i: number) => (
                    <p key={i}><span className="text-gray-400">{i + 1}.</span> {step}</p>
                  ))}
                </div>

                <div className="text-xs text-gray-600 bg-green-50 border border-green-100 rounded-lg p-2 mb-3">
                  <span className="font-medium text-green-700">Expected:</span> {tc.expectedResult}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus(tc.id, "Pass")}
                    className={`text-xs px-4 py-1.5 rounded-lg border transition ${
                      statuses[tc.id] === "Pass" ? "bg-green-500 text-white border-green-500" : "border-gray-200 text-gray-500 hover:border-green-300"
                    }`}
                  >
                    ✓ Pass
                  </button>
                  <button
                    onClick={() => setStatus(tc.id, "Fail")}
                    className={`text-xs px-4 py-1.5 rounded-lg border transition ${
                      statuses[tc.id] === "Fail" ? "bg-red-500 text-white border-red-500" : "border-gray-200 text-gray-500 hover:border-red-300"
                    }`}
                  >
                    ✗ Fail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}