import { faker } from '@faker-js/faker';
import { z } from 'zod';

export const userSchema = z.object({
  empId: z.string(),
  empName: z.string(),
  email: z.string().email(),
  mobileNo: z.string().regex(/^\d{10}$/),
  username: z.string(),
  password: z.string(),
  dob: z.string().optional(),
  experience: z.number().int().min(1).max(20),
  role: z.string(),
  department: z.string(),
  designation: z.string(),
});
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
        endpointdelete: 'admin/user',
        endpointwrong: 'admin/userss'
    },
    extraHTTPHeaders: {
        'Content-Type': "application/json",
        Authorization: "Basic " + Buffer.from("rmgyantra:rmgy@9999").toString("base64")
    },
    extraHTTPHeaders1: {
        'Content-Type': "application/json",
        Authorization: "Basic " + Buffer.from("Priya123:Priya@123").toString("base64")
    },
    extraHTTPHeaders2: {
        'Content-Type': "application/json",
        Authorization: "Basic " + Buffer.from("chitra123:chitra123").toString("base64")
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