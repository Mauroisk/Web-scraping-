const express = require('express');
const app = express();
const puppeteer = require('puppeteer');

app.get('/', async (req, res) => {

  const entrada = require('prompt-sync')({sigint: true});
  let id;

  id = entrada("Digite ID: ");

  console.log(`ID = ${id}`);



  if (!id) {
    return res.status(400).send('Por favor, forneça um ID válido.');
  }

  try {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    console.log('\nOPPAH, Iniciei!');

    await page.goto(`https://br.openfoodfacts.org/produto/${id}`);

    console.log('\nFui para a url!\n');

    const pageContent = await page.evaluate(() => {
      return {
        name: document.querySelector('.title-1').innerText,
        id: document.querySelector('#barcode').innerText,
        score: document.querySelector('.grade_d_title.attr_title').innerText,
        nova: document.querySelector('.grade_e_title.attr_title').innerText,
        nutritionTitle: document.querySelector('.panel_title.grade_d').innerText,
        novaTitle: document.querySelector('#panel_nova').innerText
      };
    });

    console.log('Busca de produtos com base nos critérios Nutri-Score e NOVA:\n', pageContent);

    await browser.close();

    
    // Aqui você pode adicionar lógica para definir os títulos com base em condições específicas, se necessário.
    
    res.json({
      
      id: pageContent.id,
      name: pageContent.name,
      nutrition: {
        score: pageContent.score,
        title: pageContent.nutritionTitle,
      },
      nova: {
        score: pageContent.nova,
        title: pageContent.novaTitle,
      }
      
    });
  } catch (error) {
    console.error('Ocorreu um erro:', error);
    res.status(500).send('Ocorreu um erro ao processar a solicitação.');
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando! acesse em http://localhost:3000');
});

//Exemplos de alguns IDs dos produtos do site:

//3155250349793

//7898024394181

//7894900027013

//7894900530001