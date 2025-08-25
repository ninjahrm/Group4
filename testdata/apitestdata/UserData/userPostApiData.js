import { faker } from '@faker-js/faker';
export const userPostApiData ={
    userCreationData: {
        department: faker.commerce.department(),
        designation: faker.person.jobTitle(),
        dob: "02/01/2000",
        email: faker.internet.email(),
        empName: faker.person.fullName()+ Math.floor(Math.random() * 10),
        experience: faker.number.int({ min: 1, max: 20 }),
        mobileNo: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
        role: faker.person.jobType(),
        username: faker.internet.username()+Math.floor(Math.random() * 100),
        password : faker.internet.password(8,true,/[A-Z]/,[1,'@','#','$','%','&','*'] )
        
    },
    userCreationDatawithMandatoryfields: {
	    empName: faker.person.fullName(),
        email: faker.internet.email(),
        mobileNo: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
        username: faker.internet.username(),
        password : faker.internet.password(8,true,/[A-Z]/,[1,'@','#','$','%','&','*'] )
    },
    URLs: {
        baseurl: 'http://49.249.28.218:8098',
        endpoint: '/admin/create-user',
        endpointget: 'admin/users',
        endpointgetwpag: 'admin/users-paginated',
        endpointcount: 'admin/users-count',
        endpointdelete: 'admin/user'
    },
    extraHTTPHeaders: {
        'Content-Type': "application/json",
        Authorization: "Basic " + Buffer.from("rmgyantra:rmgy@9999").toString("base64")
    }
};

export function generateUniqueUserData(overrides = {}) {
  const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;

  return {
    username: `user_${uniqueId}`,
    email: `user_${uniqueId}@test.com`,
    empName: faker.person.fullName()+ Math.floor(Math.random() * 10),
    mobileNo: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
    dob: '02/01/2000',
    experience: 2,
    designation: faker.person.jobTitle(),
    password: faker.internet.password(),
    role: faker.person.jobType(),
    department: faker.commerce.department(),
    ...overrides, // allows you to override fields per test
  };
}