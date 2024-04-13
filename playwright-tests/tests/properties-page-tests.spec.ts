import { test, expect } from '@playwright/test';

import { checkStarRatingMatchesExpected, properties } from './helpers';

// This test uses 2 properties
const firstProperty = properties[0]!; // 1 Test Road
const secondProperty = properties[1]!; // 2 Test Road

test.describe('Property landing page test', () => {
  test('Contains address of first and second properties', async ({ page }) => {
    await page.goto('http://localhost:3000/properties');
    await expect(page.getByRole('main')).toContainText(
      "Can't see your property?",
    );

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
      await expect(page.locator('h2')).toContainText(
        'This page could not be found.',
      );
    });

    test('ID not provided test', async ({ page }) => {
      await page.goto('http://localhost:3000/properties');
      await expect(page.getByRole('main')).toContainText(firstProperty.address);
      await expect(page.getByRole('main')).toContainText(
        secondProperty.address,
      );
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
    test.describe('First property tests', () => {
      test('Average property rating', async ({ page }) => {
        await page.goto(`http://localhost:3000/properties/${firstProperty.id}`);

        const section = await page.getByText(
          `${firstProperty.address}Current Owner:`,
        );

        await checkStarRatingMatchesExpected(section, 1);
      });

      test('Average landlord rating test', async ({ page }) => {
        await page.goto(`http://localhost:3000/properties/${firstProperty.id}`);
        await expect(page.getByRole('main')).toContainText('Unknown');
      });
    });
  });

  test.describe('Second property tests', () => {
    test('Average property rating', async ({ page }) => {
      await page.goto(`http://localhost:3000/properties/${secondProperty.id}`);

      const section = await page.getByText(
        `${secondProperty.address}Current Owner:`,
      );

      await checkStarRatingMatchesExpected(section, 3);
    });

    test('Average landlord rating test', async ({ page }) => {
      await page.goto(`http://localhost:3000/properties/${secondProperty.id}`);
      await expect(page.getByRole('main')).toContainText('2.5');
    });
  });
});
