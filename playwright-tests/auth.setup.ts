import { test as setup } from '@playwright/test';
import { loginAsUser } from './helpers';

const apiBaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const usedUsers: number[] = [1,2,3,4];

setup('authenticate user 1 with login page', async ({ browser, page, request }, testInfo) => {
    testInfo.skip(!usedUsers.includes(1));

    await loginAsUser(page, 1);
});

setup('authenticate user 2 with login page', async ({ browser, page, request }, testInfo) => {
    testInfo.skip(!usedUsers.includes(2));

    await loginAsUser(page, 2);
});

setup('authenticate user 3 with login page', async ({ browser, page, request }, testInfo) => {
    testInfo.skip(!usedUsers.includes(3));

    await loginAsUser(page, 3);
});

setup('authenticate user 4 with login page', async ({ browser, page, request }, testInfo) => {
    testInfo.skip(!usedUsers.includes(4));

    await loginAsUser(page, 4);
});

setup('authenticate user 5 with login page', async ({ browser, page, request }, testInfo) => {
    testInfo.skip(!usedUsers.includes(5));

    await loginAsUser(page, 5);
});

setup('authenticate user 6 with login page', async ({ browser, page, request }, testInfo) => {
    testInfo.skip(!usedUsers.includes(6));

    await loginAsUser(page, 6);
});

setup('authenticate user 7 with login page', async ({ browser, page, request }, testInfo) => {
    testInfo.skip(!usedUsers.includes(7));

    await loginAsUser(page, 7);
});

setup('authenticate user 8 with login page', async ({ browser, page, request }, testInfo) => {
    testInfo.skip(!usedUsers.includes(8));

    await loginAsUser(page, 8);
});

setup('authenticate user 9 with login page', async ({ browser, page, request }, testInfo) => {
    testInfo.skip(!usedUsers.includes(9));

    await loginAsUser(page, 9);
});

setup('authenticate user 10 with login page', async ({ browser, page, request }, testInfo) => {
    testInfo.skip(!usedUsers.includes(10));

    await loginAsUser(page, 10);
});