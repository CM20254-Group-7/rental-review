import { test, expect } from '@playwright/test';
import { users } from './helpers';

const firstUser  = users[2] // user not registered as a landlord - test that cannot access the claim page
const secondUser = users[0] // user registered as a landlord     - test that can claim a property

const firstProperty = {
    id: '0bd989b3-b897-42a3-a0ff-9e1e48f11fde',
    address: '3 Test Road'
}

test.describe('Claim Property Page Access', () => {
    test.describe('Not logged in - Anon User', () => {
        test('Anon user cannot access claim property page', async ({ page }) => {
            await page.goto(`/properties/${firstProperty.id}/claim`);

            // Expect the body to notify the user that they must be logged in to access the page
            await expect(page.getByRole('main')).toContainText('You must be logged in to access this page');
        });

        test('Anon user referred to login', async ({ page }) => {
            await page.goto(`/properties/${firstProperty.id}/claim`);

            await expect(page.getByRole('main')).toContainText('Go to Login');
            await page.getByRole('link', { name: 'Go to Login' }).click();
            await expect(page).toHaveURL(/.*login/);
        });

        test('Redirected back to claim property page after login', async ({ page }) => {
            await page.goto(`/properties/${firstProperty.id}/claim`);
            await page.getByRole('link', { name: 'Go to Login' }).click();
            await page
            .locator('form')
            .filter({ hasText: 'Returning User? Sign In Here.' })
            .getByPlaceholder('you@example.com')
            .fill(firstUser.email);
    
        await page
            .locator('form')
            .filter({ hasText: 'Returning User? Sign In Here.' })
            .getByPlaceholder('••••••••')
            .fill(firstUser.password);
    
        await page
            .getByRole('button', { name: 'Sign In' })
            .click();

            await expect(page).toHaveURL(`/properties/${firstProperty.id}/claim`);
        });
    })

    test.describe(`Logged in but not a landlord - ${firstUser.label}`, () => {
        test.use({ storageState: firstUser.file });

        test('User cannot access claim property page', async ({ page }) => {
            await page.goto(`/properties/${firstProperty.id}/claim`);

            // Expect the body to notify the user that they must be registered as a landlord to access the page
            await expect(page.getByRole('main')).toContainText('You must be registered as a landlord to access this page');
        });

        test('User referred to landlord registration', async ({ page }) => {
            await page.goto(`/properties/${firstProperty.id}/claim`);

            await expect(page.getByRole('main')).toContainText('Become a Landlord');
            await page.getByRole('link', { name: 'Become a Landlord' }).click();
            await expect(page).toHaveURL(/.*landlord-registration/);
        });
    });

    test.describe(`Logged in as a landlord - ${secondUser.label}`, () => {
        test.use({ storageState: secondUser.file });

        test('User can access claim property page', async ({ page }) => {
            await page.goto(`/properties/${firstProperty.id}/claim`);

            // Expect the body to contain the claim property form
            await expect(page.getByRole('main')).toContainText(`Claiming Property`);
        });
    });
})