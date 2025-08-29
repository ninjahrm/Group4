import { testLeadData } from '../../testdata/apitestdata/LeadData/POSTData'
import { queryDB } from '../../utils/dbUtils';
import { getLeadPayload } from '../../utils/payloadLeadHelper';


import Ajv from 'ajv';
import addFormats from "ajv-formats";
import { test, expect, request } from '@playwright/test'
const ajv = new Ajv();
addFormats(ajv);  //enable email, uri, date-time etc.

test.describe('API Lead  Delete tests', () => {
    let lead_Id;
    let apiContext;

    test.beforeAll(async ({ playwright }) => {
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

    test('DeleteLead with  valid lead ID', async () => {
        const response = await apiContext.delete(`/lead?leadId=${lead_Id}`)
        expect(response.status()).toBe(204)

        const dbData = await queryDB('select * from   lead where lead_id=?', [lead_Id]);

        if (dbData.length === 0) {
            // hard delete case
            expect(dbData.length).toBe(0)
        } else {
            // soft delete case
            expect(dbData[0].lead_id).toBeNull()
            expect(dbData[0].company).toBeNull()
        }
    })

    test('Verify lead is deleted with wrong username and password for authentication', async () => {

        //create lead
        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: testLeadData.Leaddatapayload
        });
        expect(response.status()).toBe(201);

        const body = await response.json();
        const lead_Id1 = body.leadId;

        const apideleteContext = await request.newContext({
            baseURL: testLeadData.URLs.url, // Replace with actual base URL
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${testLeadData.login.invalidusername}:${testLeadData.login.password}`).toString('base64') // if API is secured
            }
        })

        const delresponse = await apideleteContext.delete(`${testLeadData.URLs.leadendpoint}?leadId=${lead_Id1}`)
        expect(delresponse.status()).toBe(401)

    })

    test('Verify lead is deleted with wrong endpoint in delete API', async () => {

        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: testLeadData.Leaddatapayload
        });
        expect(response.status()).toBe(201);

        const body = await response.json();
        const lead_Id1 = body.leadId;


        //delete with invalid endpoint
        const delresponse = await apiContext.delete(`${testLeadData.URLs.leadinvalidendpoint}?leadId=${lead_Id1}`)
        console.log(delresponse.status())
        expect([404, 405]).toContain(delresponse.status())

    })

    test('delete lead with wrong  HTTP method(GET Request)  in delete API', async () => {

        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: testLeadData.Leaddatapayload
        });
        expect(response.status()).toBe(201);

        const body = await response.json();
        const lead_Id1 = body.leadId;



        const delresponse = await apiContext.get(`${testLeadData.URLs.leadendpoint}?leadId=${lead_Id1}`)
        console.log(delresponse.status())
        expect([400, 500]).toContain(delresponse.status())


    })

    test('DeleteLead with  invalid lead ID', async () => {

        const delresponse = await apiContext.delete(`${testLeadData.URLs.leadendpoint}?leadId=${testLeadData.URLs.invalidleadid}`)
        console.log(delresponse.status())
        expect(delresponse.status()).toBe(400)

    })

    test('try to Delete the lead after the first deletion', async () => {
        const delresponse1 = await apiContext.delete(`/lead?leadId=${lead_Id}`)
        expect(delresponse1.status()).toBe(204)
        console.log(delresponse1)
        const delresponse2 = await apiContext.delete(`/lead?leadId=${lead_Id}`)
        expect(delresponse2.status()).toBe(400)
        console.log(delresponse2)
    })

    test('delete lead without authentication', async () => {
        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: testLeadData.Leaddatapayload
        });
        expect(response.status()).toBe(201);

        const body = await response.json();
        const lead_Id1 = body.leadId;

        const apideleteContext = await request.newContext({
            baseURL: testLeadData.URLs.url, // Replace with actual base URL
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
            }
        })
        const delresponse1 = await apideleteContext.delete(`${testLeadData.URLs.leadendpoint}?leadId=${lead_Id1}`)
        expect(delresponse1.status()).toBe(401)

    })


    test('Verify lead is deleted with wrong url  valid data in all fields(optional and mandatory)   in delete API', async () => {

        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: testLeadData.Leaddatapayload
        });
        expect(response.status()).toBe(201);

        const body = await response.json();
        const lead_Id1 = body.leadId;

        const apideleteContext = await request.newContext({
            baseURL: testLeadData.URLs.invalidurl, // Replace with actual base URL
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
            }
        })
        const delresponse1 = await apideleteContext.delete(`${testLeadData.URLs.leadendpoint}?leadId=${lead_Id1}`)
        expect(delresponse1.status()).toBe(404)

    })



    test.afterAll(async () => {
        await apiContext.dispose();
    });


})