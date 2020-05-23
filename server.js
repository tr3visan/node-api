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