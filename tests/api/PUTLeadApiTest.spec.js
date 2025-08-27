import{testLeadData} from '../../testdata/apitestdata/LeadData/POSTData'
import { queryDB } from '../../utils/dbUtils';
import { getLeadPayload } from '../../utils/payloadLeadHelper';


import Ajv from 'ajv';
import addFormats from "ajv-formats";
import { test, expect,request} from '@playwright/test'
const ajv = new Ajv();
addFormats(ajv);  //enable email, uri, date-time etc.

test.describe('API PUTLead tests', () => {
let lead_Id;
let apiContext;

test.beforeAll(async ({playwright}) => {
apiContext = await request.newContext({
baseURL: testLeadData.URLs.url, // Replace with actual base URL
extraHTTPHeaders: {
'Content-Type': 'application/json',
'Authorization': 'Basic ' + Buffer.from(`${testLeadData.login.username}:${testLeadData.login.password}`).toString('base64') // if API is secured
}
});
//creating lead in before all to pass leadid across the tests
const response = await apiContext.post('/lead?campaignId=CAM07703', {
      data: testLeadData.Leaddatapayload
    });
    expect(response.status()).toBe(201);

    const body = await response.json();
    lead_Id = body.leadId;
    console.log("Lead created in beforeAll:", lead_Id);

});

//Update -- PUT Lead

    
   test('Verify lead is updated with valid data in all fields', async () => {
  // 🔹 Ensure lead_Id is available
  if (!lead_Id) {
    throw new Error("lead_Id is undefined. Make sure a lead is created before running this test.");
  }
  console.log("Updating lead with ID:", lead_Id);

  // 🔹 Call the API to update lead
  const response = await apiContext.put(
    `/lead?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}&leadId=${lead_Id}`,
    { data: testLeadData.UpdateLeadpayload }
  );

  expect(response.status()).toBe(200);

  const updateResponseBody = await response.json();
  console.log("API Response after update:", updateResponseBody);

  // 🔹 Guard against missing fields
  if (!updateResponseBody.name || !updateResponseBody.leadId) {
    throw new Error("API response missing leadId or name");
  }

  // 🔹 Fetch the updated lead from DB
  const dbData = await queryDB(
    'SELECT * FROM lead WHERE lead_id = ?',
    [updateResponseBody.leadId]   // map API leadId to DB lead_id
  );

  if (!dbData || dbData.length === 0) {
    throw new Error(`No lead found in DB with lead_id=${updateResponseBody.leadId}`);
  }

  console.log("DB Row after update:", dbData[0]);

  // 🔹 Assertions: API response matches DB
  expect(updateResponseBody.leadId).toBe(dbData[0].lead_id);
  expect(updateResponseBody.name).toBe(dbData[0].name);
});
})