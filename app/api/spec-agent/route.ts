import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { story } = await request.json();

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
        system: `You are a senior QA engineer. Given a vague user story, generate a complete testable specification.

Return ONLY a valid JSON object, no markdown fences, no extra text, in exactly this shape:
{
  "title": "short title of the story",
  "acceptanceCriteria": ["string", "string", ...],
  "edgeCases": ["string", "string", ...],
  "negativeScenarios": ["string", "string", ...],
  "definitionOfDone": ["string", "string", ...]
}`,
        messages: [
          {
            role: "user",
            content: `Here is the story:\n\n${story}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: "SpecAgent failed to generate a response.", details: error.message },
      { status: 500 }
    );
  }
}