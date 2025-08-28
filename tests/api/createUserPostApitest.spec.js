import { test, expect,request } from '@playwright/test'
import { userPostApiData,generateUniqueUserData, userSchema } from '../../testdata/apitestdata/UserData/userPostApiData';
import { queryDB } from '../../utils/dbUtils';
import { z } from 'zod';
//Added by Sashitra - 08/20/2025 Post API Tests

//Before method to set API Context with URI and Headers
test.describe('User API tests', () => {

let apiContext;
console.log(userPostApiData.URLs.baseurl);
test.beforeAll(async ({ playwright }) => {
apiContext = await request.newContext({
baseURL:userPostApiData.URLs.baseurl,
extraHTTPHeaders:userPostApiData.extraHTTPHeaders // Replace with actual base URL

});
});
//const { queryDB } = require('./dbUtils');

//Test 1 - Create New User
test('Create new user', async () => {

console.log(userPostApiData.URLs.endpoint);
console.log(userPostApiData.userCreationData);
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userPostApiData.userCreationData
    }
);
console.log(response.status());
console.log(response.text());

expect(response.ok()).toBeTruthy(); // checks 2xx status
const responseBody = await response.json();
console.log(responseBody);
 try {
    userSchema.parse(responseBody);
    console.log('✅ Response schema is valid');
  } catch (e) {
    console.error('❌ Schema validation failed:', e.errors);
    throw e; // Fails the test
  }
expect(responseBody.empName).toBe(userPostApiData.userCreationData.empName);



const dbData = await queryDB('SELECT * FROM employee where emp_name= ?',[responseBody.empName]);
console.log(dbData[0].emp_id);
console.log(dbData[0].emp_name);

});

//Test 2 - Create new user with only mandatory fields
test('Create new user with only mandatory fields', async () => {

console.log(userPostApiData.URLs.endpoint);
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userPostApiData.userCreationDatawithMandatoryfields
    }
);
console.log(response.status());
console.log(response.text());
expect(response.ok()).toBeTruthy(); // checks 2xx status
const responseBody = await response.json();
console.log(responseBody);

expect(responseBody.empName).toBe(userPostApiData.userCreationDatawithMandatoryfields.empName);
});

//Test 3 - Create new user with blank user full name
test('Create new user with blank user fullname', async ()  => {

console.log(userPostApiData.URLs.endpoint);
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: {...userPostApiData.userCreationData,empName:' '},
    }
);
console.log(response.text());
console.log(response.status());

expect(response.status()).toBe(400);
const responseBody = await response.json();
console.log(responseBody);

});

//Test 4 - Create new user with  blank mobile no
test('Create new user with blank mobile number', async ()  => {

console.log(userPostApiData.URLs.endpoint);
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: {...userPostApiData.userCreationData,mobileNo:' '},
    }
);
console.log(response.text());
console.log(response.status());

expect(response.status()).toBe(422);
const responseBody = await response.json();
console.log(responseBody);

});

//Test 5 - Create new user with blank email
test('Create new user with blank email', async ()  => {

console.log(userPostApiData.URLs.endpoint);
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: {...userPostApiData.userCreationData,email:' '},
    }
);
console.log(response.text());
console.log(response.status());

expect(response.status()).toBe(422);
const responseBody = await response.json();
console.log(responseBody);

});

//Test 6 - Create new user with blank username
test('Create new user with blank username', async ()  => {

console.log(userPostApiData.URLs.endpoint);
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: {...userPostApiData.userCreationData,username:' '},
    }
);
console.log(response.text());
console.log(response.status());

expect(response.status()).toBe(422);
const responseBody = await response.json();
console.log(responseBody);

});

//Test 7 Create new user with blank password
test('Create new user with blank password', async ()  => {

console.log(userPostApiData.URLs.endpoint);
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: {...userPostApiData.userCreationData,password:' '},
    }
);
console.log(response.text());
console.log(response.status());

expect(response.status()).toBe(422);
const responseBody = await response.json();
console.log(responseBody);

});

//Test 8 - Create new user with blank Designation
test('Create new user with blank designation', async () => {

console.log(userPostApiData.URLs.endpoint);

const userData = generateUniqueUserData({ designation: '' }); 
console.log(userData);
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,

    }
);
console.log(response.status());

expect(response.ok()).toBeTruthy(); // checks 2xx status
const responseBody = await response.json();
console.log(responseBody);

//expect(responseBody.empName).toBe(userData.empName);
});

//Test 9 - Create new user with blank Department
test('Create new user with blank Department', async () => {
console.log(userPostApiData.URLs.endpoint);
//console.log(userPostApiData.userCreationData);
const userData = generateUniqueUserData({ department: '' }); 
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,

    }
);
console.log(await response.status());
console.log(await response.text());
expect(response.ok()).toBeTruthy(); // checks 2xx status
const responseBody = await response.json();
console.log(responseBody);

expect(responseBody.empName).toBe(userData.empName);
});

//Test 10 - Create new user with blank role
test('Create new user with blank role', async () => {

console.log(userPostApiData.URLs.endpoint);
const userData = generateUniqueUserData({ role: '' }); 
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,
    }
);
console.log(response.status());

expect(response.ok()).toBeTruthy(); // checks 2xx status
const responseBody = await response.json();
console.log(responseBody);

