import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { journey, framework } = await request.json();

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
        max_tokens: 2000,
        system: `You are a senior QA automation engineer. Write a complete, runnable ${framework} test file for the given user journey. Use realistic selectors (text, role, or placeholder based — avoid guessing CSS classes). Return ONLY the code, no explanation, no markdown fences.`,
        messages: [
          {
            role: "user",
            content: `Write a ${framework} test for this user journey:\n\n${journey}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const tests = data.content?.[0]?.text ?? "// No response generated";

    return NextResponse.json({ tests });
  } catch (error: any) {
    return NextResponse.json(
      { tests: "// Error generating tests: " + error.message }
    );
  }
}