import { test, expect } from '@playwright/test';
import { campaignPage } from '../pages/campaignPage.js';
import { testData } from '../testdata/campaignData.js';

let CampaignPage;

test.beforeEach(async ({ page }) => {
  CampaignPage = new campaignPage(page);
  await CampaignPage.goto(testData.URLs.url);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await CampaignPage.login(testData.login.username, testData.login.password);
  await expect(page).toHaveURL(testData.URLs.successLoginUrl);
});

test('create campaign with all fields', async ({ page }) => {
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  await CampaignPage.createCampaignWithFields(testData.campaigns[0]);
  await CampaignPage.clickCreateCampaignButton();
  await expect(page).toHaveURL(testData.URLs.successCampaignCreationURL);
});

test('create campaign with Mandatory fields', async ({ page }) => {
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  await CampaignPage.createCampaignWithMandatoryFields(testData.campaigns[1]);
  await CampaignPage.clickCreateCampaignButton();
  await expect(page).toHaveURL(testData.URLs.successCampaignCreationURL);
});

test('create campaign with Empty Campaign Name fields', async ({ page }) => {
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  await CampaignPage.createCampaignWithFields(testData.campaigns[2]);
  await CampaignPage.clickCreateCampaignButton();
  const campaignNameValidation = await CampaignPage.getFieldValidationMessage(testData.campaigns[2].expectedValidationField);
  expect(campaignNameValidation).toContain(testData.campaigns[2].expectedValidationMessage);
});

test('create campaign with Empty Target Size fields', async ({ page }) => {
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  await CampaignPage.createCampaignWithFields(testData.campaigns[3]);
  await CampaignPage.clickCreateCampaignButton();
  const campaignNameValidation = await CampaignPage.getFieldValidationMessage(testData.campaigns[3].expectedValidationField);
  expect(campaignNameValidation).toContain(testData.campaigns[3].expectedValidationMessage);
});

test('create campaign with Negative Target Size', async ({ page }) => {
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  await CampaignPage.createCampaignWithFields(testData.campaigns[4]); 
  await CampaignPage.clickCreateCampaignButton();
  const targetSizeValidation = await CampaignPage.getFieldValidationMessage(testData.campaigns[4].expectedValidationField);
  expect(targetSizeValidation).toContain(testData.campaigns[4].expectedValidationMessage);
});

test('campaign status field should be a dropdown', async ({ page }) => {
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  // Check the tag name of the campaign status field
  const tagName = await page.$eval('[name="campaignStatus"]', el => el.tagName.toLowerCase());
  expect(tagName).toBe('select'); // This will fail if it's not a dropdown

});
test('campaign name field should be a text input', async ({ page }) => {
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  // Check the tag name of the campaign name field
  const tagName = await page.$eval('[name="campaignName"]', el => el.tagName.toLowerCase());
  expect(tagName).toBe('input'); // This will fail if it's not a text input
});
test('campaign target size field should be a number input', async ({ page }) => {
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  // Check the type of the target size field
  const type = await page.$eval('[name="targetSize"]', el => el.type);
  expect(type).toBe('number'); // This will fail if it's not a number input
});
test('campaign expected close date field should be a date input', async ({ page }) => {
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  // Check the type of the expected close date field
  const type = await page.$eval('[name="expectedCloseDate"]', el => el.type);
  expect(type).toBe('date'); // This will fail if it's not a date input
});
test('campaign target audience field should be a text input', async ({ page }) => {
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  // Check the tag name of the target audience field
  const tagName = await page.$eval('[name="targetAudience"]', el => el.tagName.toLowerCase());
  expect(tagName).toBe('input'); // This will fail if it's not a text input
});
test('campaign description field should be a textarea', async ({ page }) => {
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  // Check the tag name of the description field
  const tagName = await page.$eval('textarea[name="description"]', el => el.tagName.toLowerCase());
  expect(tagName).toBe('textarea'); // This will fail if it's not a textarea
});

