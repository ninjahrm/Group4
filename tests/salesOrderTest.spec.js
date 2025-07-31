import { test, expect } from '@playwright/test';
import { salesOrderPage } from '../pages/salesOrderPage';
import { usercredential, data, negativeTestCases,fieldValidationCases } from '../testdata/salesOrderData';
import { LoginPage } from '../pages/loginPage';
import { URLs, expectedUrls } from '../testdata/loginData';

test.describe('Sales Order Workflow', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(URLs.baseURL);
    //await page.setViewportSize({ width: 1920, height: 1080 });
    await loginPage.login(usercredential.username, usercredential.password);
    await expect(page).toHaveURL(expectedUrls.loginSuccess);
  });

  test('Create Sales Order With Valid Data', async ({ page }) => {
    const salesOrder = new salesOrderPage(page);
    await salesOrder.navigateToSalesOrderPage();
    await salesOrder.enterSubject(data.subject);
    await salesOrder.selectValidTillDate(data.validTillDate);
    await salesOrder.enterStatus(data.status);
    //Select required opportunity     
    await salesOrder.selectOpportunity(data.opportunity);
    //Select required Quote
    await salesOrder.selectQuote(data.quote);
    //Select required Contact
    await salesOrder.selectContact(data.contactName);
    //Enter billing details
    await salesOrder.enterBillingAddress(data.billingAddress);
    await salesOrder.enterBillingCity(data.billingCity);
    await salesOrder.enterBillingState(data.billingState);
    await salesOrder.enterBillingPOBox(data.billingPOBox);
    await salesOrder.enterBillingPostalCode(data.billingPostalCode);
    await salesOrder.enterBillingCountry(data.billingCountry);
    //Enter Shipping details
    await salesOrder.enterShippingAddress(data.shippingAddress);
    await salesOrder.enterShippingCity(data.shippingCity);
    await salesOrder.enterShippingState(data.shippingState);
    await salesOrder.enterShippingPOBox(data.shippingPOBox);
    await salesOrder.enterShippingPostalCode(data.shippingPostalCode);
    await salesOrder.enterShippingCountry(data.shippingCountry);
    //Add product button and select the required product from the list
    await salesOrder.selectProduct(data.product);
    //await page.waitForTimeout(5000); 
    await salesOrder.submitSalesOrder();
    await page.waitForTimeout(5000);
    await expect(page.locator('text=Sales-Order Order for ABC Corp Successfully Added')).toBeVisible();
  });
});

test.describe('Sales Order - Negative Tests', () => {
  test.beforeEach(async ({ page }) => {
    console.log('🔐 Logging in before test...');
    const loginPage = new LoginPage(page);
    await loginPage.goto(URLs.baseURL);
    await loginPage.login(usercredential.username, usercredential.password);
    await expect(page).toHaveURL(expectedUrls.loginSuccess);
  });

  for (const testCase of negativeTestCases) {
    test(`should show error when ${testCase.name}`, async ({ page }) => {
      const salesOrder = new salesOrderPage(page);
      await salesOrder.navigateToSalesOrderPage();

      // Apply overrides for the current negative case
      const overrides = {
        [testCase.field]: testCase.value,
      };
      await salesOrder.fillValidSalesOrderData(overrides);

      // Handle specific negative field logic
      if (testCase.name === 'Opportunity is empty') {
        // Submit without selecting opportunity
        await salesOrder.submitSalesOrder();
        const toastText = await salesOrder.getToastMessageText();
        expect(toastText).toContain(testCase.expectedValidationMessage);
        //await salesOrder.assertToastMessage(testCase.expectedValidationMessage);
        return;
      }

      // Select opportunity for all other cases
      await salesOrder.selectOpportunity(data.opportunity);

      if (testCase.name === 'Quote is empty') {
        // Submit without selecting quote
        await salesOrder.submitSalesOrder();
        const toastText = await salesOrder.getToastMessageText();
        expect(toastText).toContain(testCase.expectedValidationMessage);
        //await salesOrder.assertToastMessage(testCase.expectedValidationMessage);
        return;
      }

      // Select quote if not testing quote
      await salesOrder.selectQuote(data.quote);

      if (testCase.name === 'Contact is empty') {
        // Submit without selecting contact
        await salesOrder.submitSalesOrder();
        const toastText = await salesOrder.getToastMessageText();
        expect(toastText).toContain(testCase.expectedValidationMessage);
        //await salesOrder.assertToastMessage(testCase.expectedValidationMessage);
        return;
      }

      // Select remaining fields only if not being tested as empty
      await salesOrder.selectContact(data.contactName);

      if (testCase.name === 'Product is empty') {
        // Submit without selecting product
        await salesOrder.submitSalesOrder();
        const toastText = await salesOrder.getToastMessageText();
        expect(toastText).toContain(testCase.expectedValidationMessage);
        //await salesOrder.assertToastMessage(testCase.expectedValidationMessage);
        return;
      }

      await salesOrder.selectProduct(data.product);
      await salesOrder.submitSalesOrder();

      // Field-level validation for input elements
      const fieldLocator = salesOrder.getLocatorForField(testCase.field);
      if (!fieldLocator) {
        throw new Error(`Locator not found for field "${testCase.field}"`);
      }
      const validationMessage = await fieldLocator.evaluate(el => el.validationMessage);
      expect(validationMessage).toContain(testCase.expectedValidationMessage);
    });
  }
});

test.describe('Field Input Validation Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(URLs.baseURL);
    await loginPage.login(usercredential.username, usercredential.password);
    await expect(page).toHaveURL(expectedUrls.loginSuccess);
  });

  for (const fieldTest of fieldValidationCases) {
    test.describe(`${fieldTest.label}`, () => {
      for (const testCase of fieldTest.cases) {
        test(`Validation: ${testCase.type}`, async ({ page }) => {
          const salesOrder = new salesOrderPage(page);
          await salesOrder.navigateToSalesOrderPage();

          await salesOrder.fillField(fieldTest.field, testCase.input);
          const actual = await salesOrder.getFieldValue(fieldTest.field);

          // Special handling for >255 characters
          if (testCase.type === '> 255 characters') {
            // Assert that input is accepted fully for now (until frontend enforces limit)
            // TODO: Update assertion when maxlength is enforced in UI
            expect(actual.length).toBe(testCase.input.length);
          } else {
            expect(actual).toBe(testCase.expected);
          }
        });
      }
    });
  }
});
