import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('./');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Rental Review/);
});

test('login link', async ({ page }) => {
  await page.goto('./');

  // Click the login link.
  await page.getByRole('link', { name: 'Login / Signup' }).click();

  // Expects page to have changed to login
  await expect(page).toHaveURL('./login');
});
