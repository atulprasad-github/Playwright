const {test, expect} = require('@playwright/test');
const { timeout } = require('../playwright.config');

test('first item test',async({page})=>{
await page.goto('https://www.saucedemo.com/');
await page.locator('[placeholder="Username"]').fill("standard_user");
await page.locator("#password").fill("secret_sauce");
await page.locator("#login-button").click();
//await expect(page.locator("a[id='item_4_title_link'] div[class='inventory_item_name ']")).toHaveText("Sauce Labs Backpack")
//await expect(page.locator(".inventory_item_label a").nth(0)).toHaveText("Sauce Labs Backpack")
let value = await page.locator(".inventory_item_label a").first().allTextContents()
console.log(value[0])
});

test('no username test', async ({page})=>{
await page.goto("https://www.saucedemo.com/")
// await page.locator("#password").fill("secret_sauce");
await page.getByPlaceholder("Password").fill("secret_sauce");
await page.pause();
//await page.getByText("Login").click();
// await page.locator(".submit-button.btn_action").click();
await page.getByRole("button",{name:'Login'}).click();
await expect(page.locator("h3[data-test='error']")).toContainText("Username is required")
var e = await page.locator("h3[data-test='error']").allTextContents();
console.log(e)
})

test("Test SauceDemo AddToCart @smoke",async({page})=>{
    await page.goto("https://www.saucedemo.com/");
    await page.locator("#user-name").fill("standard_user")
    await page.locator("//input[@id='password']").fill("secret_sauce");
    await page.locator("#login-button").click()
    const items_on_page = await page.locator(".inventory_item_name").allTextContents();
    expect(items_on_page.length).toBe(6);
    await page.locator("#add-to-cart-sauce-labs-onesie").click();
    await page.locator(".shopping_cart_link").click();
    await Promise.all([
        expect(page.locator(".inventory_item_name").nth(0)).toHaveText("Sauce Labs Onesie"),
        expect(page.locator(".inventory_item_desc").nth(0)).toContainText(""),
        expect(page.locator(".inventory_item_price").nth(0)).toContainText("$7.99")
    ])
    })  