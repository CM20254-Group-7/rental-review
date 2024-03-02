import {
  test, expect, TestInfo as TestInfoType,
} from '@playwright/test';
import { users } from './helpers';

const apiBaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Make sure you update/add at least the worker index & id if you change them in the test to ensure users are cleaned up
const testUsers: {
  [workerIndex: number]: {
    id: string,
    email: string,
    password: string,
  } | undefined,
} = {};

// Helper Functions
const generateTestUserEmail = (TestInfo: TestInfoType) => `user.${TestInfo.workerIndex}@supabase.user.tests.com`;
const generateTestUserPassword = (TestInfo: TestInfoType) => `User.${TestInfo.workerIndex}.Password`;

test.beforeEach(async ({ browser }, TestInfo: TestInfoType) => {
  const email = generateTestUserEmail(TestInfo);
  const password = generateTestUserPassword(TestInfo);

  // Create a new user using a fresh context
  const context = await browser.newContext();
  const res = await context.request.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    data: {
      email,
      password,
    },
  });

  // assert the response is OK
  await expect(res).toBeOK();

  // get the user object from the response
  const resBody = await res.json();

  // store the user details for later
  testUsers[TestInfo.workerIndex] = {
    id: resBody.user.id,
    email,
    password,
  };

  context.close();
});

