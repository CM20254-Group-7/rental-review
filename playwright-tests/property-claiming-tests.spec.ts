import { test, expect } from '@playwright/test';
import { users } from './helpers';

const firstUser = users[2] // user not registered as a landlord - test that cannot access the claim page
const secondUser = users[1] // user registered as a landlord, with no claimed properties
const thirdUser = users[3] // user registered as a landlord, will attempt to claim properties

let properties: {
    [key: number]: {
        id: string,
        address: string
    }
} = {}

// Define a new date class that can be transformed to a string in the format 'YYYY-MM-DD'
class transformableDate extends Date {
    toISODateString() {
        return this.toISOString().split('T')[0];
    }

    yearBefore() {
        return new transformableDate(this.getFullYear() - 1, this.getMonth(), this.getDate());
    }

    yearAfter() {
        return new transformableDate(this.getFullYear() + 1, this.getMonth(), this.getDate());
    }

    dayBefore() {
        return new transformableDate(this.getFullYear(), this.getMonth(), this.getDate() - 1);
    }

    dayAfter() {
        return new transformableDate(this.getFullYear(), this.getMonth(), this.getDate() + 1);
    }
}

const today = new transformableDate();

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
        test('1.1.1. Anon user cannot access claim property page', async ({ page }, testInfo) => {
            const property = properties[testInfo.line]

            await page.goto(`/properties/${property.id}/claim`);

            // Expect the body to notify the user that they must be logged in to access the page
            await expect(page.getByRole('main')).toContainText('You must be logged in to access this page');
        });

        test('1.1.2. Anon user referred to login', async ({ page }, testInfo) => {
            const property = properties[testInfo.line]

            await page.goto(`/properties/${property.id}/claim`);

            await expect(page.getByRole('main')).toContainText('Go to Login');
            await page.getByRole('link', { name: 'Go to Login' }).click();
            await expect(page).toHaveURL(/.*login/);
        });

        test('1.1.3. Redirected back to claim property page after login', async ({ page }, testInfo) => {
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

        test('1.2.1. User cannot access claim property page', async ({ page }, testInfo) => {
            const property = properties[testInfo.line]

            await page.goto(`/properties/${property.id}/claim`);

            // Expect the body to notify the user that they must be registered as a landlord to access the page
            await expect(page.getByRole('main')).toContainText('You must be registered as a landlord to access this page');
        });

        test('1.2.2. User referred to landlord registration', async ({ page }, testInfo) => {
            const property = properties[testInfo.line]

            await page.goto(`/properties/${property.id}/claim`);

            await expect(page.getByRole('main')).toContainText('Become a Landlord');
            await page.getByRole('link', { name: 'Become a Landlord' }).click();
            await expect(page).toHaveURL(/.*landlord-registration/);
        });
    });

    test.describe(`1.3. Logged in as a landlord - ${secondUser.label}`, () => {
        test.use({ storageState: secondUser.file });

        test('1.3.1. User can access claim property page', async ({ page }, testInfo) => {
            const property = properties[testInfo.line]

            await page.goto(`/properties/${property.id}/claim`);

            // Expect the body to contain the claim property form
            await expect(page.getByRole('main')).toContainText(`Claiming Property`);
        });
    });
})

test.describe('2. Property Valididity', () => {
    // use the third user as they should have access to the claim property page and it does not matter if they claim properties, asumes 1.3.1 passes
    test.use({ storageState: thirdUser.file });

    test('2.1. Invalid Property ID', async ({ page }) => {
        await page.goto(`/properties/invalid-id/claim`);

        await expect(page.getByRole('main')).toContainText('This page could not be found.');
    });

    test.describe('2.2. Valid Property ID', () => {
        test('2.2.1. Page is shown', async ({ page }, testInfo) => {
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

            test(`2.2.2.2. Property address matches 2`, async ({ page }, testInfo) => {
                const property = properties[testInfo.line]

                await page.goto(`/properties/${property.id}/claim`);

                await expect(page.getByRole('main')).toContainText(property.address);
            })
        })
    });
})

