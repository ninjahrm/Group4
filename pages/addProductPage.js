import { expect } from '@playwright/test';
import { testdata, productTestcases,productTestcasesduplicatevalidation } from '../testdata/productData';



class addProductPage {




    constructor(page) {
        this.page = page;

        // Login selectors
        this.username = '#username';
        this.password = '#inputPassword';
        this.loginButton = 'button[type="submit"]';

        // Product page selectors


        this.fieldSelectorMap = {

            ProductTab: "//a[text()='Products']",
            AddProductButton: "//span[text()='Add Product']",
            ProductID: '[name="productId"]',
            ProductName: '[name="productName"]',
            SelectCategory: 'select[name="productCategory"]',
            Quantity: '[name="quantity"]',
            PricePerUnit: '[name="price"]',
            SelectVendor: 'select[name="vendorId"]',
            AddButton: '[type="submit"]',
            Toast: 'div.Toastify__toast-body',
            SearchDropdown: 'select.form-control',
            SearchTextbox: 'input.form-control[placeholder="Search by product Name"]'
        }
    }

    async goto(baseUrl) {
        await this.page.goto(baseUrl);
        await this.page.waitForLoadState('networkidle');
        return await this.page.url();
    }

    async login(username, password) {
        await this.page.fill(this.username, username);
        await this.page.fill(this.password, password);
        await this.page.click(this.loginButton);
    }
    async userClickOnProductTab() {
        const productTab = this.page.locator(this.fieldSelectorMap.ProductTab);
        await productTab.waitFor({ state: 'visible', timeout: 15000 });
        await productTab.click();
        await expect(this.page).toHaveURL((testdata.url.prodpagesuccessurl))
    }

    async userClickOnAddProductBtn() {
        const addProductButton = this.page.locator(this.fieldSelectorMap.AddProductButton);
        await addProductButton.waitFor({ state: 'visible', timeout: 15000 });
        await addProductButton.click();
    }

    async userentervalidproductdetails(data) {
        //JavaScript object destructuring --- 
        //It extracts values from the data object and assigns them to variables with the same names.
        //ProductName || ''  (logical or operator) --  ensures you always pass a defined string 
        // playwright may show error or exception if it is an empty string

        const { ProductName, SelectCategory, Quantity, PricePerUnit, SelectVendor } = data;

        await this.page.fill(this.fieldSelectorMap.ProductName, ProductName || '')
        await this.page.waitForTimeout(2000)

        // await this.page.locator(this.categoryDropdown).selectOption({label:testdata.proddata.SelectCategory})
        // await this.page.waitForTimeout(5000)
        if (SelectCategory) {
            await this.page.selectOption(this.fieldSelectorMap.SelectCategory, { label: SelectCategory });
        }
        await this.page.fill(this.fieldSelectorMap.Quantity, Quantity || '')
        await this.page.fill(this.fieldSelectorMap.PricePerUnit, PricePerUnit || '')

        if (SelectVendor) {
            await this.page.selectOption(this.fieldSelectorMap.SelectVendor, { label: SelectVendor })
        }

    }
    async userclickonaddbutton() {
        await this.page.click(this.fieldSelectorMap.AddButton)
    }

    //validate success toast message
    async validateSuccessToast(productName) {
        const expectedMsg = `Product ${productName.substring(0, 20)} Successfully Added`;
        const toast = this.page.locator('div.Toastify__toast-body');
        await toast.waitFor({ state: 'visible', timeout: 3000 });
        await expect(toast).toContainText(expectedMsg);
    }
    //validate failure toast message
    async validateFailureToast(productName) {
        // const expectedMsg = `The Project Name :${productName.substring(0, 20)} Already Exists`;
        // const toast = this.page.locator('div.Toastify__toast-body');
        // await toast.waitFor({ state: 'visible', timeout: 3000 });
        // await expect(toast).toContainText(expectedMsg);


        const toast = this.page.locator('div.Toastify__toast-body');
        await toast.waitFor({ state: 'visible', timeout: 3000 });
        const toastText = await toast.textContent();
        console.log("❗Failure Toast:", toastText);
        expect(toastText).toMatch(/already exists|mismatch|failed/i); // generic match
    }

