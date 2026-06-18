import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { story } = await request.json();

  // Fake response — swap ANTHROPIC_API_KEY when ready for real AI
  const fakeResult = {
    title: "User Login with Email and Password",
    acceptanceCriteria: [
      "Valid email and correct password → user redirected to /dashboard",
      "Login form shows email and password fields with a Submit button",
      "Forgot password link navigates to /reset-password",
      "Remember me checkbox keeps user logged in for 30 days",
      "Successful login stores auth token in secure httpOnly cookie",
      "User sees their name in the top navigation after login",
    ],
    edgeCases: [
      "Email with uppercase letters (Test@Email.com) treated same as lowercase",
      "Password with special characters (!@#$%^&*) accepted correctly",
      "Very long email address (255 characters) shows validation error",
      "Copy-pasting email with trailing whitespace still works correctly",
      "Browser autofill populates fields correctly without breaking validation",
      "Pressing Enter key in password field submits the form",
    ],
    negativeScenarios: [
      "Wrong password → shows 'Invalid email or password' — never reveals which is wrong",
      "Empty email field → shows 'Email is required' before submitting",
      "Invalid email format (missing @) → shows 'Enter a valid email address'",
      "Empty password field → shows 'Password is required' before submitting",
      "Account locked after 5 failed attempts → shows 'Account locked. Try again in 30 minutes'",
      "SQL injection in email field (admin'--) → blocked, shows validation error",
      "Disabled account → shows 'Your account has been disabled. Contact support'",
    ],
    definitionOfDone: [
      "All acceptance criteria have passing automated tests",
      "Login page is accessible — WCAG 2.1 AA compliant",
      "Page loads in under 2 seconds on 3G connection",
      "Works correctly on Chrome, Firefox, Safari, and Edge",
      "Works on mobile screen sizes (375px and above)",
      "Security review completed — no XSS or injection vulnerabilities",
      "Code reviewed and approved by at least one other developer",
      "Product owner has signed off on the UI design",
    ],
  };

  return NextResponse.json(fakeResult);
}