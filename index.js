const express = require('express');
const app = express();
const puppeteer = require('puppeteer');


app.get('/', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('\nOPPAH, Iniciei!');
  

  const id = '7894900027013';
  await page.goto(`https://br.openfoodfacts.org/produto/${id}`);
  console.log('\nFui para a url!\n');


  const pageContent = await page.evaluate(() => {
    return {
      name: document.querySelector('.title-1').innerText,
      id: document.querySelector('#barcode').innerText,
      score: document.querySelector('.attr_text').innerText,
      nova: document.querySelector('.grade_e_title').innerText,
      
      
    };
  });


  console.log('Busca de produtos com base nos critérios Nutri-Score e NOVA:\n', pageContent);


  await browser.close();


  res.send({
    
      "Código de barras": pageContent.id,
      "name": pageContent.name,
      "score": pageContent.score,
      "Nova": pageContent.nova,
    
  })
});


app.listen(3000, () => {
  console.log('Servidor rodando! acesse em http://localhost:3000');
});

