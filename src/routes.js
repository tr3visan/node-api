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