import { test, expect } from '@playwright/test';
import { properties } from './helpers';


// This test uses 2 properties
const firstProperty = properties[0];  // 1 Test Road
const secondProperty = properties[1]; // 2 Test Road

test('Existing property test: Address', async ({ page }) => {
  await page.goto(`http://localhost:3000/properties/${firstProperty.id}`);
  await expect(page.getByRole('main')).toContainText('1 Test Road');
});

test('Existing property test: Owner name', async ({ page }) => {
  await page.goto(`http://localhost:3000/properties/${secondProperty.id}`);
  await expect(page.getByRole('main')).toContainText('Test Name 1');
});

test('Nonextant property test', async ({ page }) => {
  await page.goto('http://localhost:3000/properties/123');
  await expect(page.locator('h2')).toContainText('This page could not be found.');
});

test('PropertyId not provided test', async ({ page }) => {
  await page.goto('http://localhost:3000/properties');
  await expect(page.getByRole('list')).toContainText('1 Test Road');
  await expect(page.getByRole('list')).toContainText('2 Test Road');
});
