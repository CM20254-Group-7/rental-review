import { test, expect } from '@playwright/test';

test('Landlord with no properties test', async ({ page }) => {
  await page.goto('http://localhost:3000/profiles/d433e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e');
  await expect(page.getByRole('main')).toContainText('Test Name1');
  await expect(page.getByRole('main')).toContainText('display1@example.com');
  await expect(page.getByRole('main')).toContainText('First landlord');
  await expect(page.getByRole('main')).toContainText('No properties');
});

test('Landlord with properties test', async ({ page }) => {
  await page.goto('http://localhost:3000/profiles/d3e3e3e3-3e3e-3e3e-3e3e-3e3e3e3e3e3e');
  await expect(page.getByRole('main')).toContainText('Test Name');
  await expect(page.getByRole('main')).toContainText('display@example.com');
  await expect(page.getByRole('main')).toContainText('Cool landlord');
  await expect(page.getByRole('list')).toContainText('1 Test Road');
  await expect(page.getByRole('list')).toContainText('2 Test Road');
});

test('Landlord does not exist test', async ({ page }) => {
  await page.goto('http://localhost:3000/profile/fake_landlord');
  await expect(page.locator('h2')).toContainText('This page could not be found.');
});

test('LandlordId not provided test', async ({ page }) => {
  await page.goto('http://localhost:3000/profiles');
  await expect(page.getByRole('main')).toContainText('Profile Page');
});