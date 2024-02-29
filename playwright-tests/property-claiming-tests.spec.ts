import { test, expect } from '@playwright/test';
import { users } from './helpers';

const notALandlordUser = users[2]; // user not registered as a landlord - test that cannot access the claim page
const noPropertyLandlordUser = users[1]; // user registered as a landlord, with no claimed properties
const propertyClaimerUser = users[3]; // user registered as a landlord, will attempt to claim properties
const existingOwnerUser = users[4]; // user registered as a landlord, will attempt to claim properties

//       -- NOTE --
//
// The 'Error Claiming Property' message does not count as the function rejecting the input
// It shows up when the function accepts the input, but the database rejects it
// The function should test each case itself and not rely on database implementation
//

const properties: {
  [key: number]: {
    id: string,
    address: string
  }
} = {};

// Define a new date class that can be transformed to a string in the format 'YYYY-MM-DD'
class TransformableDate extends Date {
  toISODateString() {
    return this.toISOString().split('T')[0];
  }

  yearsBefore(years: number) {
    return new TransformableDate(this.getFullYear() - years, this.getMonth(), this.getDate());
  }

  yearBefore() {
    return this.yearsBefore(1);
  }

  yearsAfter(years: number) {
    return new TransformableDate(this.getFullYear() + years, this.getMonth(), this.getDate());
  }

  yearAfter() {
    return this.yearsAfter(1);
  }

  monthsBefore(months: number) {
    return new TransformableDate(this.getFullYear(), this.getMonth() - months, this.getDate());
  }

  monthBefore() {
    return this.monthsBefore(1);
  }

  monthsAfter(months: number) {
    return new TransformableDate(this.getFullYear(), this.getMonth() + months, this.getDate());
  }

  monthAfter() {
    return this.monthsAfter(1);
  }

  daysBefore(days: number) {
    return new TransformableDate(this.getFullYear(), this.getMonth(), this.getDate() - days);
  }

  dayBefore() {
    return this.daysBefore(1);
  }

  daysAfter(days: number) {
    return new TransformableDate(this.getFullYear(), this.getMonth(), this.getDate() + days);
  }

  dayAfter() {
    return this.daysAfter(1);
  }
}

const today = new TransformableDate();

// To ensure tests do not interfere with each other, we will create a unique property for each test
// Each will be be on 'Property Claiming Road' with the house number = the line number of the test, and in a city representing the browser
test.beforeEach('Create Unique Property for test', async ({ page }, testInfo) => {
  const address = `${testInfo.workerIndex}, Property Claiming Road, ${testInfo.project.name} City`;

  const res = await page.request.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/properties?select=*`, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    data: {
      address,
      house: `${testInfo.workerIndex}`,
      street: 'Property Claiming Road',
      county: testInfo.project.name,
    },
  });

  await expect(res).toBeOK();
  const newProperty = (await res.json())[0];

  await expect(newProperty.address).toBe(address);

  properties[testInfo.workerIndex] = newProperty;
});

test.afterEach('Delete Unique Property for test', async ({ page }, testInfo) => {
  const property = properties[testInfo.workerIndex];

  const res = await page.request.delete(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/properties?id=eq.${property.id}`, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
      Prefer: 'return=minimal',
    },
  });

  await expect(res).toBeOK();
});

test.describe('1. Page Access', () => {
  // all tests will use the second property, Assumes
  test.describe('1.1. Not logged in - Anon User', () => {
    test('1.1.1. Anon user cannot access claim property page', async ({ page }, testInfo) => {
      const property = properties[testInfo.workerIndex];

      await page.goto(`/properties/${property.id}/claim`);

      // Expect the body to notify the user that they must be logged in to access the page
      await expect(page.getByRole('main')).toContainText('You must be logged in to access this page');
    });

    test('1.1.2. Anon user referred to login', async ({ page }, testInfo) => {
      const property = properties[testInfo.workerIndex];

      await page.goto(`/properties/${property.id}/claim`);

      await expect(page.getByRole('main')).toContainText('Go to Login');
      await page.getByRole('link', { name: 'Go to Login' }).click();
      await expect(page).toHaveURL(/.*login/);
    });

    test('1.1.3. Redirected back to claim property page after login', async ({ page }, testInfo) => {
      const property = properties[testInfo.workerIndex];

      await page.goto(`/properties/${property.id}/claim`);
      await page.getByRole('link', { name: 'Go to Login' }).click();
      await page
        .locator('form')
        .filter({ hasText: 'Returning User? Sign In Here.' })
        .getByPlaceholder('you@example.com')
        .fill(notALandlordUser.email);

      await page
        .locator('form')
        .filter({ hasText: 'Returning User? Sign In Here.' })
        .getByPlaceholder('••••••••')
        .fill(notALandlordUser.password);

      await page
        .getByRole('button', { name: 'Sign In' })
        .click();

      await expect(page).toHaveURL(`/properties/${property.id}/claim`);
    });
  });

  test.describe(`1.2. Logged in but not a landlord - ${notALandlordUser.label}`, () => {
    test.use({ storageState: notALandlordUser.file });

    test('1.2.1. User cannot access claim property page', async ({ page }, testInfo) => {
      const property = properties[testInfo.workerIndex];

      await page.goto(`/properties/${property.id}/claim`);

      // Expect the body to notify the user that they must be registered as a landlord to access the page
      await expect(page.getByRole('main')).toContainText('You must be registered as a landlord to access this page');
    });

    test('1.2.2. User referred to landlord registration', async ({ page }, testInfo) => {
      const property = properties[testInfo.workerIndex];

      await page.goto(`/properties/${property.id}/claim`);

      await expect(page.getByRole('main')).toContainText('Become a Landlord');
      await page.getByRole('link', { name: 'Become a Landlord' }).click();
      await expect(page).toHaveURL(/.*landlord-registration/);
    });
  });

  test.describe(`1.3. Logged in as a landlord - ${noPropertyLandlordUser.label}`, () => {
    test.use({ storageState: noPropertyLandlordUser.file });

    test('1.3.1. User can access claim property page', async ({ page }, testInfo) => {
      const property = properties[testInfo.workerIndex];

      await page.goto(`/properties/${property.id}/claim`);

      // Expect the body to contain the claim property form
      await expect(page.getByRole('main')).toContainText('Claiming Property');
    });
  });
});

test.describe('2. Property Valididity', () => {
  // use the third user as they should have access to the claim property page and it does not matter if they claim properties, asumes 1.3.1 passes
  test.use({ storageState: propertyClaimerUser.file });

  test('2.1. Invalid Property ID', async ({ page }) => {
    await page.goto('/properties/invalid-id/claim');

    await expect(page.getByRole('main')).toContainText('This page could not be found.');
  });

  test.describe('2.2. Valid Property ID', () => {
    test('2.2.1. Page is shown', async ({ page }, testInfo) => {
      const property = properties[testInfo.workerIndex];

      await page.goto(`/properties/${property.id}/claim`);

      await expect(page.getByRole('main')).toContainText('Claiming Property');
    });

    test.describe('2.2.2. Page matches property', () => {
      test('2.2.2.1. Property address matches 1', async ({ page }, testInfo) => {
        const property = properties[testInfo.workerIndex];

        await page.goto(`/properties/${property.id}/claim`);

        await expect(page.getByRole('main')).toContainText(property.address);
      });

      test('2.2.2.2. Property address matches 2', async ({ page }, testInfo) => {
        const property = properties[testInfo.workerIndex];

        await page.goto(`/properties/${property.id}/claim`);

        await expect(page.getByRole('main')).toContainText(property.address);
      });
    });
  });
});

