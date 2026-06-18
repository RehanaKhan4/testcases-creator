"use client";

import { useState } from "react";

export default function E2EPage() {
  const [journey, setJourney] = useState("");
  const [framework, setFramework] = useState("Playwright");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const frameworks = ["Playwright", "Cypress"];

  const generateTests = async () => {
    if (!journey.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/generate-e2e", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journey, framework }),
      });
      const data = await response.json();
      setResult(data.tests);
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl">

      <h1 className="text-2xl font-bold text-gray-900">E2E Tests</h1>
      <p className="text-gray-400 mt-1 mb-8">
        Paste a user journey and get end to end tests instantly
      </p>

      <div className="grid grid-cols-2 gap-6">

        {/* Left — Input */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              User Journey
            </p>
            <textarea
              className="w-full h-52 text-sm text-gray-700 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-indigo-400"
              placeholder="Paste your user journey here...

Example:
1. User lands on homepage
2. Clicks Login button
3. Enters phone number
4. Receives OTP
5. Enters OTP
6. Lands on dashboard
7. Sees their profile"
              value={journey}
              onChange={(e) => setJourney(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Framework
            </p>
            <div className="flex gap-2">
              {frameworks.map((fw) => (
                <button
                  key={fw}
                  onClick={() => setFramework(fw)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition ${
                    framework === fw
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "text-gray-500 border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  {fw}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateTests}
            disabled={loading || !journey.trim()}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Generating E2E tests..." : "🔗 Generate E2E Tests"}
          </button>
        </div>

        {/* Right — Output */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Generated Tests
          </p>
          {result ? (
            <pre className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed overflow-auto max-h-96">
              {result}
            </pre>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-300 text-sm">
              Your E2E tests will appear here
            </div>
          )}
        </div>

      </div>
    </div>
  );
}