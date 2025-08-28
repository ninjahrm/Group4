import { testLeadData } from '../../testdata/apitestdata/LeadData/POSTData'
import { queryDB } from '../../utils/dbUtils';
import { getLeadPayload, getUpdateLeadPayload } from '../../utils/payloadLeadHelper';


import Ajv from 'ajv';
import addFormats from "ajv-formats";
import { test, expect, request } from '@playwright/test'
const ajv = new Ajv();
addFormats(ajv);  //enable email, uri, date-time etc.

test.describe('API PUTLead tests', () => {
  let lead_Id;
  let apiContext;
  let dup_email;
    let dup_phone;
    let dup_secondaryemail
    let dup_company
    let dup_leadname

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext({
      baseURL: testLeadData.URLs.url, // Replace with actual base URL
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${testLeadData.login.username}:${testLeadData.login.password}`).toString('base64') // if API is secured
      }
    });
    //creating lead in before all to pass leadid across the tests
    const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
      data: testLeadData.Leaddatapayload
    });
    //expect(response.status()).toBe(201);

    const body = await response.json();
    lead_Id = body.leadId;
    dup_email = body.email;
        dup_phone = body.phone;
        dup_secondaryemail = body.secondaryEmail;
        dup_company = body.company;
        dup_leadname = body.name
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
      `${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}&leadId=${lead_Id}`,
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

  test('Verify lead is created with wrong endpoint  valid data in all fields(optional and mandatory)   in update API', async () => {
    const response = await apiContext.put(`${testLeadData.URLs.leadinvalidendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}&leadId=${lead_Id}`, {
      data: testLeadData.UpdateLeadpayload
    });
    expect([404, 405]).toContain(response.status())
  })

  test('Send request with valid data using unsupported HTTP method(GET Request)  in update API', async () => {
    const response = await apiContext.get(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}&leadId=${lead_Id}`, {
      data: testLeadData.UpdateLeadpayload
    });
    expect([500, 405]).toContain(response.status())
  })

  test('Send request with valid data without authentication in  in update API', async () => {
    const noAuthContext = await request.newContext({
      baseURL: testLeadData.URLs.url,
      extraHTTPHeaders: {
        'Content-Type': 'application/json'
      }
    })
    const response = await noAuthContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}&leadId=${lead_Id}`, {
      data: testLeadData.UpdateLeadpayload
    })
    expect(response.status()).toBe(401)
  })


  test('Verify lead is updated with all vaid data and wrong username and password for authentication', async () => {
    const invalidauthapiContext = await request.newContext({
      baseURL: testLeadData.URLs.url, // Replace with actual base URL
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${testLeadData.login.invalidusername}:${testLeadData.login.invalidpassword}`).toString('base64') // if API is secured
      }
    });
    const response = await invalidauthapiContext.put(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}&leadId=${lead_Id}`, {
      data: testLeadData.UpdateLeadpayload

    })
    expect(response.status()).toBe(401)


  })

test('verify lead is created with wrong content type   in update API',async()=>{
  const invalidContext = await request.newContext({
            baseURL: testLeadData.URLs.url,
            extraHTTPHeaders: {
                'Content-Type': 'text/plain',
                'Authorization': 'Basic ' + Buffer.from(`${testLeadData.login.username}:${testLeadData.login.password}`).toString('base64')
            }
        })
        const response = await invalidContext.put(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}&leadId=${lead_Id}`, {
            data: testLeadData.UpdateLeadpayload
        })
        expect([415, 500]).toContain(response.status())
})


