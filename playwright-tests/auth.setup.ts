import { test as setup, expect, Page, APIRequestContext } from '@playwright/test';
import { log } from 'console';

const apiBaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
    return {
        file: `playwright/.auth/user${i}.json`,
        email: `user.${i}@example.com`,
        password: `User.${i}.Password`,
    }
});


export const loginUserWithUI = async (
    page: Page,
    email: string,
    password: string
) => {
    // Go to login page
    await page.goto('./login');

    // Fill in the form
    await page
        .locator('form')
        .filter({ hasText: 'Returning User? Sign In Here.' })
        .getByPlaceholder('you@example.com')
        .fill(email);

    await page
        .locator('form')
        .filter({ hasText: 'Returning User? Sign In Here.' })
        .getByPlaceholder('••••••••')
        .fill(password);

    await page
        .getByRole('button', { name: 'Sign In' })
        .click();

    // Wait for the page to redirect
    await page.waitForURL('./');

    // If login was successful, the navigation bar should now mention the user's email
    await expect(page.getByRole('navigation')).toContainText(email);
};


// Currently does not work as intended
// do not use
const loginUserWithAPI = async (
    page: Page,
    email: string,
    password: string
) => {
    const res = await page.request.post(`${apiBaseURL}/auth/v1/token?grant_type=password`, {
        data: {
            email,
            password,
        },
        headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Content-Type': 'application/json',
        }
    });

    // check that the response is 200
    await expect(res.status()).toBe(200);
};

// API mode disabled as it does not work as intended
const loginAsUser = async (page: Page, userNo: number, method: 'UI' /* | 'API' */ = 'UI') => {
    const user = users[userNo - 1];
    if (method === 'UI') {
        await loginUserWithUI(page, user.email, user.password);
    } else {
        await loginUserWithAPI(page, user.email, user.password);
    }

    await page.context().storageState({ path: user.file });
}

setup('authenticate user 1 with login page', async ({ browser, page, request }) => {
    await loginAsUser(page, 1);
});

setup('authenticate user 2 with login page', async ({ browser, page, request }) => {
    await loginAsUser(page, 2);
});

setup('authenticate user 3 with login page', async ({ browser, page, request }) => {
    await loginAsUser(page, 3);
});

setup('authenticate user 4 with login page', async ({ browser, page, request }) => {
    await loginAsUser(page, 4);
});

setup('authenticate user 5 with login page', async ({ browser, page, request }) => {
    await loginAsUser(page, 5);
});

setup('authenticate user 6 with login page', async ({ browser, page, request }) => {
    await loginAsUser(page, 6);
});

setup('authenticate user 7 with login page', async ({ browser, page, request }) => {
    await loginAsUser(page, 7);
});

setup('authenticate user 8 with login page', async ({ browser, page, request }) => {
    await loginAsUser(page, 8);
});

setup('authenticate user 9 with login page', async ({ browser, page, request }) => {
    await loginAsUser(page, 9);
});

setup('authenticate user 10 with login page', async ({ browser, page, request }) => {
    await loginAsUser(page, 10);
});