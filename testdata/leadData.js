import { countReset } from "console";
import { isNumberObject } from "util/types";
import { faker } from '@faker-js/faker';
  
 export const leadData={
    leadCreationdata:{
    name: faker.person.fullName(),
    company: 'Company1',
    leadSource: 'Source',
    industry: 'Ind',
    annualRevenue: '100',
    noOfEmployees: '500',
    phoneNo:'5675654552',
    email:'abc@rmail.com',
    secEmail:'abc1@rmail.com',
    leadStatus:'New',
    rating:'9',
    assignedTo:'User1',
    address:'101 Brown Mtn Raod',
    city:'San Jacinto',
    country: 'USA',
    postal_code:'65784',
    website:'www.abc.com',
    campaign:' ',
    description:'Lead creation 1'
    },
    leadCreationwithMandotoryfields:{
      name:'LeadAA',
      company: 'CompAA',
      leadSource: 'SRCAA',
      industry: 'IndAA',
      phoneNo:'3434343434',
      leadStatus:'New',
      campaign:' '
    },
   URLs: {
    url: 'http://49.249.28.218:8098',
    successLoginUrl:'http://49.249.28.218:8098/dashboard',
    successLeadCreationURL:'http://49.249.28.218:8098/leads',
    notsuccessLeadCreationURL:'http://49.249.28.218:8098/create-lead',
  },
  login: {
    username: 'rmgyantra',
    password: 'rmgy@9999',
  },
  validationMessages:{
    Message1: "Please fill out this field",
    Message2: " "
  }

 };
  export const LeadTestcases=[
      {
          name:'valid lead details',
          data:leadData.leadCreationdata,
          expectError:false
      },
      {
        name: 'blank lead name - check mandatory',
        data:{...leadData.leadCreationdata,name:' '},
        expectError: { field: 'name', message: 'Please fill out this field.' },
        fieldTypeCheck:null

      },
      {
         name:'validate lead name field is not allowing to enter numeric value',
         data: {...leadData.leadCreationdata,name:'12345'},
         expectError:{field: 'name', message: 'Please fill out this field.'},
          fieldTypeCheck: 'notNumeric'
              
      },
      {
        name: 'blank company',
        data:{...leadData.leadCreationdata,company:' '},
        expectError: { field: 'company', message: 'Please fill out this field.' },
        fieldTypeCheck:null

      },
      {
        name: 'blank industry',
        data:{...leadData.leadCreationdata,industry:' '},
        expectError: { field: 'industry', message: 'Please fill out this field.' },
        fieldTypeCheck:null

      },
      {
        name: 'blank leadSource',
        data:{...leadData.leadCreationdata,leadSource:' '},
        expectError: { field: 'leadSource', message: 'Please fill out this field.' },
        fieldTypeCheck:null

      },
      {
        name: 'blank phoneNo',
        data:{...leadData.leadCreationdata,phoneNo:' '},
        expectError: { field: 'phone', message: 'Please fill out this field.' },
        fieldTypeCheck:null

      },
      {
        name: 'blank leadStatus',
        data:{...leadData.leadCreationdata,leadStatus:' '},
        expectError: { field: 'leadStatus', message: 'Please fill out this field.' },
        fieldTypeCheck:null

      },
      {
        name: 'Invalid Lead Source',
        data:{...leadData.leadCreationdata,leadSource:'1233'},
        expectError: { field: 'leadSource', message: 'Please fill out this field.' },
        fieldTypeCheck:null

      },
      {
        name: 'Invalid Industry',
        data:{...leadData.leadCreationdata,industry:'1234'},
        expectError: { field: 'industry', message: 'Please fill out this field.' },
        fieldTypeCheck:null

      },
      {
        name: 'Invalid leadStatus',
        data:{...leadData.leadCreationdata,leadStatus:'1233'},
        expectError: { field: 'leadStatus', message: 'Please fill out this field.' },
        fieldTypeCheck:null

      },
      {
        name: 'Invalid Phone',
        data:{...leadData.leadCreationdata,phoneNo:'AADD'},
        expectError: { field: 'phone', message: 'Please fill out this field.' },
        fieldTypeCheck:null

      },
      {
        name: 'blank Annual Revenue - check not mandatory',
        data:{...leadData.leadCreationdata,annualRevenue:' '},
        expectError: false ,
        fieldTypeCheck:null

      },
      {
        name: 'blank no of employees - check not mandatory',
        data:{...leadData.leadCreationdata,noOfEmployees:' '},
        expectError:false,
        fieldTypeCheck:null

      },
      {
        name: 'blank email - check not mandatory',
        data:{...leadData.leadCreationdata,email:' '},
        expectError: false,
        fieldTypeCheck:null

      },
      {
        name: 'blank secondary email - check not mandatory',
        data:{...leadData.leadCreationdata,secEmail:' '},
        expectError: false,
        fieldTypeCheck:null

      },
      {
        name: 'blank rating - check not mandatory',
        data:{...leadData.leadCreationdata,rating:' '},
        expectError: false,
        fieldTypeCheck:null

      },
      {
        name: 'blank Assigned to - check not mandatory',
        data:{...leadData.leadCreationdata,assignedTo:' '},
        expectError: false,
        fieldTypeCheck:null

      },
      {
        name: 'blank address - check not mandatory',
        data:{...leadData.leadCreationdata,address:' '},
        expectError: false,
        fieldTypeCheck:null

      },
      {
        name: 'blank city - check not mandatory',
        data:{...leadData.leadCreationdata,city:' '},
        expectError: false,
        fieldTypeCheck:null

      },
      {
        name: 'blank country - check not mandatory',
        data:{...leadData.leadCreationdata,country:' '},
        expectError: false,
        fieldTypeCheck:null

      },
      {
        name: 'blank postal code - check not mandatory',
        data:{...leadData.leadCreationdata,postal_code:' '},
        expectError: false,
        fieldTypeCheck:null

      },
      {
        name: 'blank website - check not mandatory',
        data:{...leadData.leadCreationdata,website:' '},
        expectError: false,
        fieldTypeCheck:null

      },
      {
        name: 'blank description - check not mandatory',
        data:{...leadData.leadCreationdata,description:' '},
        expectError: false,
        fieldTypeCheck:null

      }
    /* {
        name: 'blank campaign',
        data:{...leadData.leadCreationdata,campaign:' '},
        expectError: { field: 'campaign', message: 'Please select a campaign before submitting' },
        fieldTypeCheck:null

      }   */
    ]