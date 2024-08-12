const{test, expect} = require("@playwright/test");

test('child window handling', async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://demoqa.com");
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.locator("img[alt='Selenium Online Training']").click()
    ])
    await expect(newPage.locator("a[class='btn btn-primary-shadow btn-block']")).toContainText("asadadad");
    console.log(text)
    await page.waitForLoadState()
})