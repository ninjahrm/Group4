import { test, expect,request } from '@playwright/test'
import { userPostApiData } from '../../testdata/apitestdata/UserData/userPostApiData';
import { queryDB } from '../../utils/dbUtils';
test.describe('User API tests', () => {

let apiContext;
console.log(userPostApiData.URLs.baseurl);
test.beforeAll(async ({ playwright }) => {
apiContext = await request.newContext({
baseURL:userPostApiData.URLs.baseurl,
extraHTTPHeaders:userPostApiData.extraHTTPHeaders // Replace with actual base URL

});
});
//const { queryDB } = require('./dbUtils');
test('Create new user', async () => {

console.log(userPostApiData.URLs.endpoint);
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userPostApiData.userCreationData
    }
);

expect(response.ok()).toBeTruthy(); // checks 2xx status
const responseBody = await response.json();
console.log(responseBody);

expect(responseBody.empName).toBe(userPostApiData.userCreationData.empName);

const dbData = await queryDB('SELECT * FROM employee where emp_name= ?',[responseBody.empName]);
console.log(dbData[0].emp_id);
console.log(dbData[0].emp_name);

});

test.afterAll(async () => {
await apiContext.dispose();
});
});


