import { test, expect, APIRequestContext } from '@playwright/test';
import { users } from './helpers';

const apiBaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Verify the data we are looking for exists with the service key before checking which users can access it
test.describe('Service Tests', () => {
    test(`User 1 has a profile`, async ({ page }) => {
        const res = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${users[0].email}&select=email`, {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
            }
        });

        // Should return 200 with the user's profile
        await expect(res.status()).toBe(200);
        await expect(await res.json()).toEqual([{ email: users[0].email }]);
    });

    test(`User 2 has a profile`, async ({ page }) => {
        const res = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${users[1].email}&select=email`, {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
            }
        });

        // Should return 200 with the user's profile
        await expect(res.status()).toBe(200);
        await expect(await res.json()).toEqual([{ email: users[1].email }]);
    });
});

test.describe('Anon User Tests', () => {
    test('Anon user state reflected', async ({ page }) => {
        await page.goto('./');

        // Expect the body to contain the login button.
        await expect(page.getByRole('navigation')).toContainText('Login');
    });

    test(`Anon user cannot access user1's profile`, async ({ page }) => {
        const res = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${users[0].email}&select=*`, {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            }
        });

        // Should return 200 but with an empty array
        await expect(res.status()).toBe(200);
        await expect(await res.json()).toEqual([]);
    });

    test(`Anon user cannot access user2's profile`, async ({ page }) => {
        const res = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${users[1].email}&select=email`, {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            }
        });

        // Should return 200 but with an empty array
        await expect(res.status()).toBe(200);
        await expect(await res.json()).toEqual([]);
    });
});

test.describe('User 1 tests', () => {
    test.use({ storageState: users[0].file });

    test('logged in user state reflected', async ({ page }) => {
        await page.goto('./');

        // Expect the navbar to contain the user's email
        await expect(page.getByRole('navigation')).toContainText('user.1@example.com');

        // Expect the body to contain the logout button.
        await expect(page.getByRole('navigation')).toContainText('Logout');
    });

    test(`user1 can access user1's profile`, async ({ page }) => {
        // get an access token for user 1
        const userRes = await page.request.post(`${apiBaseURL}/auth/v1/token?grant_type=password`, {
            data: {
                email: users[0].email,
                password: users[0].password,
            },
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Content-Type': 'application/json',
            }
        });
        const { access_token } = await userRes.json();

        // use the access token to get user 1's profile
        const testRes = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${users[0].email}&select=email`, {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Authorization': `Bearer ${access_token}`,
            }
        });

        // Should return 200 with the user's profile
        await expect(testRes.status()).toBe(200);
        await expect(await testRes.json()).toEqual([{ email: users[0].email }]);
    });

    test(`user1 cannot access user2's profile`, async ({ page }) => {
        // get an access token for user 1
        const userRes = await page.request.post(`${apiBaseURL}/auth/v1/token?grant_type=password`, {
            data: {
                email: users[0].email,
                password: users[0].password,
            },
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Content-Type': 'application/json',
            }
        });
        const { access_token } = await userRes.json();

        // use the access token to get user 2's profile
        const testRes = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${users[1].email}&select=email`, {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Authorization': `Bearer ${access_token}`,
            }
        });

        // Should return 200 but with an empty array
        await expect(testRes.status()).toBe(200);
        await expect(await testRes.json()).toEqual([]);
    });
});

test.describe('User 2 tests', () => {
    test.use({ storageState: users[1].file });

    test('logged in user state reflected', async ({ page }) => {
        await page.goto('./');

        // Expect the navbar to contain the user's email
        await expect(page.getByRole('navigation')).toContainText('user.2@example.com');

        // Expect the body to contain the logout button.
        await expect(page.getByRole('navigation')).toContainText('Logout');
    });

    test(`user2 cannot access user1's profile`, async ({ page }) => {
        // get an access token for user 2
        const userRes = await page.request.post(`${apiBaseURL}/auth/v1/token?grant_type=password`, {
            data: {
                email: users[1].email,
                password: users[1].password,
            },
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Content-Type': 'application/json',
            }
        });
        const { access_token } = await userRes.json();

        // use the access token to get user 1's profile
        const testRes = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${users[0].email}&select=email`, {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Authorization': `Bearer ${access_token}`,
            }
        });

        // Should return 200 but with an empty array
        await expect(testRes.status()).toBe(200);
        await expect(await testRes.json()).toEqual([]);
    });

    test(`user2 can access user2's profile`, async ({ page }) => {
        // get an access token for user 2
        const userRes = await page.request.post(`${apiBaseURL}/auth/v1/token?grant_type=password`, {
            data: {
                email: users[1].email,
                password: users[1].password,
            },
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Content-Type': 'application/json',
            }
        });
        const { access_token } = await userRes.json();

        // use the access token to get user 2's profile
        const testRes = await page.request.get(`${apiBaseURL}/rest/v1/user_profiles?email=eq.${users[1].email}&select=email`, {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Authorization': `Bearer ${access_token}`,
            }
        });

        // Should return 200 with the user's profile
        await expect(testRes.status()).toBe(200);
        await expect(await testRes.json()).toEqual([{ email: users[1].email }]);
    });
});