expect(responseBody.empName).toBe(userData.empName);

});
//Test 11 - Create new user with blank DOB
test('Create new user with blank DOB', async () => {

console.log(userPostApiData.URLs.endpoint);

const userData = generateUniqueUserData({ dob: ' ' });
console.log(userData);
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,
    }
);
console.log(response.status());
console.log(await response.text());
expect(response.ok()).toBeTruthy(); // checks 2xx status
const responseBody = await response.json();
console.log(responseBody);

expect(responseBody.empName).toBe(userData.empName);
});

//Test 12 - Create new user with blank experience
test('Create new user with blank experience', async () => {

console.log(userPostApiData.URLs.endpoint);
 const userData = generateUniqueUserData({ experience: '' });
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,
    }
);
console.log(response.status());

expect(response.ok()).toBeTruthy(); // checks 2xx status
const responseBody = await response.json();
console.log(responseBody);

expect(responseBody.empName).toBe(userData.empName);
});


//Test 13 - Create new user with numeric user full name
test('Create new user with numeric employee full name', async () => {

console.log(userPostApiData.URLs.endpoint);
 const userData = generateUniqueUserData({ empName: 8796559 });
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,
    }
);
console.log(response.status());

expect(response.ok()).toBeFalsy(); // checks 4xx  or 5xx status
const responseBody = await response.json();
console.log(responseBody);


});

//Test 14 - Create new user with numeric user department
test('Create new user with numeric employee department', async () => {

console.log(userPostApiData.URLs.endpoint);
 const userData = generateUniqueUserData({ department: 876559 });
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,
    }
);
console.log(response.status());

expect(response.ok()).toBeFalsy(); // checks 4xx  or 5xx status
const responseBody = await response.json();
console.log(responseBody);


});

//Test 15 - Create new user with numeric user designation
test('Create new user with numeric employee designation', async () => {

console.log(userPostApiData.URLs.endpoint);
 const userData = generateUniqueUserData({ designation: 876559 });
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,
    }
);
console.log(response.status());

expect(response.ok()).toBeFalsy(); // checks 4xx  or 5xx status
const responseBody = await response.json();
console.log(responseBody);


});

//Test 16 - Create new user with numeric user role
test('Create new user with numeric employee role', async () => {

console.log(userPostApiData.URLs.endpoint);
 const userData = generateUniqueUserData({ role: 876559 });
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,
    }
);
console.log(response.status());

expect(response.ok()).toBeFalsy(); // checks 4xx  or 5xx status
const responseBody = await response.json();
console.log(responseBody);


});

//Test 17 - Create new user with numeric user role
test('Create new user with string employee mobile', async () => {

console.log(userPostApiData.URLs.endpoint);
 const userData = generateUniqueUserData({ mobileNo: "phoneno" });
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,
    }
);
console.log(response.status());

expect(response.ok()).toBeFalsy(); // checks 4xx  or 5xx status
const responseBody = await response.json();
console.log(responseBody);


});

//Test 18 - Create new user with numeric user email
test('Create new user with numeric employee email', async () => {

console.log(userPostApiData.URLs.endpoint);
 const userData = generateUniqueUserData({ email: 876559 });
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,
    }
);
console.log(response.status());

expect(response.ok()).toBeFalsy(); // checks 4xx  or 5xx status
const responseBody = await response.json();
console.log(responseBody);


});

//Test 19 - Create new user with string value for email
test('Create new user with string employee email', async () => {

console.log(userPostApiData.URLs.endpoint);
 const userData = generateUniqueUserData({ email: 'email' });
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,
    }
);
console.log(response.status());

expect(response.ok()).toBeFalsy(); // checks 4xx  or 5xx status
const responseBody = await response.json();
console.log(responseBody);


});

//Test 20 - Create new user with string value for experience
test('Create new user with string employee experience', async () => {

console.log(userPostApiData.URLs.endpoint);
 const userData = generateUniqueUserData({ experience: 'exper' });
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,
    }
);
console.log(response.status());

expect(response.ok()).toBeFalsy(); // checks 4xx  or 5xx status
const responseBody = await response.json();
console.log(responseBody);


});

//Test 21 - Create new user with string value for DOB
test('Create new user with string employee DOB', async () => {

console.log(userPostApiData.URLs.endpoint);
 const userData = generateUniqueUserData({ dob: 'dob' });
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,
    }
);
console.log(response.status());

expect(response.ok()).toBeFalsy(); // checks 4xx  or 5xx status
const responseBody = await response.json();
console.log(responseBody);


});

//Test 22 - Create new user with invalid value for DOB
test('Create new user with invalid employee DOB', async () => {

console.log(userPostApiData.URLs.endpoint);
 const userData = generateUniqueUserData({ dob: '22/45/0100' });
const response = await apiContext.post(userPostApiData.URLs.endpoint,
    {
        data: userData,
    }
);
console.log(response.status());

expect(response.ok()).toBeFalsy(); // checks 4xx  or 5xx status
const responseBody = await response.json();
console.log(responseBody);


});

//Test 23 - Create new user with invalid endpoint
test('Create new user with invalid endpoint', async () => {

console.log(userPostApiData.URLs.endpointwrong);
 const userData = generateUniqueUserData({ dob: '22/45/0100' });
const response = await apiContext.post(userPostApiData.URLs.endpointwrong,
    {
        data: userData,
    }
);
console.log(response.status());

expect(response.ok()).toBeFalsy(); // checks 4xx  or 5xx status
expect(response.status()).toBe(405);
const responseBody = await response.json();
console.log(responseBody);


});

//After method for cleanup
test.afterAll(async () => {
await apiContext.dispose();
});
});


