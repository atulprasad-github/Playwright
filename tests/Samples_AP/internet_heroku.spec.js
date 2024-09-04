//Tests for all the elements on internet heroku site

const {test, expect} = require('@playwright/test');
const { assert } = require('console');
const exp = require('constants');
const { promises } = require('dns');
const { json } = require('stream/consumers');
const testdata = JSON.parse(JSON.stringify(require("../../testdata.json")))

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
        {username: testdata.username,password: testdata.password}
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

test("checkboxes", async({page})=>{
    await page.goto("https://the-internet.herokuapp.com/checkboxes");
    let chkbx2 = await page.locator('#checkboxes input[type="checkbox"]:last-child')
    await chkbx2.check();
    expect(chkbx2).toBeChecked();
    await chkbx2.uncheck();
    expect(chkbx2).not.toBeChecked();
})

test("digest_auth",async({browser})=>{
    const context = await browser.newContext({httpCredentials:{username:testdata.username,password:testdata.password}});
    const page = await context.newPage();
    await page.goto("https://the-internet.herokuapp.com/digest_auth");
    expect(page.locator(".example p")).toHaveText("Congratulations! You must have the proper credentials.");
})

test ("Dynamically Loaded Page Elements",async({page})=>{

    await page.goto("https://the-internet.herokuapp.com/dynamic_loading");
    const start_btn = await page.getByText("Start");
    const loading_icon = await page.locator("#loading");
    const finish_text = await page.getByText("Hello World!");
    //iterate through both links and perform same steps
    for (const link of ['a[href="/dynamic_loading/1"]','a[href="/dynamic_loading/2"]'])
    {
        await page.click(`${link}`);
        await start_btn.click();
        await expect(loading_icon).toBeVisible();
        await expect(finish_text).toBeVisible({timeout:10000});
        await page.goBack();
    }
})