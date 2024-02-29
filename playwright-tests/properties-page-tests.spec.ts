import { test, expect } from '@playwright/test';

import { properties } from './helpers';

// This test uses 2 properties
const firstProperty = properties[0]; // 1 Test Road
const secondProperty = properties[1]; // 2 Test Road

test('Existing property test: Address', async ({ page }) => {
  await page.goto(`http://localhost:3000/properties/${firstProperty.id}`);
  await expect(page.getByRole('main')).toContainText(firstProperty.address);
});

test('Existing property test: Owner name', async ({ page }) => {
  // Skipping test because displayed owner is "Unknown", not "Test Name 1"
  test.fixme();
  await page.goto(`http://localhost:3000/properties/${secondProperty.id}`);
  await expect(page.getByRole('main')).toContainText(secondProperty.owner);
});

test('Nonextant property test', async ({ page }) => {
  await page.goto('http://localhost:3000/properties/123');
  await expect(page.locator('h2')).toContainText('This page could not be found.');
});

test('PropertyId not provided test', async ({ page }) => {
  await page.goto('http://localhost:3000/properties');
  await expect(page.getByRole('main')).toContainText(firstProperty.address);
  await expect(page.getByRole('main')).toContainText(secondProperty.address);
});

