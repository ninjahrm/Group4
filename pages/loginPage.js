<<<<<<< Updated upstream
class LoginPage {
=======
class loginPage {
>>>>>>> Stashed changes
  constructor(page) {
    this.page = page;
  }

  username = '#username';
  password = '#inputPassword';
  loginButton = 'button[type="submit"]';
 

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
    return await this.page.locator(this.errorMessageForBlankUsername).textContent();
  }

  if (password=== '') {
    return await this.page.locator(this.errorMessageForBlankPassword).textContent();
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

<<<<<<< Updated upstream
module.exports = { LoginPage };
=======
module.exports = { loginPage };
>>>>>>> Stashed changes
