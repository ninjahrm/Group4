const { time } = require( "console" );

 class createLeadPage {
    constructor(page) {
        this.page = page;
        // Example selectors
        this.username = '#username';
      this.password = '#inputPassword';
      this.loginButton = 'button[type="submit"]';
        this.Leadstab = 'a[href="/leads"]';
        this.createLead = 'button[class="btn btn-info"]';
        this.leadName = '[name="name"]';
        this.company =  '[name="company"]';
        this.leadSource = '[name="leadSource"]';
        this.industry = '[name="industry"]';
        this.annualRevenue = '[name="annualRevenue"]';
        this.noOfEmployees = '[name="noOfEmployees"]';
        this.phoneNo = '[name="phone"]';
        this.email =  '[name="email"]';
        this.secondEmail =  '[name="secondaryEmail"]' ;
        this.leadStatus =  '[name="leadStatus"]' ;
        this.rating =  '[name="rating"]' ;
        this.assignedTo =  '[name="assignedTo"]' ;
        this.address =  '[name="address"]' ;
        this.city =  '[name="city"]' ;
        this.country =  '[name="country"] ';
        this.postalCode =  '[name="postalCode"]' ;
        this.website =  '[name="website"] ';
      //  this.campaign =  '[name="campaign"]' ;
      this.campaignPlus = '[data-icon="plus"]';
      //this.campaignSelect = 'button[class="select-btn"]';
        this.campaignSelect = 'tr:nth-of-type(2) > td:nth-of-type(7) > button';
        this.description =  'textarea[name="description"]' ;
        this.createLeadButton =  'button[type="submit"]';
    
    }
async clickLeadsTab(){

    await this.page.click(this.Leadstab);
}


async clickCreateLeadButton(){

    await this.page.click(this.createLeadButton);
}
    async createLeadwithDetails(leadData){
       // await this.page.click(this.Leadstab);
        await this.page.fill(this.leadName, leadData.name);
        await this.page.fill(this.company, leadData.company);
        await this.page.fill(this.leadSource, leadData.leadSource);
        await this.page.fill(this.industry, leadData.industry);
        await this.page.fill(this.annualRevenue, leadData.annualRevenue);
        await this.page.fill(this.noOfEmployees, leadData.noOfEmployees);
        await this.page.fill(this.phoneNo, leadData.phoneNo);
        await this.page.fill(this.email, leadData.email);
        await this.page.fill(this.secondEmail, leadData.secEmail);
        await this.page.fill(this.leadStatus, leadData.leadStatus);
        await this.page.fill(this.rating, leadData.rating);
        await this.page.fill(this.assignedTo, leadData.assignedTo);
        await this.page.fill(this.address, leadData.address);
        await this.page.fill(this.city, leadData.city);
        await this.page.fill(this.country, leadData.country);
        await this.page.fill(this.postalCode, leadData.postal_code);
        await this.page.fill(this.website, leadData.website);
        //await this.page.selectOption(this.campaign, leadData.campaign);
        //await this.page.click(this.campaignPlus);
        const [popup] =await Promise.all([this.page.context().waitForEvent('page'),this.page.click(this.campaignPlus)]);
        await popup.waitForLoadState();
        await popup.click(this.campaignSelect);

        //await this.page.locator(this.campaignSelect);
        await popup.close;
        this.page.setDefaultTimeout(60000);
        await this.page.fill(this.description, leadData.description);

        // Submit the form
        //await this.submit();

    }    
    async createLeadwithManDetails(leadData){
       // await this.page.click(this.Leadstab);
        await this.page.fill(this.leadName, leadData.name);
        await this.page.fill(this.company, leadData.company);
        
        await this.page.fill(this.industry, leadData.industry);
        await this.page.fill(this.leadSource, leadData.leadSource);
        await this.page.fill(this.phoneNo, leadData.phoneNo);
        await this.page.fill(this.leadStatus, leadData.leadStatus);
        const [popup] =await Promise.all([this.page.context().waitForEvent('page'),this.page.click(this.campaignPlus)]);
        await popup.waitForLoadState();
        await popup.click(this.campaignSelect);

        //await this.page.locator(this.campaignSelect);
        await popup.close;
        

    }
    async createLeadwithblankCampaignDetails(leadData){
       // await this.page.click(this.Leadstab);
        await this.page.fill(this.leadName, leadData.name);
        await this.page.fill(this.company, leadData.company);
        
        await this.page.fill(this.industry, leadData.industry);
        await this.page.fill(this.leadSource, leadData.leadSource);
        await this.page.fill(this.phoneNo, leadData.phoneNo);
        await this.page.fill(this.leadStatus, leadData.leadStatus);
       /* const [popup] =await Promise.all([this.page.context().waitForEvent('page'),this.page.click(this.campaignPlus)]);
        await popup.waitForLoadState();
        await popup.click(this.campaignSelect);

        //await this.page.locator(this.campaignSelect);
        await popup.close;*/
        

    }
    async goto(url) {
      await this.page.goto(url);
      await this.page.waitForLoadState('networkidle');
      return await this.page.url();
    }
    
  
async login(username, password) {
      
    await this.page.fill(this.username, username);
    await this.page.fill(this.password, password);
    await this.page.click(this.loginButton);

}
async getFieldValidationMessage(fieldName) {

    return await this.page.evaluate((name) => {
        const el = document.querySelector(`[name="${name}"]`);
    return el ? el.validationMessage : 'Field not found';
    }, fieldName);
}
async clickCreateLead(){
    await this.page.click(this.createLead)
}
async getCampaignAlert() {
     await this.clickCreateLeadButton();
   this.page.on('dialog', async dialog => {
  console.log('Alert message:', dialog.message());
  await dialog.accept(); // or dialog.dismiss() if needed
  
    });

}

  
}


   


module.exports = { createLeadPage };