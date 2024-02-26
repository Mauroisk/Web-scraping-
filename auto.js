//Web scraping dinâmico ou seja automatizando o servidor web

const pup = require('puppeteer');

const url = "https://br.openfoodfacts.org/";
const searchFor = "nutella";


(async () => {
  const browser = await pup.launch({ headless: false });
  const page = await browser.newPage();
  console.log('OPPAH, Iniciei!');
  
  +8
  

  await page.goto(url);
  console.log('Fui para a url!');


 
  await page.waitForSelector('input[name="search_terms"]');
  await page.type('input[name="search_terms"]', searchFor);


  await Promise.all([
    page.waitForNavigation(), 
    page.click('Button[type="submit"]')
  ]);
  

  const links = await page.$$eval('.list_product_img_div > a', el => el.map(link => link.href));
  
  for (const link of links) {
    await page.goto(link);
    await page.waitForSelector('.title-1');

    const titles = await page.$$eval('.title-1', elements => elements.map(element => element.innerText));
    const ids = await page.$$eval('#barcode_paragraph-1', elements => elements.map(element => element.innerText));

    const obj = { title: titles[0], id: ids[0] };
    console.log(obj);

    c++;
  }

  await new Promise(resolve => setTimeout(resolve, 3000));

  await browser.close();
})();
