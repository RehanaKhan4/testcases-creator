"use client";
import { useState } from "react";

export default function JiraPage() {
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState("");

  const fetchStories = async () => {
    setLoading(true);
    setError("");
    setStories([]);
    try {
      const res = await fetch("/api/jira-stories");
      const data = await res.json();
      if (data.error) {
        setError(data.error + (data.details ? " — " + data.details : ""));
      } else {
        setStories(data.stories || []);
      }
    } catch (e: any) {
      setError("Could not connect to Jira");
    } finally {
      setLoading(false);
    }
  };

  const copyForSpecAgent = (story: any) => {
    const text = `Story: ${story.summary}\n\n${story.description}`;
    navigator.clipboard.writeText(text);
    setCopiedKey(story.key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900">Connect Jira</h1>
      <p className="text-gray-400 mt-1 mb-8">
        Fetch real stories from your Jira workspace
      </p>

      <button
        onClick={fetchStories}
        disabled={loading}
        className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-40 mb-6"
      >
        {loading ? "Connecting to Jira..." : "🔌 Fetch My Stories"}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-red-500 text-sm font-medium">Connection error</p>
          <p className="text-red-400 text-xs mt-1">{error}</p>
        </div>
      )}

      {stories.length > 0 && (
        <div className="space-y-3">
          {stories.map((s) => (
            <div key={s.key} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-mono text-indigo-500">{s.key}</span>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{s.summary}</p>
                </div>
                <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded flex-shrink-0">
                  {s.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{s.description}</p>
              <button
                onClick={() => copyForSpecAgent(s)}
                className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
              >
                {copiedKey === s.key ? "✓ Copied! Paste in SpecAgent" : "📋 Copy for SpecAgent"}
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && stories.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 flex flex-col items-center justify-center text-center">
          <div className="text-4xl mb-3">🔌</div>
          <p className="text-gray-400 text-sm">Click "Fetch My Stories" to load your real Jira tickets</p>
        </div>
      )}
    </div>
  );
}