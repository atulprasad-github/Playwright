const {test,expect} = require("@playwright/test");
const stays_page = require("../POM/booking_homepage");

test("verify hotel search", async({page})=>{
    await page.goto("https://www.booking.com/");
    const stay = new stays_page(page);
    await stay.search_hotel();
    await stay.verify_hotel_search();
    
})