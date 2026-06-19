import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { endpoint } = await request.json();

  const fakeResult = {
    endpointName: "POST /api/auth/login",
    tests: [
      {
        name: "Successful login with valid credentials",
        priority: "P0",
        description: "Returns 200 with token and user object when email and password are correct",
      },
      {
        name: "Returns 401 for wrong password",
        priority: "P0",
        description: "Returns 401 Unauthorized with no token when password does not match",
      },
      {
        name: "Returns 400 for invalid email format",
        priority: "P1",
        description: "Returns 400 Bad Request when email field is not a valid email format",
      },
      {
        name: "Returns 400 for password under 8 characters",
        priority: "P1",
        description: "Returns 400 Bad Request when password length is below minimum requirement",
      },
      {
        name: "Returns 400 for missing required fields",
        priority: "P1",
        description: "Returns 400 Bad Request when email or password field is missing from body",
      },
      {
        name: "Response time under 500ms",
        priority: "P2",
        description: "API responds within acceptable latency threshold under normal load",
      },
      {
        name: "Rejects SQL injection attempt in email field",
        priority: "P0",
        description: "Malicious input like admin'-- is sanitised and rejected safely",
      },
    ],
    postmanCollection: {
      info: { name: "Login API Tests", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
      item: [
        {
          name: "Successful Login",
          request: {
            method: "POST",
            url: "{{base_url}}/api/auth/login",
            body: { mode: "raw", raw: JSON.stringify({ email: "user@example.com", password: "validpass123" }) },
          },
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
                  "pm.test('Response has token', () => pm.expect(pm.response.json().token).to.exist);",
                ],
              },
            },
          ],
        },
        {
          name: "Wrong Password",
          request: {
            method: "POST",
            url: "{{base_url}}/api/auth/login",
            body: { mode: "raw", raw: JSON.stringify({ email: "user@example.com", password: "wrongpass" }) },
          },
          event: [
            {
              listen: "test",
              script: { exec: ["pm.test('Status code is 401', () => pm.response.to.have.status(401));"] },
            },
          ],
        },
      ],
    },
  };

  return NextResponse.json(fakeResult);
}