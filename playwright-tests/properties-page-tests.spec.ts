import { test, expect } from '@playwright/test';

import { properties } from './helpers';

// This test uses 2 properties
const firstProperty = properties[0]; // 1 Test Road
const secondProperty = properties[1]; // 2 Test Road

test.describe('Property landing page test', () => {
  test('Contains address of first and second properties', async ({ page }) => {
    await page.goto('http://localhost:3000/properties');
    await expect(page.getByRole('main')).toContainText('Can\'t see your property?');

    await expect(page.getByRole('main')).toContainText(firstProperty.address);
    await expect(page.getByRole('main')).toContainText(secondProperty.address);
  });

  test('Property link 1 test', async ({ page }) => {
    await page.goto('http://localhost:3000/properties');
    await page.getByRole('link', { name: firstProperty.address }).click();
    await expect(page.getByRole('main')).toContainText(firstProperty.address);
  });

  test('Property link 2 test', async ({ page }) => {
    await page.goto('http://localhost:3000/properties');
    await page.getByRole('link', { name: secondProperty.address }).click();
    await expect(page.getByRole('main')).toContainText(secondProperty.address);
  });
});

test.describe('Property details page test', () => {
  test.describe('Non-existent property tests', () => {
    test('Nonexistent property test', async ({ page }) => {
      await page.goto('http://localhost:3000/properties/123');
      await expect(page.locator('h2')).toContainText('This page could not be found.');
    });

    test('ID not provided test', async ({ page }) => {
      await page.goto('http://localhost:3000/properties');
      await expect(page.getByRole('main')).toContainText(firstProperty.address);
      await expect(page.getByRole('main')).toContainText(secondProperty.address);
    });
  });

  test.describe('Existing property tests', () => {
    test('Contains correct address', async ({ page }) => {
      await page.goto(`http://localhost:3000/properties/${firstProperty.id}`);
      await expect(page.getByRole('main')).toContainText(firstProperty.address);
    });

    test('Contains correct owner name', async ({ page }) => {
      await page.goto(`http://localhost:3000/properties/${secondProperty.id}`);
      await expect(page.getByRole('main')).toContainText(secondProperty.owner);
    });
  });

  test.describe('Rating tests', () => {
    test.describe('Average property rating tests', () => {
      test(`${firstProperty.address} has correct rating`, async ({ page }) => {
        await page.goto(`http://localhost:3000/properties/${firstProperty.id}`);
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
        await expect(yellowStars).toBe(1);
        await expect(greyStars).toBe(5 - yellowStars);
      });

      test(`${secondProperty.address} has correct rating`, async ({ page }) => {
        await page.goto(`http://localhost:3000/properties/${secondProperty.id}`);
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
        await expect(yellowStars).toBe(3);
        await expect(greyStars).toBe(5 - yellowStars);
      });
    });

    test('Average landlord rating test', async ({ page }) => {
      await page.goto(`http://localhost:3000/properties/${secondProperty.id}`);
      await expect(page.getByRole('main')).toContainText('2.5');
    });
  });
});
