import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";


export async function GET(request: Request) {
  const baseUrl = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;

  if (!baseUrl || !email || !token) {
    return NextResponse.json(
      { error: "Jira credentials missing in .env.local" },
      { status: 400 }
    );
  }

  const auth = Buffer.from(`${email}:${token}`).toString("base64");
  const { searchParams } = new URL(request.url);
  const project = searchParams.get("project") || "SCRUM";
  const jql = encodeURIComponent(`project = ${project} ORDER BY created DESC`);

  try {
    const res = await fetch(
      `${baseUrl}/rest/api/3/search/jql?jql=${jql}&maxResults=20&fields=summary,description,status,issuetype`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Jira responded with ${res.status}`, details: errText },
        { status: res.status }
      );
    }

    const data = await res.json();

    const stories = (data.issues || []).map((issue: any) => ({
      key: issue.key,
      summary: issue.fields.summary,
      description:
        issue.fields.description?.content
          ?.map((block: any) =>
            block.content?.map((c: any) => c.text).join(" ")
          )
          .join("\n") || "No description provided",
      status: issue.fields.status?.name || "Unknown",
      type: issue.fields.issuetype?.name || "Story",
    }));

    return NextResponse.json({ stories });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to connect to Jira", details: error.message },
      { status: 500 }
    );
  }
}