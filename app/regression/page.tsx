"use client";
import { useState } from "react";

export default function RegressionPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runRegression = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/regression-agent", { method: "POST" });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RegressionAgent</h1>
          <p className="text-gray-400 mt-1">
            Runs every test ever generated and checks nothing broke
          </p>
        </div>
        <button
          onClick={runRegression}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-40"
        >
          {loading ? "Running full suite..." : "🔁 Run Regression"}
        </button>
      </div>

      {!result ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 flex flex-col items-center justify-center text-center">
          <div className="text-4xl mb-3">🔁</div>
          <p className="text-gray-400 text-sm">Click "Run Regression" to test everything at once</p>
        </div>
      ) : result.error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-500 text-sm">{result.error}</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-400 mb-1">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{result.totalTests}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-400 mb-1">Passed</p>
              <p className="text-2xl font-bold text-green-600">{result.passed}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-400 mb-1">Failed</p>
              <p className="text-2xl font-bold text-red-500">{result.failed}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-400 mb-1">Coverage</p>
              <p className="text-2xl font-bold text-indigo-600">{result.coverage}%</p>
            </div>
          </div>

          {/* Suite results */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700">Suite results</p>
            </div>
            {(result.suites || []).map((s: any, i: number) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${s.status === "passed" ? "bg-green-500" : s.status === "flaky" ? "bg-amber-500" : "bg-red-500"}`}></span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.testCount} tests</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  s.status === "passed" ? "bg-green-50 text-green-600" :
                  s.status === "flaky" ? "bg-amber-50 text-amber-600" :
                  "bg-red-50 text-red-500"
                }`}>
                  {s.status === "passed" ? "✓ Passed" : s.status === "flaky" ? "⚠ Flaky" : "✗ Failed"}
                </span>
              </div>
            ))}
          </div>

          {/* Flaky test warning */}
          {result.flakyTests?.length > 0 && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-700 mb-2">⚠ Flaky tests detected</p>
              {result.flakyTests.map((f: string, i: number) => (
                <p key={i} className="text-xs text-amber-600">{f}</p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}