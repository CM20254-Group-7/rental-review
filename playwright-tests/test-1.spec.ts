import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.goto('http://localhost:3000/properties/1ececec8-4bbf-445f-8de0-f563caf0bf01/claim');
  await page.getByRole('link', { name: 'Go to Login' }).click();
  await page.locator('form').filter({ hasText: 'Returning User? Sign In Here.' }).getByPlaceholder('you@example.com').click();
  await page.locator('form').filter({ hasText: 'Returning User? Sign In Here.' }).getByPlaceholder('you@example.com').fill('user.2@example.com');
  await page.locator('form').filter({ hasText: 'Returning User? Sign In Here.' }).getByPlaceholder('••••••••').click();
  await page.locator('form').filter({ hasText: 'Returning User? Sign In Here.' }).getByPlaceholder('••••••••').fill('User.2.Password');
  await page.locator('form').filter({ hasText: 'Returning User? Sign In Here.' }).getByPlaceholder('••••••••').press('Enter');
  await page.locator('input[name="started_at"]').fill('2024-01-01');
  await page.getByRole('button', { name: 'I still own this property' }).click();
  await page.getByRole('button', { name: 'Claim Property' }).click();
  await expect(page.getByRole('main')).toContainText('The new claim overlaps with an existing claim');
  await page.getByText('The new claim overlaps with').click();
});