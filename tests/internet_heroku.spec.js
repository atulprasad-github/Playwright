//Tests for all the elements on internet heroku site

const {test, expect} = require('@playwright/test');
const { assert } = require('console');
const exp = require('constants');
test("add/remove elements",async({page})=>
{
    await page.goto("https://the-internet.herokuapp.com/");
    await page.locator("li > a[href='/add_remove_elements/']").click();
    const add_button = await page.locator("button[onclick='addElement()']");
    for(let i =0;i<5;i++){
        await add_button.click();
    }
    let del_btn_ct = await page.locator("button.added-manually:has-text('Delete')").count()
    expect(del_btn_ct).toBe(5)
})

test("handle auth popup",async({browser})=>{
    const context = await browser.newContext({
        httpCredentials:
        {username: "admin",password: "admin"}
    })
    const page = await context.newPage();
    await page.goto("https://the-internet.herokuapp.com/basic_auth");
    expect(await page.locator('.example p')).toContainText("Congratulations");
    await context.close()
})

test("Challenging DOM", async({page})=>{
    await page.goto("https://the-internet.herokuapp.com/")
    await page.locator('li > a[href="/challenging_dom"]').click();
    expect(await page.locator(".example p")).toContainText("The hardest part in automated web testing");
    const btn_ct = await page.locator(".large-2.columns a").count();
    expect(btn_ct).toBe(3) //verify 3 btns on lhs of page
    const rows = await page.locator(".large-10.columns table tbody tr").all();
    const row_ct = rows.length;
    console.log(row_ct)
    // assert table contents
    for (let i=0; i<row_ct;i++){
        const row = rows[i]
        const txt = await row.locator("td").first().allTextContents();
        expect(await row.locator("td").last().locator("a[href='#edit']")).toContainText('edit');
        console.log(txt)
    }
})

test ("handle context dialog", async ({page})=>{
    await page.goto("https://the-internet.herokuapp.com/context_menu");
    let dialogMsg ='';
    page.on('dialog',async d=>{
        dialogMsg = d.message();
        d.accept();
    })
    await page.click("#hot-spot",{button:"right"});
    expect(dialogMsg).toBe("You selected a context menu");

})