export const userPostApiData ={
    userCreationData: {
        department: "Dept",
        designation: "Des",
        dob: "03/23/1987",
        email: "Sara2@fmail.com",
        empName: "Sara2",
        experience: 7,
        mobileNo: "8463068311",
        role: "Lead",
        username: "Sara2",
        password : "Sarah@123"
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