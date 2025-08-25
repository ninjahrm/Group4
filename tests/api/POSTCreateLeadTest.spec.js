import{testLeadData} from '../../testdata/apitestdata/LeadData/POSTData'
import { queryDB } from '../../utils/dbUtils';
import Ajv from 'ajv';
import addFormats from "ajv-formats";
import { test, expect,request} from '@playwright/test'
const ajv = new Ajv();
addFormats(ajv);  //enable email, uri, date-time etc.

test.describe('User API tests', () => {
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

//Create --- POST Lead
test('Verify lead is created  with valid data in all fields and validate in db', async () => {

const response = await apiContext.post('/lead?campaignId=CAM07703', {
data:testLeadData.Leaddatapayload
    
});
expect(response.status()).toBe(201);
const responseBody = await response.json();
console.log(responseBody); // checks 2xx status


expect(responseBody.name).toBe(testLeadData.Leaddatapayload.name);

const dbData= await queryDB('SELECT * FROM lead where name= ?',[responseBody.name]);

console.log("Test 1:Lead ID is",dbData[0].lead_id)
console.log("Test 1 :Lead name is",dbData[0].name)

});



test('Verify lead is created with valid data in all fields  and validate schema', async () => {
const response = await apiContext.post(`/lead?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
data: testLeadData.Leaddatapayload
   
});
expect(response.status()).toBe(201);
const responseBody = await response.json();
console.log(responseBody); // checks 2xx status
const validate = ajv.compile(testLeadData.leadSchema);
    const valid = validate(responseBody);
    expect(valid, JSON.stringify(validate.errors, null, 2)).toBeTruthy();
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

//get count of all leads
test('get the count of all leads',async()=>{
    //getting count before lead creation
    const dbbefore=await queryDB('select count(*) AS count_lead from lead')
    const dbcountbefore=dbbefore[0].count_lead;

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
     
     expect(dbcountafter).toBe(countafterapi)
})

//get list  of all leads without pagination

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

//get list wit pagination

test('validate specific page number of leads can be fetched',async()=>{

    const page=2
    const size=10

    const response= await apiContext.get(`/lead/all?page=${page}&size=${size}`)
    expect(response.status()).toBe(200)

    const getallresponsebody=await response.json();

    expect(getallresponsebody).toHaveProperty('content')
    expect(Array.isArray(getallresponsebody.content)).toBe(true)

    const leads=getallresponsebody.content
    expect(leads.length).toBeLessThanOrEqual(size)

    //validating metadata
    expect(getallresponsebody).toHaveProperty("totalElements");
    expect(getallresponsebody).toHaveProperty("totalPages");
    expect(getallresponsebody).toHaveProperty("last");
    expect(getallresponsebody).toHaveProperty("size");
    expect(getallresponsebody).toHaveProperty("number");
    expect(getallresponsebody).toHaveProperty("numberOfElements");
    expect(getallresponsebody).toHaveProperty("first");
    expect(getallresponsebody).toHaveProperty("empty");
    expect(getallresponsebody).toHaveProperty("pageable");

    expect(getallresponsebody.size).toBe(size);
    expect(getallresponsebody.number).toBe(page-1);         // here `number` is 1-based in your API
    expect(getallresponsebody.numberOfElements).toBe(leads.length);

})

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


test.afterAll(async () => {
await apiContext.dispose();
});
});

