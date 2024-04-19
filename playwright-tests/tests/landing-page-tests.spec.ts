import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('./');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Rental Review/);
});

test('homebutton link', async ({ page }) => {
  await page.goto('./');

  // Click homebutton link
  await page.getByRole('link').first().click();

  // Expects to be back at the home page
  await expect(page).toHaveURL('./');
});

test('login link', async ({ page }) => {
  await page.goto('./');

  // Click the login link.
  await page.getByRole('link', { name: 'Login' }).click();

  // Expects page to have changed to login
  await expect(page).toHaveURL('./login');
});

test('search properties link', async ({ page }) => {
  await page.goto('./');

  // Click the Search Properties link
  await page.getByRole('link', { name: 'Properties' }).click();

  // Expects page to have changed to properties
  await expect(page).toHaveURL('./properties');
});

test('help button & FAQ link', async ({ page }) => {
  await page.goto('./');

  // Click help button
  await page.getByRole('button', { name: 'Help' }).click();

  // Check contents of dropdown help page
  await expect(page.getByLabel('HelpToggle help menu')).toContainText('FAQ');

  // Click on QandA link
  await page.getByRole('link', { name: 'here' }).click();

  // Expects content of QandA page
  await expect(page.locator('main')).toContainText(
    'Frequently Asked Questions',
  );
});
