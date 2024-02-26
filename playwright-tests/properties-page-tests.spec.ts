import { test, expect } from '@playwright/test';

test('Existing property test', async ({ page }) => {
  await page.goto('http://localhost:3000/properties/1ececec8-4bbf-445f-8de0-f563caf0bf01');
  await expect(page.getByRole('main')).toContainText('1 Test Road');
  await expect(page.getByRole('main')).toContainText('Test Name 1');
});

test('Nonextant property test', async ({ page }) => {
  await page.goto('http://localhost:3000/properties/123');
  await expect(page.locator('h2')).toContainText('This page could not be found.');
});

test('PropertyId not provided test', async ({ page }) => {
  await page.goto('http://localhost:3000/properties');
  await expect(page.getByRole('heading')).toContainText('Profile Page');
});
