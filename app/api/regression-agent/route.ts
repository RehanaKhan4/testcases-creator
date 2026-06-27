import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        system: `You are a regression test orchestrator for a QA automation platform called Testcases Creator. The platform has these real test suites: "Login with OTP - Unit Tests", "Online Shopping Checkout - E2E", "Login API - Postman Collection", "User Registration - Unit Tests", "Payment Gateway - E2E", "Password Reset - API Tests".

Simulate a realistic regression run result. Return ONLY valid JSON, no markdown fences, in exactly this shape:
{
  "totalTests": number,
  "passed": number,
  "failed": number,
  "coverage": number,
  "suites": [{"name": "string", "testCount": number, "status": "passed"|"flaky"|"failed"}],
  "flakyTests": ["string describing a specific flaky test and why"]
}
Make it realistic — mostly passing, one or two genuine issues, coverage between 80-95%.`,
        messages: [{ role: "user", content: "Run the regression suite now." }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: "RegressionAgent failed", details: error.message }, { status: 500 });
  }
}