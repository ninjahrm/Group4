export const apiData = {
    baseURL: 'http://49.249.28.218:8098',
    endpoint: '/campaign',
    basicAuth: {
        username: 'rmgyantra',
        password: 'rmgy@9999'
    },
    campaigns: [
        {
            testName: 'Create campaign with valid data',
            campaignId: 'Camp_01',
            campaignName: 'Summer Sale',
            campaignStatus: 'Active',
            description: 'Campaign for summer sale',
            expectedCloseDate: '2026-08-25',
            targetAudience: 'Customers',
            targetSize: 500,
            expectedStatus: 201
        },
        {
            testName: 'Create campaign with different campaign status',
            campaignId: "Camp_02",
            campaignName: "Product Launch",
            campaignStatus: "Planned",
            description: "Campaign for launch a new product",
            expectedCloseDate: "2026-08-25",
            targetAudience: "Customers",
            targetSize: 500,
            expectedStatus: 201
        },
        {
            testName: 'Create campaign with mandatory fields only',
            campaignId: "",
            campaignName: "Summer Sale",
            campaignStatus: "",
            description: "",
            expectedCloseDate: "",
            targetAudience: "",
            targetSize: 500,
            expectedStatus: 201
        },
        {
            testName: 'Create campaign with campaign Name field empty',
            campaignId: "Camp_02",
            campaignName: "",
            campaignStatus: "Planned",
            description: "Campaign for launch a new product",
            expectedCloseDate: "2026-08-25",
            targetAudience: "Customers",
            targetSize: 500,
            expectedStatus: 400
        },
        {
            testName: 'Create campaign with target size field empty',
            campaignId: "Camp_02",
            campaignName: "Product Launch",
            campaignStatus: "Planned",
            description: "Campaign for launch a new product",
            expectedCloseDate: "2026-08-25",
            targetAudience: "Customers",
            targetSize: null,
            expectedStatus: 400
        },

        {
            testName: 'Create campaign with invalid date format',
            campaignId: "Camp_02",
            campaignName: "Product Launch",
            campaignStatus: "Planned",
            description: "Campaign for launch a new product",
            expectedCloseDate: "25/12/2025",
            targetAudience: "Customers",
            targetSize: 500,
            expectedStatus: 400
        },
        {
            testName: 'Create campaign with negative target size',
            campaignId: "Camp_02",
            campaignName: "Product Launch",
            campaignStatus: "Planned",
            description: "Campaign for launch a new product",
            expectedCloseDate: "2026-08-25",
            targetAudience: "Customers",
            targetSize: -500,
            expectedStatus: 400
        },
        {
            testName: 'Create campaign with all fields empty',
            campaignId: "",
            campaignName: "",
            campaignStatus: "",
            description: "",
            expectedCloseDate: "",
            targetAudience: "",
            targetSize: null,
            expectedStatus: 400
        },
        {
            testName: 'Create campaign with duplicate campaign name',
            campaignId: 'Camp_01',
            campaignName: 'Summer Sale',
            campaignStatus: 'Active',
            description: 'Campaign for summer sale',
            expectedCloseDate: '2026-08-25',
            targetAudience: 'Customers',
            targetSize: 5000,
            expectedStatus: 201
        }

        ],
        
        postCampaigns: [
        {
            testName: 'POST with invalid endpoint',
            endpoint: '/camp', // wrong endpoint
            
            campaignId: 'Camp_08',
            campaignName: 'Summer sale',
            campaignStatus: 'Active',
            description: 'Testing invalid endpoint',
            expectedCloseDate: '2026-08-25',
            targetAudience: 'Customers',
            targetSize: 100,
            expectedStatus: 405, //  server returns 405 for invalid endpoint
        },
        {
            testName: 'POST with invalid HTTP method',
            
            campaignId: 'camp_05',
            campaignName: 'Summer sale',
            campaignStatus: 'Active',
            description: 'Testing invalid HTTP method',
            expectedCloseDate: '2026-08-25',
            targetAudience: 'Customers',
            targetSize: 100,
            expectedStatus: 500, //  server returns 500 for invalid method
        },
        {
            testName: 'POST with invalid content type',
            
            campaignId: 'Camp_09',
            campaignName: 'Summer sale',
            campaignStatus: 'Active',
            description: 'Testing invalid content type',
            expectedCloseDate: '2026-08-25',
            targetAudience: 'Customers',
            targetSize: 100,
            expectedStatus: 500, //  server returns 500 for invalid content type
        }

    ],
    updateCampaigns: [
        {
            testName: 'Update campaign status to Cancelled',
            campaignName: 'Summer Sale',
            campaignStatus: 'Cancelled',
            description: 'Updated campaign for summer sale',
            expectedCloseDate: '2026-08-25',
            targetAudience: 'Customers',
            targetSize: 500,
            expectedStatus: 200
        },
        {
            testName: 'Update campaign name and target size',
            campaignName: 'Winter Sale',
            campaignStatus: 'Active',
            description: 'Updated campaign for winter sale',
            expectedCloseDate: '2026-12-15',
            targetAudience: 'Customers',
            targetSize: 1000,
            expectedStatus: 200
        }

    ]
};