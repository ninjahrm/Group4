import{testLeadData} from '../../testdata/apitestdata/LeadData/POSTData'
import { queryDB } from '../../utils/dbUtils';
import { getLeadPayload } from '../../utils/payloadLeadHelper';


import Ajv from 'ajv';
import addFormats from "ajv-formats";
import { test, expect,request} from '@playwright/test'
const ajv = new Ajv();
addFormats(ajv);  //enable email, uri, date-time etc.

test.describe('API Lead tests', () => {
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

test('DeleteLead with  valid lead ID',async()=>{
    const response=await apiContext.delete(`/lead?leadId=${lead_Id}`)
        expect(response.status()).toBe(204)
       
        const dbData= await queryDB('select * from   lead where lead_id=?',[lead_Id]);

        if (dbData.length === 0) {
        // hard delete case
        expect(dbData.length).toBe(0)
    } else {
        // soft delete case
        expect(dbData[0].lead_id).toBeNull()
        expect(dbData[0].company).toBeNull()
    }
    })
  

})