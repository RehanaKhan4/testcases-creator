import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { issueKey, title, body, isCode, label } = await request.json();

  const baseUrl = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;

  if (!baseUrl || !email || !token) {
    return NextResponse.json({ error: "Jira credentials missing" }, { status: 400 });
  }

  const auth = Buffer.from(email + ":" + token).toString("base64");

  const contentBlocks = isCode
    ? [{ type: "codeBlock", content: [{ type: "text", text: body }] }]
    : body.split("\n").map((line: string) => ({
        type: "paragraph",
        content: line.trim() ? [{ type: "text", text: line }] : [],
      }));

  const adfComment = {
    type: "doc",
    version: 1,
    content: [
      { type: "heading", attrs: { level: 4 }, content: [{ type: "text", text: title }] },
      ...contentBlocks,
    ],
  };

  try {
    // Step 1 — Post the comment
    const commentRes = await fetch(baseUrl + "/rest/api/3/issue/" + issueKey + "/comment", {
      method: "POST",
      headers: {
        Authorization: "Basic " + auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: adfComment }),
    });

    if (!commentRes.ok) {
      const errText = await commentRes.text();
      return NextResponse.json({ error: "Jira responded with " + commentRes.status, details: errText }, { status: commentRes.status });
    }

    // Step 2 — Add the label, if one was given
    if (label) {
      await fetch(baseUrl + "/rest/api/3/issue/" + issueKey, {
        method: "PUT",
        headers: {
          Authorization: "Basic " + auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          update: { labels: [{ add: label }] },
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to save to Jira", details: error.message }, { status: 500 });
  }
}