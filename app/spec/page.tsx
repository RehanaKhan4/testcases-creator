"use client";
import { useState } from "react";

const SAMPLE = "Story: User Login\n\nAs a user I want to login to the app.\n\nNotes:\n- Email and password login\n- Forgot password option";

export default function SpecPage() {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [jiraKey, setJiraKey] = useState("");
  const [savingToJira, setSavingToJira] = useState(false);
  const [savedToJira, setSavedToJira] = useState(false);

  const enrich = async () => {
    const key = sessionStorage.getItem("jiraIssueKey") || "";
    setJiraKey(key);

    if (!story.trim()) return;
    setLoading(true);
    setResult(null);
    setSavedToJira(false);
    try {
      const res = await fetch("/api/spec-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!result) return;
    const lines = [
      "STORY: " + result.title,
      "",
      "ACCEPTANCE CRITERIA:",
      ...(result.acceptanceCriteria || []).map((x: string) => "✓ " + x),
      "",
      "EDGE CASES:",
      ...(result.edgeCases || []).map((x: string) => "⚠ " + x),
      "",
      "NEGATIVE SCENARIOS:",
      ...(result.negativeScenarios || []).map((x: string) => "✗ " + x),
      "",
      "DEFINITION OF DONE:",
      ...(result.definitionOfDone || []).map((x: string) => "□ " + x),
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveToJira = async () => {
    if (!jiraKey || !result) return;
    setSavingToJira(true);
    try {
      const res = await fetch("/api/jira-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueKey: jiraKey, result }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedToJira(true);
        setTimeout(() => setSavedToJira(false), 4000);
      } else {
        alert("Failed: " + (data.error || "unknown error"));
      }
    } catch {
      alert("Failed to save to Jira");
    } finally {
      setSavingToJira(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900">SpecAgent</h1>
      <p className="text-gray-400 mt-1 mb-8">
        Paste a vague story and get complete acceptance criteria instantly
      </p>

      <div className="grid grid-cols-2 gap-6">

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-700">Your story</p>
              <button
                onClick={() => setStory(SAMPLE)}
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

          {jiraKey && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-xs text-indigo-600">
              🔗 Linked to Jira ticket: <strong>{jiraKey}</strong>
            </div>
          )}

          <button
            onClick={enrich}
            disabled={loading || !story.trim()}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "SpecAgent is thinking..." : "📋 Enrich with SpecAgent"}
          </button>
        </div>

        <div>
          {!result ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center h-full">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-400 text-sm">Your enriched story appears here</p>
            </div>
          ) : result.error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-500 text-sm">{result.error}</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
                <p className="font-semibold text-gray-900">{result.title}</p>
                <div className="flex gap-2">
                  <button
                    onClick={copyAll}
                    className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg"
                  >
                    {copied ? "✓ Copied!" : "Copy all"}
                  </button>
                  {jiraKey && (
                    <button
                      onClick={saveToJira}
                      disabled={savingToJira}
                      className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-lg"
                    >
                      {savingToJira
                        ? "Saving..."
                        : savedToJira
                        ? "✓ Saved to " + jiraKey
                        : "💾 Save to " + jiraKey}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-4 overflow-auto max-h-96">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">✓ Acceptance criteria</p>
                  {(result.acceptanceCriteria || []).map((ac: string, i: number) => (
                    <div key={i} className="flex gap-2 py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      <span className="text-sm text-gray-700">{ac}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">⚠ Edge cases</p>
                  {(result.edgeCases || []).map((ec: string, i: number) => (
                    <div key={i} className="flex gap-2 py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-amber-500 flex-shrink-0">⚠</span>
                      <span className="text-sm text-gray-700">{ec}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">✗ Negative scenarios</p>
                  {(result.negativeScenarios || []).map((ns: string, i: number) => (
                    <div key={i} className="flex gap-2 py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-red-400 flex-shrink-0">✗</span>
                      <span className="text-sm text-gray-700">{ns}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">□ Definition of done</p>
                  {(result.definitionOfDone || []).map((d: string, i: number) => (
                    <div key={i} className="flex gap-2 py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-gray-400 flex-shrink-0">□</span>
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