test.describe('3. Claim Property Form', () => {
  // use the third user as they should have access to the page and there will be no issues if they claim a property
  test.use({ storageState: propertyClaimerUser.file });

  // go to the claim page before each test
  test.beforeEach(async ({ page }, testInfo) => {
    const property = properties[testInfo.workerIndex];

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

  test('3.3. Form Submission', async ({ page }, testInfo) => {
    // check that a new property record is added to the database when form is submitted with valid data
    const property = properties[testInfo.workerIndex];

    await page.locator('input[name="started_at"]').fill(today.yearBefore().yearBefore().toISODateString());
    await page.locator('input[name="ended_at"]').fill(today.yearBefore().toISODateString());
    await page.getByRole('button', { name: 'Claim Property' }).click();

    // wait for success message
    await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
    // Check ownerhip record added to database
    const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
      },
    });

    // Get the ownership record
    await expect(res).toBeOK();
    const ownershipRecord = (await res.json())[0];

    // Check the ownership record details match those expected
    await expect(ownershipRecord.started_at).toBe(today.yearBefore().yearBefore().toISODateString());
    await expect(ownershipRecord.ended_at).toBe(today.yearBefore().toISODateString());
    await expect(ownershipRecord.landlord_id).toBe(propertyClaimerUser.id);
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
      const startDateTests = [
        {
          name: 'Safe Pass',
          date: today.yearBefore(),
          shouldPass: true,
        },
        {
          name: 'Near Pass',
          date: today.dayBefore(),
          shouldPass: true,
        },
        {
          name: 'Boundary',
          date: today,
          shouldPass: true,
        },
        {
          name: 'Near Fail',
          date: today.dayAfter(),
          shouldPass: false,
        },
        {
          name: 'Safe Fail',
          date: today.yearAfter(),
          shouldPass: false,
        },
      ];

      for (const [startDateIndex, startDateTest] of startDateTests.entries()) {
        test(`3.5.A.${startDateIndex + 1}. ${startDateTest.name}`, async ({ page }, testInfo) => {
          const property = properties[testInfo.workerIndex];
          // Use open claim to isolate issues
          await page.getByRole('button', { name: 'I still own this property' }).click();

          // set test start date
          await page.locator('input[name="started_at"]').fill(startDateTest.date.toISODateString());
          await page.getByRole('button', { name: 'Claim Property' }).click();

          // Wait for success/error message
          if (startDateTest.shouldPass) {
            await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
          } else {
            await expect(page.getByRole('main')).toContainText('Start date must be in the past');
          }

          // Get the ownership record if it exists
          const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
            },
          });
          await expect(res).toBeOK();
          const ownershipRecord = await res.json();

          if (startDateTest.shouldPass) {
            // Check the ownership record details match those expected
            await expect(ownershipRecord[0].started_at).toBe(startDateTest.date.toISODateString());
            await expect(ownershipRecord[0].ended_at).toBeNull();
            await expect(ownershipRecord[0].landlord_id).toBe(propertyClaimerUser.id);
          } else {
            // check the ownership records are an empty array
            await expect(ownershipRecord.length).toBeFalsy();
          }
        });
      }
    });

    test.describe('3.5.B. End Date in future', () => {
      const startDate = today.yearsBefore(2);
      const endDatesTests = [
        {
          name: 'Safe Pass',
          date: today.yearBefore(),
          shouldPass: true,
        },
        {
          name: 'Near Pass',
          date: today.dayBefore(),
          shouldPass: true,
        },
        {
          name: 'Boundary',
          date: today,
          shouldPass: true,
        },
        {
          name: 'Near Fail',
          date: today.dayAfter(),
          shouldPass: false,
        },
        {
          name: 'Safe Fail',
          date: today.yearAfter(),
          shouldPass: false,
        },
      ];

      for (const [endDateIndex, endDateTest] of endDatesTests.entries()) {
        test(`3.5.A.${endDateIndex + 1}. ${endDateTest.name}`, async ({ page }, testInfo) => {
          const property = properties[testInfo.workerIndex];
          // Use safe pass start date
          await page.locator('input[name="started_at"]').fill(startDate.toISODateString());

          // Set test end date
          await page.locator('input[name="ended_at"]').fill(endDateTest.date.toISODateString());
          await page.getByRole('button', { name: 'Claim Property' }).click();

          // Wait for success/error message
          if (endDateTest.shouldPass) {
            await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
          } else {
            await expect(page.getByRole('main')).toContainText('End date must be in the past');
          }

          // Get the ownership record if it exists
          const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
            },
          });
          await expect(res).toBeOK();
          const ownershipRecord = await res.json();

          if (endDateTest.shouldPass) {
            // Check the ownership record details match those expected
            await expect(ownershipRecord[0].started_at).toBe(startDate.toISODateString());
            await expect(ownershipRecord[0].ended_at).toBe(endDateTest.date.toISODateString());
            await expect(ownershipRecord[0].landlord_id).toBe(propertyClaimerUser.id);
          } else {
            // check the ownership records are an empty array
            await expect(ownershipRecord.length).toBeFalsy();
          }
        });
      }
    });

    test.describe('3.5.C. End Date before Start Date', () => {
      const startDate = today.yearsBefore(2);
      const endDateTests = [
        {
          name: 'Safe Pass',
          date: startDate.yearAfter(),
          shouldPass: true,
        },
        {
          name: 'Near Pass',
          date: startDate.dayAfter(),
          shouldPass: true,
        },
        {
          name: 'Boundary',
          date: startDate,
          shouldPass: false,
        },
        {
          name: 'Near Fail',
          date: startDate.dayBefore(),
          shouldPass: false,
        },
        {
          name: 'Safe Fail',
          date: startDate.yearBefore(),
          shouldPass: false,
        },
      ];

      for (const [endIndex, endDateTest] of endDateTests.entries()) {
        test(`3.5.C.${endIndex + 1}. ${endDateTest.name}`, async ({ page }, testInfo) => {
          const property = properties[testInfo.workerIndex];
          // Use safe pass start date
          await page.locator('input[name="started_at"]').fill(startDate.toISODateString());

          // Set test end date
          await page.locator('input[name="ended_at"]').fill(endDateTest.date.toISODateString());
          await page.getByRole('button', { name: 'Claim Property' }).click();

          // Wait for success/error message
          if (endDateTest.shouldPass) {
            await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
          } else {
            await expect(page.getByRole('main')).toContainText('End date must be after start date');
          }

          // Get the ownership record if it exists
          const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
            },
          });
          await expect(res).toBeOK();
          const ownershipRecord = await res.json();

          if (endDateTest.shouldPass) {
            // Check the ownership record details match those expected
            await expect(ownershipRecord[0].started_at).toBe(startDate.toISODateString());
            await expect(ownershipRecord[0].ended_at).toBe(endDateTest.date.toISODateString());
            await expect(ownershipRecord[0].landlord_id).toBe(propertyClaimerUser.id);
          } else {
            // check the ownership records are an empty array
            await expect(ownershipRecord.length).toBeFalsy();
          }
        });
      }
    });

    test.describe('3.5.D. Pass/Fail (P/F) Combinations (Start-End-Order)', () => {
      type DateTest = {
        name: string;
        start: TransformableDate;
        end: TransformableDate;
        shouldPass: boolean;
        expectedMessages: RegExp;
        skip?: undefined
      } | {
        name: string;
        skip: true;
      }
      const dateTests: DateTest[] = [
        {
          name: 'F-F-F',
          start: today.yearsAfter(2),
          end: today.yearAfter(),
          shouldPass: false,
          expectedMessages: /Start date must be in the past|End date must be in the past|End date must be after start date/,
        },
        {
          name: 'F-F-P',
          start: today.yearAfter(),
          end: today.yearsAfter(2),
          shouldPass: false,
          expectedMessages: /Start date must be in the past|End date must be in the past/,
        },
        {
          name: 'F-P-F',
          start: today.yearAfter(),
          end: today.yearBefore(),
          shouldPass: false,
          expectedMessages: /Start date must be in the past|End date must be after start date/,
        },
        {
          // No combination of dates exists that will produce this result
          name: 'F-P-P',
          skip: true,
        },
        {
          // No combination of dates exists that will produce this result
          name: 'P-F-F',
          skip: true,
        },
        {
          name: 'P-F-P',
          start: today.yearBefore(),
          end: today.yearAfter(),
          shouldPass: false,
          expectedMessages: /End date must be in the past/,
        },
        {
          name: 'P-P-F',
          start: today.yearBefore(),
          end: today.yearsBefore(2),
          shouldPass: false,
          expectedMessages: /End date must be after start date/,
        },
        {
          name: 'P-P-P',
          start: today.yearsBefore(2),
          end: today.yearBefore(),
          shouldPass: true,
          expectedMessages: /Property Claimed Successfully/,
        },
      ];

      for (const [dateIndex, dateTest] of dateTests.entries()) {
        test(`3.5.D.${dateIndex + 1}. ${dateTest.name}`, async ({ page }, testInfo) => {
          if (dateTest.skip) {
            return test.skip();
          }

          const property = properties[testInfo.workerIndex];
          // Use safe pass start date
          await page.locator('input[name="started_at"]').fill(dateTest.start.toISODateString());

          // Set test end date
          await page.locator('input[name="ended_at"]').fill(dateTest.end.toISODateString());
          await page.getByRole('button', { name: 'Claim Property' }).click();

          // Wait for success/error message
          if (dateTest.shouldPass) {
            await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
          } else {
            await expect(page.getByRole('main')).toContainText(dateTest.expectedMessages);
          }

          // Get the ownership record if it exists
          const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}`, {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
            },
          });
          await expect(res).toBeOK();
          const ownershipRecord = await res.json();

          if (dateTest.shouldPass) {
            // Check the ownership record details match those expected
            await expect(ownershipRecord[0].started_at).toBe(dateTest.start.toISODateString());
            await expect(ownershipRecord[0].ended_at).toBe(dateTest.end.toISODateString());
            await expect(ownershipRecord[0].landlord_id).toBe(propertyClaimerUser.id);
          } else {
            // check the ownership records are an empty array
            await expect(ownershipRecord.length).toBeFalsy();
          }

          // I don't know why this is necessary, but ESLint is complaining about the test not returning anything
          return undefined;
        });
      }
    });
  });
});

test.describe('4. Claim Collision', () => {
  // should be logged in as the property claimer for all tests
  test.use({ storageState: propertyClaimerUser.file });

  // go to the claim page before each test
  test.beforeEach(async ({ page }, testInfo) => {
    const property = properties[testInfo.workerIndex];

    await page.goto(`/properties/${property.id}/claim`);
  });

  test.describe('4.1. Single Closed Claim', () => {
    // Define the existing claim start and end dates
    const existingClaimStart = today.yearsBefore(2);
    const existingClaimEnd = today.yearBefore();

    // Setup the potentially colliding claim before each test
    test.beforeEach(async ({ page }, testInfo) => {
      const property = properties[testInfo.workerIndex];

      // Create the existing ownership record
      const res = await page.request.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        data: {
          property_id: property.id,
          landlord_id: existingOwnerUser.id,
          started_at: existingClaimStart.toISODateString(),
          ended_at: existingClaimEnd.toISODateString(),
        },
      });

      await expect(res).toBeOK();
    });

    type EndDateTest = {
      name: string;
      date: TransformableDate | null;
      shouldPass: boolean;
    }

    type NewClaimTest = {
      name: string;
      date: TransformableDate;
      testWithEnds: EndDateTest[];
    };

    const newClaimTests: NewClaimTest[] = [
      {
        name: 'New starts before existing (safe)',
        date: existingClaimStart.yearsBefore(2),
        testWithEnds: [
          {
            // Existing:                        |----------|
            // New:       |----------|
            // Date:     -4         -3         -2         -1          0
            //
            // Should become
            // Owner:          New                   Old
            //            |----------|          |----------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends before existing starts (safe)',
            date: existingClaimStart.yearBefore(),
            shouldPass: true,
          },
          {
            // Existing:                        |----------|
            // New:       |--------------------|
            // Date:     -4         -3         -2         -1          0
            //
            // Should become
            // Owner:          New                   Old
            //            |--------------------||----------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends before existing starts (close)',
            date: existingClaimStart.dayBefore(),
            shouldPass: true,
          },
          {
            // Existing:                        |----------|
            // New:       |---------------------|
            // Date:     -4         -3         -2         -1          0
            //
            // Should become
            // Owner:               New             Old
            //            |---------------------|----------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends on same day as existing starts',
            date: existingClaimStart,
            shouldPass: true,
          },
          {
            // Existing:                        |----------|
            // New:       |--------------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends during existing (close - start',
            date: existingClaimStart.dayAfter(),
            shouldPass: false,
          },
          {
            // Existing:                        |----------|
            // New:       |--------------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends during existing (safe)',
            date: existingClaimStart.monthsAfter(6),
            shouldPass: false,
          },
          {
            // Existing:                        |----------|
            // New:       |--------------------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends on same day as existing ends',
            date: existingClaimEnd,
            shouldPass: false,
          },
          {
            // Existing:                        |----------|
            // New:       |--------------------------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends after existing ends',
            date: existingClaimEnd.monthsAfter(6),
            shouldPass: false,
          },
          {
            // Existing:                        |----------|
            // New:       |------------------------------------------->
            // Date:     -4         -3         -2         -1          0
            name: 'New is open',
            date: null,
            shouldPass: false,
          },
        ],
      }, {
        name: 'New starts before existing (close)',
        date: existingClaimStart.dayBefore(),
        testWithEnds: [
          {
            // Existing:   |----------|
            // New:       ||
            // Date:      -2         -1          0
            //
            // Should become
            // Owner:     New   Old
            //            ||----------|
            // Date:      -2         -1          0
            name: 'New ends on same day as existing starts',
            date: existingClaimStart,
            shouldPass: true,
          },
          {
            // Existing:   |----------|
            // New:       |-|
            // Date:      -2         -1          0
            name: 'New ends during existing (close)',
            date: existingClaimStart.dayAfter(),
            shouldPass: false,
          },
          {
            // Existing:   |----------|
            // New:       |------|
            // Date:      -2         -1          0
            name: 'New ends during existing (safe)',
            date: existingClaimStart.monthsAfter(6),
            shouldPass: false,
          },
          {
            // Existing:   |----------|
            // New:       |-----------|
            // Date:      -2         -1          0
            name: 'New ends on same day as existing ends',
            date: existingClaimEnd,
            shouldPass: false,
          },
          {
            // Existing:   |----------|
            // New:       |----------------|
            // Date:      -2         -1          0
            name: 'New ends after existing ends',
            date: existingClaimEnd.monthsAfter(6),
            shouldPass: false,
          },
          {
            // Existing:   |----------|
            // New:       |---------------------->
            // Date:      -2         -1          0
            name: 'New is open',
            date: null,
            shouldPass: false,
          },
        ],
      },
      {
        name: 'New starts on same day as existing',
        date: existingClaimStart,
        testWithEnds: [
          {
            // Existing:  |----------|
            // New:       |----|
            // Date:     -2         -1          0
            name: 'New ends before existing ends',
            date: existingClaimStart.monthsAfter(6),
            shouldPass: false,
          }, {
            // Existing:  |----------|
            // New:       |----|
            // Date:     -2         -1          0
            name: 'New ends on same day as existing ends',
            date: existingClaimEnd,
            shouldPass: false,
          },
          {
            // Existing:  |----------|
            // New:       |---------------|
            // Date:     -2         -1          0
            name: 'New ends after existing ends',
            date: existingClaimEnd.monthsAfter(6),
            shouldPass: false,
          },
          {
            // Existing:  |----------|
            // New:       |--------------------->
            // Date:     -2         -1          0
            name: 'New is open',
            date: null,
            shouldPass: false,
          },
        ],
      },
      {
        name: 'New starts during existing (close - start)',
        date: existingClaimStart.dayAfter(),
        testWithEnds: [
          {
            // Existing:  |----------|
            // New:        |----|
            // Date:     -2         -1          0
            name: 'New ends before existing ends',
            date: existingClaimEnd.monthsBefore(3),
            shouldPass: false,
          }, {
            // Existing:  |----------|
            // New:        |---------|
            // Date:     -2         -1          0
            name: 'New ends on same day as existing ends',
            date: existingClaimEnd,
            shouldPass: false,
          },
          {
            // Existing:  |----------|
            // New:        |--------------|
            // Date:     -2         -1          0
            name: 'New ends after existing ends',
            date: existingClaimEnd.monthsAfter(6),
            shouldPass: false,
          },
          {
            // Existing:  |----------|
            // New:        |-------------------->
            // Date:     -2         -1          0
            name: 'New is open',
            date: null,
            shouldPass: false,
          },
        ],
      },
      {
        name: 'New starts during existing (safe)',
        date: existingClaimStart.monthsAfter(3),
        testWithEnds: [
          {
            // Existing:  |----------|
            // New:          |----|
            // Date:     -2         -1          0
            name: 'New ends before existing ends',
            date: existingClaimEnd.monthsBefore(3),
            shouldPass: false,
          }, {
            // Existing:  |----------|
            // New:          |-------|
            // Date:     -2         -1          0
            name: 'New ends on same day as existing ends',
            date: existingClaimEnd,
            shouldPass: false,
          },
          {
            // Existing:  |----------|
            // New:          |------------|
            // Date:     -2         -1          0
            name: 'New ends after existing ends',
            date: existingClaimEnd.monthsAfter(6),
            shouldPass: false,
          },
          {
            // Existing:  |----------|
            // New:          |------------------>
            // Date:     -2         -1          0
            name: 'New is open',
            date: null,
            shouldPass: false,
          },
        ],
      },
      {
        name: 'New starts during existing (close - end)',
        date: existingClaimEnd.dayBefore(),
        testWithEnds: [
          {
            // Existing:  |----------|
            // New:          |-------|
            // Date:     -2         -1          0
            name: 'New ends on same day as existing ends',
            date: existingClaimEnd,
            shouldPass: false,
          },
          {
            // Existing:  |----------|
            // New:          |------------|
            // Date:     -2         -1          0
            name: 'New ends after existing ends',
            date: existingClaimEnd.monthsAfter(6),
            shouldPass: false,
          },
          {
            // Existing:  |----------|
            // New:          |------------------>
            // Date:     -2         -1          0
            name: 'New is open',
            date: null,
            shouldPass: false,
          },
        ],
      },
      {
        name: 'New starts on same day as existing ends',
        date: existingClaimEnd,
        testWithEnds: [
          {
            // Existing:  |----------|
            // New:                  |-----|
            // Date:     -2         -1          0
            //
            // Should become
            // Owner:         Old      New
            //            |----------|-----|
            // Date:     -2         -1          0
            name: 'New ends after existing ends',
            date: existingClaimEnd.monthsAfter(6),
            shouldPass: true,
          },
          {
            // Existing:  |----------|
            // New:                  |---------->
            // Date:     -2         -1          0
            //
            // Should become
            // Owner:         Old        New
            //            |----------|---------->
            // Date:     -2         -1          0
            name: 'New is open',
            date: null,
            shouldPass: true,
          },
        ],
      },
      {
        name: 'New starts after existing ends (close)',
        date: existingClaimEnd.dayAfter(),
        testWithEnds: [
          {
            // Existing:  |----------|
            // New:                   |----|
            // Date:     -2         -1          0
            //
            // Should become
            // Owner:         Old        New
            //            |----------||----|
            // Date:     -2         -1          0
            name: 'New is closed',
            date: existingClaimEnd.monthsAfter(6),
            shouldPass: true,
          }, {
            // Existing:  |----------|
            // New:                   |--------->
            // Date:     -2         -1          0
            //
            // Should become
            // Owner:         Old        New
            //            |----------||--------->
            // Date:     -2         -1          0
            name: 'New is open',
            date: null,
            shouldPass: true,
          },
        ],
      },
      {
        name: 'New starts after existing ends (safe)',
        date: existingClaimEnd.monthsAfter(3),
        testWithEnds: [
          {
            // Existing:  |----------|
            // New:                     |---|
            // Date:     -2         -1          0
            //
            // Should become
            // Owner:         Old        New
            //            |----------|  |---|
            // Date:     -2         -1          0
            name: 'New is closed',
            date: existingClaimEnd.monthsAfter(6),
            shouldPass: true,
          }, {
            // Existing:  |----------|
            // New:                     |---|
            // Date:     -2         -1          0
            //
            // Should become
            // Owner:         Old        New
            //            |----------|  |------->
            // Date:     -2         -1          0
            name: 'New is open',
            date: null,
            shouldPass: true,
          },
        ],
      },
    ];

    for (const [startIestIndex, claimStartTest] of newClaimTests.entries()) {
      test.describe(`4.1.${startIestIndex + 1}. ${claimStartTest.name}`, () => {
        const newClaimStart = claimStartTest.date;

        for (const [endTestIndex, claimEndIndex] of claimStartTest.testWithEnds.entries()) {
          test(`4.1.${startIestIndex + 1}.${endTestIndex + 1} ${claimEndIndex.name}`, async ({ page }, testInfo) => {
            const property = properties[testInfo.workerIndex];

            // Fill in form & submit
            await page.locator('input[name="started_at"]').fill(newClaimStart.toISODateString());
            if (claimEndIndex.date) {
              await page.locator('input[name="ended_at"]').fill(claimEndIndex.date.toISODateString());
            } else {
              await page.getByRole('button', { name: 'I still own this property' }).click();
            }
            await page.getByRole('button', { name: 'Claim Property' }).click();

            // Wait for and check the response
            if (claimEndIndex.shouldPass) {
              await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
            } else {
              await expect(page.getByRole('main')).toContainText(/Property Claim Failed|The new claim overlaps with an existing claim/);
            }

            // try and fetch the claim from the database
            const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}&landlord_id=eq.${propertyClaimerUser.id}`, {
              headers: {
                apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
              },
            });
            // Get the ownership record
            await expect(res).toBeOK();
            const ownershipRecords = await res.json();

            // Check that the claim was added to the database if it should have passed
            if (claimEndIndex.shouldPass) {
              // Check the ownership record details match those expected
              await expect(ownershipRecords[0].started_at).toBe(newClaimStart.toISODateString());
              if (claimEndIndex.date) {
                await expect(ownershipRecords[0].ended_at).toBe(claimEndIndex.date.toISODateString());
              } else {
                await expect(ownershipRecords[0].ended_at).toBeNull();
              }
              // Check that the claim was not added to the database if it should have failed
            } else await expect(ownershipRecords.length).toBeFalsy();
          });
        }
      });
    }
  });

  const openClaimTests: {
    label: string;
    tag: string
    user: {
      file: string;
      email: string;
      password: string;
      id: string;
      label: string;
    };
    existingClaimStart: TransformableDate;
    newClaimStartTests: {
      label: string;
      newClaimStartDate: TransformableDate;
      newClaimEndTests: {
        label: string;
        newClaimEndDate: TransformableDate | null;
        shouldPass: boolean;
        shouldCloseExisting: boolean;
        expectedMessages: RegExp;
      }[];
    }[];
  }[] = [
    {
      label: 'different owner',
      tag: 'A',
      user: existingOwnerUser,
      existingClaimStart: today.yearsBefore(2),
      newClaimStartTests: [
        {
          label: 'new starts before existing',
          newClaimStartDate: today.yearsBefore(4),
          newClaimEndTests: [
            {
              // Existing:                        |--------------------->
              // New:       |----------|
              // Date:     -4         -3         -2         -1          0
              //
              // Should become:
              // Owner:         New                         Old
              //            |----------|          |--------------------->
              // Date:     -4         -3         -2         -1          0
              label: 'new ends before existing starts',
              newClaimEndDate: today.yearsBefore(3),
              shouldPass: true,
              shouldCloseExisting: false,
              expectedMessages: /Property Claimed Successfully/,
            },
            {
              // Existing:                        |--------------------->
              // New:       |---------------------|
              // Date:     -4         -3         -2         -1          0
              //
              // Should become:
              // Owner:               New                   Old
              //            |---------------------|--------------------->
              // Date:     -4         -3         -2         -1          0
              label: 'new ends on same day as existing starts',
              newClaimEndDate: today.yearsBefore(2),
              shouldPass: true,
              shouldCloseExisting: false,
              expectedMessages: /Property Claimed Successfully/,
            },
            {
              // Existing:                        |--------------------->
              // New:       |--------------------------------|
              // Date:     -4         -3         -2         -1          0
              label: 'new ends after existing',
              newClaimEndDate: today.yearsBefore(1),
              shouldPass: false,
              shouldCloseExisting: false,
              expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
            },
            {
              // Existing:                        |--------------------->
              // New:       |------------------------------------------->
              // Date:     -4         -3         -2         -1          0
              label: 'new is open',
              newClaimEndDate: null,
              shouldPass: false,
              shouldCloseExisting: false,
              expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
            },
          ],
        },
        {
          label: 'new starts on same day as existing',
          newClaimStartDate: today.yearsBefore(2),
          newClaimEndTests: [
            {
              // Existing:  |--------------------->
              // New:       |----------|
              // Date:     -2         -1          0
              label: 'new is closed',
              newClaimEndDate: today.yearsBefore(1),
              shouldPass: false,
              shouldCloseExisting: false,
              expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
            },
            {
              // Existing:  |--------------------->
              // New:       |--------------------->
              // Date:     -2         -1          0
              label: 'new is open',
              newClaimEndDate: null,
              shouldPass: false,
              shouldCloseExisting: false,
              expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
            },
          ],
        },
        {
          label: 'new starts after existing',
          newClaimStartDate: today.yearsBefore(1),
          newClaimEndTests: [
            {
              // Existing:  |--------------------->
              // New:                  |-----|
              // Date:     -2         -1          0
              //
              // Should become:
              // Owner:         Old      New
              //            |----------|-----|
              // Date:     -2         -1          0

              label: 'new is closed',
              newClaimEndDate: today.monthsBefore(6),
              shouldPass: true,
              shouldCloseExisting: true,
              expectedMessages: /Property Claimed Successfully/,
            },
            {
              // Existing:  |--------------------->
              // New:                  |---------->
              // Date:     -2         -1          0
              //
              // Should become:
              // Owner:         Old      New
              //            |----------|---------->
              // Date:     -2         -1          0
              label: 'new is open',
              newClaimEndDate: null,
              shouldPass: true,
              shouldCloseExisting: true,
              expectedMessages: /Property Claimed Successfully/,
            },
          ],
        },
      ],
    },
    {
      label: 'same owner',
      user: propertyClaimerUser,
      tag: 'B',
      existingClaimStart: today.yearsBefore(2),
      newClaimStartTests: [
        {
          label: 'new starts before existing',
          newClaimStartDate: today.yearsBefore(4),
          newClaimEndTests: [
            {
              // Existing:                        |--------------------->
              // New:       |----------|
              // Date:     -4         -3         -2         -1          0
              //
              // Should become:
              // Owner:         New        None             New
              //            |----------|          |--------------------->
              // Date:     -4         -3         -2         -1          0
              label: 'new ends before existing starts',
              newClaimEndDate: today.yearsBefore(3),
              shouldPass: true,
              shouldCloseExisting: false,
              expectedMessages: /Property Claimed Successfully/,
            },
            {
              // Existing:                        |--------------------->
              // New:       |---------------------|
              // Date:     -4         -3         -2         -1          0
              label: 'new ends on same day as existing starts',
              newClaimEndDate: today.yearsBefore(2),
              shouldPass: false,
              shouldCloseExisting: false,
              expectedMessages: /These dates overlap one of your own claims\. Please edit your existing claim if the dates are incorrect|new claim overlaps with an existing claim|User is already the landlord of this property/,
            },
            {
              // Existing:                        |--------------------->
              // New:       |--------------------------------|
              // Date:     -4         -3         -2         -1          0
              label: 'new ends after existing',
              newClaimEndDate: today.yearsBefore(1),
              shouldPass: false,
              shouldCloseExisting: false,
              expectedMessages: /These dates overlap one of your own claims\. Please edit your existing claim if the dates are incorrect|new claim overlaps with an existing claim|User is already the landlord of this property/,
            },
            {
              // Existing:                        |--------------------->
              // New:       |------------------------------------------->
              // Date:     -4         -3         -2         -1          0
              label: 'new is open',
              newClaimEndDate: null,
              shouldPass: false,
              shouldCloseExisting: false,
              expectedMessages: /These dates overlap one of your own claims\. Please edit your existing claim if the dates are incorrect|new claim overlaps with an existing claim|User is already the landlord of this property/,
            },
          ],
        },
        {
          label: 'new starts on same day as existing',
          newClaimStartDate: today.yearsBefore(2),
          newClaimEndTests: [
            {
              // Existing:  |--------------------->
              // New:       |----------|
              // Date:     -2         -1          0
              label: 'new is closed',
              newClaimEndDate: today.yearsBefore(1),
              shouldPass: false,
              shouldCloseExisting: false,
              expectedMessages: /These dates overlap one of your own claims\. Please edit your existing claim if the dates are incorrect|new claim overlaps with an existing claim|User is already the landlord of this property/,
            },
            {
              // Existing:  |--------------------->
              // New:       |--------------------->
              // Date:     -2         -1          0
              label: 'new is open',
              newClaimEndDate: null,
              shouldPass: false,
              shouldCloseExisting: false,
              expectedMessages: /You have already told us you own this property|new claim overlaps with an existing claim|User is already the landlord of this property/,
            },
          ],
        },
        {
          label: 'new starts after existing',
          newClaimStartDate: today.yearsBefore(1),
          newClaimEndTests: [
            {
              // Existing:  |--------------------->
              // New:                  |-----|
              // Date:     -2         -1          0
              label: 'new is closed',
              newClaimEndDate: today.monthsBefore(6),
              shouldPass: false,
              shouldCloseExisting: false,
              expectedMessages: /These dates overlap one of your own claims\. Please edit your existing claim if the dates are incorrect|new claim overlaps with an existing claim|User is already the landlord of this property/,
            },
            {
              // Existing:  |--------------------->
              // New:                  |---------->
              // Date:     -2         -1          0
              label: 'new is open',
              newClaimEndDate: null,
              shouldPass: false,
              shouldCloseExisting: false,
              expectedMessages: /You have already told us you own this property\. Please edit your existing claim if the dates are incorrect|new claim overlaps with an existing claim|User is already the landlord of this property/,
            },
          ],
        },
      ],
    },
  ];

  for (const claim of openClaimTests) {
    test.describe(`4.2${claim.tag}. Single Open Claim (${claim.label})`, () => {
      // Create the exising claim for each test
      test.beforeEach(async ({ page }, testInfo) => {
        const property = properties[testInfo.workerIndex];

        // Create the existing ownership record
        const res = await page.request.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*`, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          data: {
            property_id: property.id,
            landlord_id: claim.user.id,
            started_at: claim.existingClaimStart.toISODateString(),
          },
        });

        await expect(res).toBeOK();
      });

      for (const [startIndex, startDateTest] of claim.newClaimStartTests.entries()) {
        test.describe(`4.2${claim.tag}.${startIndex + 1}. ${startDateTest.label}`, () => {
          for (const [endIndex, endDateTest] of startDateTest.newClaimEndTests.entries()) {
            test(`4.2${claim.tag}.${startIndex + 1}.${endIndex + 1}. ${endDateTest.label}`, async ({ page }, testInfo) => {
              const property = properties[testInfo.workerIndex];

              // Fill in form & submit
              await page.locator('input[name="started_at"]').fill(startDateTest.newClaimStartDate.toISODateString());
              if (endDateTest.newClaimEndDate) {
                await page.locator('input[name="ended_at"]').fill(endDateTest.newClaimEndDate.toISODateString());
              } else {
                await page.getByRole('button', { name: 'I still own this property' }).click();
              }
              await page.getByRole('button', { name: 'Claim Property' }).click();

              // Wait for and check the response
              if (endDateTest.shouldPass) {
                await expect(page.getByRole('main')).toContainText('Property Claimed Successfully');
              } else {
                await expect(page.getByRole('main')).toContainText(/Property Claim Failed|The new claim overlaps with an existing claim/);
              }

              // try and fetch the claim from the database
              const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}&landlord_id=eq.${propertyClaimerUser.id}`, {
                headers: {
                  apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
                },
              });
              // Get the ownership record
              await expect(res).toBeOK();
              const ownershipRecords = await res.json();

              // Check that the claim was added to the database if it should have passed
              if (endDateTest.shouldPass) {
                // Check the ownership record details match those expected
                await expect(ownershipRecords[0].started_at).toBe(startDateTest.newClaimStartDate.toISODateString());
                if (endDateTest.newClaimEndDate) {
                  await expect(ownershipRecords[0].ended_at).toBe(endDateTest.newClaimEndDate.toISODateString());
                } else {
                  await expect(ownershipRecords[0].ended_at).toBeNull();
                }
                // Check that the claim was not added to the database if it should have failed
              } else await expect(ownershipRecords.length).toBeFalsy();

              // Check that the existing claim was closed if it should have been
              const existingRes = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}&landlord_id=eq.${claim.user.id}`, {
                headers: {
                  apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
                },
              });
              await expect(existingRes).toBeOK();
              const existingOwnershipRecord: {
                started_at: string;
                ended_at: string | null;
              } = (await existingRes.json())[0];
              await expect(existingOwnershipRecord).toBeDefined();

              if (endDateTest.shouldCloseExisting) {
                // Check the ownership record details match those expected
                await expect(existingOwnershipRecord.ended_at).toBe(startDateTest.newClaimStartDate.toISODateString());
              } else {
                await expect(existingOwnershipRecord.ended_at).toBeNull();
              }
            });
          }
        });
      }
    });
  }

  test.describe('4.3. Two Closed Claims', () => {
    // Setup the potentially colliding claims before each test
    //                       |----------|          |----------|
    // Date:     -5         -4         -3         -2         -1          0

    const existingClaim1Start = today.yearsBefore(4);
    const existingClaim1End = today.yearsBefore(3);
    const existingClaim2Start = today.yearsBefore(2);
    const existingClaim2End = today.yearsBefore(1);

    test.beforeEach(async ({ page }, testInfo) => {
      const property = properties[testInfo.workerIndex];

      // Create the first ownership record
      const res1 = await page.request.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        data: {
          property_id: property.id,
          landlord_id: existingOwnerUser.id,
          started_at: existingClaim1Start.toISODateString(),
          ended_at: existingClaim1End.toISODateString(),
        },
      });
      await expect(res1).toBeOK();

      // Create the second ownership record
      const res2 = await page.request.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        data: {
          property_id: property.id,
          landlord_id: existingOwnerUser.id,
          started_at: existingClaim2Start.toISODateString(),
          ended_at: existingClaim2End.toISODateString(),
        },
      });
      await expect(res2).toBeOK();
    });

    const newClaimTests: {
      name: string;
      newClaimStartDate: TransformableDate;
      new_end_tests: {
        name: string;
        newClaimEndDate: TransformableDate | null;
        shouldPass: boolean;
        expectedMessages: RegExp;
      }[];
    }[] = [
      {
        name: 'New starts before both existing',
        newClaimStartDate: existingClaim1Start.yearBefore(),
        new_end_tests: [
          {
            // Existing:             |----------|          |----------|
            // New:       |-----|
            // Date:     -5         -4         -3         -2         -1          0
            //
            // Should become:
            // Owner:       New          Old                   Old
            //            |-----|    |----------|          |----------|
            // Date:     -5         -4         -3         -2         -1          0
            name: 'New ends before both existing',
            newClaimEndDate: existingClaim1Start.monthsBefore(6),
            shouldPass: true,
            expectedMessages: /Property Claimed Successfully/,
          },
          {
            // Existing:             |----------|          |----------|
            // New:       |----------|
            // Date:     -5         -4         -3         -2         -1          0
            //
            // Should become:
            // Owner:       New          Old                   Old
            //            |----------|----------|          |----------|
            // Date:     -5         -4         -3         -2         -1          0
            name: 'New ends on same day as first existing starts',
            newClaimEndDate: existingClaim1Start,
            shouldPass: true,
            expectedMessages: /Property Claimed Successfully/,
          },
          {
            // Existing:             |----------|          |----------|
            // New:       |---------------|
            // Date:     -5         -4         -3         -2         -1          0
            name: 'New ends during first existing',
            newClaimEndDate: existingClaim1Start.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:             |----------|          |----------|
            // New:       |---------------------|
            // Date:     -5         -4         -3         -2         -1          0
            name: 'New ends on same day as first existing ends',
            newClaimEndDate: existingClaim1End,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:             |----------|          |----------|
            // New:       |---------------------------|
            // Date:     -5         -4         -3         -2         -1          0
            name: 'New ends between existing',
            newClaimEndDate: existingClaim1End.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:             |----------|          |----------|
            // New:       |--------------------------------|
            // Date:     -5         -4         -3         -2         -1          0
            name: 'New ends on same day as second existing starts',
            newClaimEndDate: existingClaim2Start,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:             |----------|          |----------|
            // New:       |--------------------------------------|
            // Date:     -5         -4         -3         -2         -1          0
            name: 'New ends during second existing',
            newClaimEndDate: existingClaim2Start.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:             |----------|          |----------|
            // New:       |-------------------------------------------|
            // Date:     -5         -4         -3         -2         -1          0
            name: 'New ends on same day as second existing ends',
            newClaimEndDate: existingClaim2End,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:             |----------|          |----------|
            // New:       |-------------------------------------------------|
            // Date:     -5         -4         -3         -2         -1          0
            name: 'New ends after both existing',
            newClaimEndDate: existingClaim2End.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:             |----------|          |----------|
            // New:       |------------------------------------------------------>
            // Date:     -5         -4         -3         -2         -1          0
            name: 'New is open',
            newClaimEndDate: null,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
        ],
      }, {
        name: 'New starts on same day as first existing',
        newClaimStartDate: existingClaim1Start,
        new_end_tests: [
          {
            // Existing:  |----------|          |----------|
            // New:       |----|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends during first existing',
            newClaimEndDate: existingClaim1Start.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:       |----------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends on same day as first existing ends',
            newClaimEndDate: existingClaim1End,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:       |---------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends between existing',
            newClaimEndDate: existingClaim1End.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:       |---------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends on same day as second existing starts',
            newClaimEndDate: existingClaim2Start,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:       |---------------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends during second existing',
            newClaimEndDate: existingClaim2Start.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:       |--------------------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends on same day as second existing ends',
            newClaimEndDate: existingClaim2End,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:       |--------------------------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends after both existing',
            newClaimEndDate: existingClaim2End.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {

            // Existing:  |----------|          |----------|
            // New:       |------------------------------------------->
            // Date:     -4         -3         -2         -1          0
            name: 'New is open',
            newClaimEndDate: null,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
        ],
      }, {
        name: 'New starts during first existing',
        newClaimStartDate: existingClaim1Start.monthsAfter(3),
        new_end_tests: [
          {
            // Existing:  |----------|          |----------|
            // New:          |----|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends during first existing',
            newClaimEndDate: existingClaim1End.monthsBefore(3),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:          |-------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends on same day as first existing ends',
            newClaimEndDate: existingClaim1End,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:          |-------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends between existing',
            newClaimEndDate: existingClaim1End.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:          |------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends on same day as second existing starts',
            newClaimEndDate: existingClaim2Start,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:          |------------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends during second existing',
            newClaimEndDate: existingClaim2Start.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,

          },
          {
            // Existing:  |----------|          |----------|
            // New:          |-----------------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends on same day as second existing ends',
            newClaimEndDate: existingClaim2End,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:          |-----------------------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends after both existing',
            newClaimEndDate: existingClaim2End.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:          |---------------------------------------->
            // Date:     -4         -3         -2         -1          0
            name: 'New is open',
            newClaimEndDate: null,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
        ],
      }, {
        name: 'New starts on same day as first existing ends',
        newClaimStartDate: existingClaim1End,
        new_end_tests: [
          {
            // Existing:  |----------|          |----------|
            // New:                  |-----|
            // Date:     -4         -3         -2         -1          0
            //
            // Should become:
            // Owner:         Old      New          Old
            //            |----------|-----|    |----------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends between existing',
            newClaimEndDate: existingClaim1End.monthsAfter(6),
            shouldPass: true,
            expectedMessages: /Property Claimed Successfully/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                  |----------|
            // Date:     -4         -3         -2         -1          0
            //
            // Should become:
            // Owner:         Old         New       Old
            //            |----------|----------|----------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends on same day as second existing starts',
            newClaimEndDate: existingClaim2Start,
            shouldPass: true,
            expectedMessages: /Property Claimed Successfully/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                  |----------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends during second existing',
            newClaimEndDate: existingClaim2Start.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                  |---------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends on same day as second existing ends',
            newClaimEndDate: existingClaim2End,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                  |--------------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends after both existing',
            newClaimEndDate: existingClaim2End.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                  |-------------------------------->
            // Date:     -4         -3         -2         -1          0
            name: 'New is open',
            newClaimEndDate: null,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
        ],
      }, {
        name: 'New starts between existing',
        newClaimStartDate: existingClaim1End.monthsAfter(3),
        new_end_tests: [
          {
            // Existing:  |----------|          |----------|
            // New:                     |-----|
            // Date:     -4         -3         -2         -1          0
            //
            // Should become:
            // Owner:         Old         New       Old
            //            |----------|  |-----| |----------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends between existing',
            newClaimEndDate: existingClaim2Start.monthsBefore(3),
            shouldPass: true,
            expectedMessages: /Property Claimed Successfully/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                     |-------|
            // Date:     -4         -3         -2         -1          0
            //
            // Should become:
            // Owner:         Old          New      Old
            //            |----------|  |-------|----------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends on same day as second existing starts',
            newClaimEndDate: existingClaim2Start,
            shouldPass: true,
            expectedMessages: /Property Claimed Successfully/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                     |------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends during second existing',
            newClaimEndDate: existingClaim2Start.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                     |------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends on same day as second existing ends',
            newClaimEndDate: existingClaim2End,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                     |------------------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends after both existing',
            newClaimEndDate: existingClaim2End.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                     |----------------------------->
            // Date:     -4         -3         -2         -1          0
            name: 'New is open',
            newClaimEndDate: null,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
        ],
      }, {
        name: 'New starts on same day as second existing starts',
        newClaimStartDate: existingClaim2Start,
        new_end_tests: [
          {
            // Existing:  |----------|          |----------|
            // New:                             |-----|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends during second existing',
            newClaimEndDate: existingClaim2Start.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                             |----------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends on same day as second existing ends',
            newClaimEndDate: existingClaim2End,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                             |----------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends after both existing',
            newClaimEndDate: existingClaim2End.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                             |--------------------->
            // Date:     -4         -3         -2         -1          0
            name: 'New is open',
            newClaimEndDate: null,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
        ],
      }, {
        name: 'New starts during second existing',
        newClaimStartDate: existingClaim2Start.monthsAfter(3),
        new_end_tests: [
          {
            // Existing:  |----------|          |----------|
            // New:                                |----|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends during second existing',
            newClaimEndDate: existingClaim2End.monthsBefore(3),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                                |-------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends on same day as second existing ends',
            newClaimEndDate: existingClaim2End,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                                |-------------|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends after both existing',
            newClaimEndDate: existingClaim2End.monthsAfter(6),
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                                |------------------>
            // Date:     -4         -3         -2         -1          0
            name: 'New is open',
            newClaimEndDate: null,
            shouldPass: false,
            expectedMessages: /These dates overlap someone elses claim\. Please contact support if you believe this is a mistake|new claim overlaps with an existing claim/,
          },
        ],
      }, {
        name: 'New starts on same day as second existing ends',
        newClaimStartDate: existingClaim2End,
        new_end_tests: [
          {
            // Existing:  |----------|          |----------|
            // New:                                        |----|
            // Date:     -4         -3         -2         -1          0
            //
            // Should become:
            // Owner:         Old                    Old    New
            //            |----------|          |----------|----|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends after both existing',
            newClaimEndDate: existingClaim2End.monthsAfter(6),
            shouldPass: true,
            expectedMessages: /Property Claimed Successfully/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                                        |---------->
            // Date:     -4         -3         -2         -1          0
            //
            // Should become:
            // Owner:         Old                    Old        New
            //            |----------|          |----------|---------->
            // Date:     -4         -3         -2         -1          0
            name: 'New is open',
            newClaimEndDate: null,
            shouldPass: true,
            expectedMessages: /Property Claimed Successfully/,
          },
        ],
      }, {
        name: 'New starts after both existing',
        newClaimStartDate: existingClaim2End.monthsAfter(3),
        new_end_tests: [
          {
            // Existing:  |----------|          |----------|
            // New:                                            |---|
            // Date:     -4         -3         -2         -1          0
            //
            // Should become:
            // Owner:         Old                    Old        New
            //            |----------|          |----------|   |---|
            // Date:     -4         -3         -2         -1          0
            name: 'New ends after both existing',
            newClaimEndDate: existingClaim2End.monthsAfter(9),
            shouldPass: true,
            expectedMessages: /Property Claimed Successfully/,
          },
          {
            // Existing:  |----------|          |----------|
            // New:                                            |------>
            // Date:     -4         -3         -2         -1          0
            //
            // Should become:
            // Owner:         Old                    Old          New
            //            |----------|          |----------|    |----->
            // Date:     -4         -3         -2         -1          0
            name: 'New is open',
            newClaimEndDate: null,
            shouldPass: true,
            expectedMessages: /Property Claimed Successfully/,
          },
        ],
      },
    ];

    for (const [startIndex, startTest] of newClaimTests.entries()) {
      test.describe(`4.3.${startIndex + 1}. ${startTest.name}`, () => {
        const { newClaimStartDate } = startTest;

        for (const [endIndex, endTestDate] of startTest.new_end_tests.entries()) {
          test(`4.3.${startIndex + 1}.${endIndex + 1}. ${endTestDate.name}`, async ({ page }, testInfo) => {
            const property = properties[testInfo.workerIndex];
            const { newClaimEndDate } = endTestDate;

            // Fill in form & submit
            await page.locator('input[name="started_at"]').fill(newClaimStartDate.toISODateString());
            if (newClaimEndDate) {
              await page.locator('input[name="ended_at"]').fill(newClaimEndDate.toISODateString());
            } else {
              await page.getByRole('button', { name: 'I still own this property' }).click();
            }
            await page.getByRole('button', { name: 'Claim Property' }).click();

            // Wait for and check the response
            await expect(page.getByRole('main')).toContainText(endTestDate.expectedMessages);

            // try and fetch the claim from the database
            const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/property_ownership?select=*&property_id=eq.${property.id}&landlord_id=eq.${propertyClaimerUser.id}`, {
              headers: {
                apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
              },
            });
            // Get the ownership record
            await expect(res).toBeOK();
            const ownershipRecords = await res.json();

            // Check that the claim was added to the database if it should have passed
            if (endTestDate.shouldPass) {
              // Check the ownership record details match those expected
              await expect(ownershipRecords[0].started_at).toBe(newClaimStartDate.toISODateString());
              if (newClaimEndDate) {
                await expect(ownershipRecords[0].ended_at).toBe(newClaimEndDate.toISODateString());
              } else {
                await expect(ownershipRecords[0].ended_at).toBeNull();
              }
              // Check that the claim was not added to the database if it should have failed
            } else await expect(ownershipRecords.length).toBeFalsy();
          });
        }
      });
    }
  });
});
