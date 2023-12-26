// Add Modules
let limit = 10
const downloadImage = require('./imageDownloader');
const puppeteer = require('puppeteer'); // Web manipulation
const readlineSync = require('readline-sync');





// Get input from the user and split it into an array
const themes = readlineSync.question('Write your desired tags: ').split(' ');
const answer = themes.join('_'); // Insert the underscore between them

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // Timeout



(async () => {
    const browser = await puppeteer.launch(); // launch browser
    const page = await browser.newPage(); // open newpage
    await page.goto('https://safebooru.org'); //
    const searchInputSelector = 'input[name="tags"]';
    await delay(3000);
    await page.type(searchInputSelector, answer);
    await page.keyboard.press('Enter');
    await delay(3000);
    const imgSrcsInDivs = await page.evaluate(() => {
        const divsWithImages = document.querySelectorAll('div');
        const imgSrcs = [];
        divsWithImages.forEach(div => {
            const imgElements = div.querySelectorAll('a');
            imgElements.forEach(img => {
                imgSrcs.push(img.href);
            });
        });
        return imgSrcs;
    });
    const justJpg = imgSrcsInDivs.filter(src => src.includes('view&id'));
    const finalJpg = []
    for ( let i = 0; i < Math.min(limit, justJpg.length) ; i++) {
       await page.goto(justJpg[i])
            finalJpg[i] = await page.evaluate(() => {
            const jpgSrcs = []
        const allDivs =  document.querySelectorAll('div')
            allDivs.forEach(div => {
                const  allJpg = div.querySelectorAll('img')
                allJpg.forEach(jpgs => {
                    jpgSrcs.push(jpgs.src);
                })
            })
            return jpgSrcs.filter(src => src.includes('jpg'));
        })
    }
    for(let i = 0 ; i < finalJpg.length ; i++) {
        await  delay(1500)
       await downloadImage(finalJpg[i][0],`C:\\Users\\firat\\WebstormProjects\\Safebooru\\Photos\\image${i+1}.jpg`)
    }
    await browser.close();
})();