import { test, expect, request } from '@playwright/test';
import { testLeadData } from '../../testdata/apitestdata/LeadData/POSTData';
import { queryDB } from '../../utils/dbUtils';

test.describe('Get all Leads nonpageable  Test', () => {
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



test.afterAll(async () => {
    await apiContext.dispose();
  });
})