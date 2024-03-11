import { Page, expect } from '@playwright/test';

const apiBaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const userIds = [
  'b1b284f9-2c24-4f2e-bd4e-9c7ab7fe88e3',
  '44db487d-ace4-43c8-bd7c-38b32b0bc711',
  'e155848a-f32b-4d7d-a8d2-4228a7989078',
  '482afef6-1b2f-4ac2-a449-9bc318f55936',
  '4dfc3778-a1f2-410d-ae3d-9c92a469db8d',
  '470b631a-addd-4380-acf3-b476e136d5f6',
  'a5ceb0f0-707e-47b8-9021-cf451fca19be',
  'f48d6af6-5b3e-4834-ab9d-3e2d9af434b6',
  '1c6ff33c-5efe-4b45-bd35-13783eebbee2',
  '5b3bb17f-33fe-40dd-a387-285e70812f0b',
];

const userLandlordProfiles = [
  {
    displayName: 'Test Name 1',
    displayEmail: 'display1@example.com',
    userBio: 'Cool landlord',
    properties: ['1, Test Road', '2, Test Road'],
  },
  {
    displayName: 'Test Name 2',
    displayEmail: 'display2@example.com',
    userBio: 'Cooler landlord',
    properties: [],
  },
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  {
    displayName: 'Test Name 5',
    displayEmail: 'display5@example.com',
    userBio: 'Best landlord',
    properties: ['2, Test Road'],
  },
  undefined,
];

export const users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({
  file: `playwright/.auth/user${i}.json`,
  email: `user.${i}@example.com`,
  password: `User.${i}.Password`,
  label: `User ${i}`,
  id: userIds[i - 1],
  landlordProfile: userLandlordProfiles[i - 1],
}));

const propertyIds = [
  '1ececec8-4bbf-445f-8de0-f563caf0bf01',
  '6a83d02b-9da1-4a4a-9719-05e8a8c9228d',
];

const propertyAddresses = [
  '1, Test Road, AB1 234',
  '2, Test Road, AB1 234',
];

export const ownershipHistories = [
  {
    startDate: ['20/02/2024', '20/2/2024', '02/20/2024', '2/20/2024'],
    endDate: ['21/02/2024', '21/2/2024', '02/21/2024', '2/21/2024'],
    landlord: users[0].landlordProfile?.displayName,
    propertyAddress: propertyAddresses[0],
    propertyId: propertyIds[0],
    landlordRating: [2],
  },

  {
    // allow the dates in either format
    startDate: [['20/01/2024', '01/20/2024', '20/1/2024', '1/20/2024'], ['01/01/2021', '1/01/2021', '01/1/2021', '1/1/2021']],
    endDate: ['Present', ['31/12/2021', '12/31/2021']],
    landlord: [users[0].landlordProfile?.displayName, users[8].landlordProfile?.displayName],
    propertyAddress: propertyAddresses[1],
    propertyId: propertyIds[1],
    landlordRating: [2, 5],
  },
];

export const properties = [1, 2].map((i) => ({
  id: propertyIds[i - 1],
  address: propertyAddresses[i - 1],
  // They are all owned by the same user according to the mock data
  owner: 'Test Name 1',
}));

export const loginUserWithUI = async (
  page: Page,
  email: string,
  password: string,
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
  password: string,
) => {
  const res = await page.request.post(`${apiBaseURL}/auth/v1/token?grant_type=password`, {
    data: {
      email,
      password,
    },
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json',
    },
  });

  // check that the response is 200
  await expect(res.status()).toBe(200);
};

// API mode disabled as it does not work as intended
export const loginAsUser = async (page: Page, userNo: number, method: 'UI' /* | 'API' */ = 'UI') => {
  const user = users[userNo - 1];
  if (method === 'UI') {
    await loginUserWithUI(page, user.email, user.password);
  } else {
    await loginUserWithAPI(page, user.email, user.password);
  }

  await page.context().storageState({ path: user.file });
};
