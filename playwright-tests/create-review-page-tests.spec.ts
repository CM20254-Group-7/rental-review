import { test, expect } from '@playwright/test';
import { users } from './helpers';

// Some example data for testing review creation
const houses = ['test house 4', 'test house 5', 'test house 6', 'test house 7', 'test house 8'];
const streets = ['test street 4', 'test street 5', 'test street 6', 'test street 7', 'test street 8'];
const postcodes = ['ABC 123', 'DEF 456', 'GHI 789', 'JKL 012', 'MNO 345', 'PQR 678', 'STU 901', 'VWX 234', 'YZA 567'];

// Function to select a random element from an array
function getRandomElement(array: string | any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

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
  test('reviewing new property', async ({ page }) => {
    // do full workflow to get to new property review page
    // goes to the create review page
    await page.goto('./reviews/create/');

    // fills in mandatory property details
    await page.getByLabel('House').fill(getRandomElement(houses));
    await page.getByLabel('Street').fill(getRandomElement(streets));
    await page.getByLabel('Postcode').fill(getRandomElement(postcodes));

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
  test('reviewing an existing property', async ({ page }) => {
    // do full workflow to get to existing property review page
    // goes to the create review page
    await page.goto('/properties/1ececec8-4bbf-445f-8de0-f563caf0bf01/existing-property-review');

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
  test('reviewing prevent creating a new property for existing property', async ({ page }) => {
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

  test('reviewing a property already reviewed by user', async ({ page }) => {
    // Goes to the review form of a property user 4 has already reviewed
    await page.goto('/properties/1ececec8-4bbf-445f-8de0-f563caf0bf01/existing-property-review');

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
