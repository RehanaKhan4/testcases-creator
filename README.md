# ⚡ Testcases Creator

> **Agentic Quality Engineering (AQE) SaaS** — AI agents that automate your entire testing lifecycle

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet%204.6-orange)](https://anthropic.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)

---

## 🎯 What is Testcases Creator?

Testcases Creator is an **Agentic QE platform** built on PACT principles (Proactive · Autonomous · Collaborative · Targeted) that replaces manual test writing with specialised AI agents. Paste a Jira story, get back complete test coverage in seconds.

**From testing-as-activity → to agents-as-orchestrators.**

---

## 🤖 AI Agents

| Agent | Job | Status |
|-------|-----|--------|
| 📋 SpecAgent | Enriches vague stories with ACs, edge cases, negative scenarios | ✅ Live |
| ⚡ Sprint Tests | Generates unit & integration tests from acceptance criteria | ✅ Live |
| 🔗 E2E Tests | Generates Playwright/Cypress user journey tests | ✅ Live |
| 🔁 RegressionAgent | Runs full suite, detects flaky tests | 🔜 Coming |
| 👥 UATAgent | Converts tests to plain English for stakeholder sign-off | 🔜 Coming |
| 🔌 APITestAgent | Tests every endpoint, generates Postman collections | 🔜 Coming |

---

## ✨ Features

- [x] Dashboard with test suite overview
- [x] SpecAgent — story enrichment
- [x] Sprint Test Generator (Jest · Vitest · Postman)
- [x] E2E Test Generator (Playwright · Cypress)
- [ ] Regression Test Suite runner
- [ ] UAT Scenario Generator
- [ ] Jira OAuth integration
- [ ] Real Claude AI test generation (currently using demo data)
- [ ] Stripe billing

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| AI Brain | Claude Sonnet 4.6 (Anthropic API) |
| Hosting | Vercel |

---

## 🚀 Getting Started

```bash
git clone https://github.com/RehanaKhan4/testcases-creator
cd testcases-creator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📐 Built on PACT Principles

- **P**roactive — SpecAgent anticipates gaps before dev starts
- **A**utonomous — Sprint & E2E agents work without human input
- **C**ollaborative — UAT Agent bridges AI and business stakeholders
- **T**argeted — Regression focuses on what changed, not everything

---

## 📄 License

MIT — built by Rehana Khan