test.describe('3. Claim Property Form', () => {
    // use the third user as they should have access to the page and there will be no issues if they claim a property
    test.use({ storageState: thirdUser.file });

    // go to the claim page before each test
    test.beforeEach(async ({ page }, testInfo) => {
        const property = properties[testInfo.line]

        await page.goto(`/properties/${property.id}/claim`);
    });

    test.describe('3.1. Form Fields exist', () => {
        test('3.1.1. Form has start date input', async ({ page }) => {
            await expect(page.getByRole('main')).toContainText('When did you purchase this property?');
            await expect(page.locator('input[name="started_at"]')).toBeVisible();
        });

        test('3.1.2. Form has end date input', async ({ page }) => {
            await expect(page.getByRole('main')).toContainText('When did you sell this property?');
            await expect(page.locator('input[name="ended_at"]')).toBeVisible();
        });

        test('3.1.2. Form has option to still own property', async ({ page }) => {
            await expect(page.getByRole('main')).toContainText('When did you sell this property?');
            await expect(page.getByRole('button', { name: 'I still own this property' })).toBeVisible();
        });

        test('3.1.4. Form has submit button', async ({ page }) => {
            await expect(page.getByRole('button', { name: 'Claim Property' })).toBeVisible();
        });
    });

    test.describe('3.2. Fields Indicate When Set', () => {
        const activeClass = /bg-accent\/20/;
        test.describe('3.2.1. Start Date', () => {
            test('3.2.1.1 Start Date is initially unset', async ({ page }) => {
                await expect(page.locator('input[name="started_at"]')).toHaveValue('');
                await expect(page.locator('input[name="started_at"]')).not.toHaveClass(activeClass);
            });

            test('3.2.1.2 Start Date is set', async ({ page }) => {
                await page.locator('input[name="started_at"]').fill('2020-01-01');

                await expect(page.locator('input[name="started_at"]')).toHaveValue('2020-01-01');
                await expect(page.locator('input[name="started_at"]')).toHaveClass(activeClass);
            });
        });

        test.describe('3.2.2. End Date', () => {
            test('3.2.2.1. End Date is initially unset', async ({ page }) => {
                await expect(page.locator('input[name="ended_at"]')).toHaveValue('');
                await expect(page.locator('input[name="ended_at"]')).not.toHaveClass(activeClass);
            });

            test('3.2.2.2. End Date is set', async ({ page }) => {
                await page.locator('input[name="ended_at"]').fill('2020-01-01');

                await expect(page.locator('input[name="ended_at"]')).toHaveValue('2020-01-01');
                await expect(page.locator('input[name="ended_at"]')).toHaveClass(activeClass);
            });
        });

        test.describe('3.2.3. Still Owned', () => {
            test('3.2.3.1. Still Owned is initially unset', async ({ page }) => {
                await expect(page.getByRole('button', { name: 'I still own this property' })).not.toHaveClass(activeClass);
            });

            test('3.2.3.2. Still Owned is set', async ({ page }) => {
                await page.getByRole('button', { name: 'I still own this property' }).click();

                await expect(page.getByRole('button', { name: 'I still own this property' })).toHaveClass(activeClass);
            });
        });
    });

    test('3.3. Form Submission', async ({page},testInfo) => {
        // check that a new property record is added to the database when form is submitted with valid data
        const property = properties[testInfo.line]

        await page.locator('input[name="started_at"]').fill(today.yearBefore().yearBefore().toISODateString());
        await page.locator('input[name="ended_at"]').fill(today.yearBefore().toISODateString());
        await page.getByRole('button', { name: 'Claim Property' }).click();

        // wait for success message
        await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
        // Check ownerhip record added to database
        const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
            }
        })

        // Get the ownership record
        await expect(res).toBeOK();
        const ownershipRecord = (await res.json())[0];

        // Check the ownership record details match those expected
        await expect(ownershipRecord.started_at).toBe(today.yearBefore().yearBefore().toISODateString());
        await expect(ownershipRecord.ended_at).toBe(today.yearBefore().toISODateString());
        await expect(ownershipRecord.landlord_id).toBe(thirdUser.id);
    });

    test.describe('3.4. Client Side Form Validation', () => {
        test.describe('3.4.1. Required Fields', () => {
            test('3.4.1.1. Start Date is required', async ({ page }) => {
                await page.getByRole('button', { name: 'Claim Property' }).click();

                await expect(page.locator('input[name="started_at"]')).toHaveAttribute('required');
            });

            test('3.4.1.2. End Date is not required if still owned', async ({ page }) => {
                await page.getByRole('button', { name: 'I still own this property' }).click();
                await page.getByRole('button', { name: 'Claim Property' }).click();

                await expect(page.locator('input[name="ended_at"]')).not.toHaveAttribute('required');
            });

            test('3.4.1.3. End Date is required if not still owned', async ({ page }) => {
                await page.getByRole('button', { name: 'Claim Property' }).click();

                await expect(page.locator('input[name="ended_at"]')).toHaveAttribute('required');
            });
        });

        test.describe('3.4.2. End Date & Still Owned mutual exclusivity', () => {
            const activeClass = /bg-accent\/20/;

            test('3.4.2.1. End Date Cleared when Still Owned is clicked', async ({ page }) => {
                await page.locator('input[name="ended_at"]').fill(today.yearBefore().toISODateString());
                await page.getByRole('button', { name: 'I still own this property' }).click();

                await expect(page.locator('input[name="ended_at"]')).toHaveValue('');
            });

            test('3.4.2.2. Still Owned is Cleared when End Date is set', async ({ page }) => {
                await page.getByRole('button', { name: 'I still own this property' }).click();

                await page.locator('input[name="ended_at"]').fill(today.yearBefore().toISODateString());

                await expect(page.getByRole('button', { name: 'I still own this property' })).not.toHaveClass(activeClass);
            });
        });
    });

    test.describe('3.5. Server Side Form Validation', () => {
        // There are three possible error causes:
        //   A. Start Date in future
        //   B. End Date in future
        //   C. End Date before Start Date
        // 
        // For each cause, Test:
        //   1. Safe Pass     
        //      - difference from boundary >= 1 year 
        //      - on the right side of the boundary
        //   2. Near Pass 
        //      - difference from boundary = 1 day
        //      - on the right side of the boundary
        //   3. Boundary
        //      - difference from boundary = 0
        //      - Pass/Fail depends on specific test
        //   4. Near Fail
        //      - difference from boundary = 1 day
        //      - on the wrong side of the boundary
        //   5. Safe Fail
        //      - difference from boundary >= 1 year
        //      - on the wrong side of the boundary
        //
        // Test 1-5 for each cause A-C, as well as each comination of safe passes and fails (D)
        // 
        // After each test
        //  - check that the correct / no error message is shown
        //  - check that the database contains the correct / no new ownership record

        test.describe('3.5.A. Start Date in future', () => {
            test('3.5.A.1. Safe Pass', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use open claim to isolate issues
                await page.getByRole('button', { name: 'I still own this property' }).click();

                // set test start date (1 year ago)
                await page.locator('input[name="started_at"]').fill(today.yearBefore().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error not shown
                await expect(page.getByRole('main')).not.toContainText('Start date must be in the past');

                // wait for success message
                await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecord = (await res.json())[0];

                // Check the ownership record details match those expected
                await expect(ownershipRecord.started_at).toBe(today.yearBefore().toISODateString());
                await expect(ownershipRecord.ended_at).toBeNull();
                await expect(ownershipRecord.landlord_id).toBe(thirdUser.id);
            });

            test('3.5.A.2. Near Pass', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use open claim to isolate issues
                await page.getByRole('button', { name: 'I still own this property' }).click();

                // set test start date (1 year ago)
                await page.locator('input[name="started_at"]').fill(today.dayBefore().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error not shown
                await expect(page.getByRole('main')).not.toContainText('Start date must be in the past');

                // wait for success message
                await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecord = (await res.json())[0];

                // Check the ownership record details match those expected
                await expect(ownershipRecord.started_at).toBe(today.dayBefore().toISODateString());
                await expect(ownershipRecord.ended_at).toBeNull();
                await expect(ownershipRecord.landlord_id).toBe(thirdUser.id);
            });

            test('3.5.A.3. Boundary (should pass)', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use open claim to isolate issues
                await page.getByRole('button', { name: 'I still own this property' }).click();

                // set test start date (1 year ago)
                await page.locator('input[name="started_at"]').fill(today.toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error not shown
                await expect(page.getByRole('main')).not.toContainText('Start date must be in the past');

                // wait for success message
                await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecord = (await res.json())[0];

                // Check the ownership record details match those expected
                await expect(ownershipRecord.started_at).toBe(today.toISODateString());
                await expect(ownershipRecord.ended_at).toBeNull();
                await expect(ownershipRecord.landlord_id).toBe(thirdUser.id);
            });

            test('3.5.A.2. Near fail', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use open claim to isolate issues
                await page.getByRole('button', { name: 'I still own this property' }).click();

                // set test start date (1 year ago)
                await page.locator('input[name="started_at"]').fill(today.dayAfter().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error shown
                await expect(page.getByRole('main')).toContainText('Start date must be in the past');

                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecords = await res.json();

                // check the ownership records are an empty array
                await expect(ownershipRecords.length).toBeFalsy();
            });

            test('3.5.A.5. Safe fail', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use open claim to isolate issues
                await page.getByRole('button', { name: 'I still own this property' }).click();

                // set test start date (1 year ago)
                await page.locator('input[name="started_at"]').fill(today.yearAfter().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error shown
                await expect(page.getByRole('main')).toContainText('Start date must be in the past');

                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecords = await res.json();

                // check the ownership records are an empty array
                await expect(ownershipRecords.length).toBeFalsy();
            });
        });

        test.describe('3.5.B. End Date in future', () => {
            // Use safe pass start date (2 years ago)for all tests
            const start_date = today.yearBefore().yearBefore().toISODateString();

            test('3.5.B.1. Safe Pass', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use safe pass start date
                await page.locator('input[name="started_at"]').fill(start_date);

                // Set test end date (1 year ago)
                await page.locator('input[name="ended_at"]').fill(today.yearBefore().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error not shown
                await expect(page.getByRole('main')).not.toContainText('End date must be in the past');

                // wait for success message
                await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecord = (await res.json())[0];

                // Check the ownership record details match those expected
                await expect(ownershipRecord.started_at).toBe(start_date);
                await expect(ownershipRecord.ended_at).toBe(today.yearBefore().toISODateString());
                await expect(ownershipRecord.landlord_id).toBe(thirdUser.id);
            });

            test('3.5.B.2. Near Pass', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use safe pass start date
                await page.locator('input[name="started_at"]').fill(start_date);

                // Set test end date (1 year ago)
                await page.locator('input[name="ended_at"]').fill(today.dayBefore().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error not shown
                await expect(page.getByRole('main')).not.toContainText('End date must be in the past');

                // wait for success message
                await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecord = (await res.json())[0];

                // Check the ownership record details match those expected
                await expect(ownershipRecord.started_at).toBe(start_date);
                await expect(ownershipRecord.ended_at).toBe(today.dayBefore().toISODateString());
                await expect(ownershipRecord.landlord_id).toBe(thirdUser.id);
            });

            test('3.5.B.3. Boundary (should pass)', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use safe pass start date
                await page.locator('input[name="started_at"]').fill(start_date);

                // Set test end date (1 year ago)
                await page.locator('input[name="ended_at"]').fill(today.toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error not shown
                await expect(page.getByRole('main')).not.toContainText('End date must be in the past');

                // wait for success message
                await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecord = (await res.json())[0];

                // Check the ownership record details match those expected
                await expect(ownershipRecord.started_at).toBe(start_date);
                await expect(ownershipRecord.ended_at).toBe(today.toISODateString());
                await expect(ownershipRecord.landlord_id).toBe(thirdUser.id);
            });

            test('3.5.B.4. Near Fail', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use safe pass start date
                await page.locator('input[name="started_at"]').fill(start_date);

                // Set test end date (1 year ago)
                await page.locator('input[name="ended_at"]').fill(today.dayAfter().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error shown
                await expect(page.getByRole('main')).toContainText('End date must be in the past');

                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecords = await res.json();

                // check the ownership records are an empty array
                await expect(ownershipRecords.length).toBeFalsy();
            });

            test('3.5.B.5. Safe Fail', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use safe pass start date
                await page.locator('input[name="started_at"]').fill(start_date);

                // Set test end date (1 year ago)
                await page.locator('input[name="ended_at"]').fill(today.yearAfter().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error shown
                await expect(page.getByRole('main')).toContainText('End date must be in the past');

                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecords = await res.json();

                // check the ownership records are an empty array
                await expect(ownershipRecords.length).toBeFalsy();
            });
        });

        test.describe('3.5.C. End Date before Start Date', () => {
            // Use safe pass start date (2 years ago)for all tests
            const start_date = today.yearBefore().yearBefore();

            test('3.5.C.1. Safe Pass', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use safe pass start date
                await page.locator('input[name="started_at"]').fill(start_date.toISODateString());

                // Set test end date (1 year ago)
                await page.locator('input[name="ended_at"]').fill(start_date.yearAfter().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error not shown
                await expect(page.getByRole('main')).not.toContainText('End date must be after start date');

                // wait for success message
                await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecord = (await res.json())[0];

                // Check the ownership record details match those expected
                await expect(ownershipRecord.started_at).toBe(start_date.toISODateString());
                await expect(ownershipRecord.ended_at).toBe(today.yearBefore().toISODateString());
                await expect(ownershipRecord.landlord_id).toBe(thirdUser.id);
            });

            test('3.5.C.2. Near Pass', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use safe pass start date
                await page.locator('input[name="started_at"]').fill(start_date.toISODateString());

                // Set test end date (1 year ago)
                await page.locator('input[name="ended_at"]').fill(start_date.dayAfter().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error not shown
                await expect(page.getByRole('main')).not.toContainText('End date must be after start date');

                // wait for success message
                await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecord = (await res.json())[0];

                // Check the ownership record details match those expected
                await expect(ownershipRecord.started_at).toBe(start_date.toISODateString());
                await expect(ownershipRecord.ended_at).toBe(start_date.dayAfter().toISODateString());
                await expect(ownershipRecord.landlord_id).toBe(thirdUser.id);
            });

            test('3.5.B.3. Boundary (should fail)', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use safe pass start date
                await page.locator('input[name="started_at"]').fill(start_date.toISODateString());

                // Set test end date (1 year ago)
                await page.locator('input[name="ended_at"]').fill(start_date.toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error shown
                await expect(page.getByRole('main')).toContainText('End date must be after start date');

                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecords = await res.json();

                // check the ownership records are an empty array
                await expect(ownershipRecords.length).toBeFalsy();
            });

            test('3.5.B.4. Near Fail', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use safe pass start date
                await page.locator('input[name="started_at"]').fill(start_date.toISODateString());

                // Set test end date (1 year ago)
                await page.locator('input[name="ended_at"]').fill(start_date.dayBefore().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error shown
                await expect(page.getByRole('main')).toContainText('End date must be after start date');

                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecords = await res.json();

                // check the ownership records are an empty array
                await expect(ownershipRecords.length).toBeFalsy();
            });

            test('3.5.B.5. Safe Fail', async ({ page }, testInfo) => {
                const property = properties[testInfo.line]
                // Use safe pass start date
                await page.locator('input[name="started_at"]').fill(start_date.toISODateString());

                // Set test end date (1 year ago)
                await page.locator('input[name="ended_at"]').fill(start_date.yearBefore().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error shown
                await expect(page.getByRole('main')).toContainText('End date must be after start date');

                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecords = await res.json();

                // check the ownership records are an empty array
                await expect(ownershipRecords.length).toBeFalsy();
            });
        });

        test.describe('3.5.D. Pass Fail Combinations', () => {
            // For each condition ABC test pass (1) and fail (0)
            // Represent pass/fail as binary string e.g. 101 for A:pass, B:fail, C:pass

            test('3.5.D.1. 000', async ({ page }, testInfo) => {
                // Test all conditions fail with
                // Start date 2 years in future
                // End date 1 year in future

                const property = properties[testInfo.line]

                await page.locator('input[name="started_at"]').fill(today.yearAfter().yearAfter().toISODateString());
                await page.locator('input[name="ended_at"]').fill(today.yearAfter().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error shown (can be any of the 3)
                await expect(page.getByRole('main')).toContainText(/Start date must be in the past|End date must be in the past|End date must be after start date/);

                // Check ownerhip record not added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })
                await expect(res).toBeOK();
                const ownershipRecords = await res.json();
                await expect(ownershipRecords.length).toBeFalsy();
            });

            test('3.5.D.2. 001', async ({ page }, testInfo) => {
                // Test conditions A & B fail with
                // Start date 1 years in future
                // End date 2 year in future

                const property = properties[testInfo.line]

                await page.locator('input[name="started_at"]').fill(today.yearAfter().toISODateString());
                await page.locator('input[name="ended_at"]').fill(today.yearAfter().yearAfter().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error shown (can be any of the 2 that fail)
                await expect(page.getByRole('main')).toContainText(/Start date must be in the past|End date must be in the past/);

                // Check ownerhip record not added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })
                await expect(res).toBeOK();
                const ownershipRecords = await res.json();
                await expect(ownershipRecords.length).toBeFalsy();
            });

            test('3.5.D.3. 010', async ({ page }, testInfo) => {
                // Test conditions A & C fail with
                // Start date 1 years in future
                // End date 1 year in past

                const property = properties[testInfo.line]

                await page.locator('input[name="started_at"]').fill(today.yearAfter().toISODateString());
                await page.locator('input[name="ended_at"]').fill(today.yearBefore().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error shown (can be any of the 2 that fail)
                await expect(page.getByRole('main')).toContainText(/Start date must be in the past|End date must be after start date/);

                // Check ownerhip record not added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })
                await expect(res).toBeOK();
                const ownershipRecords = await res.json();
                await expect(ownershipRecords.length).toBeFalsy();
            });
            test('3.5.D.4. 011', async ({ page }, testInfo) => {
                testInfo.skip(true, 'Not possible for start date to be in the future, end date to be in the past, and end date to be after start date');
            });
            test('3.5.D.5. 100', async ({ page }, testInfo) => {
                testInfo.skip(true, 'Not possible for start date to be in the past, end date to be in the future, and end date to be before start date');
            });
            test('3.5.D.6. 101', async ({ page }, testInfo) => {
                // Test condition B fails with
                // Start date 1 years in past
                // End date 1 year in future

                const property = properties[testInfo.line]

                await page.locator('input[name="started_at"]').fill(today.yearBefore().toISODateString());
                await page.locator('input[name="ended_at"]').fill(today.yearAfter().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error shown
                await expect(page.getByRole('main')).toContainText(/End date must be in the past/);

                // Check ownerhip record not added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })
                await expect(res).toBeOK();
                const ownershipRecords = await res.json();
                await expect(ownershipRecords.length).toBeFalsy();
            });
            test('3.5.D.7. 110', async ({ page }, testInfo) => {
                // Test condition  C fails with
                // Start date 1 years in past
                // End date 2 year in past

                const property = properties[testInfo.line]

                await page.locator('input[name="started_at"]').fill(today.yearBefore().toISODateString());
                await page.locator('input[name="ended_at"]').fill(today.yearBefore().yearBefore().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error shown
                await expect(page.getByRole('main')).toContainText(/End date must be after start date/);

                // Check ownerhip record not added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })
                await expect(res).toBeOK();
                const ownershipRecords = await res.json();
                await expect(ownershipRecords.length).toBeFalsy();
            });
            test('3.5.D.8. 111', async ({ page }, testInfo) => {
                // Test all conditions pass fail with
                // Start date 2 years in past
                // End date 1 year in past

                const property = properties[testInfo.line]

                await page.locator('input[name="started_at"]').fill(today.yearBefore().yearBefore().toISODateString());
                await page.locator('input[name="ended_at"]').fill(today.yearBefore().toISODateString());
                await page.getByRole('button', { name: 'Claim Property' }).click();

                // Check error not shown
                await expect(page.getByRole('main')).not.toContainText(/Start date must be in the past|End date must be in the past|End date must be after start date/);

                // wait for success message
                await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
                // Check ownerhip record added to database
                const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`
                    }
                })

                // Get the ownership record
                await expect(res).toBeOK();
                const ownershipRecord = (await res.json())[0];

                // Check the ownership record details match those expected
                await expect(ownershipRecord.started_at).toBe(today.yearBefore().yearBefore().toISODateString());
                await expect(ownershipRecord.ended_at).toBe(today.yearBefore().toISODateString());
                await expect(ownershipRecord.landlord_id).toBe(thirdUser.id);
            });
        });
    });
});