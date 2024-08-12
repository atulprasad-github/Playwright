const{test,expect} = require("@playwright/test");
const { assert } = require("console");
const exp = require("constants");

test("simple_window_handling",async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://demoqa.com/");
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.locator(".banner-image").click()
    ])
    await expect(newPage.locator("a[class='btn btn-primary-shadow btn-block']")).toContainText("Registration")
})