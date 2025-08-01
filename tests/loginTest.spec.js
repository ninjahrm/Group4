import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { credentials, URLs, expectedUrls } from '../testdata/loginData';
// This test suite validates the login functionality of the NinjaHrm application
// It checks both valid and invalid login scenarios using the provided credentials  
test.describe('NinjaHrm - Login validations', () => {
  credentials.forEach((data) => {
    test(`${data.testname}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const actualUrl = await loginPage.goto(URLs.baseURL);
      // Validate the URL after navigation
      expect(actualUrl).toMatch(expectedUrls.loginPageDisplayed);

      // Perform login with each test data
      const errorMsg = await loginPage.login(data.username, data.password);
      console.log('Error message:', errorMsg);
      // Check if the error message matches the expected error
      expect(errorMsg).toContain(data.error);
     
    });
  });
});
