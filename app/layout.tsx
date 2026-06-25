import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Testcases Creator",
  description: "AI powered testing platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        <div className="flex h-screen bg-gray-50">

          {/* Sidebar */}
          <aside className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">

            {/* Logo */}
            <div className="px-4 py-5 border-b border-gray-200">
              <p className="text-sm font-bold text-indigo-600">Testcases Creator</p>
              <p className="text-xs text-gray-400 mt-0.5">AI Testing Platform</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-3 space-y-1">
              <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">
                📊 Dashboard
              </Link>
              <Link href="/spec" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">
              📋 SpecAgent
              </Link>
              <Link href="/manual-tests" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">
              📝 Manual Tests
              </Link>
              <Link href="/sprint" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">
                ⚡ Sprint Tests
              </Link>
              <Link href="/e2e" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">
                🔗 E2E Tests
              </Link>
              <Link href="/api-test" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">
                🔌 APITestAgent
              </Link>
              <Link href="/regression" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">
                🔁 Regression
              </Link>
              <Link href="/uat" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">
                👥 UAT
              </Link>
              <Link href="/jira" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition">
                🔌 Connect Jira
              </Link>
            </nav>

            {/* Bottom */}
            <div className="px-4 py-3 border-t border-gray-200">
              <p className="text-xs text-gray-400">claude-sonnet-4-6</p>
              <p className="text-xs text-gray-400 mt-0.5">Jira: Not connected</p>
            </div>

          </aside>

          {/* Page content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>

        </div>
      </body>
    </html>
  );
}