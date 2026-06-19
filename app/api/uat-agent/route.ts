import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { story } = await request.json();

  const scenarios = [
    {
      title: "Successful login with valid OTP",
      given: "a registered user is on the login screen",
      when: "they enter a valid phone number and the correct OTP",
      then: "they are redirected to their dashboard",
    },
    {
      title: "OTP sent within expected time",
      given: "a user enters a valid phone number",
      when: "they click 'Send OTP'",
      then: "they receive the OTP within 5 seconds",
    },
    {
      title: "Account locks after repeated failures",
      given: "a user has entered the wrong OTP twice",
      when: "they enter the wrong OTP a third time",
      then: "their account is locked for 30 minutes with a clear message shown",
    },
    {
      title: "Expired OTP prompts resend",
      given: "a user received an OTP more than 10 minutes ago",
      when: "they try to use that expired OTP",
      then: "they see a message asking them to resend a new OTP",
    },
    {
      title: "Invalid phone number is rejected early",
      given: "a user types an incomplete or invalid phone number",
      when: "they click 'Send OTP'",
      then: "they see an inline validation error before any request is sent",
    },
  ];

  return NextResponse.json({ scenarios });
}