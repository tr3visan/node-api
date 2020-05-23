# Node JS - API

## Criando uma api com Node JS

---

### Criando a estrutura

- Criar uma pasta para o projeto
- Abrir essa pasta no cli e iniciar o npm com o comando:

```jsx
// terminal

npm init -y
```

- Em seguida vamos instalar o Express:

```jsx
npm install express

// Express tem como função auxiliar nas rotas da aplicação
```

- Nesse momento, podemos criar o arquivo `server.js`na raiz do projeto
- No `server.js` podemos importar o express e armazenamos em uma variável.

```jsx
const express = require('express');
const app = express()
```

- Agora basta iniciar a porta configurando:

```jsx
app.liste(3001)

// Nesse momento já conseguimos acessar: http://localhost:3001
// porém ainda a página tudo em branco
```

---

### Criando a primeira rota

Quano o usuário acessar a rota, irá aparecer uma resposta na view

- Configurando a primeira rota:

```jsx
// A função get recebe dois parâmetros
// 1º rota
// 2º uma callback function com dois parâmetros (req, res)

app.get('/', (req, res) => {
	res.send('Hello World!')
})

/*

req -> simboliza a requisição que é feita ao servidor.
O que podemos pegar com o req ?
- parâmetros
- corpo da requisição
- cabeçalho da requisição
- usuário da requisição
- autenticação
- IP

res -> é o que devolvemos para a requisição.

*/

/*
Nesse momento já conseguimos acessar: http://localhost:3001
com um texto "Hello World!"
*/
```

