const {test, expect} = require('@playwright/test');
const { assert } = require('console');
//Tests for all the elements on internetheroku site
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
