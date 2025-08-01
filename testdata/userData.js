import { faker } from '@faker-js/faker';


export const validationURLs = {
    createUserSuccess: 'http://49.249.28.218:8098/users',
    homePage : 'http://49.249.28.218:8098/dashboard',
    
}

export const dropdownData = {
    adminConsoleDropdownItems: ['Create User', 'View Users']
  };

export const dropdownItems = [
    {
        name:'click on create user',
        selectText: 'Create User',
        url: 'http://49.249.28.218:8098/create-user',
    },
    {name:'clicl on view users',
        selectText: 'View Users',
        url: 'http://49.249.28.218:8098/users',
    }, 
]

export const fieldNames = {
    fullName: 'usersFullName',
    mobileNo: 'usersMobileNo',
    email: 'usersEmail',
    userName: 'usersUsername',
    password: 'usersPassword',
    dateOfBirth: 'dateOfBirth',
  };
  
export const fullNameData =[
   
        { Name: 'Enter valid users full name',fieldValue: faker.person.fullName() ,error: ''},
        {  Name: 'Enter numbers for users full name',fieldValue: '1234' ,error: 'Please fill out this field.'},
        {  Name: 'Enter special chracter for users full name',fieldValue: '!@#' ,error: 'Please fill out this field.'},
        {  Name: 'Enter alphanumeric and special character for users full name',fieldValue: 'Sam1234!@#sam' ,error: ''},
        {  Name: 'Enter Single character for users full name',fieldValue: 'S' ,error: 'Please lengthen this text to 2 characters or more (you are currently using 1 character).'},
        {  Name: 'Users full name is left blank',fieldValue: '',error: 'Please fill out this field.' },
        {  Name: 'Enter blank spaces for users full name',fieldValue: '       ' ,error: 'Please fill out this field.'},    
        {  Name: 'Enter more than 21 characters for users full name',fieldValue: 'Sam John Sam John Sam John' ,error: ''},

     
];

export const mobileNoData = [
    { Name: 'Enter valid mobile number', fieldValue: faker.string.numeric(10), error: '' },
    { Name: 'Enter less than 10 digits mobile number', fieldValue: '123456789', error: '' },
    { Name: 'Enter more than 10 digits mobile number', fieldValue: '12345678901', error: '' },
    { Name: 'Enter alphabets for mobile number', fieldValue: 'abcde', error: 'Please fill out this field.' },
    { Name: 'Enter special characters for mobile number', fieldValue: '!@#$', error: 'Please fill out this field.' },
    { Name: 'Enter alphanumeric characters for mobile number', fieldValue: '123abc456', error:'' },
    { Name: 'Mobile number is left blank', fieldValue: '', error: 'Please fill out this field.' },
    { Name: 'Enter blank spaces for mobile number', fieldValue: '       ', error: 'Please fill out this field.' },
];

    

export const emailData = [
    { Name: 'Enter valid email address', fieldValue: faker.internet.email(), error: '' },
    { Name: 'Enter email address without @ symbol', fieldValue: 'test123qa.net', error: 'Please enter a valid email address' },
    { Name: 'Enter email address without domain', fieldValue: 'test123@', error: 'Please enter a valid email address' },
    { Name: 'Enter email address without username', fieldValue: '@qa.com', error: 'Please enter a valid email address' },
    { Name: 'Enter email address with invalid domain', fieldValue: 'test123@.123', error: 'Please enter a valid email address' },
    { Name: 'Enter email address with invalid TLD', fieldValue: 'test123    @qa.invalid', error: 'Please enter a valid email address' },
    { Name: 'Enter email address with special characters after @', fieldValue: 'test123@!#qa.com', error: 'Please enter a valid email address' },
    { Name: 'Enter valid email address with co.in',fieldValue:'test123@qa.co.IN',error:''},
    { Name: 'Enter email address with invalid characters', fieldValue: 'test123@qa. com', error: 'Please enter a valid email address' },
    { Name: 'Enter invalid email address', fieldValue: 'test123@qa', error: 'Please enter a valid email address' },
    { Name: 'Enter email address with special characters', fieldValue: 'test!@  qa.com', error: 'Please enter a valid email address' },
    { Name: 'Enter email address with spaces', fieldValue: 'test123 @qa.com', error:'Please enter a valid email address' },
    { Name: 'Email address is left blank', fieldValue: '', error: 'Please fill out this field.' },
    { Name: 'Enter blank spaces for email address', fieldValue: '       ', error: 'Please fill out this field.' },
]; 

export const usernameData = [
    { Name: 'Enter valid username', fieldValue: faker.internet.userName(), error: '' },
    { Name: 'Enter username with special characters', fieldValue: 'test@user!', error: '' },
    { Name: 'Enter username with spaces', fieldValue: 'test user', error: 'Please enter a valid username' },
    { Name: 'Enter username with less than 3 characters', fieldValue: 'ab', error: 'Please lengthen this text to 6 characters or more' },
    { Name: 'Username is left blank', fieldValue: '', error: 'Please fill out this field.' },
    { Name: 'Enter blank spaces for username', fieldValue: '       ', error: 'Please fill out this field.' },
];

export const passwordData = [
    { Name: 'Enter valid password', fieldValue: 'Password123!', error: '' },
    { Name: 'Enter password with less than 6 characters', fieldValue: 'Pass1', error: 'Please lengthen this text to 6 characters or more' },
    { Name: 'Enter password with more than 20 characters', fieldValue: 'Thisisaverylongpassword12345!', error: 'Password must not exceed 20 characters' },
    { Name: 'Enter password without uppercase letters', fieldValue: 'password   123!', error: 'Password must contain at least one uppercase letter' },
    { Name: 'Enter password without lowercase letters', fieldValue: 'PASSWORD123!', error: 'Password must contain at least one lowercase letter' },
    { Name: 'Enter password without numbers', fieldValue: 'Password!', error: 'Password must contain at least one number' },
    { Name: 'Enter password without special characters', fieldValue: 'Password123', error: 'Password must contain at least one special character' },
    { Name: 'Password is left blank', fieldValue: '', error: 'Please fill out this field.' },
    { Name: 'Enter blank spaces for password', fieldValue: '       ', error: 'Please fill out this field.' },
];  

export const dateOfBirthData = [
    { Name: 'Enter valid date of birth', fieldValue: '2000-01-01', error: '' },
    { Name: 'Enter date of birth in the future', fieldValue: '2025-01-01', error: 'Age must be at least 18 years.' },
    { Name: 'Enter date of birth with invalid format', fieldValue: '01/01/2000', error: 'Please enter a valid date in YYYY-MM-DD format' },
    { Name: 'Enter date of birth with invalid characters', fieldValue: 'abcd-ef-gh', error: 'Please enter a valid date in YYYY-MM-DD format' },
    { Name: 'Date of birth is left blank', fieldValue: '', error: '' },
   
];  


  

