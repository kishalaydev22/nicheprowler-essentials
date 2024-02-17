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

// Usage example:
const url = 'https://notion.com';
extractTextContent(url)
    .then(textContent => {
        console.log(textContent);
    })
    .catch(error => {
        console.error('Error:', error);
    });
