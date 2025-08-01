import { test, expect } from '@playwright/test'
import { addProductPage } from '../pages/addProductPage'
import { testdata, productTestcases, productTestcasesduplicatevalidation } from '../testdata/productData'

const fieldSelectorMap = {

    ProductID: '[name="productId"]',
    ProductName: '[name="productName"]',
    SelectCategory: 'select[name="productCategory"]',
    Quantity: '[name="quantity"]',
    PricePerUnit: '[name="price"]',
    SelectVendor: 'select[name="vendorId"]',
    Toast: 'div.Toastify__toast-body',


}


test('validate that user click on product tab', async ({ page }) => {
    const prodpage = new addProductPage(page);
    await prodpage.goto(testdata.url.baseUrl)
    await prodpage.login(testdata.usercredential.username, testdata.usercredential.password)
    await expect(page).toHaveURL(testdata.url.successloginurl)
    await prodpage.userClickOnProductTab();


})



test('validate-all fields in product page', async ({ page }) => {


    const prodpage = new addProductPage(page);
    await prodpage.goto(testdata.url.baseUrl)
    await prodpage.login(testdata.usercredential.username, testdata.usercredential.password)
    await prodpage.userClickOnProductTab();
    await prodpage.validateAllFieldsArePresent()



})



for (const { name, data, expectError, fieldTypeCheck, checkReadOnlyField, expectdefaultvalue, validateProductID, expectSuccessToast,expectFailureToast, expectdeleteproduct
 ,productmismatch} of productTestcases) {

    test(name, async ({ page }) => {

        console.log(`Running test: ${name}`);
        console.log('Data:', data);
        const prodpage = new addProductPage(page)
        await prodpage.goto(testdata.url.baseUrl)
        await prodpage.login(testdata.usercredential.username, testdata.usercredential.password)
        await prodpage.userClickOnProductTab();
        await prodpage.userClickOnAddProductBtn();


        if (checkReadOnlyField) {

            await prodpage.checkReadOnlyField(checkReadOnlyField.field, testdata.url.createprodpageurl)
            return

        }

        if (expectdefaultvalue) {

            await prodpage.checkReadOnlyField(expectdefaultvalue.field, testdata.url.createprodpageurl)
            return

        }


        if (fieldTypeCheck?.type === 'dropdown') {

            await prodpage.fieldTypedropdownvalidation(fieldTypeCheck.field, fieldTypeCheck.expectedoptions, fieldTypeCheck.minoptions, testdata.url.createprodpageurl,productmismatch)
            return; // ✅ Skip rest of test (no form fill or URL check)

        }


        await prodpage.userentervalidproductdetails(data);
        await prodpage.userclickonaddbutton();





        if (expectError) {
            await prodpage.expectError(testdata.url.createprodpageurl, expectError.field, expectError.message)
            return;
        }

        if (expectSuccessToast) {
                await prodpage.validateSuccessToast(data.ProductName);
            } else if (expectFailureToast) {
                await prodpage.validateFailureToast(data.ProductName);
                const successToast = prodpage.page.locator('div.Toastify__toast-body', {
                    hasText: `Successfully Added`,
                });
                await expect(successToast).toHaveCount(0, { timeout: 3000 });
            } else {
                // Optional: if no toast is expected at all
                const toast = prodpage.page.locator('div.Toastify__toast-body');
                await expect(toast).toHaveCount(0, { timeout: 3000 });
            }

        if (validateProductID) {
            await prodpage.selectsearachdropdownprodpage('Search by Product Name', data.ProductName)
            await prodpage.page.waitForTimeout(1000)
            await prodpage.getproductnamerow(data.ProductName)
            await prodpage.findprodid(data.ProductName)
        }

        if (expectdeleteproduct) {
            await prodpage.selectsearachdropdownprodpage('Search by Product Name', data.ProductName)
            await prodpage.page.waitForTimeout(1000)
            await prodpage.getproductnamerow(data.ProductName)
            await prodpage.deleteproduct(data.ProductName)
            await prodpage.selectsearachdropdownprodpage('Search by Product Name', data.ProductName)
            await prodpage.page.waitForTimeout(1000)
            await prodpage.isProductdeleted(data.ProductName)

        }

        if(productmismatch){
            await prodpage.page.waitForTimeout(2000)
            const currentUrl = prodpage.page.url();
            console.log(`"${currentUrl}"`)
            await prodpage.page.waitForTimeout(2000)
            expect(currentUrl).toContain('/create-product'); 
            expect(currentUrl).not.toContain('/products')
        }


    })
}

test.describe.serial('Product Test Cases (Ordered)', () => {
    // Shared setup for all tests
    test.beforeEach(async ({ page }) => {
        const prodPage = new addProductPage(page);
        await prodPage.goto(testdata.url.baseUrl);
        await prodPage.login(testdata.usercredential.username, testdata.usercredential.password);
        await expect(page).toHaveURL(testdata.url.successloginurl);
        await prodPage.userClickOnProductTab();
        await prodPage.userClickOnAddProductBtn();
    });

    for (const { name, data, expectSuccessToast, expectFailureToast } of productTestcasesduplicatevalidation) {
        test(name, async ({ page }) => {
            const prodPage = new addProductPage(page);

            console.log(`Running test: ${name}`);
            console.log('Data:', data);

            await prodPage.userentervalidproductdetails(data);
            await prodPage.userclickonaddbutton();


            

            //   if (expectSuccessToast) {
            //     await prodPage.validateSuccessToast(data.ProductName);
            //   }

            //   if (expectFailureToast) {
            //     await prodPage.validateFailureToast(data.ProductName);
            //   }

            if (expectSuccessToast) {
                await prodPage.validateSuccessToast(data.ProductName);
            } else if (expectFailureToast) {
                await prodPage.validateFailureToast(data.ProductName);
                const successToast = prodPage.page.locator('div.Toastify__toast-body', {
                    hasText: `Successfully Added`,
                });
                await expect(successToast).toHaveCount(0, { timeout: 3000 });
            } else {
                // Optional: if no toast is expected at all
                const toast = prodPage.page.locator('div.Toastify__toast-body');
                await expect(toast).toHaveCount(0, { timeout: 3000 });
            }

        });
    }



});


