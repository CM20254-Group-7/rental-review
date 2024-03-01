import { test, expect } from '@playwright/test';

import { properties } from './helpers';

// This test uses 2 properties
const firstProperty = properties[0]; // 1 Test Road
const secondProperty = properties[1]; // 2 Test Road

test.describe('Properties page test', () => {
  test('General properties page test', async ({ page }) => {
    await page.goto('http://localhost:3000/properties');

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
  test('Existing property test: Address', async ({ page }) => {
    await page.goto(`http://localhost:3000/properties/${firstProperty.id}`);
    await expect(page.getByRole('main')).toContainText(firstProperty.address);
  });

  test('Existing property test: Owner name', async ({ page }) => {
    await page.goto(`http://localhost:3000/properties/${secondProperty.id}`);
    await expect(page.getByRole('main')).toContainText(secondProperty.owner);
  });

  test('Nonexistent property test', async ({ page }) => {
    await page.goto('http://localhost:3000/properties/123');
    await expect(page.locator('h2')).toContainText('This page could not be found.');
  });

  test('PropertyId not provided test', async ({ page }) => {
    await page.goto('http://localhost:3000/properties');
    await expect(page.getByRole('main')).toContainText(firstProperty.address);
    await expect(page.getByRole('main')).toContainText(secondProperty.address);
  });

  test('Average property rating test', async ({ page }) => {
    await page.goto('http://localhost:3000/properties/6a83d02b-9da1-4a4a-9719-05e8a8c9228d');
    // Select the specific section containing the stars
    const section = await page.$('body > main > div > div > div.flex.flex-row.w-full.justify-between.gap-2.bg-secondary\\/30.shadow-lg.shadow-secondary\\/40 > div.flex-1.flex.flex-col.w-full.px-8.sm\\:max-w-md.justify-top.gap-2.py-4 > div.flex.flex-row.w-full.px-0.justify-start.items-center.gap-2 > div');

    // Use querySelectorAll within the section to select all SVG elements representing stars
    const stars = await section.$$('svg[data-slot="icon"]');

    // Count the number of yellow and grey stars
    let yellowStars = 0;
    let greyStars = 0;
    for (const star of stars) {
        const starClass = await star.getAttribute('class');
        if (starClass.includes('text-yellow-300')) {
            yellowStars++;
        } else if (starClass.includes('text-gray-400')) {
            greyStars++;
        }
    }

    // Assert that there are exactly 2 yellow stars
    await expect(yellowStars).toBe(3);

    // Assert that there are exactly 3 grey stars
    await expect(greyStars).toBe(2);
  });

  test('Average landlord rating test', async ({ page }) => {
    // TODO: Add test for checking average property rating
    test.fixme();
    await page.goto('http://localhost:3000/properties/6a83d02b-9da1-4a4a-9719-05e8a8c9228d');
  });
});
