import { test, expect } from '@playwright/test';
import { users } from './helpers';

const firstUser = users[2] // user not registered as a landlord - test that cannot access the claim page
const secondUser = users[1] // user registered as a landlord, with no claimed properties

let properties: {
    [key:number]: {
        id: string,
        address: string
    }
} = {}

// To ensure tests do not interfere with each other, we will create a unique property for each test
// Each will be be on 'Property Claiming Road' with the house number = the line number of the test, and in a city representing the browser
test.beforeEach('Create Unique Property for test', async ({ page }, testInfo) => {
    const address = `${testInfo.line}, Property Claiming Road, ${testInfo.project.name} City`

    const res = await page.request.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/properties?select=*`, {
        headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        data: {
            'address': address,
            'house': testInfo.line,
            'street': 'Property Claiming Road',
            'county': testInfo.project.name,
        }
    })

    await expect(res).toBeOK();
    const newProperty = (await res.json())[0]

    await expect(newProperty.address).toBe(address);

    properties[testInfo.line] = newProperty
})

test.afterEach('Delete Unique Property for test', async ({ page }, testInfo) => {
    const property = properties[testInfo.line]

    const res = await page.request.delete(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/properties?id=eq.${property.id}`, {
        headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
            'Prefer': 'return=minimal'
        }
    })

    await expect(res).toBeOK();
})


test.describe('1. Page Access', () => {

    // all tests will use the second property, Assumes
    test.describe('1.1. Not logged in - Anon User', () => {
        test('1.1.1. Anon user cannot access claim property page', async ({ page },testInfo) => {
            const property = properties[testInfo.line]

            await page.goto(`/properties/${property.id}/claim`);

            // Expect the body to notify the user that they must be logged in to access the page
            await expect(page.getByRole('main')).toContainText('You must be logged in to access this page');
        });

        test('1.1.2. Anon user referred to login', async ({ page },testInfo) => {
            const property = properties[testInfo.line]

            await page.goto(`/properties/${property.id}/claim`);

            await expect(page.getByRole('main')).toContainText('Go to Login');
            await page.getByRole('link', { name: 'Go to Login' }).click();
            await expect(page).toHaveURL(/.*login/);
        });

        test('1.1.3. Redirected back to claim property page after login', async ({ page },testInfo) => {
            const property = properties[testInfo.line]

            await page.goto(`/properties/${property.id}/claim`);
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

            await expect(page).toHaveURL(`/properties/${property.id}/claim`);
        });
    })

    test.describe(`1.2. Logged in but not a landlord - ${firstUser.label}`, () => {
        test.use({ storageState: firstUser.file });

        test('1.2.1. User cannot access claim property page', async ({ page },testInfo) => {
            const property = properties[testInfo.line]

            await page.goto(`/properties/${property.id}/claim`);

            // Expect the body to notify the user that they must be registered as a landlord to access the page
            await expect(page.getByRole('main')).toContainText('You must be registered as a landlord to access this page');
        });

        test('1.2.2. User referred to landlord registration', async ({ page },testInfo) => {
            const property = properties[testInfo.line]

            await page.goto(`/properties/${property.id}/claim`);

            await expect(page.getByRole('main')).toContainText('Become a Landlord');
            await page.getByRole('link', { name: 'Become a Landlord' }).click();
            await expect(page).toHaveURL(/.*landlord-registration/);
        });
    });

    test.describe(`1.3. Logged in as a landlord - ${secondUser.label}`, () => {
        test.use({ storageState: secondUser.file });

        test('1.3.1. User can access claim property page', async ({ page },testInfo) => {
            const property = properties[testInfo.line]

            await page.goto(`/properties/${property.id}/claim`);

            // Expect the body to contain the claim property form
            await expect(page.getByRole('main')).toContainText(`Claiming Property`);
        });
    });
})

test.describe('2. Property Valididity', () => {
    // use the second user as they should have access to the claim property page, asumes 1.3.1 passes
    test.use({ storageState: secondUser.file });

    test('2.1. Invalid Property ID', async ({ page }) => {
        await page.goto(`/properties/invalid-id/claim`);

        await expect(page.getByRole('main')).toContainText('This page could not be found.');
    });

    test.describe('2.2. Valid Property ID', () => {
        test('2.2.1. Page is shown', async ({ page },testInfo) => {
            const property = properties[testInfo.line]

            await page.goto(`/properties/${property.id}/claim`);

            await expect(page.getByRole('main')).toContainText('Claiming Property');
        });

        test.describe('2.2.2. Page matches property', () => {
            test(`2.2.2.1. Property address matches 1`, async ({ page }, testInfo) => {
                const property = properties[testInfo.line]

                await page.goto(`/properties/${property.id}/claim`);

                await expect(page.getByRole('main')).toContainText(property.address);
            });

            test(`2.2.2.2. Property address matches 2`, async ({ page },testInfo) => {
                const property = properties[testInfo.line]

                await page.goto(`/properties/${property.id}/claim`);

                await expect(page.getByRole('main')).toContainText(property.address);
            })
        })
    });
})