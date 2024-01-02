const data =require("../data/data.json")
require("dotenv").config();
import { executeStep } from "../utils/action";
exports.LoginPage= class LoginOage{
    constructor(test,page){
        this.test=test;
        this.page=page;
        this.usernameField=page.locator("//input[@id='user-name']");
        this.passwordFeild=page.locator("//input[@id='password']");
        this.loginButton=page.locator("//input[@id='login-button']");
        this.loginlogo=page.locator("//div[@class='login_logo']");
        this.errorLogin=page.locator("//h3[@data-test='error']");
    }
    async launchUrl() {
        await this.page.goto(process.env.baseUrl)
      } 

    async loginAction(){
        await executeStep(this.test,this.usernameField,"fill","Enter the username",[data.loginDetails.username]);
        await executeStep(this.test,this.passwordFeild,"fill","Enter the password",[data.loginDetails.password]);
        await executeStep(this.test,this.loginButton,"click","click on the loginButton");
    }
    async InvalidLoginAction(){
        await executeStep(this.test,this.usernameField,"fill","Enter the username",[data.loginDetails.invalidusername]);
        await executeStep(this.test,this.passwordFeild,"fill","Enter the password",[data.loginDetails.invalidpassword]);
        await executeStep(this.test,this.loginButton,"click","click on the loginButton");
  
    }
}