import { test as setup } from '@playwright/test';
import { loginAsUser } from './helpers';


const usedUsers: number[] = [1,2,3,4];

for (const user of usedUsers) {
    setup(`authenticate user ${user} with login page`, async ({ browser, page, request }, testInfo) => {
        await loginAsUser(page, user);
    });
}

