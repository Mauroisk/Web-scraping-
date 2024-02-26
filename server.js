const express = require('express');
const server = express();
const puppeteer = require('puppeteer');


server.get('/', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('\nOPPAH, Iniciei!');


  const id = '7894900027013';
  await page.goto(`https://br.openfoodfacts.org/produto/${id}`);
  console.log('\nFui para a url!' );


  const productDetails = await page.evaluate(() => {
    const ingredientsList = Array.from(document.querySelectorAll('.panel_text')).map(ingredient => ingredient.innerText);
    return {
        title: document.querySelector('.title-1').innerText,
        quantity: document.querySelector('#field_quantity_value').innerText,
        category: document.querySelector('#field_categories_value').innerText,
        ingredientsList: ingredientsList,
        nutritionScore: document.querySelector('.grade_e_title').innerText,
        values: document.querySelector('#panel_nutrient_levels_content').innerText,
        servingSize: document.querySelector('#panel_nutrition_facts_table_content').innerText,
        novaScore: document.querySelector('.grade_unknown_title').innerText,
    };
});


console.log('Busca detalhada de produtos:', productDetails);


await browser.close();


res.send({

    "Título": productDetails.title,
    "Quantidade": productDetails.quantity,
    "Categoria": productDetails.category,
    "Ingredientes": productDetails.ingredientsList,
    "Nutrição": productDetails.nutritionScore,
    "Valores Nutricionais": productDetails.values,
    "Dados Nutricionais": productDetails.servingSize,
    "Nova score": productDetails.novaScore,
    
})
});

server.listen(7777, () => {
    console.log('Servidor rodando! acesse em http://localhost:7777');
  });