    //validate read-only field
    async checkReadOnlyField(field, expectedurl) {
        const selector = this.fieldSelectorMap[field]
        const readonly = await this.page.locator(selector).getAttribute('readonly')
        expect(readonly).toBeNull
        console.log(`the field "{$field}"  is readonly`)
        await expect(this.page).toHaveURL(expectedurl, { timeout: 10000 })


    }
    // validate default value in fields
    async expectdefaultvalue(field, expectedurl) {

        const selector = this.fieldSelectorMap[field]
        const value = await this.page.locator(selector).inputValue()
        console.log(`the default value for the field "{$expectdefaultvalue.field} is {$value}`)
        expect(value).toBe('0')
        await expect(this.page).toHaveURL(expectedurl, { timeout: 10000 });

    }

    //dropdown validation

    async fieldTypedropdownvalidation(field, expectedoptions, minoptions, expectedurl) {
        const selector = this.fieldSelectorMap[field];

        const tagName = await this.page.locator(selector).evaluate(el => el.tagName);
        expect(tagName).toBe('SELECT');
        console.log(`✅ Field "${field}" is a dropdown.`);
        //await this.page.locator(selector).waitFor({state:'visible',timeout:5000})
        //const options = await this.page.locator(selector).locator('option').allTextContents();

        await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });

        // Step 2: Wait until valid, non-disabled options are available (skip placeholder)
        await this.page.waitForFunction(
            (sel) => {
                const options = Array.from(document.querySelectorAll(`${sel} option`));
                return options.some(opt => opt.value && !opt.disabled);
            },
            selector,
            { timeout: 5000 }
        );

        // Step 3: Collect options (filtering out placeholders or disabled ones)
        const options = await this.page.$$eval(`${selector} option`, opts =>
            opts
                //.filter(opt => opt.value && !opt.disabled)
                .map(opt => opt.textContent?.trim() || '')
        );

        console.log(`options found in "${field}" is`, options)

        if (expectedoptions) {
            expect(options).toEqual(expectedoptions);
        }
        else if (minoptions) {
            expect(options.length).toBeGreaterThanOrEqual(minoptions)
        } else {
            expect(options.length).toBeGreaterThanOrEqual(0)
        }

        console.log(`✅ Dropdown "${field}" options are validated.`);
        await expect(this.page).toHaveURL(expectedurl, { timeout: 10000 });

    }

    //validate fieldwise error messages

    async expectError(expectedurl, field, message) {
        // await expect(page).not.toHaveURL(testdata.url.prodpagesuccessurl,{ timeout: 10000 })
        await expect(this.page).toHaveURL(expectedurl)
        const selector = this.fieldSelectorMap[field];
        await this.page.waitForSelector(selector, { timeout: 5000 });
        const validationMessage = await this.page.$eval(selector, el => el.validationMessage);
        expect(validationMessage).toBe(message);
    }

    async userenternumericvalue() {

        return await this.productName.inputValue();

    }

    //capturing product id from table
    async getproductnamerow(prodname) {
        //await this.page.waitForSelector('table.table-striped tbody tr', { state: 'visible', timeout: 10000 });
        //const row=this.page.locator(`table.table-striped tbody tr:has(td:has-text("${prodname}"))`)
        //const row = this.page.locator('table.table-striped tbody tr').first();
        //const trimmedName = prodname.trim();
        const partialName = prodname.slice(0, 20).trim();

        // Optional: log table content for debugging
        const tableText = await this.page.locator('table.table-striped tbody').innerText();


        const row = this.page.locator('table.table-striped tbody tr').filter({ hasText: partialName });
        await expect(row).toHaveCount(1, { timeout: 10000 });
        await expect(row).toBeVisible({ timeout: 5000 });
        return row
    }
    async findprodid(prodname){
        const row=await this.getproductnamerow(prodname)
        const prodid = await row.locator('td').first().textContent();
        if (!prodid || prodid.trim() === '') {
        throw new Error(`❌ No Product ID found for product: ${prodname}`);
    }
        console.log(`✅ Product ID of "${prodname}" is`, prodid);
        return prodid
    }

    async selectsearachdropdownprodpage(srdropdown, searchval) {
        const dropdown = this.page.locator(this.fieldSelectorMap.SearchDropdown);
    await dropdown.waitFor({ state: 'visible', timeout: 5000 });

    await dropdown.selectOption({ label: srdropdown });
    await this.page.fill(this.fieldSelectorMap.SearchTextbox, searchval.slice(0, 20).trim());
    console.log(`🔍 Searched for product: ${searchval}`);
    }


    async deleteproduct(prodname){
         const partialName = prodname.slice(0, 20).trim();
        
        const row = this.page.locator('table.table-striped tbody tr').filter({ hasText: partialName });
        const deleteicon=row.locator('a.delete i[title="Delete"]')
        await deleteicon.click()

        const modal= this.page.locator('#deleteProductModal')
        await expect(modal).toBeVisible({timeout:5000})

        const modaldialog=await  modal.locator('p').first().innerText()
        console.log(modaldialog) 

        const dialogconfirmbtn=modal.locator('input[type="button"][value="Delete"]')
        await dialogconfirmbtn.click()
        await this.page.waitForTimeout(1000);

    }

    async isProductdeleted(prodname){
        const partialName = prodname.slice(0, 20).trim();
        const row = this.page.locator('table.table-striped tbody tr').filter({ hasText: partialName });
        await expect(row).toHaveCount(0, { timeout: 5000 })

    }

    async isOnCreateProductPage(){
        const currenturl=this.page.url();
        console.log(`${currenturl}`)
        return currenturl.includes('/create-product')
    }
    //validate all fields are present in product page
    async validateAllFieldsArePresent() {
        const productTab = this.page.locator(this.fieldSelectorMap.ProductTab);
        await productTab.waitFor({ state: 'visible', timeout: 15000 });
        await productTab.click();

        const addProductButton = this.page.locator(this.fieldSelectorMap.AddProductButton);
        await addProductButton.waitFor({ state: 'visible', timeout: 15000 });
        await addProductButton.click();

        await this.checkField(this.fieldSelectorMap.ProductID, 'Product ID');
        await this.checkField(this.fieldSelectorMap.ProductName, 'Product Name');
        await this.checkField(this.fieldSelectorMap.Quantity, 'Quantity');
        await this.checkField(this.fieldSelectorMap.PricePerUnit, 'Price Per Unit');
        await this.checkField(this.fieldSelectorMap.SelectVendor, 'Vendor Dropdown');
        await this.checkFieldWithText('button:has-text("save")', 'Save Button', 1);
        await this.checkFieldWithText('button:has-text("Cancel")', 'Cancel Button', 1);
    }

    async checkField(selector, fieldName) {
        const isVisible = await this.page.locator(selector).isVisible();
        if (isVisible) {
            console.log(`✅ ${fieldName} is visible`);
        } else {
            console.error(`❌ ${fieldName} is NOT visible`);
        }
    }

    async checkFieldWithText(selector, fieldName, expectedCount = 1) {
        const actualCount = await this.page.locator(selector).count();
        const status = actualCount === expectedCount
            //nested ternary operator
            ? `✅ ${fieldName} is ${expectedCount === 0 ? 'NOT present as expected' : 'present as expected'}`
            //detailed error message when expeced count doesnt match actual count
            : `❌ ${fieldName} expected count ${expectedCount}, but found ${actualCount}`;
        console.log(status);

        if (actualCount !== expectedCount) {
            throw new Error(`${fieldName} count mismatch: expected ${expectedCount}, but found ${actualCount}`);
        }
    }


}

export { addProductPage }; 