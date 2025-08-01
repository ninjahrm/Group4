class LoginPage {
  constructor(page) {
    this.page = page;
  }

  username = '#username';
  password = '#inputPassword';
  loginButton = 'button[type="submit"]';
  
      errorMessageForBlankUsername = '.invalid-feedback';
      errorMessageForBlankPassword = '.invalid-feedback';
 

  async goto(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
    return this.page.url();
  }
 

  async login(username, password) {
    await this.page.fill(this.username, username);
    await this.page.fill(this.password, password);
    await this.page.click(this.loginButton);
   
   // ✅ Check HTML5 validation messages only if fields are empty
    if (username=== '') {
    const message= await this.page.locator(this.errorMessageForBlankUsername).textContent();
    console.log('Error message for blank username:', message);
    return message;
  }

    if (password=== '') {
    const message= await this.page.locator(this.errorMessageForBlankPassword).textContent();
    console.log('Error message for blank password:', message);
    return message;
   
  } 
  await this.page.waitForTimeout(2000);
  // ✅ Fallback: check if login failed by still being on login page
  const stillOnLogin = await this.page.locator(this.loginButton).isVisible();
  if (stillOnLogin) {
    return 'Invalid Credentials';
  }

  // ✅ Login success assumed
  return '';
}

}

module.exports = { LoginPage };
