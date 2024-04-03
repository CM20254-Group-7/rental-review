import { test, expect } from '@playwright/test';
import { users } from './helpers';

// This test uses 3 users
// for each it will check what is displayed on the landlord's profile page
const firstUser = users[0]; // Landlord with 2 properties
const secondUser = users[1]; // Landlord with no properties
const thirdUser = users[2]; // Not a landlord
const fourthUser = users[8]; // Landlord with highest

test.describe('Landlord leaderboard tests', () => {
  test.describe('Contains landlords', () => {
    test.describe(`${firstUser.label} has correct details`, () => {
      test(`${firstUser.label} has correct name`, async ({ page }) => {
        await page.goto('http://localhost:3000/profiles');
        await expect(page.getByRole('main')).toContainText(`${firstUser.landlordProfile!.displayName}`);
      });

      test(`${firstUser.label} has correct number of stars`, async ({ page }) => {
        await page.goto('http://localhost:3000/profiles');
        const section = await page.$('body > main > div > div > div > div:nth-child(1) > div > div.w-full.pl-4 > a > div > div.flex.flex-col.w-full.gap-2');
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
        await expect(yellowStars).toBe(5);
        await expect(greyStars).toBe(5 - yellowStars);
      });
    });

    test.describe(`${fourthUser.label} has correct details`, () => {
      test(`${fourthUser.label} has correct name`, async ({ page }) => {
        await page.goto('http://localhost:3000/profiles');
        await expect(page.getByRole('main')).toContainText(`${fourthUser.landlordProfile!.displayName}`);
      });

      test(`${fourthUser.label} has correct number of stars`, async ({ page }) => {
        await page.goto('http://localhost:3000/profiles');
        const section = await page.$('body > main > div > div > div > div:nth-child(2) > div > div.w-full.pl-4 > a > div > div.flex.flex-col.w-full.gap-2');
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
    });
  });

  test.describe('Landlords ordered by highest rating', () => {
    test(`${fourthUser.label} comes before ${firstUser.label}`, async ({ page }) => {
      await page.goto('http://localhost:3000/profiles');
      const fourthUserElement = await page.getByRole('link', { name: `${fourthUser.landlordProfile?.displayName}` });
      const firstUserElement = await page.getByRole('link', { name: `${firstUser.landlordProfile?.displayName}` });

      // Get the positions of the elements
      const fourthUserPosition = await fourthUserElement.boundingBox();
      const firstUserPosition = await firstUserElement.boundingBox();

      // Throw error if the positions are not found
      if (!fourthUserPosition || !firstUserPosition) {
        throw new Error('Position not found');
      }

      // Ensure that the fourth user appears before the first user on the page
      await expect(fourthUserPosition.y).toBeLessThan(firstUserPosition.y);
    });
  });
});

test.describe('2. Landlord profile details page tests', () => {
  test.describe('2.1. Wrong landlordID tests', () => {
    test(`2.1.1. ${thirdUser.label} - Not a landlord`, async ({ page }) => {
      await page.goto(`http://localhost:3000/profiles/${thirdUser.id}`);
      await expect(page.locator('h2')).toContainText('This page could not be found.');
    });

    test('2.1.2. Landlord does not exist: no user with ID', async ({ page }) => {
      await page.goto('http://localhost:3000/profile/123');
      await expect(page.locator('h2')).toContainText('This page could not be found.');
    });

    test('LandlordId not provided test', async ({ page }) => {
      await page.goto('http://localhost:3000/profiles');
      await expect(page.getByRole('main')).toContainText('Landlords');
    });
  });

  test.describe('2.2. Landlord details tests', () => {
    test.describe('2.2.1. Landlord personal details tests', () => {
      test.describe('2.2.1.1. Contains correct display name', () => {
        test(`2.2.1.1.1. ${firstUser.label} has correct name`, async ({ page }) => {
          await page.goto(`http://localhost:3000/profiles/${firstUser.id}`);
          await expect(page.getByRole('main')).toContainText(`${firstUser.landlordProfile!.displayName}`);
        });

        test(`2.2.1.1.2. ${secondUser.label} has correct name`, async ({ page }) => {
          await page.goto(`http://localhost:3000/profiles/${secondUser.id}`);
          await expect(page.getByRole('main')).toContainText(`${secondUser.landlordProfile!.displayName}`);
        });
      });

      test.describe('2.2.1.2. Contains correct email', () => {
        test(`2.2.1.2.1. ${firstUser.label} has correct email`, async ({ page }) => {
          await page.goto(`http://localhost:3000/profiles/${firstUser.id}`);
          await expect(page.getByRole('main')).toContainText(`${firstUser.landlordProfile!.displayEmail}`);
        });

        test(`2.2.1.2.2. ${secondUser.label} has correct email`, async ({ page }) => {
          await page.goto(`http://localhost:3000/profiles/${secondUser.id}`);
          await expect(page.getByRole('main')).toContainText(`${secondUser.landlordProfile!.displayEmail}`);
        });
      });

      test.describe('2.2.1.3. Contains correct bio', () => {
        test(`2.2.1.3.1. ${firstUser.label} has correct bio`, async ({ page }) => {
          await page.goto(`http://localhost:3000/profiles/${firstUser.id}`);
          await expect(page.getByRole('main')).toContainText(`${firstUser.landlordProfile!.userBio}`);
        });

        test(`2.2.1.3.2. ${secondUser.label} has correct bio`, async ({ page }) => {
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
          await expect(yellowStars).toBe(0);
          await expect(greyStars).toBe(5 - yellowStars);
        });
      });
    });

    test.describe('Landlord owned properties tests', () => {
      test(`${secondUser.label} - No owned properties`, async ({ page }) => {
        await page.goto(`http://localhost:3000/profiles/${secondUser.id}`);
        await expect(page.getByRole('main')).toContainText('No properties are currently owned by this landlord');
        await expect(page.getByRole('main')).toContainText('No properties have previously been owned by this landlord');
      });

      test(`${firstUser.label} - Two owned properties`, async ({ page }) => {
        await page.goto(`http://localhost:3000/profiles/${firstUser.id}`);
        await expect(page.getByRole('main')).toContainText(`${firstUser.landlordProfile!.properties[0]}`);
        await expect(page.getByRole('main')).toContainText(`${firstUser.landlordProfile!.properties[1]}`);
      });

      test(`${fourthUser.label} - One owned property in the past`, async ({ page }) => {
        await page.goto(`http://localhost:3000/profiles/${fourthUser.id}`);
        await expect(page.getByRole('main')).toContainText('No properties are currently owned by this landlord');
        await expect(page.getByRole('main')).toContainText(`${fourthUser.landlordProfile!.properties[0]}`);
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
        await expect(page.getByRole('main')).toContainText('No reviews found');
      });
    });
  });
});

// TODO: is a fixme because the test.use functions don't work and idk why.
test.describe.fixme('3. Landlord registration tests', () => {
  test.describe('3.1. Can access page', () => {
    test('3.1.1. Anon - gets redirected to login', async ({ page }) => {
      await page.goto('http://localhost:3000/become-a-landlord');

      await expect(page.getByRole('main')).toContainText('Go to Login');
      await page.getByRole('link', { name: 'Go to Login' }).click();
      await expect(page).toHaveURL(/.*login/);
    });

    test(`3.1.2. ${secondUser.label} - Go to Home Page`, async ({ page }) => {
      test.use({ storageState: secondUser.file });

      await page.goto('http://localhost:3000/become-a-landlord');

      await expect(page.locator('main')).toContainText('You\'re already a landlord.');
      await page.getByRole('link', { name: 'Go to Home Page' }).click();
      await expect(page).toHaveURL('http://localhost:3000');
    });

    test(`3.1.3. ${thirdUser.label} - can access page`, async ({ page }) => {
      test.use({ storageState: thirdUser.file });

      await page.goto('http://localhost:3000/become-a-landlord');

      await expect(page.locator('form_header')).toContainText('Hello there! Let\'s make you a landlord!');
    });
  });

  // TODO: currently, profile page for landlord is 404 Not Found
  test('3.2. Can input information', async ({ page }) => {
    test.use({ storageState: thirdUser.file });

    await page.goto('http://localhost:3000/become-a-landlord');

    await expect(page.locator('form_header')).toContainText('Hello there! Let\'s make you a landlord!');

    await page.locator('input[name="user_first_name"]').fill('Mah');
    await page.locator('input[name="user_last_name"]').fill('Boi');
    await page.locator('input[name="display_name"]').fill('Mah Boi');
    await page.locator('input[name="display_email"]').fill('display.7@example.com');
    await page.locator('input[name="user_phoneNb"]').fill('123456789');
    await page.locator('input[name="user_postcode"]').fill('TES T78');
    await page.locator('input[name="user_country"]').fill('Test Country');
    await page.locator('input[name="user_county"]').fill('Test County');
    await page.locator('input[name="user_city"]').fill('Test City');
    await page.locator('input[name="user_street"]').fill('Test Street');
    await page.locator('input[name="user_house"]').fill('13 Test Road');
    await page.locator('input[name="user_bio"]').fill('I am such an interesting landlord.');

    await page.getByRole('button', { name: 'Landlordify!' }).click();

    await expect(page).toHaveURL(`http://localhost:3000/profiles/${thirdUser.id}`);
  });
});
