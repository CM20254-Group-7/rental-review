import { test, expect } from '@playwright/test';
import { users } from './helpers';

// tests will need to be edited to simply check that Anon cannot review.
test.describe('Anon User Tests', () => {
  test('Anon cannot create review.', async ({ page }) => {
    test.fixme();

    // clicks "Create Review" button
    /* TODO: maybe remove this line depending on how createReviewPage()
    works w/ not being logged in */
    await page.getByRole('button', { name: 'Create Review' }).click();

    // checks Anon receives relevant message
    await expect(page.locator('form')).toContainText('User Not Logged In')
  })
})

// TODO: fill in params for createReviewPage() once it has been implemented
test.describe('User 1 tests', () => {
  test.use({ storageState: users[0].file });
  const dateTime = new Date();

  test('reviewing without selecting a property', async ({ page }) => {
    test.fixme();

    await page.goto('./reviews/create/')

    // fills in date
    await page.getByLabel('Review Date').fill(`${dateTime.getDate()}`);

    // fills in review contents
    await page.getByLabel('Review Body').fill('test review');

    // gives review to proeperty and landlord
    await page.getByLabel('Property Rating').fill('5');
    await page.getByLabel('Landlord Rating').fill('5');

    // clicks "Create Review" button
    await page.getByRole('button', { name: 'Create Review' }).click();

    // checks for no property selected message
    await expect(page.locator('form')).toContainText('No Property Selected');
    })

    // This is not implemented yet, so not tested
    test('reviewing new property as User 1', async ({ page }) => {
      // TODO: do full workflow to get to new property review page
      test.fixme();

      // fills in date
      await page.getByLabel('Review Date').fill(`${dateTime.getDate()}`);

      // fills in review contents
      await page.getByLabel('Review Body').fill('test review');

      // gives review to proeperty and landlord
      await page.getByLabel('Property Rating').fill('5');
      await page.getByLabel('Landlord Rating').fill('5');

      // clicks "Create Review" button
      await page.getByRole('button', { name: 'Create Review' }).click();

      // checks for review created message
      await expect(page.locator('form')).toContainText('Review Created');
    })

    // reviews page not implemented, so .../create/... returns 404 error
    test('reviewing existing property as User 1', async ({ page }) => {
      test.fixme();

      // Goes to the createReview page of a pre-existing property
      await page.goto('./reviews/create/1ececec8-4bbf-445f-8de0-f563caf0bf01')

      // fills in date
      await page.getByLabel('Review Date').fill(`${dateTime.getDate()}`);

      // fills in review contents
      await page.getByLabel('Review Body').fill('test review');

      // gives review to proeperty and landlord
      await page.getByLabel('Property Rating').fill('5');
      await page.getByLabel('Landlord Rating').fill('5');

      // clicks "Create Review" button
      await page.getByRole('button', { name: 'Create Review' }).click();

      // checks for existing property message
      await expect(page.locator('form')).toContainText('Property Already Exists');
    })

  test('reviewing property already reviewd by User 1 as User 1', async ({ page }) => {
    test.fixme();

    // TODO: change propertyId to one that User 1 made
    await page.goto('./reviews/create/1ececec8-4bbf-445f-8de0-f563caf0bf01')

    // fills in date
    await page.getByLabel('Review Date').fill(`${dateTime.getDate()}`);

    // fills in review contents
    await page.getByLabel('Review Body').fill('test review');

    // gives review to proeperty and landlord
    await page.getByLabel('Property Rating').fill('5');
    await page.getByLabel('Landlord Rating').fill('5');

    // clicks "Create Review" button
    await page.getByRole('button', { name: 'Create Review' }).click();

    // checks for existing user review message
    await expect(page.locator('form')).toContainText('User has already reviewed this property');
  })
})