class salesOrderPage {
  constructor(page) {
    this.page = page;
    this.salesOrderButton = this.page.locator('text=Sales Order');
    this.createOrderButton = this.page.locator('text=Create Order');
    this.subject = this.page.locator('input[name="subject"]');
    this.validTill = this.page.locator('input[type="date"]');
    this.status = this.page.locator('input[name="status"]');
    this.opportunity = this.page.locator('(//button[@class="action-button"])[1]');
    this.quote = this.page.locator('(//button[@class="action-button"])[2]');
    this.contact = this.page.locator('(//button[@class="action-button"])[3]');
    //this.billingAddress = page.locator('//label[text()="Billing Address"]/../textarea'); // If both label and text area embedded under one div tag, you can use this

    // Billing
    this.billingAddress = page.locator('//label[text()="Billing Address"]/following-sibling::textarea');
    this.billingPOBox = page.locator('//label[text()="Billing PO Box"]/following-sibling::input');
    this.billingCity = page.locator('//label[text()="Billing City"]/following-sibling::input');
    this.billingState = page.locator('//label[text()="Billing State"]/following-sibling::input');
    this.billingPostalCode = page.locator('//label[text()="Billing Postal Code"]/following-sibling::input');
    this.billingCountry = page.locator('//label[text()="Billing Country"]/following-sibling::input');

    // Shipping
    this.shippingAddress = page.locator('//label[text()="Shipping Address"]/following-sibling::textarea');
    this.shippingPOBox = page.locator('//label[text()="Shipping PO Box"]/following-sibling::input');
    this.shippingCity = page.locator('//label[text()="City"]/following-sibling::input');
    this.shippingState = page.locator('//label[text()="State"]/following-sibling::input');
    this.shippingPostalCode = page.locator('//label[text()="Postal Code"]/following-sibling::input');
    this.shippingCountry = page.locator('//label[text()="Country"]/following-sibling::input');

    // Product
    this.productButton = this.page.locator('(//button[@class="action-button"])[4]');
    this.quantity = page.locator('//label[text()="Quantity:"]/following-sibling::input[@type="number"]');

    // Price related
    this.discount = page.locator('//label[text()="Discount in $ (-):"]/../input');
    this.shippingCharges = page.locator('//label[text()="Shipping and Handling Charges in $ (+):"]/../input');

    // Submit
    this.createSalesOrderBtn = page.locator('button[type=submit]');

    // For toast message text
    //this.toastMessage = page.locator('[role="alert"].Toastify__toast-body');
    this.toastMessage = this.page.locator('div[role="alert"]'); // simpler locator


  }

  // 🔁 Map field name to locator (Generic helper)
  getLocatorForField(fieldName) {
    const fieldMap = {
      subject: this.subject,
      validTill: this.validTill,
      status: this.status,
      opportunity: this.opportunity,
      quote: this.quote,
      contact: this.contact,
      billingAddress: this.billingAddress,
      billingPOBox: this.billingPOBox,
      billingCity: this.billingCity,
      billingState: this.billingState,
      billingPostalCode: this.billingPostalCode,
      billingCountry: this.billingCountry,
      shippingAddress: this.shippingAddress,
      shippingPOBox: this.shippingPOBox,
      shippingCity: this.shippingCity,
      shippingState: this.shippingState,
      shippingPostalCode: this.shippingPostalCode,
      shippingCountry: this.shippingCountry,
      quantity: this.quantity,
      discount: this.discount,
      shippingCharges: this.shippingCharges,
    };

    return fieldMap[fieldName];
  }

  async navigateToSalesOrderPage() {
    await this.salesOrderButton.click();
    await this.createOrderButton.click();
    await this.page.waitForLoadState('networkidle'); // Optional: wait for page load
  }

  async enterSubject(text) {
    await this.subject.fill(text);   // <-- call fill on locator directly
  }

  async selectValidTillDate(date) {
    await this.validTill.fill(date);
  }

  async enterStatus(statusText) {
    await this.status.fill(statusText);
  }

  async submitForm() {
    await this.page.click('button[type="submit"]'); // This is fine if you don't have a locator for submit button
  }

