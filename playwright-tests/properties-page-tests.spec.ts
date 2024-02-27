import { test, expect } from '@playwright/test';

test('searching properties', async ({ page }) => {
    const address = '13 Argyle Terrace'
    await page.goto('./properties');

    // Type in an address to search bar
    await page.getByPlaceholder('13 Argyle Terrace, Staverton').fill(address);

    // Click the search button
    await page.getByRole('button', { name: 'Search (no functionality yet)' }).click();

    // Expects search bar to have placeholder 13 Argyle Terrace
    await expect(page).toHaveURL(`http://localhost:3000/properties?address=${address.replaceAll(' ', '+')}`);
})