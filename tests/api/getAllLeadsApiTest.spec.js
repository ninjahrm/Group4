import { test, expect, request } from '@playwright/test';
import { testLeadData } from '../../testdata/apitestdata/LeadData/POSTData';
import { queryDB } from '../../utils/dbUtils';

test.describe('Lead Count Test', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext({
      baseURL: testLeadData.URLs.url,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${testLeadData.login.username}:${testLeadData.login.password}`).toString('base64')
      }
    });

  })
test('Get the list of all leads and Verify all the fields in lead module in json format are present',async()=>{

    const response= await apiContext.get('/lead/all-leads')
    const getallresponsebody=await response.json();
    
    let expectedfields=["address","annualRevenue","assignedTo","campaign","city","company","country","description",
        "email","industry","leadId","leadSource","leadStatus","name","noOfEmployees","phone","postalCode","rating","secondaryEmail","website"]

    getallresponsebody.forEach((lead,index) => {
        expectedfields.forEach(field=>{
            expect(lead).toHaveProperty(field)
        })
    }); 
})

  });

