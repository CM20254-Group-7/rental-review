import { test, expect } from '@playwright/test';
import { checkStarRatingMatchesExpected, ownershipHistories } from './helpers';

const fuzzyMatchDate = (date: Date) => {
  const day = date.getDate().toString();
  const month = (date.getMonth() + 1).toString();
  const year = date.getFullYear().toString();
  const shortYear = year.slice(2, 4);

  // for each of day and month, if they are a single digit, allow a 0 at the front
  // allow day and month to be in either order
  // allow year to be in either format
  const fuzzyDateFormat = new RegExp(
    `(?:${day.length === 1 ? `0?${day}` : day}\\/${
      month.length === 1 ? `0?${month}` : month
    }|${month.length === 1 ? `0?${month}` : month}\\/${
      day.length === 1 ? `0?${day}` : day
    })\\/(?:${year}|${shortYear})`,
  );

  return fuzzyDateFormat;
};

const firstPropertyHistory = ownershipHistories[0]!; // 1 Test Road
const secondPropertyHistory = ownershipHistories[1]!; // 2 Test Road

test.describe(`${firstPropertyHistory.propertyAddress} ownership history tests`, () => {
  test('Contains correct start and end dates', async ({ page }) => {
    await page.goto(
      `http://localhost:3000/properties/${firstPropertyHistory.propertyId}/ownership-history`,
    );
    await expect(page.getByRole('main')).toContainText(
      fuzzyMatchDate(new Date(firstPropertyHistory.startDate[0]!)),
    );
    await expect(page.getByRole('main')).toContainText(
      fuzzyMatchDate(new Date(firstPropertyHistory.endDate[0]!)),
    );
  });

  test('Contains correct landlord', async ({ page }) => {
    await page.goto(
      `http://localhost:3000/properties/${firstPropertyHistory.propertyId}/ownership-history`,
    );
    await expect(page.getByRole('main')).toContainText(
      `${firstPropertyHistory.landlord[0]}`,
    );
  });

  test('Contains correct landlord rating', async ({ page }) => {
    await page.goto(
      `http://localhost:3000/properties/${firstPropertyHistory.propertyId}/ownership-history`,
    );
    // Select the specific section containing the stars
    const section = await page.getByRole('main');

    await checkStarRatingMatchesExpected(
      section,
      firstPropertyHistory.landlordRating[0]!,
    );
  });
});

test.describe(`${secondPropertyHistory.propertyAddress} ownership history tests`, () => {
  test.describe('Current ownership test', () => {
    test('Contains correct start and end dates', async ({ page }) => {
      await page.goto(
        `http://localhost:3000/properties/${secondPropertyHistory.propertyId}/ownership-history`,
      );
      await expect(page.getByRole('main')).toContainText(
        fuzzyMatchDate(new Date(secondPropertyHistory.startDate[0]!)),
      );
      await expect(page.getByRole('main')).toContainText(
        secondPropertyHistory.endDate[0]!,
      );
    });

    test('Contains correct landlord', async ({ page }) => {
      await page.goto(
        `http://localhost:3000/properties/${secondPropertyHistory.propertyId}/ownership-history`,
      );
      await expect(page.getByRole('main')).toContainText(
        `${secondPropertyHistory.landlord?.[0]}`,
      );
    });

    test('Contains correct average rating', async ({ page }) => {
      await page.goto(
        `http://localhost:3000/properties/${secondPropertyHistory.propertyId}/ownership-history`,
      );
      // Select the specific section containing the stars
      const section = await page.getByRole('link', {
        name: `${secondPropertyHistory.landlord?.[0]}`,
      });

      await checkStarRatingMatchesExpected(
        section,
        secondPropertyHistory.landlordRating[0]!,
      );
    });
  });

  test.describe('Past ownership test', () => {
    test('Contains correct start and end dates', async ({ page }) => {
      await page.goto(
        `http://localhost:3000/properties/${secondPropertyHistory.propertyId}/ownership-history`,
      );
      await expect(page.getByRole('main')).toContainText(
        fuzzyMatchDate(new Date(secondPropertyHistory.startDate[1]!)),
      );
      await expect(page.getByRole('main')).toContainText(
        fuzzyMatchDate(new Date(secondPropertyHistory.endDate[1]!)),
      );
    });

    test('Contains correct landlord', async ({ page }) => {
      await page.goto(
        `http://localhost:3000/properties/${secondPropertyHistory.propertyId}/ownership-history`,
      );
      await expect(page.getByRole('main')).toContainText(
        `${secondPropertyHistory.landlord?.[1]}`,
      );
    });

    test('Contains correct average rating', async ({ page }) => {
      await page.goto(
        `http://localhost:3000/properties/${secondPropertyHistory.propertyId}/ownership-history`,
      );

      // Select the specific section containing the stars
      const section = await page.getByRole('link', {
        name: `${secondPropertyHistory.landlord?.[1]}`,
      });

      await checkStarRatingMatchesExpected(
        section,
        secondPropertyHistory.landlordRating[1]!,
      );
    });
  });

  test.describe('History ordered by newest first', () => {
    test(`${secondPropertyHistory.landlord?.[0]} comes before ${secondPropertyHistory.landlord?.[1]}`, async ({
      page,
    }) => {
      await page.goto(
        `http://localhost:3000/properties/${secondPropertyHistory.propertyId}/ownership-history`,
      );
      const currentOwnership = await page.getByRole('link', {
        name: `${secondPropertyHistory.landlord?.[0]}`,
      });
      const pastOwnership = await page.getByRole('link', {
        name: `${secondPropertyHistory.landlord?.[1]}`,
      });

      // Get the positions of the elements
      const currentOwnershipPosition = await currentOwnership.boundingBox();
      const pastOwnershipPosition = await pastOwnership.boundingBox();

      // Throw error if the positions are not found
      if (!currentOwnershipPosition || !pastOwnershipPosition) {
        throw new Error('Position not found');
      }

      // Check if the current ownership comes before the past ownership
      await expect(currentOwnershipPosition.y).toBeLessThan(
        pastOwnershipPosition.y,
      );
    });
  });
});
