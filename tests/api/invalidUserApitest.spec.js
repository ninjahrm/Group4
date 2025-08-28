import { test, expect, request } from '@playwright/test';
import { userPostApiData } from '../../testdata/apitestdata/UserData/userPostApiData';

test.describe('User API tests',() => {
let userId1;
let apiContext;
console.log(userPostApiData.URLs.baseurl);
test.beforeAll(async ({ playwright }) => {
apiContext = await request.newContext({
baseURL:userPostApiData.URLs.baseurl,
//extraHTTPHeaders:userPostApiData.extraHTTPHeaders2 // Replace with actual base URL

});
});
test('get all users without pagination', async () => {
    const response = await apiContext.get(userPostApiData.URLs.endpointget);
    expect(response.status()).toBe(401);

  // Parse JSON response
  const responseBody = await response.json();
  
 // const firstTen = responseBody.slice(0, 10);
  //console.log(firstTen);

});

test('get all users with pagination', async () => {
    const response = await apiContext.get(userPostApiData.URLs.endpointgetwpag , {
    params: { page: 1, pageSize: 10 } 
  });
    expect(response.status()).toBe(401);

  // Parse JSON response
  const responseBody = await response.json();
 // const firstTen = responseBody.slice(0,10);
  console.log(responseBody);
  
  
});

test('get all users count', async () => {
    const response = await apiContext.get(userPostApiData.URLs.endpointcount);
    expect(response.status()).toBe(401);

  // Parse JSON response
  const responseBody = await response.json();
 // const firstTen = responseBody.slice(0, 10);
  console.log(responseBody);
});
test('Create new user', async () => {

console.log(userPostApiData.URLs.endpoint);
console.log(userPostApiData.userCreationData);
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userPostApiData.userCreationData
    }
);
console.log(response.status());
console.log(response.text());

expect(response.ok()).toBeFalsy(); // checks 4xx status
const responseBody = await response.json();
console.log(responseBody);
//expect(responseBody.empName).toBe(userPostApiData.userCreationData.empName);

});

test.describe.serial('User flow', () => {
test.describe('User API tests',() => {

let apiContext;
console.log(userPostApiData.URLs.baseurl);
test.beforeAll(async ({ playwright }) => {
apiContext = await request.newContext({
baseURL:userPostApiData.URLs.baseurl,
extraHTTPHeaders:userPostApiData.extraHTTPHeaders2 // Replace with actual base URL

});
});
test('Delete A User with api', async () => {
    //Create a User for deletion
    const createResponse = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userPostApiData.userCreationData
    }
);
console.log(createResponse.status());

expect(createResponse.ok()).toBeFalsy()
const responseBody = await createResponse.json();
console.log(responseBody);

//Delete the user created above
    const userId = responseBody.empId;
    userId1 = responseBody.empId;
    console.log(userId);
    const delResponse = await apiContext.delete(userPostApiData.URLs.endpointdelete,{
  params: { userId } });
    expect(delResponse.status()).toBe(401);

  // Parse JSON response

  const body = await delResponse.text();
  console.log('delResponse-status: ', delResponse.status());
  console.log('User not deleted successfully');
  console.log(body);

 
});
});

});

test.afterAll(async () => {
await apiContext.dispose();
});
});