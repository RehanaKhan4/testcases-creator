import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { issueKey, result } = await request.json();

  const baseUrl = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;

  if (!baseUrl || !email || !token) {
    return NextResponse.json({ error: "Jira credentials missing" }, { status: 400 });
  }

  const auth = Buffer.from(email + ":" + token).toString("base64");

  const bulletSection = (label: string, items: string[]) => [
    { type: "heading", attrs: { level: 4 }, content: [{ type: "text", text: label }] },
    {
      type: "bulletList",
      content: (items || []).map((item: string) => ({
        type: "listItem",
        content: [{ type: "paragraph", content: [{ type: "text", text: item }] }],
      })),
    },
  ];

  const adfDescription = {
    type: "doc",
    version: 1,
    content: [
      ...bulletSection("Acceptance Criteria", result.acceptanceCriteria),
      ...bulletSection("Edge Cases", result.edgeCases),
      ...bulletSection("Negative Scenarios", result.negativeScenarios),
      ...bulletSection("Definition of Done", result.definitionOfDone),
    ],
  };

  try {
    const res = await fetch(baseUrl + "/rest/api/3/issue/" + issueKey, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields: { description: adfDescription } }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: "Jira responded with " + res.status, details: errText },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update Jira", details: error.message },
      { status: 500 }
    );
  }
}