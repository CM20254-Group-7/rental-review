import { test, expect, APIRequestContext } from '@playwright/test';

test.describe('Anon User Tests', () => {
  test('Anon user state reflected', async ({ page }) => {
    await page.goto('./');

    // Expect the body to contain the login button.
    await expect(page.getByRole('navigation')).toContainText('Login');
  });
});

test.describe('User 1 tests', () => {
  test.use({ storageState: 'playwright/.auth/user1.json' });

  test('logged in user state reflected', async ({ page }) => {
    await page.goto('./');

    // Expect the navbar to contain the user's email
    await expect(page.getByRole('navigation')).toContainText('user.1@example.com');

    // Expect the body to contain the logout button.
    await expect(page.getByRole('navigation')).toContainText('Logout');
  });
});

test.describe('User 2 tests', () => {
  test.use({ storageState: 'playwright/.auth/user2.json' });

  test('logged in user state reflected', async ({ page }) => {
    await page.goto('./');

    // Expect the navbar to contain the user's email
    await expect(page.getByRole('navigation')).toContainText('user.2@example.com');

    // Expect the body to contain the logout button.
    await expect(page.getByRole('navigation')).toContainText('Logout');
  });
});
