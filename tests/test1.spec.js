
const data = require("../data/data.json")
require("dotenv").config();
const { default: test, expect } = require("@playwright/test");
const indexPage = require("../pages/pageIndex.page")


test.beforeEach(async ({page})=>{
    await test.step("Launching url", async () => {
    const loginPage=new indexPage.LoginPage(test,page);
    await loginPage.launchUrl();
    
});
});

test("login user",async ({page})=>{
    const login=new indexPage.LoginPage(test,page);
    const dashboard=new indexPage.DashboardPage(test,page);
    await login.loginAction();
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await expect(dashboard.logo).toBeVisible();
    await dashboard.logoutAction();
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await expect(login.loginlogo).toBeVisible();

})
test("login with invalid user",async ({page})=>{
    const login=new indexPage.LoginPage(test,page);
    await login.InvalidLoginAction();
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await expect(login.errorLogin).toBeVisible();

})
test("add to cart",async({page}) =>{
    const login=new indexPage.LoginPage(test,page);
    await login.loginAction();
    const dashboardpage=new indexPage.DashboardPage(test,page);
    await dashboardpage.addToCartAction();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await expect(login.loginlogo).toBeVisible();

})
test("Validations on Dashboardpage",async({page}) =>{
    const loginPage = new indexPage.LoginPage(test,page);
    await loginPage.loginAction();
    const dashboardpage =new  indexPage.DashboardPage(test,page);
    for (let i = 1; i < 7; i++) {
        var info = dashboardpage.items(i);
        await expect(info).toBeVisible();
        await page.waitForTimeout(parseInt(process.env.small_timeout));
    }
})
test("Validations on Sidenavbar",async ({ page }) => {
    const loginPage = new indexPage.LoginPage(test,page);
    await loginPage.loginAction();
    const nav =new  indexPage.DashboardPage(test,page);
    nav.menuBarAction();
    for(const content of data.navBarText) {
       await expect(nav.navBar(content)).toBeVisible();
       await page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    await nav.logoutClick();
  })

