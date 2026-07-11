"use client";
import { useState } from "react";

export default function SprintPage() {
  const [story, setStory] = useState("");
  const [framework, setFramework] = useState("Jest");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [manualResult, setManualResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [jiraKey, setJiraKey] = useState("");
  const [savingToJira, setSavingToJira] = useState(false);
  const [savedToJira, setSavedToJira] = useState(false);

  const frameworks = ["Jest", "Playwright", "Cypress", "Postman", "Manual"];
  const isManual = framework === "Manual";

  const generateTests = async () => {
    const key = sessionStorage.getItem("jiraIssueKey") || "";
    setJiraKey(key);

    if (!story.trim()) return;
    setLoading(true);
    setResult("");
    setManualResult(null);
    setSavedToJira(false);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 8 : p));
    }, 300);

    try {
      if (isManual) {
        const response = await fetch("/api/manual-test-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ story }),
        });
        const data = await response.json();
        setManualResult(data);
      } else {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ story, framework }),
        });
        const data = await response.json();
        setResult(data.tests);
      }
    } catch (error) {
      if (isManual) {
        setManualResult({ error: "Something went wrong. Please try again." });
      } else {
        setResult("Something went wrong. Please try again.");
      }
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setLoading(false), 300);
    }
  };

  const saveToJira = async () => {
    if (!jiraKey) return;
    setSavingToJira(true);
    try {
      let title = "";
      let body = "";
      let isCode = false;

      if (isManual && manualResult?.testCases) {
        title = "📝 Manual Test Cases (Testcases Creator)";
        body = manualResult.testCases
          .map((tc: any) =>
            `${tc.id} — ${tc.title} [${tc.priority}]\nInput: ${tc.inputData}\nSteps: ${tc.steps.join(" | ")}\nExpected: ${tc.expectedResult}`
          )
          .join("\n\n");
      } else if (!isManual && result) {
        title = `⚡ Sprint Tests — ${framework} (Testcases Creator)`;
        body = result;
        isCode = true;
      } else {
        setSavingToJira(false);
        return;
      }

      const labelName = isManual ? "manual-tests" : "sprint-tests";
      const res = await fetch("/api/jira-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueKey: jiraKey, title, body, isCode, label: labelName }),
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
    <div className="p-8 max-w-5xl">

      <h1 className="text-2xl font-bold text-gray-900">Sprint Tests</h1>
      <p className="text-gray-400 mt-1 mb-8">
        Paste your Jira story and get tests instantly — automated or manual
      </p>

      <div className="grid grid-cols-2 gap-6">

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Jira Story
            </p>
            <textarea
              className="w-full h-52 text-sm text-gray-700 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-indigo-400"
              placeholder="Paste your Jira story here..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
          </div>

          {jiraKey && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-xs text-indigo-600">
              🔗 Linked to Jira ticket: <strong>{jiraKey}</strong>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Framework
            </p>
            <div className="flex gap-2 flex-wrap">
              {frameworks.map((fw) => (
                <button
                  key={fw}
                  onClick={() => setFramework(fw)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition ${
                    framework === fw
                      ? fw === "Manual"
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-indigo-600 text-white border-indigo-600"
                      : "text-gray-500 border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  {fw === "Manual" ? "📝 Manual" : fw}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateTests}
            disabled={loading || !story.trim()}
            className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed ${
              isManual ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading
              ? isManual ? "Writing manual test cases..." : "Generating tests..."
              : isManual ? "📝 Generate Manual Test Cases" : "⚡ Generate Tests"}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-gray-700">
              Generated Tests
            </p>
            {jiraKey && ((isManual && manualResult?.testCases) || (!isManual && result)) && (
              <button
                onClick={saveToJira}
                disabled={savingToJira}
                className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-lg"
              >
                {savingToJira ? "Saving..." : savedToJira ? "✓ Saved to " + jiraKey : "💾 Save to " + jiraKey}
              </button>
            )}
          </div>

          {isManual ? (
            manualResult?.testCases ? (
              <div className="space-y-3 overflow-auto max-h-96">
                {manualResult.testCases.map((tc: any) => (
                  <div key={tc.id} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-mono text-indigo-500">{tc.id}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        tc.priority === "P0" ? "bg-red-50 text-red-500" :
                        tc.priority === "P1" ? "bg-amber-50 text-amber-600" :
                        "bg-gray-50 text-gray-500"
                      }`}>{tc.priority}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">{tc.title}</p>
                    <p className="text-xs text-gray-500 mb-1">
                      <span className="font-medium text-gray-400">Input:</span> {tc.inputData}
                    </p>
                    <ol className="text-xs text-gray-600 list-decimal list-inside space-y-0.5 mb-1">
                      {tc.steps.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ol>
                    <p className="text-xs text-green-600 bg-green-50 rounded px-2 py-1 mt-1">
                      Expected: {tc.expectedResult}
                    </p>
                  </div>
                ))}
              </div>
            ) : manualResult?.error ? (
              <p className="text-red-500 text-sm">{manualResult.error}</p>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-300 text-sm">
                Your manual test cases will appear here
              </div>
            )
          ) : result ? (
            <pre className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed overflow-auto max-h-96">
              {result}
            </pre>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-300 text-sm">
              Your tests will appear here
            </div>
          )}
        </div>

      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-80 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isManual ? "bg-amber-50" : "bg-indigo-50"}`}>
                <span className="text-2xl animate-pulse">{isManual ? "📝" : "⚡"}</span>
              </div>
            </div>
            <p className="text-center text-sm font-semibold text-gray-800 mb-1">
              {isManual ? "ManualTestCaseAgent" : "Sprint Tests"}
            </p>
            <p className="text-center text-xs text-gray-400 mb-5">
              {progress < 30 ? "Reading acceptance criteria..." :
               progress < 60 ? "Designing test scenarios..." :
               progress < 90 ? (isManual ? "Writing steps and input data..." : `Writing ${framework} test code...`) :
               "Almost done..."}
            </p>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ease-out ${isManual ? "bg-amber-500" : "bg-indigo-500"}`} style={{ width: `${progress}%` }} />
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">{Math.round(progress)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}