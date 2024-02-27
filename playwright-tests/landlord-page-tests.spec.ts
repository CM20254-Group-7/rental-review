import { test, expect } from '@playwright/test';
import { users } from './helpers';

// This test uses 3 users
// for each it will check what is displayed on the landlord's profile page
const firstUser = users[0]; // Landlord with 2 properties
const secondUser  = users[1]; // Landlord with no properties
const thirdUser  = users[2]; // Not a landlord

test.describe('Landlord Profile Page Tests', () => {
  test(`${secondUser.label} - No owned properties`,  async ({ page }) => {
    await page.goto(`http://localhost:3000/profiles/${secondUser.id}`);
    await expect(page.getByRole('main')).toContainText(`${secondUser.landlordProfile!.displayName}`);
    await expect(page.getByRole('main')).toContainText(`${secondUser.landlordProfile!.displayEmail}`);
    await expect(page.getByRole('main')).toContainText(`${secondUser.landlordProfile!.userBio}`);
    await expect(page.getByRole('main')).toContainText('No properties');
  });

  test(`${firstUser.label} - Two owned properties`, async ({ page }) => {
    await page.goto(`http://localhost:3000/profiles/${firstUser.id}`);
    await expect(page.getByRole('main')).toContainText(`${firstUser.landlordProfile!.displayName}`);
    await expect(page.getByRole('main')).toContainText(`${firstUser.landlordProfile!.displayEmail}`);
    await expect(page.getByRole('main')).toContainText(`${firstUser.landlordProfile!.userBio}`);
    await expect(page.getByRole('list')).toContainText(`${firstUser.landlordProfile!.properties[0]}`);
    await expect(page.getByRole('list')).toContainText(`${firstUser.landlordProfile!.properties[1]}`);
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