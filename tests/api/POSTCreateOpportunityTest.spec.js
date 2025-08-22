import { test, expect, request } from '@playwright/test';
import { generateOpportunityData } from '../../testdata/apitestdata/OpportunityData/opportunityData.js';
import { queryDB } from '../../utils/dbUtils.js';
/*Features:

Generates a new user with Faker.

Saves the username/password to testdata/generatedUser.json.

Makes an API POST call to create the user.

Validates the user exists in the database.

Logs DB record and location of saved credentials.*/
test.describe('Create User API Test with Faker', () => {
  let apiContext;
  let createdUserId;
  let opportunityData;

  test.beforeAll(async () => {
    // Generate new user payload and save credentials to JSON
    const { data, savePath } = generateOpportunityData();
    opportunityData = data;

    apiContext = await request.newContext({
      baseURL: opportunityData.urls.baseUrl,
      extraHTTPHeaders: opportunityData.headers
    });

    console.log(`Generated user credentials saved at: ${savePath}`);
  });

test('Create user and validate in DB', async () => {
  const response = await apiContext.post(opportunityData.urls.endpoint, {
    data: opportunityData.userCreateData
  });

  // Log status and body for debugging
  console.log('Status code:', response.status());
  const responseText = await response.text();
  console.log('Response body:', responseText);

  // Validate HTTP status
  expect(response.status(), `API Error: ${responseText}`).toBe(201);

  const responseBody = JSON.parse(responseText);
  createdUserId = responseBody.empId;

  // Validate in DB
  const dbData = await queryDB('SELECT * FROM employee WHERE emp_name = ?', [opportunityData.userCreateData.empName]);
  expect(dbData.length).toBeGreaterThan(0);

  console.log('Created user credentials saved at: testdata/generatedUser.json');
  console.log('DB record:', dbData[0]);
});

  test.afterAll(async () => {
    await apiContext.dispose();
  });
});

