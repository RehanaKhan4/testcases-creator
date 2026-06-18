"use client";

import { useState } from "react";

const SAMPLE_STORY = "Story: User Login\n\nAs a user I want to be able to login to the app so I can access my account.\n\nNotes:\n- Use email and password\n- There is a forgot password option";

export default function SpecPage() {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const enrich = async () => {
    if (!story.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/spec-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!result) return;
    const text = [
      "STORY: " + result.title,
      "\nACCEPTANCE CRITERIA:",
      result.acceptanceCriteria?.map((ac: string) => "✓ " + ac).join("\n"),
      "\nEDGE CASES:",
      result.edgeCases?.map((ec: string) => "⚠ " + ec).join("\n"),
      "\nNEGATIVE SCENARIOS:",
      result.negativeScenarios?.map((ns: string) => "✗ " + ns).join("\n"),
      "\nDEFINITION OF DONE:",
      result.definitionOfDone?.map((d: string) => "□ " + d).join("\n"),
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-6xl">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">SpecAgent</h1>
        <p className="text-gray-400 mt-1">
          Paste a vague story and get back complete acceptance criteria,
          edge cases and a definition of done
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">

        {/* Left — Input */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-700">
                Paste your vague story here
              </p>
              <button
                onClick={() => setStory(SAMPLE_STORY)}
                className="text-xs text-indigo-500 hover:text-indigo-700"
              >
                Load sample
              </button>
            </div>
            <textarea
              className="w-full h-64 text-sm text-gray-700 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-indigo-400"
              placeholder="Paste your vague Jira story here..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
          </div>

          <button
            onClick={enrich}
            disabled={loading || !story.trim()}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "SpecAgent is thinking..." : "📋 Enrich with SpecAgent"}
          </button>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              How SpecAgent works
            </p>
            {[
              ["1", "Paste a vague Jira story", "gray"],
              ["2", "SpecAgent reads and understands it", "indigo"],
              ["3", "Claude AI generates complete ACs", "indigo"],
              ["4", "Edge cases and negatives added", "indigo"],
              ["5", "Copy everything back to Jira", "green"],
            ].map(([num, text, color]) => (
              <div key={num} className="flex items-start gap-3 mb-2">
                <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  color === "green" ? "bg-green-100 text-green-600" :
                  color === "indigo" ? "bg-indigo-100 text-indigo-600" :
                  "bg-gray-100 text-gray-500"
                }`}>
                  {num}
                </span>
                <span className="text-xs text-gray-500">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Output */}
        <div>
          {!result ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 h-full flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-400 text-sm">Your enriched story will appear here</p>
              <p className="text-gray-300 text-xs mt-1">
                Complete with ACs, edge cases and definition of done
              </p>
            </div>
          ) : result.error ? (
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <p className="text-red-500 text-sm">{result.error}</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{result.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {result.acceptanceCriteria?.length} ACs ·{" "}
                    {result.edgeCases?.length} edge cases ·{" "}
                    {result.negativeScenarios?.length} negative scenarios
                  </p>
                </div>
                <button
                  onClick={copyAll}
                  className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition flex-shrink-0"
                >
                  {copied ? "✓ Copied!" : "Copy all"}
                </button>
              </div>

              <div className="p-5 space-y-5 overflow-auto max-h-96">

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    ✓ Acceptance criteria
                  </p>
                  {result.acceptanceCriteria?.map((ac: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-green-500 text-sm flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-sm text-gray-700">{ac}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    ⚠ Edge cases
                  </p>
                  {result.edgeCases?.map((ec: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-amber-500 text-sm flex-shrink-0 mt-0.5">⚠</span>
                      <span className="text-sm text-gray-700">{ec}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    ✗ Negative scenarios
                  </p>
                  {result.negativeScenarios?.map((ns: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-red-400 text-sm flex-shrink-0 mt-0.5">✗</span>
                      <span className="text-sm text-gray-700">{ns}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    □ Definition of done
                  </p>
                  {result.definitionOfDone?.map((d: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-gray-400 text-sm flex-shrink-0 mt-0.5">□</span>
                      <span className="text-sm text-gray-700">{d}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}