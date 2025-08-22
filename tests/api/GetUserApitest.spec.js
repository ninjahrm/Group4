import { test, expect, request } from '@playwright/test';
import { userPostApiData } from '../../testdata/apitestdata/UserData/userPostApiData';

test.describe('User API tests',() => {

let apiContext;
console.log(userPostApiData.URLs.baseurl);
test.beforeAll(async ({ playwright }) => {
apiContext = await request.newContext({
baseURL:userPostApiData.URLs.baseurl,
extraHTTPHeaders:userPostApiData.extraHTTPHeaders // Replace with actual base URL

});
});
test('get all users without pagination', async () => {
    const response = await apiContext.get(userPostApiData.URLs.endpointget);
    expect(response.status()).toBe(200);

  // Parse JSON response
  const responseBody = await response.json();
  const firstTen = responseBody.slice(0, 10);
  console.log(firstTen);
});

test('get all users with pagination', async () => {
    const response = await apiContext.get(userPostApiData.URLs.endpointgetwpag , {
    params: { page: 1, pageSize: 10 } 
  });
    expect(response.status()).toBe(200);

  // Parse JSON response
  const responseBody = await response.json();
 // const firstTen = responseBody.slice(0,10);
  console.log(responseBody);
});

test('get all users count', async () => {
    const response = await apiContext.get(userPostApiData.URLs.endpointcount);
    expect(response.status()).toBe(200);

  // Parse JSON response
  const responseBody = await response.json();
 // const firstTen = responseBody.slice(0, 10);
  console.log(responseBody);
});


test.afterAll(async () => {
await apiContext.dispose();
});
});