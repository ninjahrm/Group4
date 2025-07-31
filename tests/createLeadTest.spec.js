import { test, expect } from '@playwright/test';
import {createLeadPage} from '../pages/createLeadPage';
import {leadData, LeadTestcases} from '../testdata/leadData'


test('create Lead with Mandatory Details',async ({ page }) => {

const CreateLeadPage= new createLeadPage(page);

    await CreateLeadPage.goto(leadData.URLs.url);
    await page.setViewportSize({ width: 1920, height: 1080 });
    page.setDefaultTimeout(60000);
    await CreateLeadPage.login(leadData.login.username,leadData.login.password);
    await expect(page).toHaveURL(leadData.URLs.successLoginUrl);
   
    await CreateLeadPage.clickLeadsTab();
    await CreateLeadPage.clickCreateLead();

    await CreateLeadPage.createLeadwithManDetails(leadData.leadCreationwithMandotoryfields);
    await CreateLeadPage.clickCreateLeadButton();
    console.log('Lead creation test completed');
    page.setDefaultTimeout(60000); 
    await expect(page).toHaveURL(leadData.URLs.successLeadCreationURL);
}
)
test('create Lead with blank campaign Details',async ({ page }) => {

const CreateLeadPage= new createLeadPage(page);

    await CreateLeadPage.goto(leadData.URLs.url);
    await page.setViewportSize({ width: 1920, height: 1080 });
    page.setDefaultTimeout(60000);
    await CreateLeadPage.login(leadData.login.username,leadData.login.password);
    await expect(page).toHaveURL(leadData.URLs.successLoginUrl);
   
    await CreateLeadPage.clickLeadsTab();
    await CreateLeadPage.clickCreateLead();

    await CreateLeadPage.createLeadwithblankCampaignDetails(leadData.leadCreationwithMandotoryfields);
    await CreateLeadPage.clickCreateLeadButton();
    console.log('Lead creation test completed');
    page.setDefaultTimeout(60000); 
      const errorMessage = await CreateLeadPage.getCampaignAlert();
        console.log(errorMessage);
    await expect(page).toHaveURL(leadData.URLs.notsuccessLeadCreationURL);
    
}
)


for (const {name,data,expectError,fieldTypeCheck } of LeadTestcases){
/*  if (name === 'blank campaign1') {
    test.only(name, async ({ page }) => {
      console.log(`Running test: ${name}`);
      console.log('Data:', data);
      const CreateLeadPage= new createLeadPage(page);

      await CreateLeadPage.goto(leadData.URLs.url);
      await page.setViewportSize({ width: 1920, height: 1080 });
      page.setDefaultTimeout(60000);
      await CreateLeadPage.login(leadData.login.username,leadData.login.password);
      await expect(page).toHaveURL(leadData.URLs.successLoginUrl);
     
      await CreateLeadPage.clickLeadsTab();
      await CreateLeadPage.clickCreateLead();

      await CreateLeadPage.createLeadwithDetails(data);
      await CreateLeadPage.clickCreateLeadButton();
      console.log('Lead creation test completed');
     // console.log(page.locator('[name="leadId"]').textContent());
      page.setDefaultTimeout(60000); 
      
      if (expectError) {
        const errorMessage = await CreateLeadPage.getFieldValidationMessage(expectError.field);
        expect(errorMessage).toContain(leadData.validationMessages.Message1);
        console.log(`✅ Validation message for field "${expectError.field}": ${errorMessage}`);
      } else {
        console.log('No validation errors expected.');
      
      await expect(page).toHaveURL(leadData.URLs.successLeadCreationURL);
      }
    })
  }
  }*/
 test(name,async({page})=>{
    console.log(`Running test: ${name}`);
    console.log('Data:', data);
    const CreateLeadPage= new createLeadPage(page);

    await CreateLeadPage.goto(leadData.URLs.url);
    await page.setViewportSize({ width: 1920, height: 1080 });
    page.setDefaultTimeout(60000);
    await CreateLeadPage.login(leadData.login.username,leadData.login.password);
    await expect(page).toHaveURL(leadData.URLs.successLoginUrl);
   
    await CreateLeadPage.clickLeadsTab();
    await CreateLeadPage.clickCreateLead();

    await CreateLeadPage.createLeadwithDetails(data);
    await CreateLeadPage.clickCreateLeadButton();
    console.log('Lead creation test completed');
    page.setDefaultTimeout(60000); 
    console.log(expectError);
    console.log(expectError.message);
    if (expectError) {
      const errorMessage = await CreateLeadPage.getFieldValidationMessage(expectError.field);
      expect(errorMessage).toContain(expectError.message);
      console.log(`✅ Validation message for field "${expectError.field}": ${errorMessage}`);
    } else {
      console.log('No validation errors expected.');
      await expect(page).toHaveURL(leadData.URLs.successLeadCreationURL);
    }
    })

  }



