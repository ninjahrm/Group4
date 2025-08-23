import { faker } from '@faker-js/faker';
export const userPostApiData ={
    userCreationData: {
        department: faker.commerce.department(),
        designation: faker.person.jobTitle(),
        dob: "02/01/2000",
        email: faker.internet.email(),
        empName: faker.person.fullName(),
        experience: faker.number.int({ min: 1, max: 20 }),
        mobileNo: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
        role: faker.person.jobType(),
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