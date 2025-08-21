import{testLeadData} from '../../testdata/apitestdata/LeadData/POSTData'
import { queryDB } from '../../utils/dbUtils';
import Ajv from 'ajv';
import addFormats from "ajv-formats";
import { test, expect,request } from '@playwright/test'
const ajv = new Ajv();
addFormats(ajv);  //enable email, uri, date-time etc.
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

test('Verify lead is created with valid data in all fields', async () => {

const response = await apiContext.post('/lead?campaignId=CAM07703', {
data: testLeadData.Leaddatapayload
});
expect(response.status()).toBe(201);
const responseBody = await response.json();
console.log(responseBody); // checks 2xx status

expect(responseBody.name).toBe(testLeadData.Leaddatapayload.name);

const dbData= await queryDB('SELECT * FROM lead where name= ?',[responseBody.name]);
console.log("Test 1:Lead ID is",dbData[0].lead_id)
console.log("Test 1 :ead name is",dbData[0].name)

});



test('Verify lead is created with valid data in all fields  and validate schema', async () => {
const response = await apiContext.post('/lead?campaignId=CAM07703', {
data: testLeadData.Leaddatapayload
});
expect(response.status()).toBe(201);
const responseBody = await response.json();
console.log(responseBody); // checks 2xx status
const validate = ajv.compile(testLeadData.leadSchema);
    const valid = validate(responseBody);
    expect(valid, JSON.stringify(validate.errors, null, 2)).toBeTruthy();
});




test.afterAll(async () => {
await apiContext.dispose();
});
});

