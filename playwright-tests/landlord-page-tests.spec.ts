import { test, expect } from '@playwright/test';
import { users } from './helpers';

// This test uses 3 users
// for each it will check what is displayed on the landlord's profile page
const firstUser = users[0]; // Landlord with 2 properties
const secondUser = users[1]; // Landlord with no properties
const thirdUser = users[2]; // Not a landlord

test.describe('Landlord profile landing page tests', () => {
  test('Contains landlords', async ({ page }) => {
    test.fixme();
    // Need to get the profile landing page done first
    await page.goto('http://localhost:3000/profiles');
    await expect(page.getByRole('main')).toContainText('Profile Page');
  });
});

test.describe('Landlord profile details page tests', () => {
  test.describe('Wrong landlordID tests', () => {
    test(`${thirdUser.label} - Not a landlord`, async ({ page }) => {
      await page.goto(`http://localhost:3000/profiles/${thirdUser.id}`);
      await expect(page.locator('h2')).toContainText('This page could not be found.');
    });

    test('Landlord does not exist: no user with ID', async ({ page }) => {
      await page.goto('http://localhost:3000/profile/123');
      await expect(page.locator('h2')).toContainText('This page could not be found.');
    });

    test('LandlordId not provided test', async ({ page }) => {
      test.fixme();
      // Need to get the profile landing page done first
      await page.goto('http://localhost:3000/profiles');
      await expect(page.getByRole('main')).toContainText('Profile Page');
    });
  });

  test.describe('Landlord details tests', () => {
    test.describe('Landlord personal details tests', () => {
      test.describe('Contains correct display name', () => {
        test(`${firstUser.label} has correct name`, async ({ page }) => {
          await page.goto(`http://localhost:3000/profiles/${firstUser.id}`);
          await expect(page.getByRole('main')).toContainText(`${firstUser.landlordProfile!.displayName}`);
        });

        test(`${secondUser.label} has correct name`, async ({ page }) => {
          await page.goto(`http://localhost:3000/profiles/${secondUser.id}`);
          await expect(page.getByRole('main')).toContainText(`${secondUser.landlordProfile!.displayName}`);
        });
      });

      test.describe('Contains correct email', () => {
        test(`${firstUser.label} has correct email`, async ({ page }) => {
          await page.goto(`http://localhost:3000/profiles/${firstUser.id}`);
          await expect(page.getByRole('main')).toContainText(`${firstUser.landlordProfile!.displayEmail}`);
        });

        test(`${secondUser.label} has correct email`, async ({ page }) => {
          await page.goto(`http://localhost:3000/profiles/${secondUser.id}`);
          await expect(page.getByRole('main')).toContainText(`${secondUser.landlordProfile!.displayEmail}`);
        });
      });

      test.describe('Contains correct bio', () => {
        test(`${firstUser.label} has correct bio`, async ({ page }) => {
          await page.goto(`http://localhost:3000/profiles/${firstUser.id}`);
          await expect(page.getByRole('main')).toContainText(`${firstUser.landlordProfile!.userBio}`);
        });

        test(`${secondUser.label} has correct bio`, async ({ page }) => {
          await page.goto(`http://localhost:3000/profiles/${secondUser.id}`);
          await expect(page.getByRole('main')).toContainText(`${secondUser.landlordProfile!.userBio}`);
        });
      });
    });

    test.describe('Landlord owned properties tests', () => {
      test(`${secondUser.label} - No owned properties`, async ({ page }) => {
        await page.goto(`http://localhost:3000/profiles/${secondUser.id}`);
        await expect(page.getByRole('main')).toContainText('No properties');
      });

      test(`${firstUser.label} - Two owned properties`, async ({ page }) => {
        await page.goto(`http://localhost:3000/profiles/${firstUser.id}`);
        await expect(page.getByRole('list')).toContainText(`${firstUser.landlordProfile!.properties[0]}`);
        await expect(page.getByRole('list')).toContainText(`${firstUser.landlordProfile!.properties[1]}`);
      });
    });

    test.describe('Shows the relevant reviews', () => {
      test(`${firstUser.label} - Shows reviews`, async ({ page }) => {
        await page.goto(`http://localhost:3000/profiles/${firstUser.id}`);
        await expect(page.getByRole('main')).toContainText('Everything is fine.');
        await expect(page.getByRole('main')).toContainText('01/02/2024');
        await expect(page.getByRole('main')).toContainText('The landlord never responded to my queries and did not offer to fix the leakage in the bathroom. However, the property is impressive, with a beautiful city view.');
        await expect(page.getByRole('main')).toContainText('21/02/2024');
      });

      test(`${secondUser.label} - No reviews`, async ({ page }) => {
        await page.goto(`http://localhost:3000/profiles/${secondUser.id}`);
        await expect(page.getByRole('main')).toContainText('No reviews');
      });
    });
  });
});
