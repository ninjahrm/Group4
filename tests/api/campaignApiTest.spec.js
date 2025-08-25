import { test as base, expect, request } from '@playwright/test';
import { apiData } from '../../testdata/apitestdata/CampaignData/campaigndata.js';

// Create a custom test fixture with pre-authenticated request context
const test = base.extend({
    apiRequest: async ({ }, use) => {
        const apiRequestContext = await request.newContext({
            baseURL: apiData.baseURL,
            extraHTTPHeaders: {
                'Authorization': 'Basic ' + Buffer.from(`${apiData.basicAuth.username}:${apiData.basicAuth.password}`).toString('base64'),
                'Content-Type': 'application/json'
            }
        });
        await use(apiRequestContext);
        await apiRequestContext.dispose();
    }
});

test.describe('Campaign API POST tests', () => {
    for (const campaign of apiData.campaigns) {
        test(campaign.testName, async ({ apiRequest }) => {
            const postResponse = await apiRequest.post(
                apiData.endpoint,
                { data: campaign }
            );

            expect(postResponse.status()).toBe(campaign.expectedStatus);
            const postCampaignData = await postResponse.json();
            console.log(`Response for ${campaign.testName}:`, postCampaignData);

            if (postResponse.status() === 201) {
                expect(postCampaignData.campaignId).toBeDefined();
                expect(postCampaignData.campaignName).toBe(campaign.campaignName);
                expect(postCampaignData.campaignStatus).toBe(campaign.campaignStatus);
                expect(postCampaignData.expectedCloseDate).toBe(campaign.expectedCloseDate);
                expect(postCampaignData.targetSize).toBe(campaign.targetSize);
            } else {
                expect(postCampaignData.error).toBeDefined();
            }
        });
    }
});


test('POST with invalid endpoint', async ({ apiRequest }) => {
    const data = apiData.postCampaigns.find(c => c.testName === 'POST with invalid endpoint');
    const response = await apiRequest.post(apiData.invalidEndpoint, { data });
    expect(response.status()).toBe(data.expectedStatus);
    console.log('Response:', await response.json());
});

test('POST with invalid HTTP method', async ({ apiRequest }) => {
    const data = apiData.postCampaigns.find(c => c.testName === 'POST with invalid HTTP method');
    const response = await apiRequest.get(apiData.endpoint, { data });
    expect(response.status()).toBe(data.expectedStatus);
    console.log('Response:', await response.text());
});

test('POST with invalid content type', async ({ }, testInfo) => {
    const data = apiData.postCampaigns.find(c => c.testName === 'POST with invalid content type');
    // Create a new context with invalid content type
    const apiRequestContext = await request.newContext({
        baseURL: apiData.baseURL,
        extraHTTPHeaders: {
            'Authorization': 'Basic ' + Buffer.from(`${apiData.basicAuth.username}:${apiData.basicAuth.password}`).toString('base64'),
            'Content-Type': 'application/xml'
        }
    });
    const response = await apiRequestContext.post(apiData.endpoint, { data });
    expect(response.status()).toBe(data.expectedStatus);
    console.log('Response:', await response.text());
    await apiRequestContext.dispose();
});

test.describe('Campaign API Create and Update tests', () => {
    for (const updateData of apiData.updateCampaigns) {
        test(updateData.testName, async ({ apiRequest }) => {
            // 1. Create campaign (POST)
            const postResponse = await apiRequest.post(apiData.endpoint, { data: updateData });
            expect(postResponse.status()).toBe(201);
            const postCampaignData = await postResponse.json();
            expect(postCampaignData.campaignId).toBeDefined();

            // 2. Update campaign (PUT)
            const campaignId = postCampaignData.campaignId;
            const putResponse = await apiRequest.put(
                `${apiData.endpoint}?campaignId=${campaignId}`,
                { data: { ...updateData, campaignId } }
            );

            expect(putResponse.status()).toBe(updateData.expectedStatus);
            const responseBody = await putResponse.json();
            console.log(`PUT Response for ${updateData.testName}:`, responseBody);

            expect(responseBody.campaignName).toBe(updateData.campaignName);
            expect(responseBody.campaignStatus).toBe(updateData.campaignStatus);
            expect(responseBody.targetSize).toBe(updateData.targetSize);
        });
    }
});

test('GET all campaigns', async ({ apiRequest }) => {

    const response = await apiRequest.get(apiData.getAllCampaignsEndpoint);
    expect(response.ok()).toBeTruthy();
    const campaigns = await response.json();
    console.log('All campaigns:', campaigns);

});


test('GET campaign count', async ({ apiRequest }) => {

    const response = await apiRequest.get(apiData.getCampaignCountEndpoint);
    expect(response.ok()).toBeTruthy();
    const countData = await response.json();
    console.log('Campaign count:', countData);


});

test('GET all campaigns non-pageable', async ({ apiRequest }) => {

    const response = await apiRequest.get(apiData.getAllCampaignsNonPageableEndpoint);
    expect(response.ok()).toBeTruthy();
    const campaigns = await response.json();
    console.log('All campaigns (non-pageable):', campaigns);

    expect(Array.isArray(campaigns)).toBe(true);

});


test('DELETE campaign by campaignId', async ({ apiRequest }) => {
    // First, create a campaign to get a valid campaignId
    const campaignData = apiData.campaigns[0];
    const postResponse = await apiRequest.post(apiData.endpoint, { data: campaignData });
    expect(postResponse.status()).toBe(201);
    const createdCampaign = await postResponse.json();
    const campaignId = createdCampaign.campaignId;
    expect(campaignId).toBeDefined();

    // Now, delete the campaign using campaignId as query param
    const deleteResponse = await apiRequest.delete(`${apiData.endpoint}?campaignId=${campaignId}`);
    expect(deleteResponse.status()).toBe(204); // Assuming 204 No Content for successful delete



});
test('DELETE campaign with non-existent campaignId', async ({ apiRequest }) => {
    const fakeCampaignId = '145999';

    const response = await apiRequest.delete(`${apiData.endpoint}?campaignId=${fakeCampaignId}`);

    expect(response.status()).toBe(400);

    const errorText = await response.text();
    console.log('Delete non-existent campaign response:', errorText);

});


test('DELETE campaign without passing campaignId', async ({ apiRequest }) => {
    const response = await apiRequest.delete(`${apiData.endpoint}`);

    expect(response.status()).toBe(500);

    const errorBody = await response.json();
    console.log('Delete without campaignId response:', errorBody);
});








