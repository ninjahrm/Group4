import { test, expect } from '@playwright/test';
import { apiData } from '../../testdata/apitestdata/CampaignData/campaigndata.js';


test.describe('Campaign API POST tests', () => {
    for (const campaign of apiData.campaigns) {
        test(campaign.testName, async ({ request }) => {
            const postResponse = await request.post(
                `${apiData.baseURL}${apiData.endpoint}`, // <-- Use full URL
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + Buffer.from(`${apiData.basicAuth.username}:${apiData.basicAuth.password}`).toString('base64')
                    },
                    data: campaign
                }
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
test('POST with invalid endpoint', async ({ request }) => {
    const data = apiData.postCampaigns.find(c => c.testName === 'POST with invalid endpoint');
    const response = await request.post(`${apiData.baseURL}${apiData.endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(`${apiData.basicAuth.username}:${apiData.basicAuth.password}`).toString('base64')
        },
        data
    });
    expect(response.status()).toBe(data.expectedStatus);
    console.log('Response:', await response.text());
});

test('POST with invalid HTTP method', async ({ request }) => {
    const data = apiData.postCampaigns.find(c => c.testName === 'POST with invalid HTTP method');
    const response = await request.get(`${apiData.baseURL}${apiData.endpoint}`, { // Should be POST, using GET
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(`${apiData.basicAuth.username}:${apiData.basicAuth.password}`).toString('base64')
        },
        data
    });
    expect(response.status()).toBe(data.expectedStatus);
    console.log('Response:', await response.text());
});

test('POST with invalid content type', async ({ request }) => {
    const data = apiData.postCampaigns.find(c => c.testName === 'POST with invalid content type');
    const response = await request.post(`${apiData.baseURL}${apiData.endpoint}`, {
        headers: {
            'Content-Type': 'application/xml', // Invalid content type
            'Authorization': 'Basic ' + Buffer.from(`${apiData.basicAuth.username}:${apiData.basicAuth.password}`).toString('base64')
        },
        data
    });
    expect(response.status()).toBe(data.expectedStatus);
    console.log('Response:', await response.text());
});


test.describe('Campaign API Create and Update tests', () => {

    for (const updateData of apiData.updateCampaigns) {
        test(updateData.testName, async ({ request }) => {
            // 1. Create campaign (POST)
            const postResponse = await request.post(`${apiData.baseURL}${apiData.endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + Buffer.from(`${apiData.basicAuth.username}:${apiData.basicAuth.password}`).toString('base64')
                },
                data: updateData
            });

            expect(postResponse.status()).toBe(201);
            const postCampaignData = await postResponse.json();
            expect(postCampaignData.campaignId).toBeDefined();

            // 2. Update campaign (PUT)
            const campaignId = postCampaignData.campaignId;
            const putResponse = await request.put(
               `${apiData.baseURL}${apiData.endpoint}?campaignId=${campaignId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + Buffer.from(`${apiData.basicAuth.username}:${apiData.basicAuth.password}`).toString('base64')
                    },
                    data: { ...updateData, campaignId }
                }
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