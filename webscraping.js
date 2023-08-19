const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const headless = !process.argv.includes('-h');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 200
    });
    const page = await browser.newPage();
    await page.goto('https://web.cornershopapp.com/');
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

    await page.waitForSelector('button.continue-button');
   
    const [continueButton] = await page.$x("//button[contains(@class,'continue-button')]");
    if (continueButton) await continueButton.click();
   
    /*
    const [loginButton] = await page.$x("//button[contains(@class,'already-have-account-button')]");
    if (loginButton) await loginButton.click();

    await page.waitForSelector('a.google');
    const aGoogle = await page.$('.google');
    if (aGoogle) await aGoogle.click();

    await page.waitForSelector('.VfPpkd-LgbsSe');
    await page.type('input[name="identifier"]', 'bascur.joan.a@gmail.com');     
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', '#Jesed5$Jojma3');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
*/
    while(true)
    {    
        //await page.waitForSelector('button.cs-modal-close');
        //await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

        //await page.waitForSelector('button.cs-modal-close');
        const closeMessageButton = await page.$('button.cs-modal-close');
        if (closeMessageButton) closeMessageButton.click();

        //await page.waitForNavigation({waitUntil: 'domcontentloaded'});
        await page.waitForSelector('button.store-access');
        const storeButton = await page.$('button.store-access');
        if (storeButton) {
            await storeButton.click();

            await page.waitForSelector('button.promo-access');
            const promoButton = await page.$('button.promo-access');
            if (promoButton) await promoButton.click();

            console.log('paso 1')
            await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
            console.log('paso 2')
            
            let pageHeight = await page.evaluate(() => document.body.scrollHeight);
            let scrollHeight = 0;
            const viewportHeight = 1000; 

            while (scrollHeight < pageHeight) {
                
                await page.evaluate((scrollHeight) => {
                    window.scrollTo(0, scrollHeight);
                }, scrollHeight);
                
                console.log('scrollHeight:'+scrollHeight);
                console.log('pageHeight:'+pageHeight);
                
                await page.waitForTimeout(100);
                scrollHeight += viewportHeight;

                let newPageHeight = await page.evaluate(() => document.body.scrollHeight);
                if(newPageHeight > pageHeight) pageHeight = newPageHeight;
            }


            const elProductGridArray = await page.$$('.products-grid');
            if (elProductGridArray) console.log('elProductGridArray: '+elProductGridArray.length);
            
            let productNumber = 0;
            for (const productGrid of elProductGridArray) {
            
                const elProductsArray = await productGrid.$$('.product');
                if (elProductsArray) console.log(elProductsArray.length);

                for (const product of elProductsArray) {

                    let isActualProduct = true;
                    let countProduct = 0;
                    productNumber += 1; 

                    while (isActualProduct){
                       
                        //await page.waitForTimeout(1000000);
                        //const [badgeAddButton] = await product.$x("//button[contains(@class,'badge-add')]");
                        //if (badgeAddButton) await badgeAddButton.click();

                        let countUnit = 0;
                        const addProductButton = await product.$('.add-product');
                        if (addProductButton){
                            console.log('addProductButton: '+addProductButton);
                            addProductButton.click();
                            countUnit++;
                        }

                        await page.waitForSelector('button.more');
                        const moreButton = await product.$('.more');
                        console.log(moreButton);

                        if(moreButton){
                            for (let count = countUnit; count < 3; count++) {
                                await moreButton.click();
                            }
                            countProduct += 3;
                        }
                        
                        const [cartButton] = await page.$x("//button[contains(@class,'cart-button')]");
                        if (cartButton) await cartButton.click()

                        await page.waitForSelector('div.cart-content-product-detail')
                        await page.screenshot({ path: 'captures/product_'+productNumber+'-'+countProduct+'.png' })

                        
                        if (countProduct >= 12) {
                            const [editButton] = await page.$x("//button[contains(@class,'cart-edit-button')]");
                            if (editButton) await editButton.click()

                            await page.waitForSelector('button.delete-product');
                            const [deleteProductButton] = await page.$x("//button[contains(@class,'delete-product')]");
                            if (deleteProductButton) await deleteProductButton.click()

                            isActualProduct = false;
                        }

                        await page.waitForSelector('button.cs-modal-close');
                        const [closeButton] = await page.$x("//button[contains(@class,'cs-modal-close')]");
                        if (closeButton) await closeButton.click()

                    }
                }  
            }
        }
        break;
    }
    
    await browser.close()
})();


