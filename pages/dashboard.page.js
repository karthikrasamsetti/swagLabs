const { expect } = require("@playwright/test");
const data = require("../data/data.json")
require("dotenv").config();
import { executeStep } from "../utils/action";
exports.DashboardPage = class DashboardPage {
    constructor(test, page) {
        this.test = test;
        this.page = page;
        this.logo = page.locator("//div[@class='app_logo']");
        this.menuBar = page.locator("//button[@id='react-burger-menu-btn']");
        this.logoutButton = page.locator("//a[@id='logout_sidebar_link']");
        this.addbackbag = page.locator("//button[@id='add-to-cart-sauce-labs-backpack']");
        this.addbikeLight = page.locator("//button[@id='add-to-cart-sauce-labs-bike-light']");
        this.addredHoodie = page.locator("//button[@id='add-to-cart-test.allthethings()-t-shirt-(red)']");
        this.filterDropDown = page.locator("//select[@data-test='product_sort_container']");
        this.fleeceJacket = page.locator("//button[@id='add-to-cart-sauce-labs-fleece-jacket']");
        this.cartLink = page.locator("//div[@id='shopping_cart_container']//a[@class='shopping_cart_link']");
        this.removebikeLight = page.locator("//button[@id='remove-sauce-labs-bike-light']");
        this.checkoutBtn = page.locator("//button[@id='checkout']");
        this.firstnameFeild = page.locator("//input[@id='first-name']");
        this.lastnameFeild = page.locator("//input[@id='last-name']");
        this.zipFeild = page.locator("//input[@id='postal-code']");
        this.continueBtn = page.locator("//input[@id='continue']");
        this.finishBtn = page.locator("//button[@id='finish']");
        this.thankYou = page.locator("//h2[text()='Thank you for your order!']");
        this.backHomeBtn = page.locator("//button[@id='back-to-products']");
        this.navBar = (content) => page.locator(`(//a[text()='${content}'])`);
        this.items = (i) =>
            this.page.locator(     
            `((//div[@id='inventory_container']// descendant::div)[3]/child::div)[${i}]/child::div[@class='inventory_item_img']`
                );
    }
    async logoutAction() {
        await executeStep(this.test, this.menuBar, "click", "Click on menu bar");
        await executeStep(this.test, this.logoutButton, "click", "Click on logout");
    }
    async addToCartAction() {
        await executeStep(this.test, this.addbackbag, "click", "add backBag to cart");
        await executeStep(this.test, this.addbikeLight, "click", "add bikelight to cart");
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await this.page.evaluate(() => {
            window.scrollBy(0, 260);
        });
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await executeStep(this.test, this.addredHoodie, "click", "add redHoodie to cart");
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await executeStep(this.test, this.filterDropDown, "click", "click on filter dropdown");
        await executeStep(this.test, this.filterDropDown, "selectOption", "select required filter", [data.filter.priceHtoL]);
        await executeStep(this.test, this.fleeceJacket, "click", "add fleece jacket to cart");
        await executeStep(this.test, this.cartLink, "click", "click on cart button");
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await executeStep(this.test, this.removebikeLight, "click", "remove bikelight from cart");
        await this.page.evaluate(() => {
            window.scrollBy(0, 250);
        });
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await executeStep(this.test, this.checkoutBtn, "click", "click on checkoutButton");
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await executeStep(this.test, this.firstnameFeild, "fill", "Enter firstname", [data.personalDetails.firstname]);
        await executeStep(this.test, this.lastnameFeild, "fill", "Enter lastname", [data.personalDetails.lastname]);
        await executeStep(this.test, this.zipFeild, "fill", "Enter zip code", [data.personalDetails.zipcode]);
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await executeStep(this.test, this.continueBtn, "click", "click the continue button");
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await this.page.evaluate(() => {
            window.scrollBy(0, 280);
        });
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await executeStep(this.test, this.finishBtn, "click", "click the finish button");
        await expect(this.thankYou).toBeVisible();
        await executeStep(this.test, this.backHomeBtn, "click", "click on BackHome Button");
        await this.logoutAction();


    }
    async menuBarAction() {
        await executeStep(this.test, this.menuBar, "click", "Click on menu bar");
    }
    async logoutClick() {
        await executeStep(this.test, this.logoutButton, "click", "Click on logout");
    }
    
}