const mandatoryfields = ["name", "company", "industry", "phone", "leadStatus", "leadSource", "campaign"]
    for (const field of mandatoryfields) {
        test(`validate Lead's ${field}   is mandatory`, async () => {
            const payload = getUpdateLeadPayload({}, [field])

            const response = await apiContext.put(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}&leadId=${lead_Id}`, {
                data: payload
            

            });

            console.log("Status:", response.status());
            console.log("Response body:", await response.text());

            expect(response.status()).toBe(400)
        })
    }


    const variation_fields = [
    { field: "name", value: 123, expectedError: "Failed to convert property value" },
    { field: "company", value: 345, expectedError: "Failed to convert property value" },
    { field: "leadSource", value: 123, expectedError: "Failed to convert property value" },
    { field: "industry", value: 567, expectedError: "Failed to convert property value" },
    { field: "annualRevenue", value: "revenue", type: "long" },
    { field: "noOfEmployees", value: "emloyeecount", type: "int" },
    { field: "postalCode", value: "postal", type: "int" },
    { field: "phone", value: 56778989, expectedError: "Failed to convert property value" },
    { field: "email", value: 1234, expectedError: "Failed to convert property value" },
    { field: "secondaryEmail", value: "abc123gmail.com" },
    { field: "website", value: 12343, expectedError: "Failed to convert property value" },
    { field: "leadStatus", value: 8999, expectedError: "Failed to convert property value" },
    { field: "rating", value: "rating", type: "long" },
    { field: "assignedTo", value: 3445, expectedError: "Failed to convert property value" },
    { field: "city", value: 7856, expectedError: "Failed to convert property value" },
    { field: "country", value: 87678, expectedError: "Failed to convert property value" }
];

for (const { field, value, type, expectedError } of variation_fields) {
    test(`Check PUT lead with invalid ${field}`, async () => {
        const payload = getUpdateLeadPayload({ [field]: value });

        const response = await apiContext.put(
            `${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.UpdateLeadpayload.campaign.campaignId}&leadId=${lead_Id}`,
            { data: payload }
        );

        const responseBody = await response.json();
        console.log(`PUT response for ${field}:`, responseBody);

        // For numeric fields: validate type remains numeric
        if (type) {
            expect(typeof responseBody[field]).toBe("number");
        }

        // For other fields: validate expected error if defined
        if (expectedError) {
            expect(responseBody.message).toContain(expectedError);
        }

        // Optional: ensure response status is valid
        expect([200, 400, 500]).toContain(response.status());
    });
}


test('Check if email already exists for another lead.', async () => {

        const payload = getUpdateLeadPayload({ email: dup_email });

        const response = await apiContext.put(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}&leadId=${lead_Id}`, {
            data: payload,

        });

        console.log("Status:", response.status());
        console.log("Response body:", await response.text());

        expect(response.status()).toBe(409)
    })


    test('Check if phone  already exists for another lead.', async () => {
        const payload = getUpdateLeadPayload({ phone: dup_phone });

        const response = await apiContext.put(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}&leadId=${lead_Id}`, {
            data: payload,

        });

        console.log("Status:", response.status());
        console.log("Response body:", await response.text());

        expect(response.status()).toBe(409)
    })

    test('Check if secondaryEmail already exists for another lead.', async () => {
        const payload = getUpdateLeadPayload({ secondaryEmail: dup_secondaryemail });

        const response = await apiContext.put(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}&leadId=${lead_Id}`, {
            data: payload,

        });

        console.log("Status:", response.status());
        console.log("Response body:", await response.text());

        expect(response.status()).toBe(409)
    })

    test('Verify duplicate leads with same Lead Name and company combination is not accepted', async () => {
        const payload = getUpdateLeadPayload({ name: dup_leadname, company: dup_company })

        const response = await apiContext.put(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.UpdateLeadpayload.campaign.campaignId}&leadId=${lead_Id}`, {
            data: payload,

        });

        console.log("Status:", response.status());
        console.log("Response body:", await response.text());
        expect(response.status()).toBe(409)

    })

    test('Verify annualRevenue defaults to 0 when not provided', async () => {
        //const payload=getLeadPayload({},"annualRevenue")
        const payload = { ...testLeadData.UpdateLeadpayload };

        
        delete payload.annualRevenue;


        const response = await apiContext.put(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.UpdateLeadpayload.campaign.campaignId}&leadId=${lead_Id}`, {
            data: payload,
        });

        const responseBody = await response.json()

        expect(responseBody.annualRevenue).toBe(0)
        
    })

    test('Verify noOfEmployees defaults to 1 when not provided', async () => {

        const payload = { ...testLeadData.UpdateLeadpayload };

        // remove noOfEmployees field
        delete payload.noOfEmployees;

        const response = await apiContext.put(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.UpdateLeadpayload.campaign.campaignId}&leadId=${lead_Id}`, {
            data: payload,
        });

        const responseBody = await response.json()


        expect(responseBody.noOfEmployees).toBe(1)
        
    })

    test('Verify rating defaults to 0 when not provided', async () => {

        const payload = { ...testLeadData.UpdateLeadpayload };

        // remove rating field
        delete payload.rating;

        const response = await apiContext.put(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}&leadId=${lead_Id}`, {
            data: payload,
        });

        const responseBody = await response.json()
        expect(responseBody.rating).toBe(0);
    })

    test.afterAll(async () => {
        await apiContext.dispose();
    });

})