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
        max_tokens: 1500,
        system: `You are writing UAT (User Acceptance Testing) scenarios for non-technical business stakeholders. Given a story, write 4-6 scenarios in Given/When/Then format that a stakeholder could read and approve without any technical knowledge.

Return ONLY valid JSON, no markdown fences, in exactly this shape:
{
  "scenarios": [{"title": "string", "given": "string", "when": "string", "then": "string"}]
}`,
        messages: [{ role: "user", content: `Write UAT scenarios for this story:\n\n${story}` }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ scenarios: [] });
  }
}