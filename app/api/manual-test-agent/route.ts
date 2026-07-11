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
        max_tokens: 4096,
        system: `You are a senior QA engineer writing manual test cases for a human tester to execute by hand.

Return ONLY a valid JSON object, no markdown fences, no extra text before or after, in exactly this shape:
{
  "title": "short title of the feature being tested",
  "testCases": [
    {
      "id": "TC-001",
      "title": "short descriptive title",
      "precondition": "what must be true before starting",
      "inputData": "exact input values to use, e.g. email = test@example.com",
      "steps": ["step 1", "step 2", "step 3"],
      "expectedResult": "what should happen",
      "priority": "P0" or "P1" or "P2"
    }
  ]
}

Generate exactly 6 test cases covering happy path, edge cases, and negative scenarios — even if the input story is very long, keep your output focused and complete. Each test case must have concrete, realistic input data — never leave it generic. Keep each field concise so the full JSON always closes properly.`,
        messages: [
          {
            role: "user",
            content: `Write manual test cases for this story:\n\n${story}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";

    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      return NextResponse.json(
        { error: "ManualTestCaseAgent returned no usable JSON", details: text.slice(0, 300) },
        { status: 500 }
      );
    }

    const jsonSlice = text.slice(firstBrace, lastBrace + 1);
    const result = JSON.parse(jsonSlice);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: "ManualTestCaseAgent failed", details: error.message },
      { status: 500 }
    );
  }
}