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
  });





test('get the count of all leads',async()=>{
    //getting count before lead creation
    const dbbefore=await queryDB('select count(*) AS count_lead from lead')
    const dbcountbefore=dbbefore[0].count_lead;

    //api response before creating lead
    const apiBeforeResp = await apiContext.get('/lead/count');
    const countbeforeapi = await apiBeforeResp.json();

    //create new lead

    const responsecreate=await apiContext.post('/lead?campaignId=CAM07703', {
        data:testLeadData.Leaddatapayload
    });

    expect(responsecreate.status()).toBe(201)

    //get count from api
     const response=await apiContext.get('/lead/count')
     const countafterapi=await response.json()  
     console.log("the count of leads =",countafterapi) 

    //checking in DB
    const dbafter=await queryDB('select count(*) AS count_lead from lead')
    const dbcountafter=dbafter[0].count_lead;

     //validating with database
     
      expect(dbcountafter - dbcountbefore).toBe(1);     // DB increased by 1
      expect(countafterapi - countbeforeapi).toBe(1);
})
})