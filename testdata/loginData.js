
export const credentials = [
  {
    testname: 'Login with valid admin credentials',
    username: 'rmgyantra',
    password: 'rmgy@9999',
    error: '',
  },
  {
    testname: 'Login with invalid admin credentials',
    username: 'rmgyantra123',
    password: 'rmgy@9999',
    error: 'Invalid Credentials',
  },
  {
    testname: 'Login with valid user credentials',
    username: 'user_viji',
    password: 'v123456',
    error: '',
  },
  {
    testname: 'Login with no username',
    username: '',
    password: 'rmgy@9999',
    error: 'Username is required',
  },
  {
    testname: 'Login with no password',
    username: 'rmgyantra',
    password: '',
    error: 'Password is required',
  },
];

export const URLs = {
  baseURL: 'http://49.249.28.218:8098',
};

export const expectedUrls = {
  loginPageDisplayed: 'http://49.249.28.218:8098/',
};


