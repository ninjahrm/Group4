import { test, expect, request } from '@playwright/test';
import { testLeadData } from '../../testdata/apitestdata/LeadData/POSTData';

import { queryDB } from '../../utils/dbUtils';

import Ajv from 'ajv';
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

test.describe('Get all Leads pageable  Test', () => {
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
  test.skip('Get the list of all leads and Verify all the fields in lead module in json are present', async () => {

    const response = await apiContext.get(`${testLeadData.URLs.getallendpoint}`)
    const getallresponsebody = await response.json();

    const leads = Array.isArray(getallresponsebody) ? getallresponsebody : getallresponsebody.content;
    let expectedfields = ["address", "annualRevenue", "assignedTo", "campaign", "city", "company", "country", "description",
      "email", "industry", "leadId", "leadSource", "leadStatus", "name", "noOfEmployees", "phone", "postalCode", "rating", "secondaryEmail", "website"]

    leads.forEach((lead, index) => {
      expectedfields.forEach(field => {
        expect(lead).toHaveProperty(field)
      })
    });

  })

  test('Verify get all leads with wrong http method', async () => {
    const response = await apiContext.put(`${testLeadData.URLs.getallendpoint}`)
    const body = await response.text();   // /lead/all-leads'get raw text response

    expect(body).toContain("Request method 'PUT' not supported");
    expect([405, 500]).toContain(response.status())

  })

  test('Verify get all leads without pagination with wrong endpoint', async () => {
    const apiinvepContext = await request.newContext({
      baseURL: testLeadData.URLs.invalidurl,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${testLeadData.login.username}:${testLeadData.login.password}`).toString('base64')
      }
    });
    const response = await apiContext.put(`${testLeadData.URLs.getallendpoint}`)
    expect([400, 500]).toContain(response.status())


  })

  test('Verify all the fields in lead module  in correct data format', async () => {
    const response = await apiContext.get(`${testLeadData.URLs.getallendpoint}`)
    expect(response.status()).toBe(200)

    const responsedata = await response.json()
    console.log(responsedata)

    const listSchema = {
      type: "array",
      items: testLeadData.leadSchema
    };

    const validatedata = ajv.compile(listSchema)
    const valid = validatedata(responsedata)
    expect(valid, JSON.stringify(validatedata.errors, null, 2)).toBeTruthy()

  })


  test('verify lead list is displayed in sorted order with lead ids', async () => {
    const response = await apiContext.get(`${testLeadData.URLs.getallendpoint}`)
    expect(response.status()).toBe(200)

    const leads = await response.json()
    const leadids = leads.map(l => l.leadId)

    const sortedleadIds = [...leadids].sort()
    expect(leadids).toEqual(sortedleadIds)
  })


  test.afterAll(async () => {
    await apiContext.dispose();
  });

});

