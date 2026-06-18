import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { journey, framework } = await request.json();

  const fakeTests = `// ✅ ${framework} E2E tests generated

import { test, expect } from "@playwright/test";

test.describe("Online Shopping Checkout", () => {

  test("complete checkout from search to confirmation", async ({ page }) => {

    await page.goto("http://localhost:3000");
    await expect(page).toHaveTitle(/Home/);

    await page.fill("input[placeholder='Search...']", "wireless headphones");
    await page.keyboard.press("Enter");

    await page.locator(".product-card").first().click();
    await expect(page).toHaveURL(/product/);

    await page.selectOption("select[name='quantity']", "2");
    await page.click("button:text('Add to Cart')");
    await expect(page.locator(".cart-count")).toHaveText("2");

    await page.click(".cart-icon");
    await expect(page).toHaveURL(/cart/);

    await page.click("text=Proceed to Checkout");
    await page.fill("input[name='name']", "Neeraj Kumar");
    await page.fill("input[name='email']", "neeraj@example.com");
    await page.fill("input[name='address']", "Jammu, J&K 180001");

    await page.click("text=Pay with UPI");
    await page.fill("input[name='upi']", "neeraj@upi");
    await page.click("text=Confirm Payment");

    await expect(page).toHaveURL(/order-confirmation/);
    await expect(page.locator("h1")).toContainText("Order Confirmed");
    await expect(page.locator(".order-number")).toBeVisible();

  });

  test("shows error for invalid UPI ID", async ({ page }) => {
    await page.goto("http://localhost:3000/checkout");
    await page.click("text=Pay with UPI");
    await page.fill("input[name='upi']", "invalid-upi");
    await page.click("text=Confirm Payment");
    await expect(page.locator("text=Invalid UPI ID")).toBeVisible();
  });

  test("cart persists after page refresh", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.locator(".product-card").first().click();
    await page.click("text=Add to Cart");
    await page.reload();
    await expect(page.locator(".cart-count")).toHaveText("1");
  });

});`;

  return NextResponse.json({ tests: fakeTests });
}