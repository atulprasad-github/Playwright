const { error } = require("console");
const{test, expect} = require("@playwright/test");
const { text } = require("stream/consumers");
const test_data = JSON.parse(JSON.stringify(require("../Data/search_data.json")));

class booking_homepage {
    constructor(page) {
        this.page = page;
        this.destination = 'input[placeholder="Where are you going?"]';
        this.flex_date_picker = "button[aria-controls='flexible-searchboxdatepicker']";
        this.top_date_picker = "button[data-testid='date-display-field-start']"
        this.dismiss_signIn = 'button[aria-label="Dismiss sign-in info."]';
        this.search = "button[type='submit']"
        this.destinationDropdownItems= '.abf093bdfe.d2f04c9037'
        this.start_date = 'div[data-testid="searchbox-datepicker"]'
        this.hotel_results = 'div[data-testid="property-card-container"]'
    }

    async search_hotel() {
        try {
            await this.page.waitForSelector(this.dismiss_signIn, { timeout: 15000 });
            await this.page.click(this.dismiss_signIn);
        } catch (e) {
            console.warn('Sign-in popup not visible, proceeding with the search...');
        }
        await this.page.click(this.destination);
        await this.page.fill(this.destination, test_data[0].destination) // enter destination
        // Wait for the destination drop-down to appear
        await this.page.waitForSelector(this.destinationDropdownItems);
        const exact_location = await this.page.locator(this.destinationDropdownItems).filter({text:test_data[0].destination}).locator('nth=0')
    
        if (exact_location) {
            await exact_location.click(); // Click on the element
        } else {
            console.error("Location not found.");
        }
        expect(this.page.locator("button[aria-controls='flexible-searchboxdatepicker']")).toBeVisible()
        await this.page.locator("button[aria-controls='flexible-searchboxdatepicker']").click()
        await this.page.getByText("Other").click();
        await this.page.click(this.search);

    }
    async verify_hotel_search(){
       
        const datepickerTab = await this.page.getByText("Other")
        try {
            await this.page.waitForSelector(this.dismiss_signIn, { timeout: 10000 });
            await this.page.click(this.dismiss_signIn);
        } catch (e) {
            console.warn('Sign-in popup not visible, proceeding with the search...');
        }
        if (datepickerTab.isVisible()){
            console.log("datepicker tab is visible, closing it now")
            // await this.page.pause();
            await this.page.locator(this.top_date_picker).click()
        }
        await this.page.waitForSelector(this.hotel_results,{timeout:8000})
        const hotels_list = await this.page.locator(this.hotel_results).all();
        const hotels_count = hotels_list.length;
        console.log("Search Successful, hotels returned in page="+hotels_count);
    }

}
module.exports = booking_homepage;
