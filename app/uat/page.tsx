"use client";
import { useState } from "react";

const SAMPLE = "Story: User Login with OTP\n\nAs a user I want to log in using my phone number and OTP so I can access my account securely.\n\nKey behaviors:\n- Enter phone number, receive OTP\n- Enter correct OTP, land on dashboard\n- Wrong OTP 3 times locks account for 30 minutes";

export default function UatPage() {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<Record<number, string>>({});
  const [progress, setProgress] = useState(0);

  const generate = async () => {
    if (!story.trim()) return;
    setLoading(true);
    setScenarios([]);
    setDecisions({});
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 8 : p));
    }, 300);

    try {
      const res = await fetch("/api/uat-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),
      });
      const data = await res.json();
      setScenarios(data.scenarios || []);
    } catch {
      setScenarios([]);
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setLoading(false), 300);
    }
  };
  const decide = (i: number, decision: string) => {
    setDecisions((prev) => ({ ...prev, [i]: decision }));
  };

  const approvedCount = Object.values(decisions).filter((d) => d === "approved").length;
  const rejectedCount = Object.values(decisions).filter((d) => d === "rejected").length;
  const allDecided = scenarios.length > 0 && Object.keys(decisions).length === scenarios.length;

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900">UATAgent</h1>
      <p className="text-gray-400 mt-1 mb-8">
        Converts tests into plain English scenarios for stakeholder sign-off
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
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-40 mb-6"
      >
        {loading ? "UATAgent is writing scenarios..." : "👥 Generate UAT Scenarios"}
      </button>

      {scenarios.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{scenarios.length}</span> scenarios ·{" "}
              <span className="text-green-600 font-semibold">{approvedCount} approved</span> ·{" "}
              <span className="text-red-500 font-semibold">{rejectedCount} rejected</span>
            </p>
            {allDecided && (
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                rejectedCount === 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
              }`}>
                {rejectedCount === 0 ? "✓ Ready to release" : "✗ Blocked — fix rejected items"}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {scenarios.map((sc, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-sm font-semibold text-gray-800">{sc.title}</p>
                  {decisions[i] && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      decisions[i] === "approved" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                    }`}>
                      {decisions[i] === "approved" ? "✓ Approved" : "✗ Rejected"}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p><span className="font-medium text-gray-400">Given</span> {sc.given}</p>
                  <p><span className="font-medium text-gray-400">When</span> {sc.when}</p>
                  <p><span className="font-medium text-gray-400">Then</span> {sc.then}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => decide(i, "approved")}
                    className={`text-xs px-4 py-1.5 rounded-lg border transition ${
                      decisions[i] === "approved"
                        ? "bg-green-500 text-white border-green-500"
                        : "border-gray-200 text-gray-500 hover:border-green-300"
                    }`}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => decide(i, "rejected")}
                    className={`text-xs px-4 py-1.5 rounded-lg border transition ${
                      decisions[i] === "rejected"
                        ? "bg-red-500 text-white border-red-500"
                        : "border-gray-200 text-gray-500 hover:border-red-300"
                    }`}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
       </>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-80 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                <span className="text-2xl animate-pulse">👥</span>
              </div>
            </div>
            <p className="text-center text-sm font-semibold text-gray-800 mb-1">UATAgent</p>
            <p className="text-center text-xs text-gray-400 mb-5">
              {progress < 30 ? "Reading the story..." :
               progress < 60 ? "Translating into plain English..." :
               progress < 90 ? "Building sign-off scenarios..." :
               "Almost done..."}
            </p>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">{Math.round(progress)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}