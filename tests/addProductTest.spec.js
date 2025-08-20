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

test.describe('Product form validation', () => {
for (const {name,data,expectError} of productTestcases){


    test('name',async({page})=>{
        const prodpage=new addProductPage(page);
        await prodpage.goto(testdata.url.baseUrl) 
        await prodpage.login(testdata.usercredential.username,testdata.usercredential.password) 
        await prodpage.userClickOnProductTab(); 
        await prodpage.userClickOnAddProductBtn();
        await prodpage.userentervalidproductdetails();
        await prodpage.userclicksaddbutton();


            const validationMsg = await page.$eval(this.productName, el => {
            el.checkValidity();  // triggers validation check
            return el.validationMessage;  // returns error message if invalid
        });
            console.log(validationMsg);

        })
        
    
}
})

test('User validates  product fields ',async({page})=>{

    const prodpage=new addProductPage(page)
    await prodpage.goto(testdata.url.baseUrl) 
    await prodpage.login(testdata.usercredential.username,testdata.usercredential.password) 
    await prodpage.userClickOnProductTab(); 
    await prodpage.userClickOnAddProductBtn();
    await prodpage.validateAllFieldsArePresent();

})
