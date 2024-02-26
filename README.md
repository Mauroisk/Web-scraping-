# Primeiros passos para criar o projeto
Web Scraper de Informações de Produtos 
Este é um projeto simples onde utilizei o Puppeteer para realizar scraping de informações de produtos alimentícios a partir do site [Open Food Facts](https://br.openfoodfacts.org).


Pré-requisitos:
Antes de começar, é preciso ter o Node.js instalado em sua máquina. Você pode baixá-lo em 'nodejs.org'.

bash significa terminal;

Passo a Passo:
Utilizei os passos abaixo para criar o projeto:


1º Criei um novo diretório para o projeto e naveguei até ele:
  bash
  => mkdir Projeto
  => cd Projeto


2º Inicializei o projeto Node.js:
  bash
  => npm init -y
  
  
3º Instalei as dependências necessárias (Express e Puppeteer):
  bash
  => npm install express puppeteer


Depois de instalar  as dependência necessárias, criei dois arquivos javascript dentro da pasta :

   "index.js" para a busca de produtos com base nos critérios Nutri-Score e NOVA;

   "server.js" para a busca detalhada de produtos


# No arquivo 'index.js' vou adicionar o código do projeto para a busca de produtos com base nos critérios Nutri-Score e NOVA:


//O script começa importando os módulos necessários: express para o servidor web, puppeteer para automação do navegador:

const express = require('express');
const app = express();
const puppeteer = require('puppeteer');


//Configuração de um endpoint no Express para lidar com requisições HTTP do tipo GET na rota raiz ('/').

app.get('/', async (req, res) => {


  //Dentro do endpoint, o Puppeteer é inicializado, um navegador é lançado e uma nova página é aberta:

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('\nOPPAH, Iniciei!');


  //A página é navegada para a URL desejada, neste caso,"https://br.openfoodfacts.org/produto/${id}":

  const id = '7898024394181';
  await page.goto(`https://br.openfoodfacts.org/produto/${id}`);
  console.log('\nFui para a url!\n');


  //Utilizando o Puppeteer, o conteúdo da página é avaliado e informações específicas são extraídas do DOM:

  const pageContent = await page.evaluate(() => {

  // Código para extrair informações da página:

    return {
      name: document.querySelector('.title-1').innerText,
      id: document.querySelector('#barcode').innerText,
      score: document.querySelector('.attr_text').innerText,
      nova: document.querySelector('.grade_e_title').innerText,
    };
  });


  //As informações extraídas são exibidas no console e enviadas como resposta à requisição HTTP:

  console.log('Busca de produtos com base nos critérios Nutri-Score e NOVA:\n', pageContent);

  //Fechou-se o navegador Puppeteer após a conclusão da extração de dados:
  await browser.close();

  res.send({

  // ... (Detalhes do produto extraídos)

    "Código de barras": pageContent.id,
    "name": pageContent.name,
    "score": pageContent.score,
    "Nova": pageContent.nova,
  });
});


//O servidor Express é inicializado e configurado para ouvir na porta 3000:
app.listen(3000, () => {
  console.log('Servidor rodando! acesse em http://localhost:3000');
});


Abra o terminal e Execute o servidor:
  bash
  => node index.js


Acesse o servidor no navegador:

Abra um navegador web e acesse http://localhost:3000 para ver os resultados.






# No arquivo 'server.js' vou adicionar o código do projeto para a busca detalhada produtos:

//O script começa importando os módulos necessários: express para o servidor web, puppeteer para automação do navegador:
const express = require('express');
const server = express();
const puppeteer = require('puppeteer');


//Configuração de um endpoint no Express para lidar com requisições HTTP do tipo GET na rota raiz ('/').
server.get('/', async (req, res) => {

//Dentro do endpoint, o Puppeteer é inicializado, um navegador é lançado e uma nova página é aberta:
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('\nOPPAH, Iniciei!');



//A página é navegada para a URL desejada, neste caso,"https://br.openfoodfacts.org/produto/${id}":
  const id = '7894900027013';
  await page.goto('https://br.openfoodfacts.org/produto/${id}');
  console.log('\nFui para a url!' );



//Utilizando o Puppeteer, o conteúdo da página é avaliado e informações específicas são extraídas do DOM:
  const productDetails = await page.evaluate(() => {
    const ingredientsList = Array.from(document.querySelectorAll('.panel_text')).map(ingredient => ingredient.innerText);


    // Código para extrair informações da página:
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


//As informações extraídas são exibidas no console e enviadas como resposta à requisição HTTP:
console.log('Busca detalhada de produtos:', productDetails);


//Fechou-se o navegador Puppeteer após a conclusão da extração de dados:
await browser.close();


res.send({

  // ... (Detalhes do produto extraídos)
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

//Iniciou-se o servidor Express para escutar requisições na porta 7777.
server.listen(7777, () => {
    console.log('Servidor rodando! acesse em http://localhost:7777');
  });

  Abra o terminal e Execute o servidor:
  bash
  => node server.js


Acesse o servidor no navegador:

Abra um navegador web e acesse http://localhost:7777 para ver os resultados.


# Como é feito a busca de produtos ?

=> Para fazer a busca do Produto vai no site https://br.openfoodfacts.org Pega o id de qualquer produto desejado;

=> Depois é só colar o id dentro do código na função const id = 'colar o id aqui', Para poder obter os detalhes deste produto.