import { NextResponse } from "next/server";

export async function POST() {
  const fakeResult = {
    totalTests: 28,
    passed: 25,
    failed: 1,
    coverage: 87,
    suites: [
      { name: "Login with OTP — Unit Tests", testCount: 5, status: "passed" },
      { name: "Online Shopping Checkout — E2E", testCount: 3, status: "passed" },
      { name: "Login API — Postman Collection", testCount: 7, status: "passed" },
      { name: "User Registration — Unit Tests", testCount: 4, status: "flaky" },
      { name: "Payment Gateway — E2E", testCount: 6, status: "passed" },
      { name: "Password Reset — API Tests", testCount: 3, status: "failed" },
    ],
    flakyTests: [
      "User Registration > 'sends welcome email' — passed 7/10 runs, intermittent timeout",
    ],
  };

  return NextResponse.json(fakeResult);
}