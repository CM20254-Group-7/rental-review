import { test, expect } from '@playwright/test';
import { users } from './helpers';

const properties: {
  [key: number]: {
    id: string,
    address: string
  }
} = {};

test.beforeEach(async ({ page }, testInfo) => {
  // if test name includes <Existing Property>, create a property to review
  if (testInfo.title.includes('Existing Property')) {
    const house = `${testInfo.workerIndex}`;
    const street = 'Property Claiming Road';
    const county = `${testInfo.project.name} City`;
    const address = `${house}, ${street}, ${county}`;

    const res = await page.request.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/properties?select=*`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      data: {
        house: `${testInfo.workerIndex}`,
        street: 'Property Claiming Road',
        county: `${testInfo.project.name} City`,
        postcode: 'PC1 1CR',
      },
    });

    await expect(res).toBeOK();
    const newProperty = (await res.json())[0];

    await expect(newProperty.house).toBe(house);
    await expect(newProperty.street).toBe(street);
    await expect(newProperty.county).toBe(county);

    properties[testInfo.workerIndex] = {
      ...newProperty,
      address,
    };

    // if test name includes <Existing Review>, create a review for the property as user 4
    if (testInfo.title.includes('Existing Review')) {
      // create a reviewer profile
      const res3 = await page.request.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/reviewer_private_profiles?select=*`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        data: {
          user_id: users[3].id,
          property_id: properties[testInfo.workerIndex].id,
        },
      });

      const reviewerId = (await res3.json())[0]?.reviewer_id;

      // create a review
      const res2 = await page.request.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/reviews?select=*`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        data: {
          property_id: properties[testInfo.workerIndex].id,
          reviewer_id: reviewerId,
          review_date: '2021-01-01',
          review_body: 'test review',
          property_rating: 5,
          landlord_rating: 5,
        },
      });

      await expect(res2).toBeOK();
    }
  }
});

test.afterEach(async ({ page }, testInfo) => {
  // if property was created, delete it
  // beforeEach creation
  if (properties[testInfo.workerIndex]) {
    const property = properties[testInfo.workerIndex];

    const res = await page.request.delete(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/properties?id=eq.${property.id}`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
        Prefer: 'return=minimal',
      },
    });

    await expect(res).toBeOK();
  // otherwise check the database for the property and delete it if found
  } else {
    const res = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/properties?select=id&house=eq.${testInfo.workerIndex}&street=eq.${'Property Claiming Road'}`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
      },
    });

    const id = (await res.json())[0]?.id;

    if (id) {
      const res2 = await page.request.delete(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/properties?id=eq.${id}`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
          Prefer: 'return=minimal',
        },
      });

      await expect(res2).toBeOK();
    }
  }
});

test.describe('Anon User Cannot Review', () => {
  test('Anon cannot create review.', async ({ page }) => {
    // goes to the create review page
    await page.goto('./reviews/create/');

    // checks Anon receives relevant message
    await expect(page.locator('main')).toContainText('You must be logged in to access this page.');
  });
});

test.describe('User 1 tests', () => {
  test.use({ storageState: users[0].file });
  const dateTime = new Date();
  const formattedDate = dateTime.toISOString().split('T')[0];

  // test review form for new properties
  test('reviewing new property', async ({ page }, testInfo) => {
    // do full workflow to get to new property review page
    // goes to the create review page
    await page.goto('./reviews/create/');

    // fills in mandatory property details
    await page.getByLabel('House').fill(`${testInfo.workerIndex}`);
    await page.getByLabel('Street').fill('Property Claiming Road');
    await page.getByLabel('Postcode').fill('PC1 1CR');

    // fills in date
    await page.getByLabel('Review Date').fill(formattedDate);
    // fills in review contents
    await page.getByLabel('Review Body').fill('test review');
    // gives review to proeperty and landlord
    await page.getByLabel('Property Rating').fill('5');
    await page.getByLabel('Landlord Rating').fill('5');

    // clicks "Create Review" button
    await page.getByRole('button', { name: 'Create Review' }).click();

    // checks for review created message
    await expect(page.locator('form')).toContainText('Review Created');
  });

  // test existing property review form, using 1 Test Road
  test('reviewing an existing property <Existing Property> <Existing Review>', async ({ page }, testInfo) => {
    const property = properties[testInfo.workerIndex];
    // do full workflow to get to existing property review page
    // goes to the create review page
    await page.goto(`/properties/${property.id}/review`);

    // fills in date
    await page.getByLabel('Review Date').fill(formattedDate);
    // fills in review contents
    await page.getByLabel('Review Body').fill('test review');
    // gives review to proeperty and landlord
    await page.getByLabel('Property Rating').fill('5');
    await page.getByLabel('Landlord Rating').fill('5');

    // clicks "Create Review" button
    await page.getByRole('button', { name: 'Create Review' }).click();

    // checks for review created message
    await expect(page.locator('form')).toContainText('Review Created');
  });

  // test for preventing writing a new review for an existing property
  test('reviewing prevent creating a new property for existing property <Existing Property>', async ({ page }) => {
    // Goes to review form for new properties
    await page.goto('./reviews/create/');

    // fills in mandatory property details with details of an existing property
    await page.getByLabel('House').fill('1');
    await page.getByLabel('Street').fill('Test Road');
    await page.getByLabel('Postcode').fill('AB1 234');

    // fills in review details
    // fills in date
    await page.getByLabel('Review Date').fill(formattedDate);
    // fills in review contents
    await page.getByLabel('Review Body').fill('test review');
    // gives review to proeperty and landlord
    await page.getByLabel('Property Rating').fill('5');
    await page.getByLabel('Landlord Rating').fill('5');

    // clicks "Create Review" button
    await page.getByRole('button', { name: 'Create Review' }).click();

    // checks for existing property message
    await expect(page.locator('form')).toContainText('Property Already Exists');
  });
});

test.describe('User 4 tests', () => {
  test.use({ storageState: users[3].file });
  const dateTime = new Date();
  const formattedDate = dateTime.toISOString().split('T')[0];

  test('reviewing a property already reviewed by user <Existing Property>', async ({ page }) => {
    // Goes to the review form of a property user 4 has already reviewed
    await page.goto('/properties/1ececec8-4bbf-445f-8de0-f563caf0bf01/review');

    // fills in date
    await page.getByLabel('Review Date').fill(formattedDate);

    // fills in review contents
    await page.getByLabel('Review Body').fill('test review');

    // gives review to proeperty and landlord
    await page.getByLabel('Property Rating').fill('5');
    await page.getByLabel('Landlord Rating').fill('5');

    // clicks "Create Review" button
    await page.getByRole('button', { name: 'Create Review' }).click();

    // checks for existing user review message
    await expect(page.locator('form')).toContainText('User has already reviewed this property');
  });
});
