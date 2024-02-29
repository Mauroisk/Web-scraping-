# Web Scraping

### Web Scraper de detalhes de Produtos 

Este é um projeto simples onde utilizei o Puppeteer para realizar scraping de informações de produtos alimentícios a partir do site [Open Food Facts](https://br.openfoodfacts.org).


**Pré-requisitos:**
- Antes de começar, é preciso ter o Node.js instalado em sua máquina. Você pode baixá-lo em [nodejs.org](https://nodejs.org/en).



**Passo a Passo:**
**Utilizei os passos abaixo para criar o projeto:**


**1º** Criei um novo diretório para o projeto e naveguei até ele:

  _bash_
  => **_mkdir Projeto_**
  => **_cd Projeto_**


**2º** Inicializei o projeto Node.js:

  _bash_
  => **_npm init -y_**
  
  
**3º** Instalei as dependências necessárias (Express e Puppeteer):
  _bash_
  => _**npm install express puppeteer**_


**Por último** Instalei o prompt que permite receber valores pelo teclado:
_bash_
  => _**npm install prompt-sync**_
  


**Depois de instalar  as dependência necessárias, criei dois arquivos javascript dentro da pasta  :**

1.    "index.js" para a busca de produtos com base nos critérios Nutri-Score e NOVA;

2.    "detl.js" para a busca detalhada de produtos


# No arquivo 'index.js' vou adicionar o código do projeto para a busca de produtos com base nos critérios Nutri-Score e NOVA:


**//O script começa importando os módulos necessários: express para o servidor web, puppeteer para automação do navegador:**
```
const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
```


**//Configuração de um endpoint no Express para lidar com requisições HTTP do tipo GET na rota raiz ('/').**
`app.get('/', async (req, res) => {
`
  **//Dentro do endpoint, o Puppeteer é inicializado, um navegador é lançado e uma nova página é aberta:**
 ```
 const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('\nOPPAH, Iniciei!');
```


  **//A página é navegada para o produto pertencente ao ID que será atribuido no terminal ,"https://br.openfoodfacts.org/produto/${id}":**
  ```
const entrada = require('prompt-sync')({sigint: true});
  let id;

  id = entrada("Digite ID: ");

  console.log(`ID = ${id}`);


  if (!id) {
    return res.status(400).send('Por favor, forneça um ID válido.');
  }
  await page.goto(`https://br.openfoodfacts.org/produto/${id}`);
  console.log('\nFui para a url!\n');
```


  **//Utilizando o Puppeteer, o conteúdo da página é avaliado e informações específicas são extraídas do DOM:**
  try{
 ` const pageContent = await page.evaluate(() => {
`
  **// Código para extrair informações da página:**
   ```
 return {
      name: document.querySelector('.title-1').innerText,
        id: document.querySelector('#barcode').innerText,
        score: document.querySelector('.grade_d_title.attr_title').innerText,
        nova: document.querySelector('.grade_e_title.attr_title').innerText,
        nutritionTitle: document.querySelector('.panel_title.grade_d').innerText,
        novaTitle: document.querySelector('#panel_nova').innerText
    };
  });
```


  **//As informações extraídas são exibidas no console e enviadas como resposta à requisição HTTP:**
  console.log('Busca de produtos com base nos critérios Nutri-Score e NOVA:\n', pageContent);

  **//Fechou-se o navegador Puppeteer após a conclusão da extração de dados:**
  `await browser.close();`

**// ... (Detalhes do produto extraídos)**
  ```
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
    **// ...Mensagem de erro**
    } catch (error) {
    console.error('Ocorreu um erro:', error);
    res.status(500).send('Ocorreu um erro ao processar a solicitação.');
  }
});
```


**//O servidor Express é inicializado e configurado para ouvir na porta 3000:**
```
app.listen(3000, () => {
  console.log('Servidor rodando! acesse em http://localhost:3000');
});

```

**//Abra o terminal e Execute o servidor:**
  _bash_
  => **_node index.js_**


//**Acesse o servidor no navegador:**

**//Abra um navegador web e acesse [](http://localhost:3000) para ver os resultados.**






# No arquivo 'detl.js' vou adicionar o código do projeto para a busca detalhada produtos:

//No detl.js atribuirei o id dentro do código;

**//O script começa importando os módulos necessários: express para o servidor web, puppeteer para automação do navegador:**
```
const express = require('express');
const server = express();
const puppeteer = require('puppeteer');

```

**//Configuração de um endpoint no Express para lidar com requisições HTTP do tipo GET na rota raiz ('/').**
`server.get('/', async (req, res) => {`

**//Dentro do endpoint, o Puppeteer é inicializado, um navegador é lançado e uma nova página é aberta:**
 ```
 const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('\nOPPAH, Iniciei!');

```


**//A página é navegada para a URL desejada, neste caso,"https://br.openfoodfacts.org/produto/${id}":**
```
  const id = '7894900027013';
  await page.goto('https://br.openfoodfacts.org/produto/${id}');
  console.log('\nFui para a url!' );

```


**//Utilizando o Puppeteer, o conteúdo da página é avaliado e informações específicas são extraídas do DOM:**
```
  const productDetails = await page.evaluate(() => {
    const ingredientsList = Array.from(document.querySelectorAll('.panel_text')).map(ingredient => ingredient.innerText);


```
    // Código para extrair informações da página:
   ```
 return {
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

```

**//As informações extraídas são exibidas no console e enviadas como resposta à requisição HTTP:**
`console.log('Busca detalhada de produtos:', productDetails);
`

**//Fechou-se o navegador Puppeteer após a conclusão da extração de dados:**
`await browser.close();
`

**// ... (Detalhes do produto extraídos)**

```
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
})

**// ...Mensagem de erro**
} catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Ocorreu um erro ao processar a solicitação.');
    }

});

```
**//Iniciou-se o servidor Express para escutar requisições na porta 7777.**
```
server.listen(7777, () => {
    console.log('Servidor rodando! acesse em[]( http://localhost:7777)');
  });

```
  **//Abra o terminal e Execute o servidor:**
  _bash_
  => **_node detl.js_**


**//Acesse o servidor no navegador:**

**//Abra um navegador web e acesse http://localhost:7777 para ver os resultados.**


# Como é feito a busca de produtos ?

=> Para o 'index.js'  vai no site https://br.openfoodfacts.org Pega o id de qualquer produto desejado e coloca no terminal ao ser solicitado.

=> Para o 'detl.js' é só colar o id dentro do código na função
```
 const id = 'Colar o id de qualquer produto aqui';
 await page.goto('https://br.openfoodfacts.org/produto/${id}');
 console.log('\nFui para a url!' ); Para poder obter os detalhes do produto pertencente a este ID;
```


//Gostei muito de fazer este trabalho ganhei várias experências no desenrolar do código, Não foi difícil elaborar este trabalho mas tive algumas dificuldades considerados normais.
//OBS: Ouve Classes que não se tinha encontrado no site.