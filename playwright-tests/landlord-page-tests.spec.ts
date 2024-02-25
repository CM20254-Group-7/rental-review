import { test, expect } from '@playwright/test';

test('Landlord with no properties test', async ({ page }) => {
  await page.goto('http://localhost:3000/profiles/44db487d-ace4-43c8-bd7c-38b32b0bc711');
  await expect(page.getByRole('main')).toContainText('Test Name 2');
  await expect(page.getByRole('main')).toContainText('display2@example.com');
  await expect(page.getByRole('main')).toContainText('Cooler landlord');
  await expect(page.getByRole('main')).toContainText('No properties');
});

test('Landlord with properties', async ({ page }) => {
  await page.goto('http://localhost:3000/profiles/b1b284f9-2c24-4f2e-bd4e-9c7ab7fe88e3');
  await expect(page.getByRole('main')).toContainText('Test Name 1');
  await expect(page.getByRole('main')).toContainText('display1@example.com');
  await expect(page.getByRole('main')).toContainText('Cool landlord');
  await expect(page.getByRole('list')).toContainText('1 Test Road');
  await expect(page.getByRole('list')).toContainText('2 Test Road');
});

test('Landlord does not exist: user with ID is not a landlord', async ({ page }) => {
  await page.goto('http://localhost:3000/profile/e155848a-f32b-4d7d-a8d2-4228a7989078');
  await expect(page.locator('h2')).toContainText('This page could not be found.');
});

test('Landlord does not exist: no user with ID', async ({ page }) => {
  await page.goto('http://localhost:3000/profile/123');
  await expect(page.locator('h2')).toContainText('This page could not be found.');
});

test('LandlordId not provided test', async ({ page }) => {
  await page.goto('http://localhost:3000/profiles');
  await expect(page.getByRole('main')).toContainText('Profile Page');
});