  async selectOpportunity(opportunityName) {
    // Click the lookup icon to open the popup
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      //this.page.click(this.opportunity), // (//button[@class="action-button"])[1]
      this.opportunity.click()
    ]);

    await popup.waitForLoadState('domcontentloaded');

    let found = false;

    while (!found) {
      const buttons = popup.locator('button.select-btn');
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const onclick = await button.getAttribute('onclick');

        if (onclick && onclick.includes(opportunityName)) {
          await button.evaluate(btn => btn.click()); // Force click
          console.log(`✅ Selected opportunity: ${opportunityName}`);
          found = true;
          break;
        }
      }

      if (!found) {
        const nextButton = popup.locator('button:has-text("Next")');
        const isDisabled = await nextButton.isDisabled();

        if (isDisabled) {
          console.log(`❌ Opportunity "${opportunityName}" not found.`);
          break;
        }

        await nextButton.click();
        await popup.waitForSelector('table tbody tr');
      }
    }

    // Optional: Assert it was found
    if (!found) {
      throw new Error(`Opportunity "${opportunityName}" not found.`);
    }
  }

  async selectQuote(quoteSubject) {
    // Click the lookup icon to open the popup
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      //this.page.click(this.quote), // (//button[@class="action-button"])[2]
      this.quote.click()
    ]);

    await popup.waitForLoadState('domcontentloaded');

    let found = false;

    while (!found) {
      const buttons = popup.locator('button.select-btn');
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const onclick = await button.getAttribute('onclick');

        if (onclick && onclick.includes(quoteSubject)) {
          await button.evaluate(btn => btn.click()); // Force click
          console.log(`✅ Selected Quote: ${quoteSubject}`);
          found = true;
          break;
        }
      }

      if (!found) {
        const nextButton = popup.locator('button:has-text("Next")');
        const isDisabled = await nextButton.isDisabled();

        if (isDisabled) {
          console.log(`❌ Quote "${quoteSubject}" not found.`);
          break;
        }

        await nextButton.click();
        await popup.waitForSelector('table tbody tr');
      }
    }

    // Optional: Assert it was found
    if (!found) {
      throw new Error(`Quote "${quoteSubject}" not found.`);
    }
  }

  async selectContact(contactName) {
    // Click the lookup icon to open the popup
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      //this.page.click(this.contact), // (//button[@class="action-button"])[3]
      this.contact.click()
    ]);

    await popup.waitForLoadState('domcontentloaded');

    let found = false;

    while (!found) {
      const buttons = popup.locator('button.select-btn');
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const onclick = await button.getAttribute('onclick');

        if (onclick && onclick.includes(contactName)) {
          await button.evaluate(btn => btn.click()); // Force click
          console.log(`✅ Selected Contact: ${contactName}`);
          found = true;
          break;
        }
      }

      if (!found) {
        const nextButton = popup.locator('button:has-text("Next")');
        const isDisabled = await nextButton.isDisabled();

        if (isDisabled) {
          console.log(`❌ Contact "${contactName}" not found.`);
          break;
        }

        await nextButton.click();
        await popup.waitForSelector('table tbody tr');
      }
    }

    // Optional: Assert it was found
    if (!found) {
      throw new Error(`Contact "${contactName}" not found.`);
    }
  }

  // Billing methods
  async enterBillingAddress(address) {
    await this.billingAddress.fill(address);
  }

  async enterBillingPOBox(poBox) {
    await this.billingPOBox.fill(poBox);
  }

  async enterBillingCity(city) {
    await this.billingCity.fill(city);
  }

  async enterBillingState(state) {
    await this.billingState.fill(state);
  }

  async enterBillingPostalCode(postalCode) {
    await this.billingPostalCode.fill(postalCode);
  }

  async enterBillingCountry(country) {
    await this.billingCountry.fill(country);
  }

  // Shipping methods
  async enterShippingAddress(address) {
    await this.shippingAddress.fill(address);
  }

  async enterShippingPOBox(poBox) {
    await this.shippingPOBox.fill(poBox);
  }

  async enterShippingCity(city) {
    await this.shippingCity.fill(city);
  }

  async enterShippingState(state) {
    await this.shippingState.fill(state);
  }

  async enterShippingPostalCode(postalCode) {
    await this.shippingPostalCode.fill(postalCode);
  }

  async enterShippingCountry(country) {
    await this.shippingCountry.fill(country);
  }

  async getToastMessageText() {
    await this.toastMessage.waitFor({ state: 'visible', timeout: 60000 }); // 60s timeout  // wait for toast to appear
    return (await this.toastMessage.textContent()).trim();
  }

  async selectProduct(productName) {
    // Click the lookup icon to open the popup
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.productButton.click(), // (//button[@class="action-button"])[4]      
    ]);

    await popup.waitForLoadState('domcontentloaded');

    let found = false;

    while (!found) {
      const buttons = popup.locator('button.select-btn');
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const onclick = await button.getAttribute('onclick');

        if (onclick && onclick.includes(productName)) {
          await button.evaluate(btn => btn.click()); // Force click
          console.log(`✅ Selected Product: ${productName}`);
          found = true;
          break;
        }
      }

      if (!found) {
        const nextButton = popup.locator('button:has-text("Next")');
        const isDisabled = await nextButton.isDisabled();

        if (isDisabled) {
          console.log(`❌ Product "${productName}" not found.`);
          break;
        }

        await nextButton.click();
        await popup.waitForSelector('table tbody tr');
      }
    }

    // Optional: Assert it was found
    if (!found) {
      throw new Error(`Product "${productName}" not found.`);
    }
  }

  async enterQuantity(value) {
    await this.quantity.fill(value);
  }

  // Price details
  async enterDiscount(value) {
    await this.discount.fill(value);
  }

  async enterShippingCharges(value) {
    await this.shippingCharges.fill(value);
  }

  // Submit sales order
  async submitSalesOrder() {
    await this.createSalesOrderBtn.click();
  }

  async getErrorText() {
    return this.errorMessages;
  }

  //Overrides method
  async fillValidSalesOrderData(overrides = {}) {
    await this.page.waitForLoadState('domcontentloaded'); // or 'networkidle'
    await this.subject.fill(overrides.subject ?? 'Test Order');
    await this.validTill.fill(overrides.validTill ?? '2027-07-31');
    await this.status.fill(overrides.status ?? 'Open');

    // For buttons, use click()
    /* await this.opportunity.click();
    await this.quote.click();
    await this.contact.click(); */

    await this.billingAddress.fill(overrides.billingAddress ?? '123 Main St');
    await this.billingPOBox.fill(overrides.billingPOBox ?? '45678');
    await this.billingCity.fill(overrides.billingCity ?? 'Testville');
    await this.billingState.fill(overrides.billingState ?? 'CA');
    await this.billingPostalCode.fill(overrides.billingPostalCode ?? '123456');
    await this.billingCountry.fill(overrides.billingCountry ?? 'USA');

    await this.shippingAddress.fill(overrides.shippingAddress ?? '456 Market St');
    await this.shippingPOBox.fill(overrides.shippingPOBox ?? '78912');
    await this.shippingCity.fill(overrides.shippingCity ?? 'ShipCity');
    await this.shippingState.fill(overrides.shippingState ?? 'NY');
    await this.shippingPostalCode.fill(overrides.shippingPostalCode ?? '654321');
    await this.shippingCountry.fill(overrides.shippingCountry ?? 'USA');

    // Uncomment and update if you want to fill these fields and click productButton
    // await this.productButton.click();
    // await this.quantity.fill(overrides.quantity ?? '10');
    // await this.discount.fill(overrides.discount ?? '5');
    // await this.shippingCharges.fill(overrides.shippingCharges ?? '10');
  }

  async fillField(fieldName, inputValue) {
    const locator = this.getLocatorForField(fieldName);
    await locator.fill('');
    await locator.type(inputValue, { delay: 50 }); // simulate user typing
  }

  async getFieldValue(fieldName) {
    const locator = this.getLocatorForField(fieldName);
    return await locator.inputValue();
  }

}
module.exports = { salesOrderPage };
