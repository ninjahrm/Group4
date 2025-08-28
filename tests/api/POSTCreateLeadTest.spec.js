import { testLeadData } from '../../testdata/apitestdata/LeadData/POSTData'
import { queryDB } from '../../utils/dbUtils';
import { getLeadPayload } from '../../utils/payloadLeadHelper';


import Ajv from 'ajv';
import addFormats from "ajv-formats";
import { test, expect, request } from '@playwright/test'
const ajv = new Ajv();
addFormats(ajv);  //enable email, uri, date-time etc.

test.describe('API Lead tests', () => {
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
        //create new lead
        const response = await apiContext.post('/lead?campaignId=CAM07703', {
            data: testLeadData.Leaddatapayload
        });
        expect(response.status()).toBe(201);

        const body = await response.json();
        lead_Id = body.leadId;
        dup_email = body.email;
        dup_phone = body.phone;
        dup_secondaryemail = body.secondaryEmail;
        dup_company = body.company;
        dup_leadname = body.name

        console.log("Lead created in beforeAll:", lead_Id);

    })

    //Create --- POST Lead
    test('Verify lead is created  with valid data in all fields and validate in db', async () => {

        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: testLeadData.Leaddatapayload

        });
        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        console.log(responseBody); // checks 2xx status


        expect(responseBody.name).toBe(testLeadData.Leaddatapayload.name);

        const dbData = await queryDB('SELECT * FROM lead where name= ?', [responseBody.name]);

        console.log("Test 1:Lead ID is", dbData[0].lead_id)
        console.log("Test 1 :Lead name is", dbData[0].name)



    });





    test('Verify lead is created with valid data in all fields  and validate schema', async () => {
        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: testLeadData.Leaddatapayload

        });
        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        console.log(responseBody); // checks 2xx status
        const validate = ajv.compile(testLeadData.leadSchema);
        const valid = validate(responseBody);
        expect(valid, JSON.stringify(validate.errors, null, 2)).toBeTruthy();
    });

    test('Verify lead is created with valid data in all fields with mandatory fields only', async () => {
        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: testLeadData.mandatoryfields

        });
        expect(response.status()).toBe(201);
        const responseBody = await response.json()
        console.log('lead ID from response ', responseBody.leadId)

        const dbData = await queryDB(
            'SELECT * FROM lead WHERE lead_id = ?',
            [responseBody.leadId]   // map API leadId to DB lead_id
        );
        console.log("lead id from database", dbData[0].lead_id)
        expect(responseBody.leadId).toBe(dbData[0].lead_id)
    })

    //checking manadatory fields for POST requests in data driver loop

    const mandatoryfields = ["name", "company", "industry", "phone", "leadStatus", "leadSource", "campaign"]
    for (const field of mandatoryfields) {
        test(`validate Lead's ${field}   is mandatory`, async () => {
            const payload = getLeadPayload({}, [field])

            const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
                data: payload,

            });

            console.log("Status:", response.status());
            console.log("Response body:", await response.text());

            expect(response.status()).toBe(400)
        })
    }

    //validating data for the fields in lead

    const variation_fields = [
        { field: "name", value: 123, expectedError: "Failed to convert property value" },
        { field: "company", value: 345, expectedError: "Failed to convert property value" },
        { field: "leadSource", value: 123, expectedError: "Failed to convert property value" },
        { field: "industry", value: 567, expectedError: "Failed to convert property value" },
        { field: "annualRevenue", value: "revenue", type: "long", expectedError: "Cannot deserialize value of type `long`" },
        { field: "noOfEmployees", value: "emloyeecount", type: "int", expectedError: "Cannot deserialize value of type `long`" },
        { field: "phone", value: 56778989, expectedError: "Failed to convert property value" },
        { field: "email", value: 1234, expectedError: "Failed to convert property value" },
        { field: "secondaryEmail", value: "abc123gmail.com" },
        { field: "website", value: 12343, expectedError: "Failed to convert property value" },
        { field: "leadStatus", value: 8999, expectedError: "Failed to convert property value" },
        { field: "rating", value: "rating", expectedError: "Cannot deserialize value of type `long`" },
        { field: "assignedTo", value: 3445, expectedError: "Failed to convert property value" },
        { field: "city", value: 7856, expectedError: "Failed to convert property value" },
        { field: "country", value: 87678, expectedError: "Failed to convert property value" },
        { field: "postalCode", value: "postal", type: "int", expectedError: "Cannot deserialize value of type `long`" },

    ]


    for (const { field, value, type, expectedError } of variation_fields) {
        test(`Check lead is created with invalid ${field}`, async () => {
            const payload = getLeadPayload({ [field]: value });

            const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`,
                { data: payload })
            console.log("response is",response.status())
            const responseBody = await response.json()
            expect(responseBody).toHaveProperty("message");

            if (type) {
                expect(responseBody.message).toContain(`Cannot deserialize value of type \`${type}\``);
            } else if (expectedError) {
                expect(response.message).toContain(expectedError);
            }
            expect(responseBody.message).toContain(field)
            expect([400, 500]).toContain(response.status());

        })

    }

    test('Check if email already exists for another lead.', async () => {
        const payload = getLeadPayload({ email: dup_email });

        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: payload,

        });

        console.log("Status:", response.status());
        console.log("Response body:", await response.text());

        expect(response.status()).toBe(409)
    })


    test('Check if phone  already exists for another lead.', async () => {
        const payload = getLeadPayload({ phone: dup_phone });

        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: payload,

        });

        console.log("Status:", response.status());
        console.log("Response body:", await response.text());

        expect(response.status()).toBe(409)
    })

    test('Check if secondaryEmail already exists for another lead.', async () => {
        const payload = getLeadPayload({ secondaryEmail: dup_secondaryemail });

        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: payload,

        });

        console.log("Status:", response.status());
        console.log("Response body:", await response.text());

        expect(response.status()).toBe(409)
    })

    test('Verify duplicate leads with same Lead Name and company combination is not accepted', async () => {
        const payload = getLeadPayload({ name: dup_leadname, company: dup_company })

        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: payload,

        });

        console.log("Status:", response.status());
        console.log("Response body:", await response.text());
        expect(response.status()).toBe(409)

    })

    test('provide lead id manually', async () => {
        const fakeleadid = "gttt1234"
        const payload = getLeadPayload({ leadId: fakeleadid })

        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: payload,

        });
        const responseBody = await response.json()
        expect(responseBody).not.toBe(fakeleadid)

    })



    test('Verify annualRevenue defaults to 0 when not provided', async () => {
        //const payload=getLeadPayload({},"annualRevenue")
        const payload = { ...testLeadData.Leaddatapayload };

        // remove rating field
        delete payload.annualRevenue;


        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: payload,
        });

        const responseBody = await response.json()

        expect(responseBody.annualRevenue).toBe(0)
        
    })

    test('Verify noOfEmployees defaults to 1 when not provided', async () => {

        const payload = { ...testLeadData.Leaddatapayload };

        // remove noOfEmployees field
        delete payload.noOfEmployees;

        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: payload,
        });

        const responseBody = await response.json()


        expect(responseBody.noOfEmployees).toBe(1)
        
    })

    test('Verify rating defaults to 0 when not provided', async () => {

        const payload = { ...testLeadData.Leaddatapayload };

        // remove rating field
        delete payload.rating;

        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: payload,
        });

        const responseBody = await response.json()
        expect(responseBody.rating).toBe(0);
    })

    test('Verify lead is created with wrong endpoint  valid data in all fields', async () => {
        const response = await apiContext.post(`${testLeadData.URLs.leadinvalidendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: testLeadData.Leaddatapayload,
        });
        expect([404, 405]).toContain(response.status())
    })

    test('Send request with valid data using unsupported HTTP method(GET Request)', async () => {
        const response = await apiContext.get(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: testLeadData.Leaddatapayload
        });
        expect([500, 405]).toContain(response.status())

    })

    test('Send request with valid data without authentication', async () => {

        const noAuthContext = await request.newContext({
            baseURL: testLeadData.URLs.url,
            extraHTTPHeaders: {
                'Content-Type': 'application/json'
            }
        })
        const response = await noAuthContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: testLeadData.Leaddatapayload
        })
        expect(response.status()).toBe(401)
    })

    test('verify lead is created with wrong content type', async () => {
        const invalidContext = await request.newContext({
            baseURL: testLeadData.URLs.url,
            extraHTTPHeaders: {
                'Content-Type': 'text/plain',
                'Authorization': 'Basic ' + Buffer.from(`${testLeadData.login.username}:${testLeadData.login.password}`).toString('base64')
            }
        })
        const response = await invalidContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: testLeadData.Leaddatapayload
        })
        expect([415, 500]).toContain(response.status())
    })

    test('verify lead is created with invalid url', async () => {
        const invalidurlapiContext = await request.newContext({
            baseURL: testLeadData.URLs.invalidurl, // Replace with actual base URL
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${testLeadData.login.username}:${testLeadData.login.password}`).toString('base64') // if API is secured
            }
        });
        const response = await invalidurlapiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: testLeadData.Leaddatapayload
        })
        expect([404, 400]).toContain(response.status())
    })

    test('Verify API should not accepts all invalid lead Status values', async () => {
        const payload = getLeadPayload({leadStatus:"old"});

        const response = await apiContext.post(
            `${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`,
            { data: payload }
        );

        const responseBody = await response.json();

        const allowedValues = ["New", "Contacted", "Qualified", "Unqualified"];

        // check that responseBody.leadStatus is one of the allowed values
        expect(allowedValues).toContain(responseBody.leadStatus);
    })


    test.afterAll(async () => {
        await apiContext.dispose();
    });
})

