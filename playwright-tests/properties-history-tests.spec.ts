import { test, expect } from '@playwright/test';
import { ownershipHistories } from './helpers';

const firstPropertyHistory = ownershipHistories[0]; // 1 Test Road
const secondPropertyHistory = ownershipHistories[1]; // 2 Test Road

test.describe(`${firstPropertyHistory.propertyAddress} ownership history tests`, () => {
  test('Contains correct start and end dates', async ({ page }) => {
    await page.goto(`http://localhost:3000/properties/${firstPropertyHistory.propertyId}/ownership-history`);
    await expect(page.getByRole('main')).toContainText(`${firstPropertyHistory.startDate}`);
    await expect(page.getByRole('main')).toContainText(`${firstPropertyHistory.endDate}`);
  });

  test('Contains correct landlord', async ({ page }) => {
    await page.goto(`http://localhost:3000/properties/${firstPropertyHistory.propertyId}/ownership-history`);
    await expect(page.getByRole('main')).toContainText(`${firstPropertyHistory.landlord}`);
  });

  test('Contains correct landlord rating', async ({ page }) => {
    await page.goto(`http://localhost:3000/properties/${firstPropertyHistory.propertyId}/ownership-history`);
    // Select the specific section containing the stars
    const section = await page.$('body > main > div > div > a > div.flex.flex-col.items-center.justify-center > div:nth-child(2)');
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
    await expect(yellowStars).toBe(firstPropertyHistory.landlordRating[0]);
    await expect(greyStars).toBe(5 - yellowStars);
  });
});

test.describe(`${secondPropertyHistory.propertyAddress} ownership history tests`, () => {
  test.describe('Recent ownership test', () => {
    test('Contains correct start and end dates', async ({ page }) => {
      await page.goto(`http://localhost:3000/properties/${secondPropertyHistory.propertyId}/ownership-history`);
      await expect(page.getByRole('main')).toContainText(`${secondPropertyHistory.startDate[0]}`);
      await expect(page.getByRole('main')).toContainText(`${secondPropertyHistory.endDate[0]}`);
    });

    test('Contains correct landlord', async ({ page }) => {
      await page.goto(`http://localhost:3000/properties/${secondPropertyHistory.propertyId}/ownership-history`);
      await expect(page.getByRole('main')).toContainText(`${secondPropertyHistory.landlord?.[0]}`);
    });

    test('Contains correct average rating', async ({ page }) => {
      await page.goto(`http://localhost:3000/properties/${secondPropertyHistory.propertyId}/ownership-history`);
      // Select the specific section containing the stars
      const section = await page.$('body > main > div > div > a > div.flex.flex-col.items-center.justify-center > div:nth-child(2)');
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
      await expect(yellowStars).toBe(secondPropertyHistory.landlordRating[0]);
      await expect(greyStars).toBe(5 - yellowStars);
    });
  });
  test.describe('Past ownership test', () => {
    test('Contains correct start and end dates', async ({ page }) => {
      await page.goto(`http://localhost:3000/properties/${secondPropertyHistory.propertyId}/ownership-history`);
      await expect(page.getByRole('main')).toContainText(`${secondPropertyHistory.startDate[1]}`);
      await expect(page.getByRole('main')).toContainText(`${secondPropertyHistory.endDate[1]}`);
    });

    test('Contains correct landlord', async ({ page }) => {
      await page.goto(`http://localhost:3000/properties/${secondPropertyHistory.propertyId}/ownership-history`);
      await expect(page.getByRole('main')).toContainText(`${secondPropertyHistory.landlord?.[1]}`);
    });

    test('Contains correct average rating', async ({ page }) => {
      await page.goto(`http://localhost:3000/properties/${secondPropertyHistory.propertyId}/ownership-history`);
      // Select the specific section containing the stars
      const section = await page.$('body > main > div > div > a:nth-child(4) > div.flex.flex-col.items-center.justify-center > div:nth-child(2)');
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
      await expect(yellowStars).toBe(secondPropertyHistory.landlordRating[1]);
      await expect(greyStars).toBe(5 - yellowStars);
    });
  });
});
