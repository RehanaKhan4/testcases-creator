export default function Home() {
  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-400 mt-1 mb-8">Your AI powered testing platform</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-400 mb-1">Tests Generated</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-400 mb-1">Sprint Suites</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-400 mb-1">E2E Suites</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        What do you want to do?
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-400 cursor-pointer transition">
          <p className="font-semibold text-gray-900 mb-1">⚡ Sprint Tests</p>
          <p className="text-sm text-gray-400">Paste a Jira story and get unit tests instantly</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-400 cursor-pointer transition">
          <p className="font-semibold text-gray-900 mb-1">🔗 E2E Tests</p>
          <p className="text-sm text-gray-400">Paste a user journey and get Playwright tests</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-400 cursor-pointer transition">
          <p className="font-semibold text-gray-900 mb-1">🔁 Regression</p>
          <p className="text-sm text-gray-400">Run your full test suite automatically</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-400 cursor-pointer transition">
          <p className="font-semibold text-gray-900 mb-1">🔌 Connect Jira</p>
          <p className="text-sm text-gray-400">Link Jira to automate everything</p>
        </div>
      </div>

    </div>
  );
}