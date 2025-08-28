
export const testLeadData = {

  URLs: {
    url: 'http://49.249.28.218:8098',
    invalidurl:'http://49.249.28.218:8068',
    leadendpoint:'/lead',
    leadinvalidendpoint:'/leadss',
    campaignendpoint:'/campaign'
  },
  login: {
    invalidusername:'nothinguser',
    invalidpassword:'#$%%%6&',
    username: 'user16_vijay',
    password: '@123456'
  },

Leaddatapayload :{
  "address": "1345 Main Street",
  "annualRevenue": 5000000,
  "assignedTo": "John Ding",
  "campaign": {
    "campaignId": "CAM07703",
    "campaignName": "camp123",
    "campaignStatus": "active",
    "targetSize": 23,
    "expectedCloseDate": "01-09-2025",
    "targetAudience": "students",
    "description": "abcwertt"

  },
  "city": "New York",
  "company": "Tekarak limited",
  "country": "USA",
  "description": "Potential high-value client",
  "email": "client@example.com",
  "industry": "Technology",
  "leadSource": "Web",
  "leadStatus": "New",
  "name": "Alice Johnson",
  "noOfEmployees": 250,
  "phone": "+1-555-123-4567",
  "postalCode": 10001,
  "rating": 8,
  "secondaryEmail": "alice.johnson@workmail.com",
  "website": "https://www.techsolutions.com"
},

mandatoryfields:{
    "campaign": {
    "campaignId": "{{campaignId}}",
    "campaignName": "Summer Sales Campaign",
    "campaignStatus": "Active",
    "description": "Campaign to boost summer product sales",
    "expectedCloseDate": "2025-12-31",
    "targetAudience": "Retail Customers",
    "targetSize": 200
  },
  "company": "Tekark Solutions Inc",
  "industry": "Technology",
  "leadSource": "Web",
  "leadStatus": "New",
  "name": "Alice Johnson",
  "phone": "+1-555-123-4568"

},

UpdateLeadpayload:{
    
  "address": "456 Oak Avenue",
  "annualRevenue": 7500000,
  "assignedTo": "Jane Smith",
  "campaign": {
    "campaignId": "CAM07703",
    "campaignName": "camp123",
    "campaignStatus": "active",
    "targetSize": 23,
    "expectedCloseDate": "01-09-2025",
    "targetAudience": "students",
    "description": "abcwertt"

  },
  "city": "San Francisco",
  "company": "Innovatech Corp",
  "country": "Canada",
  "description": "Prospective partner for tech collaboration",
  "email": "partner@innovatech.ca",
  "industry": "Software",
  "leadSource": "Referral",
  "leadStatus": "In Progress",
  "name": "Robert Williams",
  "noOfEmployees": 120,
  "phone": "+1-604-987-6543",
  "postalCode": 99990,
  "rating": 5,
  "secondaryEmail": "robert.williams@innovatech.ca",
  "website": "https://www.innovatech.ca"

},

leadSchema : {
  type: "object",
  properties: {
    leadId: { type: "string" }, // usually returned by backend
    address: { type: "string" },
    annualRevenue: { type: "number" },
    assignedTo: { type: "string" },
    campaign: {
      type: "object",
      properties: {
        campaignId: { type: "string" },
        campaignName: { type: "string" },
        campaignStatus: { type: "string" },
        targetSize: { type: "number" },
        expectedCloseDate: { type: "string" },
        targetAudience: { type: "string" },
        description: { type: "string" }
      },
      required: ["campaignId", "campaignName", "campaignStatus"]
    },
    city: { type: "string" },
    company: { type: "string" },
    country: { type: "string" },
    description: { type: "string" },
    email: { type: "string", format: "email" },
    industry: { type: "string" },
    leadSource: { type: "string" },
    leadStatus: { type: "string" },
    name: { type: "string" },
    noOfEmployees: { type: "number" },
    phone: { type: "string" },
    postalCode: { type: "number" },
    rating: { type: "number" },
    secondaryEmail: { type: "string", format: "email" },
    website: { type: "string" }
  },
  required: [
    "leadId", 
    "name", 
    "company", 
    "email", 
    "campaign", 
    "leadStatus"
  ],
  additionalProperties: true
}
};