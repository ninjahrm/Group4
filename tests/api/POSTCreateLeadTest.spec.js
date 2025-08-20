import{testLeadData} from '../../testdata/apitestdata/LeadData/POSTData'
import { test, expect,request } from '@playwright/test'

test.describe('User API tests', () => {

let apiContext;

test.beforeAll(async ({ playwright }) => {
apiContext = await request.newContext({
baseURL: testLeadData.URLs.url, // Replace with actual base URL
extraHTTPHeaders: {
'Content-Type': 'application/json',
'Authorization': 'Basic ' + Buffer.from(`${testLeadData.login.username}:${testLeadData.login.password}`).toString('base64') // if API is secured
}
});
});

test('Create new user', async () => {


const response = await apiContext.post('/lead?campaignId=CAM07703', {
data: testLeadData.Leaddatapayload
});

expect(response.status()).toBe(201);

const responseBody = await response.json();
console.log(responseBody); // checks 2xx status


//expect(responseBody.lead).toBe(newUserPayload.empName);
});

test.afterAll(async () => {
await apiContext.dispose();
});
});

