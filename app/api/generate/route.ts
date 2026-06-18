import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { story, framework } = await request.json();

  const fakeTests = `// ✅ ${framework} tests generated for your story

describe("Login with OTP", () => {

  test("sends OTP for valid phone number", async () => {
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone: "+91 9876543210" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe("OTP sent successfully");
  });

  test("rejects invalid phone number format", async () => {
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone: "123" }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid phone number");
  });

  test("redirects to dashboard on correct OTP", async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone: "+91 9876543210", otp: "123456" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.redirect).toBe("/dashboard");
  });

  test("locks account after 3 wrong attempts", async () => {
    for (let i = 0; i < 3; i++) {
      await fetch("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone: "+91 9876543210", otp: "000000" }),
      });
    }
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone: "+91 9876543210", otp: "000000" }),
    });
    const data = await res.json();
    expect(data.error).toBe("Account locked for 30 minutes");
  });

  test("prompts resend when OTP expires", async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone: "+91 9876543210", otp: "expired" }),
    });
    const data = await res.json();
    expect(data.error).toBe("OTP expired");
    expect(data.canResend).toBe(true);
  });

});`;

  return NextResponse.json({ tests: fakeTests });
}