// For each test, if a user exists at the end of the test, delete them
test.afterEach(async ({ browser }, TestInfo) => {
  const testUser = testUsers[TestInfo.workerIndex];

  if (!testUser) return;

  const context = await browser.newContext();
  const res = await context.request.delete(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${testUser.id}`, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
    },
  });

  // assert the response is OK
  await expect(res).toBeOK();
  await context.close();
});

// User Authentication Tests
test.describe('User Authentication Tests', () => {
  // For each test not marked as <NEU> (No Existing User), create a new user

  // Login page tests
  test.describe('Login Page Tests', () => {
    test.describe('Page Access Tests', () => {
      test('Logged out user can access login page', async ({ page }) => {
        await page.goto('./login');

        await expect(page).toHaveURL(/\/login/);
      });

      test('Logged in user cannot access login page', async () => {
        test.fixme();
        // log user in with this test's user
        // get the login details from the testUsers object as
        //
        // email:    testUsers[TestInfo.workerIndex].email
        // password: testUsers[TestInfo.workerIndex].password
        //
        // then try to access the login page again and expect it to fail
      });
    });

    // Signup tests
    test.describe('User Signup Tests <NEU>', () => {
      test('New user can sign up', async () => {
        test.fixme();
      });

      test('user cannot sign up with an existing email', async () => {
        test.fixme();
      });

      test.describe('Password Validation Tests', () => {
        test('Password must be at least 6 characters - Too short (5 characters)', async () => {
          test.fixme();
        });

        test('Password must be at least 6 characters - Minimum length (6 characters)', async () => {
          test.fixme();
        });

        test('Password must be at least 6 characters - Longer than minimum (7 characters)', async () => {
          test.fixme();
        });
      });
    });

    // Login tests
    test.describe('User Login Tests', () => {
      test('Existing user can login', async () => {
        test.fixme();
      });

      test('Non-existent user cannot login', async () => {
        test.fixme();
      });

      test('User cannot login with incorrect password', async () => {
        test.fixme();
      });
    });
  });

  // Nav bar tests
  test.describe('Navbar Tests', () => {
    test('Logged out user shown login button', async () => {
      test.fixme();
    });

    test.describe('Logged in user shown auth button', () => {
      test('Logged in user sees their email', async () => {
        test.fixme();
      });

      test('Logged in user can log out', async () => {
        test.fixme();
      });

      test('Logged in user shown link to account page', async () => {
        test.fixme();
      });
    });
  });
});

// Account page tests
test.describe('Account Management Tests', () => {
  test.describe('Page Access Tests', () => {
    test('Logged out user cannot access account page', async () => {
      test.fixme();
    });

    test('Logged in user can access account page', async () => {
      test.fixme();
    });
  });

  test.describe('Email Change Tests', () => {
    test('User can change their email', async () => {
      test.fixme();
    });

    test('User cannot change their email to an existing email', async () => {
      test.fixme();
    });

    test('User cannot change their email to an invalid email', async () => {
      test.fixme();
    });
  });

  test.describe('Password Change Tests', () => {
    test('User can change their password', async () => {
      test.fixme();
    });

    test('User cannot change password with incorrect current password', async () => {
      test.fixme();
    });

    test('User cannot change their password to a password that does not match the confirm password', async () => {
      test.fixme();
    });

    test('User cannot change their password to a weak password', async () => {
      test.fixme();
    });
  });

  test('User can delete their account', async () => {
    test.fixme();
  });
});

test.describe('User Profile Tests', () => {
  // This test uses 2 users
  // for each user checks if they can access their own profile and not the other user's profile
  const firstUser = users[0];
  const secondUser = users[1];

  // Verify the data we are looking for exists with the service key before checking which users can access it
  test.describe('User\'s have profiles', () => {
    test(`${firstUser.label} has a profile`, async ({ page }) => {
      const res = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${firstUser.email}&select=email`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
        },
      });

      // Should return 200 with the user's profile
      await expect(res.status()).toBe(200);
      await expect(await res.json()).toEqual([{ email: firstUser.email }]);
    });

    test(`${secondUser.label} has a profile`, async ({ page }) => {
      const res = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${secondUser.email}&select=email`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
        },
      });

      // Should return 200 with the user's profile
      await expect(res.status()).toBe(200);
      await expect(await res.json()).toEqual([{ email: secondUser.email }]);
    });
  });

  test.describe('User profile access tests', () => {
    test.describe('Anon User Tests', () => {
      test('Anon user state reflected', async ({ page }) => {
        await page.goto('./');

        // Expect the body to contain the login button.
        await expect(page.getByRole('navigation')).toContainText('Login');
      });

      test(`Anon user cannot access ${firstUser.label}'s profile`, async ({ page }) => {
        const res = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${firstUser.email}&select=*`, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          },
        });

        // Should return 200 but with an empty array
        await expect(res.status()).toBe(200);
        await expect(await res.json()).toEqual([]);
      });

      test(`Anon user cannot access ${secondUser.label}'s profile`, async ({ page }) => {
        const res = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${secondUser.email}&select=email`, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          },
        });

        // Should return 200 but with an empty array
        await expect(res.status()).toBe(200);
        await expect(await res.json()).toEqual([]);
      });
    });

    test.describe(`${firstUser.label} tests`, () => {
      test.use({ storageState: firstUser.file });

      test('logged in user state reflected', async ({ page }) => {
        await page.goto('./');

        // Expect the navbar to contain the user's email
        await expect(page.getByRole('navigation')).toContainText(firstUser.email);
      });

      test(`${firstUser.label} can access ${firstUser.label}'s profile`, async ({ page }) => {
        // get an access token for user 1
        const userRes = await page.request.post(`${apiBaseURL}/auth/v1/token?grant_type=password`, {
          data: {
            email: firstUser.email,
            password: firstUser.password,
          },
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Content-Type': 'application/json',
          },
        });
        const { access_token } = await userRes.json();

        // use the access token to get user 1's profile
        const testRes = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${firstUser.email}&select=email`, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${access_token}`,
          },
        });

        // Should return 200 with the user's profile
        await expect(testRes.status()).toBe(200);
        await expect(await testRes.json()).toEqual([{ email: firstUser.email }]);
      });

      test(`${firstUser.label} cannot access ${secondUser.label}'s profile`, async ({ page }) => {
        // get an access token for user 1
        const userRes = await page.request.post(`${apiBaseURL}/auth/v1/token?grant_type=password`, {
          data: {
            email: firstUser.email,
            password: firstUser.password,
          },
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Content-Type': 'application/json',
          },
        });
        const { access_token } = await userRes.json();

        // use the access token to get user 2's profile
        const testRes = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${secondUser.email}&select=email`, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${access_token}`,
          },
        });

        // Should return 200 but with an empty array
        await expect(testRes.status()).toBe(200);
        await expect(await testRes.json()).toEqual([]);
      });
    });

    test.describe(`${secondUser.label} tests`, () => {
      test.use({ storageState: secondUser.file });

      test('logged in user state reflected', async ({ page }) => {
        await page.goto('./');

        // Expect the navbar to contain the user's email
        await expect(page.getByRole('navigation')).toContainText(secondUser.email);
      });

      test(`${secondUser.label} cannot access ${firstUser.label}'s profile`, async ({ page }) => {
        // get an access token for user 2
        const userRes = await page.request.post(`${apiBaseURL}/auth/v1/token?grant_type=password`, {
          data: {
            email: secondUser.email,
            password: secondUser.password,
          },
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Content-Type': 'application/json',
          },
        });
        const { access_token } = await userRes.json();

        // use the access token to get user 1's profile
        const testRes = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${firstUser.email}&select=email`, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${access_token}`,
          },
        });

        // Should return 200 but with an empty array
        await expect(testRes.status()).toBe(200);
        await expect(await testRes.json()).toEqual([]);
      });

      test(`${secondUser.label} can access ${secondUser.label}'s profile`, async ({ page }) => {
        // get an access token for user 2
        const userRes = await page.request.post(`${apiBaseURL}/auth/v1/token?grant_type=password`, {
          data: {
            email: secondUser.email,
            password: secondUser.password,
          },
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Content-Type': 'application/json',
          },
        });
        const { access_token } = await userRes.json();

        // use the access token to get user 2's profile
        const testRes = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${secondUser.email}&select=email`, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${access_token}`,
          },
        });

        // Should return 200 with the user's profile
        await expect(testRes.status()).toBe(200);
        await expect(await testRes.json()).toEqual([{ email: secondUser.email }]);
      });
    });
  });
});
