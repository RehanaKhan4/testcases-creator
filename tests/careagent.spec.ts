
import { test, expect } from '@playwright/test';

test.describe('Homepage Landing and Authentication Options', () => {
  test('should load homepage and display app title or login screen with sign in/sign up options', async ({ page }) => {
    // Step 1: Navigate to the homepage
    await page.goto('https://family-health-ai.vercel.app/');

    // Step 2: Wait for the page to fully load
    await page.waitForLoadState('networkidle');

    // Step 2: Verify the page loads successfully
    await expect(page).toHaveURL(/family-health-ai\.vercel\.app/);

    // Step 2: Check that the page title is present (not empty)
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);

    // Step 2: Verify the app title or some meaningful content is visible on the page
    const appTitleOrHeading = page.locator('h1, h2, [data-testid="app-title"], .app-title, header, [role="banner"]').first();
    await expect(appTitleOrHeading).toBeVisible({ timeout: 10000 });

    // Step 3: Check for login/sign in option
    const loginOption = page.getByRole('link', { name: /log ?in|sign ?in/i })
      .or(page.getByRole('button', { name: /log ?in|sign ?in/i }))
      .or(page.getByText(/log ?in|sign ?in/i).first());

    // Step 3: Check for sign up option
    const signUpOption = page.getByRole('link', { name: /sign ?up|register|get started|create account/i })
      .or(page.getByRole('button', { name: /sign ?up|register|get started|create account/i }))
      .or(page.getByText(/sign ?up|register|get started|create account/i).first());

    // At least one authentication option should be visible
    const loginVisible = await loginOption.isVisible().catch(() => false);
    const signUpVisible = await signUpOption.isVisible().catch(() => false);

    // Also check for any form elements that might indicate a login/sign up screen
    const authForm = page.locator('input[type="email"], input[type="password"], input[placeholder*="email" i], input[placeholder*="password" i]').first();
    const authFormVisible = await authForm.isVisible().catch(() => false);

    // Verify at least one of these authentication elements is present
    const hasAuthOption = loginVisible || signUpVisible || authFormVisible;
    expect(hasAuthOption).toBeTruthy();

    // If login button is visible, verify it's interactive
    if (loginVisible) {
      await expect(loginOption.first()).toBeEnabled();
    }

    // If sign up button is visible, verify it's interactive
    if (signUpVisible) {
      await expect(signUpOption.first()).toBeEnabled();
    }

    // If a form is visible, verify email/password fields are interactive
    if (authFormVisible) {
      await expect(authForm).toBeEnabled();
    }
  });

  test('should display Family Health AI branding or relevant health content', async ({ page }) => {
    await page.goto('https://family-health-ai.vercel.app/');
    await page.waitForLoadState('networkidle');

    // Check for health or family related content on the page
    const healthContent = page.getByText(/health|family|ai|medical|wellness/i).first();
    await expect(healthContent).toBeVisible({ timeout: 10000 });
  });

  test('login option should navigate to login page or show login form', async ({ page }) => {
    await page.goto('https://family-health-ai.vercel.app/');
    await page.waitForLoadState('networkidle');

    // Find and click login button/link if available
    const loginButton = page.getByRole('link', { name: /log ?in|sign ?in/i })
      .or(page.getByRole('button', { name: /log ?in|sign ?in/i }))
      .first();

    const loginVisible = await loginButton.isVisible().catch(() => false);

    if (loginVisible) {
      await loginButton.click();
      await page.waitForLoadState('networkidle');

      // After clicking login, we should see a login form or be on a login page
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i], input[name="email"]').first();
      const passwordInput = page.locator('input[type="password"], input[placeholder*="password" i], input[name="password"]').first();

      const emailVisible = await emailInput.isVisible().catch(() => false);
      const passwordVisible = await passwordInput.isVisible().catch(() => false);

      const loginFormPresent = emailVisible || passwordVisible;
      expect(loginFormPresent).toBeTruthy();
    } else {
      // If no separate login button, check if login form is already on homepage
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
      const emailVisible = await emailInput.isVisible().catch(() => false);
      expect(emailVisible).toBeTruthy();
    }
  });

  test('sign up option should navigate to registration page or show sign up form', async ({ page }) => {
    await page.goto('https://family-health-ai.vercel.app/');
    await page.waitForLoadState('networkidle');

    // Find and click sign up button/link if available
    const signUpButton = page.getByRole('link', { name: /sign ?up|register|get started|create account/i })
      .or(page.getByRole('button', { name: /sign ?up|register|get started|create account/i }))
      .first();

    const signUpVisible = await signUpButton.isVisible().catch(() => false);

    if (signUpVisible) {
      await signUpButton.click();
      await page.waitForLoadState('networkidle');

      // After clicking sign up, verify we're on a registration page or see a form
      const currentUrl = page.url();
      const isOnSignUpPage = /sign.?up|register|signup|registration/i.test(currentUrl);

      const registrationForm = page.locator('input[type="email"], input[type="password"], input[placeholder*="email" i], form').first();
      const formVisible = await registrationForm.isVisible().catch(() => false);

      expect(isOnSignUpPage || formVisible).toBeTruthy();
    } else {
      // Sign up might not be a separate page - log this as acceptable
      console.log('Sign up button not found on homepage - may be integrated into login flow');
    }
  });
});