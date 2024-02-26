import { test, expect } from '@playwright/test';
import { users } from './helpers';

// This test uses 3 users
// for each it will check what is displayed on the landlord's profile page
const firstUser  = users[0]; // Landlord with no properties
const secondUser = users[1]; // Landlord with 2 properties
const thirdUser  = users[2]; // Not a landlord

test.describe('Landlord Profile Page Tests', () => {
  test(`${firstUser.label} - No owned properties`,  async ({ page }) => {
    await page.goto(`http://localhost:3000/profiles/${firstUser.id}`);
    await expect(page.getByRole('main')).toContainText('Test Name 2');
    await expect(page.getByRole('main')).toContainText('display2@example.com');
    await expect(page.getByRole('main')).toContainText('Cooler landlord');
    await expect(page.getByRole('main')).toContainText('No properties');
  });

  test(`${secondUser.label} - Two owned properties`, async ({ page }) => {
    await page.goto(`http://localhost:3000/profiles/${secondUser.id}`);
    await expect(page.getByRole('main')).toContainText('Test Name 1');
    await expect(page.getByRole('main')).toContainText('display1@example.com');
    await expect(page.getByRole('main')).toContainText('Cool landlord');
    await expect(page.getByRole('list')).toContainText('1 Test Road');
    await expect(page.getByRole('list')).toContainText('2 Test Road');
  });

  test(`${thirdUser.label} - Not a landlord`, async ({ page }) => {
    await page.goto(`http://localhost:3000/profiles/${thirdUser.id}`);
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
});