import { test, expect, request } from '@playwright/test';
import { userPostApiData } from '../../testdata/apitestdata/UserData/userPostApiData';
import { queryDB } from '../../utils/dbUtils';
test.describe('User API tests',() => {

let apiContext;
console.log(userPostApiData.URLs.baseurl);
test.beforeAll(async ({ playwright }) => {
apiContext = await request.newContext({
baseURL:userPostApiData.URLs.baseurl,
extraHTTPHeaders:userPostApiData.extraHTTPHeaders // Replace with actual base URL

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

expect(createResponse.ok()).toBeTruthy()
const responseBody = await createResponse.json();
console.log(responseBody);

//Delete the user created above
    const userId = responseBody.empId;
    console.log(userId);
    const delResponse = await apiContext.delete(userPostApiData.URLs.endpointdelete,{
	params: { userId } });
    expect(delResponse.status()).toBe(204);

  // Parse JSON response

  const body = await delResponse.text();
  console.log('User deleted successfully');
  console.log(body);

 
});



test.afterAll(async () => {
await apiContext.dispose();
});
});