import { test, expect } from '@playwright/test';
import { users } from './helpers';

// This test uses 3 users
// for each it will check what is displayed on the landlord's profile page
const firstUser = users[0]; // Landlord with 2 properties
const secondUser = users[1]; // Landlord with no properties
const thirdUser = users[2]; // Not a landlord

test.describe('Landlord profile landing page tests', () => {
  test.describe('Contains landlords', () => {
    test.describe(`${firstUser.label} has correct details`, () => {
      test(`${firstUser.label} has correct name`, async ({ page }) => {
        await page.goto('http://localhost:3000/profiles');
        await expect(page.getByRole('main')).toContainText('Test Name 1');
      });
      test(`${firstUser.label} has correct bio`, async ({ page }) => {
        await page.goto('http://localhost:3000/profiles');
        await expect(page.getByRole('main')).toContainText('Cool landlord');
      });
    });

    test.describe(`${secondUser.label} has correct details`, () => {
      test(`${secondUser.label} has correct name`, async ({ page }) => {
        await page.goto('http://localhost:3000/profiles');
        await expect(page.getByRole('main')).toContainText('Test Name 2');
      });
      test(`${secondUser.label} has correct bio`, async ({ page }) => {
        await page.goto('http://localhost:3000/profiles');
        await expect(page.getByRole('main')).toContainText('Cooler landlord');
      });
    });
  });

  test.describe('Links to correct profile', () => {
    test(`Link to ${firstUser.label}`, async ({ page }) => {
      await page.goto('http://localhost:3000/profiles');
      await page.getByRole('link', { name: 'Test Name 1 Cool landlord' }).click();
      await expect(page.getByRole('main')).toContainText('Test Name 1');
    });

    test(`Link to ${secondUser.label}`, async ({ page }) => {
      await page.goto('http://localhost:3000/profiles');
      await page.getByRole('link', { name: 'Test Name 2 Cooler landlord' }).click();
      await expect(page.getByRole('main')).toContainText('Test Name 2');
    });
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
      await page.goto('http://localhost:3000/profiles');
      await expect(page.getByRole('main')).toContainText('Landlords');
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

      test.describe('Rating tests', () => {
        test(`${firstUser.label} has correct rating`, async ({ page }) => {
          await page.goto(`http://localhost:3000/profiles/${firstUser.id}`);
          // Select the specific section containing the stars
          const section = await page.$('body > main > div > div > div.flex.flex-row.w-full.justify-between.gap-2.bg-secondary\\/30.shadow-lg.shadow-secondary\\/40 > div.flex-1.flex.flex-col.w-full.px-8.sm\\:max-w-md.justify-top.gap-2.py-4 > div:nth-child(2)');
          if (!section) {
            throw new Error('Section not found');
          }

          // Get all the svg of the stars
          const stars = await section.$$('svg[data-slot="icon"]');
          if (!stars) {
            throw new Error('Stars not found');
          }

          // Collect promises for all star classes
          const starClassPromises = stars.map(async (star) => {
            const starClass = await star.getAttribute('class');
            if (!starClass) {
              throw new Error('Star class not found');
            }
            return starClass;
          });

          // Wait for all promises to resolve
          const starClasses = await Promise.all(starClassPromises);
          // Count the number of yellow and grey stars
          let yellowStars = 0;
          let greyStars = 0;
          for (const starClass of starClasses) {
            if (starClass.includes('text-yellow-300')) {
              yellowStars += 1;
            } else if (starClass.includes('text-gray-400')) {
              greyStars += 1;
            }
          }

          // Check if the number of stars is correct
          await expect(yellowStars).toBe(2);
          await expect(greyStars).toBe(5 - yellowStars);
        });

        test(`${secondUser.label} has correct rating`, async ({ page }) => {
          await page.goto(`http://localhost:3000/profiles/${secondUser.id}`);
          await expect(page.getByRole('main')).toContainText('No Ratings Yet');
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
        await expect(page.getByRole('main')).toContainText('The landlord never responded to my queries and did not offer to fix the leakage in the bathroom. However, the property is impressive, with a beautiful city view.');
      });

      test(`${secondUser.label} - No reviews`, async ({ page }) => {
        await page.goto(`http://localhost:3000/profiles/${secondUser.id}`);
        await expect(page.getByRole('main')).toContainText('No reviews');
      });
    });
  });
});