![imagem](https://github.com/tr3visan/node-api/blob/master/img/Untitled-2020-05-11-0825.png)

---

### Utilizando o Nodemon

Nodemon auxilia na atualização da aplicação quando fazemos alguma ateração nos arquivos. Basicamente ele fica assistindo o arquivo `server.js` e atualiza automaticamente sem que precisamos ficar carregando a página toda vez.

- Instalando o nodemon

```jsx
npm install nodemon --save-dev

// resultado no arquivo package.json
"devDependencies": {
    "nodemon": "^2.0.4"
}
```

- Abrimos o arquivo `package.json` e adicionamos o script:

```jsx
// package.json

"scripts": {
	"dev": "nodemon server.js"
}
```

- Nesse momento podemos reiniciar nosso servidor digitando digitando o comando:

```jsx
// terminal

npm run dev

// a partir de agora ele faz o refresh automático
```

---

### Instalando o MongoDB no Docker

- Instalar o [Docker](https://www.docker.com/) e abrir o terminal
- Baixando uma imagem no Docker:

```jsx
// terminal

docker pull mongo
```

- Criando um container para o MongoDB

```jsx
// direcionamento de porta

/*
	Explicando o comando:
	--name mongodb = nomeando o container
	-p 27017:27017 =
	1ª porta é referente a nossa máquina
	2ª porta é referente a maquina no docker
	-d mongo = a imagem a ser utilizada
*/

docker run --name mongodb -p 27017:27017 -d mongo
```

```jsx
// terminal

docker ps

// verificar quais imagens estão rodando
```

- Nesse momento podemos verificar se está funcionando acessando:

```jsx
// navegador

http://localhost:27017

// It looks like you are trying to access MongoDB over HTTP on the native driver port.
```

---

### Instalando o Robot 3T

Através do Robot 3T é possível visualizar o Schema do bando de dados

- Instalando o [Robot 3T](https://robomongo.org/download)
- Configurando:

![Robot 3T](https://github.com/tr3visan/node-api/blob/master/img/Captura_de_Tela_2020-05-23_as_09.47.44.png)

- Agora é só clicar em `create` e configurar a porta para `27017`

---

### Criando a conexão com o Banco da Dados

- Vamos instalar a dependência Mongoose, abrindo o terminal do nosso projeto:

```jsx
// terminal

npm install mongoose
```

- No arquivo `server.js` importamos o mongoose:

```jsx
// server.js

const mongoose = require('mongoose')
```

- Conectando:

```jsx
// server.js

// Iniciando o DB
mongoose.connect('mongodb://localhost:27017/nodeapi', { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
```

---

### Criando o Model

- Vamos criar uma pasta `src` / `models` / `Product.js`
- Abrindo o arquivo `Product.js`, vamos construir o schema:

```jsx
// Product.js

const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Product', ProductSchema)
```

- Agora voltamos ao arquivo `server.js`, e logo abaixo da iniciação ao BD que fizemos anteriormente fazemos um require ao schema. Para isso vamos instalar como dependencia e importar o `require-dir` para auxiliar:

```jsx
// terminal

npm install require-dir
```

```jsx
// server.js

// Conexão completa com o require ao schema do Product

// Iniciando o DB
// nodeapi = nome do banco de dados

mongoose.connect('mongodb://localhost:27017/nodeapi', { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// require no Schema
requireDir('./src/models')
```

- Criando um teste para verificar a conexão:

```jsx
// server.js

const Product = mongoose.model('Product')

app.get('/', (req, res) => {
	Product.create({
		title: 'Nome do Produto',
		description: 'Descrição do produto',
		url: 'https://github.com'
	})
	return res.send('Hello World!')
})

/*
	Obs: posteriormente vamos retirar esse trecho de código
	do arquivo server.js e criar um Controller.
*/
```

- Nesse momento podemos salvar o arquivo, verificar se não deu algum erro no terminal, abrir o `Robot 3T`,  e o que aconteceu?
    - Foi criando o bando de dados com o nome `nodeapi`
    - Em collections foi criado uma tabela `products`
    - Ok!

    ![Robot 3T](https://github.com/tr3visan/node-api/blob/master/img/Captura_de_Tela_2020-05-23_as_10.40.44.png)

    ---

---

### Reestruturação de arquivos

Vamos organizar melhor as pastas do nosso projeto.

- Dentro da pasta `src` criamos o arquivo `routes.js`

```jsx
// routes.js

const express = require('express')
const routes = express.Router()

routes.get('/', (req, res) => {
	Product.create({
		title: 'Nome do Produto',
		description: 'Descrição do produto',
		url: 'https://github.com'
	})
	return res.send('Hello World!')
})

module.exports = routes

/*
	Posteriormente vamos retirar (req, res) => {}
	para um arquivo ProductController.js
*/
```

- Agora vamos criar uma pasta `controllers` e criamos o arquivo `ProductController.js`

```jsx
// ProductController.js

const mongoose = require('mongoose')

const Product = mongoose.model('Product')

module.exports = {
  async index(req, res) {
    const products = await Product.find()

		return res.json(poducts)
  },
}
```

```jsx
// server.js

// Setando a rota api como padrão
app.use('/api', require('./src/routes'))
```

- Voltamos pro arquivo `routes.js`

```jsx
// routes.js

const express = require('express')
const routes = express.Router()

// importando o ProductController
const ProductController = require('./controllers/ProductController')

// get produto
routes.get('/products', ProductController.index)
```

- Agora vamos ir até a url do navegador e fazer uma requisição de teste

```jsx
// navegador

localhost:3001/api/products

// irá aparecer um produto na página
```

---

### Baixando e utilizando o [Insomnia](https://insomnia.rest/)

- Podemos setar uma url base:
- Clicamos em: `No Environment` / `Manage Environments` /
- Configuramos `uma base_url` / confirmamos em `DONE`

![Imagem](https://github.com/tr3visan/node-api/blob/master/img/Captura_de_Tela_2020-05-23_as_12.41.29.png)

- Agora teremos uma url base para nos auxiliar:

![Imagem](https://github.com/tr3visan/node-api/blob/master/img/Captura_de_Tela_2020-05-23_as_12.47.08.png)

- 

---

### Criação de Registro

- Vamos abrir o arquivo `ProductController.js`

```jsx
// ProductController.js

const mongoose = require('mongoose')

const Product = mongoose.model('Product')

module.exports = {

  async index(req, res) {
    const { page = 1 } = req.query
    const products = await Product.paginate({}, { 
      page,
      limit: 10
    })
    return res.json(products)
  },
	
	// Criando um produto através do body da requisição
  async store(req, res) {
    const product = await Product.create(req.body)
    return res.json(product)
  },

}
```

- Agora, vamos pro arquivo `server.js` para permitir que enviamos para a nossa aplicação dados no formato de `JSON`

```jsx
// server.js

// permitindo envio de dados json na aplicação
app.use(express.json())
```

- Vamos pro Insomnia, criamos um método `Create`, selecionamos o formato `JSON` para o body e criamos um produto:

![Imagem](https://github.com/tr3visan/node-api/blob/master/img/Captura_de_Tela_2020-05-23_as_13.05.11.png)

- Se clicarmos em `Send`, será feito o registro e nos retornará uma resposta ao lado:

![Imagem](https://github.com/tr3visan/node-api/blob/master/img/Captura_de_Tela_2020-05-23_as_13.07.55.png)

- Podemos abrir o `Robot 3T` e também verificar esse registo

---

### CRUD

Vamos criar o restante das rotas!

- Vamos abrir o `ProductController.js`

```jsx
// ProductController.js

const mongoose = require('mongoose')

const Product = mongoose.model('Product')

module.exports = {

  async index(req, res) {
    const { page = 1 } = req.query
    const products = await Product.paginate({}, { 
      page,
      limit: 10
    })
    return res.json(products)
  },

  async show(req, res){
    const product = await Product.findById(req.params.id)
    return res.json(product)
  },

  async store(req, res) {
    const product = await Product.create(req.body)
    return res.json(product)
  },

  async update(req, res){
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.json(product)
  },

  async destroy(req, res){
    await Product.findByIdAndRemove(req.params.id)
    return res.send()
  }
}
```

- Criando as rotas no arquivo `routes.js`

```jsx
// routes.js

const express = require('express')
const routes = express.Router()

const ProductController = require('./controllers/ProductController')

// get produto
routes.get('/products', ProductController.index)
routes.get('/products/:id', ProductController.show)

// criando produto
routes.post('/products', ProductController.store)

// update
routes.put('/products/:id', ProductController.update)

// delete
routes.delete('/products/:id', ProductController.destroy)

// export
module.exports = routes
```

---

### Adicionando a Páginação da lista dos produtos

- Instalar a dependência `mongoose-paginate`

```jsx
// terminal

npm install mongoose-paginate
```

- Vamos no arquivo `models` / `Product.js`

```jsx
// Product.js

const mongoose = require('mongoose')

// Iniciamos o mongoose-paginate
const mongoosePaginate = require('mongoose-paginate')

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Configuramos o paginate
ProductSchema.plugin(mongoosePaginate)

mongoose.model('Product', ProductSchema)
```

- Abrimos o arquivo `ProductController.js`

```jsx
// ProductController.js

// Na função index fazemos a seguinte config

async index(req, res) {
  const { page = 1 } = req.query
  const products = await Product.paginate({//filtro?}, { 
    page,
    limit: 10
  })
  return res.json(products)
},
```

---

### Adicionando CORS

- Instalando o `cors`:

```jsx
// terminal

npm install cors
```

- Vamos no arquivo `server.js`

```jsx
// server.js

// importando
const cors = require('cors')

// iniciando e habilitando o cors
app.use(cors())
```

---

### Como ficou o final de todos os arquivos?

- Pastas:

![Imagem](https://github.com/tr3visan/node-api/blob/master/img/Captura_de_Tela_2020-05-23_as_15.01.44.png)

- Arquivo `package.json`

```jsx
// package.json

{
  "name": "node-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "mongoose": "^5.9.15",
    "mongoose-paginate": "^5.0.3",
    "require-dir": "^1.2.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.4"
  }
}
```

- Arquivo `server.js`

```jsx
// server.js

// imports
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const requireDir = require('require-dir')

// iniciando o app
const app = express()

// permitindo envio de dados json na aplicação
app.use(express.json())

// habilitando o cors
app.use(cors())

// Iniciando o DB
mongoose.connect('mongodb://localhost:27017/nodeapi', { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
requireDir('./src/models')

// Setando a rota api como padrão
app.use('/api', require('./src/routes'))

// localhost:3001
app.listen(3001)
```

- Arquivo `src` / `controllers` / `ProductController`.js

```jsx
// ProductController.js

const mongoose = require('mongoose')

const Product = mongoose.model('Product')

module.exports = {

  async index(req, res) {
    const { page = 1 } = req.query
    const products = await Product.paginate({}, { 
      page,
      limit: 10
    })
    return res.json(products)
  },

  async show(req, res){
    const product = await Product.findById(req.params.id)
    return res.json(product)
  },

  async store(req, res) {
    const product = await Product.create(req.body)
    return res.json(product)
  },

  async update(req, res){
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.json(product)
  },

  async destroy(req, res){
    await Product.findByIdAndRemove(req.params.id)
    return res.send()
  }
}
```

- Arquivo `src` /  `models` / `Product.js`

```jsx
// Product.js

const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ProductSchema.plugin(mongoosePaginate)

mongoose.model('Product', ProductSchema)
```

- Arquivo `src` / `routes.js`

```jsx
// routes.js

const express = require('express')
const routes = express.Router()

const ProductController = require('./controllers/ProductController')

// get produto
routes.get('/products', ProductController.index)
routes.get('/products/:id', ProductController.show)

// criando produto
routes.post('/products', ProductController.store)

// update
routes.put('/products/:id', ProductController.update)

// delete
routes.delete('/products/:id', ProductController.destroy)

// export
module.exports = routes
```

---

### Repositório no [Github](https://github.com/tr3visan/node-api)