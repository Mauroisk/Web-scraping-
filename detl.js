const express = require('express');
const server = express();
const puppeteer = require('puppeteer');

server.get('/', async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        console.log('\nOPPAH, Iniciei!');

        const id = '3155250349793';
        await page.goto(`https://br.openfoodfacts.org/produto/${id}`);
        console.log('\nFui para a url!');

        const productDetails = await page.evaluate(() => {
            const ingredientsList = Array.from(document.querySelectorAll('#panel_ingredients_content')).map(ingredient => ingredient.innerText);
            return {
                title: document.querySelector('.title-1').innerText,

                quantity: document.querySelector('#field_quantity_value').innerText,

                ingredientsList: ingredientsList,

                nutritionScore: document.querySelector('.grade_d_title.attr_title').innerText,

                nutritionServingSize: document.querySelector('#panel_nutrition_facts_table_content').innerText,

                novaScore: document.querySelector('.grade_e_title.attr_title').innerText,

                novaTitle: document.querySelector('#panel_nova').innerText,

            };
        });

        console.log('Busca detalhada de produtos:', productDetails);

        await browser.close();

        res.json({
            titulo: productDetails.title,
            Quantidade: productDetails.quantity,
            Ingredientes: {
                lista: productDetails.ingredientsList,
            },
            Nutrição: {
                score: productDetails.nutritionScore,
                values: productDetails.nutritionValues,
                servingSize: productDetails.nutritionServingSize,
            },
            nova: {
                score: productDetails.novaScore,
                title: productDetails.novaTitle
            }
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Ocorreu um erro ao processar a solicitação.');
    }
});

server.listen(7777, () => {
    console.log('Servidor rodando! Acesse em http://localhost:7777');
});
