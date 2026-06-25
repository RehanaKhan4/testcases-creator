"use client";
import { useState } from "react";

const SAMPLE = "Endpoint: POST /api/auth/login\n\nRequest body:\n{\n  \"email\": \"string\",\n  \"password\": \"string\"\n}\n\nSuccess response (200):\n{\n  \"token\": \"string\",\n  \"user\": { \"id\": \"string\", \"name\": \"string\" }\n}\n\nNotes:\n- Email must be valid format\n- Password minimum 8 characters\n- Returns 401 if credentials are wrong";

export default function ApiTestPage() {
  const [endpoint, setEndpoint] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  const generate = async () => {
    if (!endpoint.trim()) return;
    setLoading(true);
    setResult(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 8 : p));
    }, 300);

    try {
      const res = await fetch("/api/api-test-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint }),
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

  const copyCollection = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result.postmanCollection, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900">APITestAgent</h1>
      <p className="text-gray-400 mt-1 mb-8">
        Paste an API endpoint description and get a full Postman test collection
      </p>

      <div className="grid grid-cols-2 gap-6">

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-700">API endpoint description</p>
              <button
                onClick={() => setEndpoint(SAMPLE)}
                className="text-xs text-indigo-500 hover:text-indigo-700"
              >
                Load sample
              </button>
            </div>
            <textarea
              className="w-full h-64 text-sm text-gray-700 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-indigo-400"
              placeholder="Paste your API endpoint details here..."
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
            />
          </div>

          <button
            onClick={generate}
            disabled={loading || !endpoint.trim()}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "APITestAgent is working..." : "🔌 Generate API Tests"}
          </button>
        </div>

        <div>
          {!result ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center h-full">
              <div className="text-4xl mb-3">🔌</div>
              <p className="text-gray-400 text-sm">Your Postman test collection appears here</p>
            </div>
          ) : result.error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-500 text-sm">{result.error}</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">{result.endpointName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{result.tests?.length} test cases generated</p>
                </div>
                <button
                  onClick={copyCollection}
                  className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg flex-shrink-0"
                >
                  {copied ? "✓ Copied!" : "Copy Postman JSON"}
                </button>
              </div>

              <div className="p-5 space-y-3 overflow-auto max-h-96">
                {(result.tests || []).map((t: any, i: number) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        t.priority === "P0" ? "bg-red-50 text-red-500" :
                        t.priority === "P1" ? "bg-amber-50 text-amber-600" :
                        "bg-gray-50 text-gray-500"
                      }`}>{t.priority}</span>
                      <span className="text-sm font-medium text-gray-800">{t.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">{t.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-80 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                <span className="text-2xl animate-pulse">🔌</span>
              </div>
            </div>
            <p className="text-center text-sm font-semibold text-gray-800 mb-1">APITestAgent</p>
            <p className="text-center text-xs text-gray-400 mb-5">
              {progress < 30 ? "Reading the endpoint spec..." :
               progress < 60 ? "Designing test cases..." :
               progress < 90 ? "Building Postman collection..." :
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