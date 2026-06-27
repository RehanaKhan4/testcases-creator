import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { story, framework } = await request.json();

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
        system: `You are a senior QA automation engineer. Write a complete, runnable unit/integration test file using ${framework} for the given story. Cover happy paths, edge cases, and error states. Return ONLY the code, no explanation, no markdown fences.`,
        messages: [
          {
            role: "user",
            content: `Write ${framework} tests for this story:\n\n${story}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const tests = data.content?.[0]?.text ?? "// No response generated";

    return NextResponse.json({ tests });
  } catch (error: any) {
    return NextResponse.json({ tests: "// Error generating tests: " + error.message });
  }
}