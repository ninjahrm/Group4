import { test, expect, request } from '@playwright/test';
import { testLeadData } from '../../testdata/apitestdata/LeadData/POSTData';
import { queryDB } from '../../utils/dbUtils';

test.describe.serial('Lead Count Test', () => {
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

    test('Verify api returns lead count with wrong Http Method', async () => {

        const response = await apiContext.post(`${testLeadData.URLs.countendpoint}`)
        console.log("Status:", response.status());
        const body = await response.text();
        console.log("Response body:", body);

        expect([400, 500]).toContain(response.status())
    })


    test('Verify count returns correct total number of leads', async () => {
        const response = await apiContext.get(`${testLeadData.URLs.countendpoint}`)
        console.log("Status:", response.status());
        const body = await response.text();
        console.log("Response body:", body);

        expect(response.status()).toBe(200)
    })






    test('Verify count lead get increased after adding a new lead', async () => {
        //getting count before lead creation
        const dbbefore = await queryDB('select count(*) AS count_lead from lead')
        const dbcountbefore = dbbefore[0].count_lead;

        //api response before creating lead
        const apiBeforeResp = await apiContext.get('/lead/count');
        const countbeforeapi = await apiBeforeResp.json();

        //create new lead

        const responsecreate = await apiContext.post('/lead?campaignId=CAM07703', {
            data: testLeadData.Leaddatapayload
        });

        expect(responsecreate.status()).toBe(201)

        //get count from api
        const response = await apiContext.get('/lead/count')
        const countafterapi = await response.json()
        console.log("the count of leads =", countafterapi)

        //checking in DB
        const dbafter = await queryDB('select count(*) AS count_lead from lead')
        const dbcountafter = dbafter[0].count_lead;

        //validating with database

        expect(dbcountafter - dbcountbefore).toBe(1);     // DB increased by 1
        expect(countafterapi - countbeforeapi).toBe(1);
    })


    test('Verify count lead get decreased after deleting a new lead', async () => {





        //create new lead
        const response = await apiContext.post(`${testLeadData.URLs.leadendpoint}?campaignId=${testLeadData.Leaddatapayload.campaign.campaignId}`, {
            data: testLeadData.Leaddatapayload
        });
        //expect(response.status()).toBe(201);


        const body = await response.json();
        const lead_Id = body.leadId;

        const dbbefore = await queryDB('select count(*) AS count_lead from lead')
        const dbcountbefore = dbbefore[0].count_lead;

        //api response before creating lead
        const apiBeforeResp = await apiContext.get(`${testLeadData.URLs.countendpoint}`);
        const countbeforeapi = await apiBeforeResp.json();


        const responsedelete = await apiContext.delete(`${testLeadData.URLs.leadendpoint}?leadId=${lead_Id}`, {
            data: testLeadData.Leaddatapayload
        });

        expect(responsedelete.status()).toBe(204)

        //get count from api
        const countresponse = await apiContext.get(`${testLeadData.URLs.countendpoint}`)
        const countafterapi = await countresponse.json()
        console.log("the count of leads =", countafterapi)

        //checking in DB
        const dbafter = await queryDB('select count(*) AS count_lead from lead')
        const dbcountafter = dbafter[0].count_lead;

        //validating with database

        //expect(dbcountafter - dbcountbefore).toBe(1);     // DB increased by 1
        expect(dbcountbefore - dbcountafter).toBe(1);
        expect(countbeforeapi - countafterapi).toBe(1);
    })

    test('Verify count returns correct total number of leads without authentication', async () => {
        const apinoauthContext = await request.newContext({
            baseURL: testLeadData.URLs.url,
            extraHTTPHeaders: {
                'Content-Type': 'application/json'
            }

        });
        const response = await apinoauthContext.get(`${testLeadData.URLs.countendpoint}`)
        const countafterapi = await response.json()
        console.log("the count of leads =", countafterapi)
        expect(response.status()).toBe(401)

    })


    test.afterAll(async () => {
        await apiContext.dispose();
    });


})