test('expected close date field should not accept past date', async ({ page }) => {
  const campaign = testData.campaigns[5]; 
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  await CampaignPage.createCampaignWithFields(campaign);
  await CampaignPage.clickCreateCampaignButton();

  // Get the validation message
  const validationMessage = await CampaignPage.getFieldValidationMessage(campaign.expectedValidationField);
  expect(validationMessage).toContain(campaign.expectedValidationMessage);
});

test('expected close date field should not accept invalid format', async ({ page }) => {
  const campaign = testData.campaigns[6];
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  await CampaignPage.createCampaignWithFields(campaign);
  await CampaignPage.clickCreateCampaignButton();

  const validationMessage = await CampaignPage.getExpectedCloseDateValidationMessage(campaign.expectedValidationField);
  expect(validationMessage).toContain(campaign.expectedValidationMessage);
});

test('expected close date field should not accept month greater than 12', async ({ page }) => {
  const campaign = testData.campaigns[7]; 
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  await CampaignPage.createCampaignWithFields(campaign);
  await CampaignPage.clickCreateCampaignButton();

  const validationMessage = await CampaignPage.getExpectedCloseDateValidationMessage(campaign.expectedValidationField);
  expect(validationMessage).toContain(campaign.expectedValidationMessage);
});

test('edit and update campaign ', async ({ page }) => {
  const campaign = testData.campaigns[8]; 

  // Create campaign first
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  await CampaignPage.createCampaignWithFields(campaign);
  await CampaignPage.clickCreateCampaignButton();
  await expect(page).toHaveURL(testData.URLs.successCampaignCreationURL);

  // Edit campaign status
  await CampaignPage.clickEditCampaignButton();
  await CampaignPage.editCampaignFields(campaign); // This fills updatedStatus
  await CampaignPage.clickUpdateCampaignButton();

  // After updating, go back to edit or details page if needed
  await CampaignPage.clickEditCampaignButton(); 

// Now assert the status
const updatedStatus = await page.$eval('[name="campaignStatus"]', el => el.value);
expect(updatedStatus).toBe(campaign.updatedStatus);
});

test('campaign name field should not accept special characters and numbers', async ({ page }) => {
  const campaign = testData.campaigns[9]; 
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  await CampaignPage.createCampaignWithFields(campaign);
  await CampaignPage.clickCreateCampaignButton();

  const validationMessage = await CampaignPage.getFieldValidationMessage(campaign.expectedValidationField);
  expect(validationMessage).toContain(campaign.expectedValidationMessage);
});

test('Create and validate  campaign is appear in the list', async ({ page }) => {
  

  function generateRandomName(prefix = "Product Launch") {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let suffix = "";
    for (let i = 0; i < 5; i++) {
      suffix += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return `${prefix} ${suffix}`;
  }

  const campaign = {
    name: generateRandomName(),targetSize: '1000',
  };

  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();
  await CampaignPage.createCampaignWithMandatoryFields(campaign);
  await CampaignPage.clickCreateCampaignButton();
  await CampaignPage.searchCampaignByName(campaign.name);

  const row = CampaignPage.getCampaignRowByName(campaign.name);
  await expect(row).toBeVisible();

  const nameCell = CampaignPage.getCampaignNameCell(row);
  await expect(nameCell).toHaveText(campaign.name);
});

test('Validate Campaign Status  dropdown has options', async ({ page }) => {
 
  await CampaignPage.clickCampaignsTab();
  await CampaignPage.clickCreateCampaign();

  const options = await CampaignPage.getCustomDropdownOptions();
  const expectedOptions = ['Planned', 'Active', 'Completed', 'Cancelled'];
  expect(options).toEqual(expectedOptions);
});
test('Validate Save and Cancel buttons are present ', async ({ page }) => {

    await CampaignPage.clickCampaignsTab();
    await CampaignPage.clickCreateCampaign();
 
  const saveCount = await page.locator('button:has-text("Save")').count();
  const cancelCount = await page.locator('button:has-text("Cancel")').count();

  // Fail test if Save or Cancel buttons are missing
  expect(saveCount, '"Save" button is missing ').toBeGreaterThan(0);
  expect(cancelCount, '"Cancel" button is missing ').toBeGreaterThan(0);
});




