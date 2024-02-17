const puppeteer = require('puppeteer');

async function extractTextContent(url) {
    // Launch headless Chrome browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the specified URL
    await page.goto(url);

    // Extract text content
    const textContent = await page.evaluate(() => {
        // This function runs in the context of the browser
        // and can access the DOM
        return document.body.innerText;
    });

    // Close the browser
    await browser.close();

    return textContent;
}

// List of URLs to extract text content from
const urls = [
    'https://notion.so/',
    'https://airtable.com/',
    'https://https://obsidian.md/'
];

// Concurrently extract text content from all URLs
Promise.all(urls.map(url => extractTextContent(url)))
    .then(textContents => {
        // Print text content for each URL
        textContents.forEach((textContent, index) => {
            console.log(`Text content for ${urls[index]}:`);
            console.log(textContent);
            console.log('---------------------------------------');
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });



    // const puppeteer = require('puppeteer');

    // async function extractTextContent(url) {
    //   const browser = await puppeteer.launch();
    //   const page = await browser.newPage();
    
    //   await page.goto(url);
    //   const textContent = await page.evaluate(() => {
    //     return document.body.innerText;
    //   });
    
    //   await browser.close();
    //   return textContent;
    // }
    
    // async function extractTextContents(urls) {
    //   const textContents = [];
    //   const browser = await puppeteer.launch();
    
    //   for (const url of urls) {
    //     const page = await browser.newPage();
    //     await page.goto(url);
    //     const content = await page.evaluate(() => {
    //       return document.body.innerText;
    //     });
    //     textContents.push({ url: url, content: content });
    //     await page.close();
    //   }
    
    //   await browser.close();
    //   return textContents;
    // }
    
    // // List of URLs to extract text content from
    // const urls = [
    //     'https://notion.so/',
    //     'https://airtable.com/',
    //     'https://https://obsidian.md/'
    // ];
    
    
    // extractTextContents(urls)
    //   .then(textContents => {
    //     textContents.forEach(({ url, content }) => {
    //       console.log(`Text content for ${url}:`);
    //       console.log(content);
    //       console.log('---------------------------------------');
    //     });
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });
    