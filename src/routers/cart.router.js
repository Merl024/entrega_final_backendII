import express from 'express'
import * as cartController from '../controllers/cart.controller.js'
import { passportCall, authorization } from '../utils.js'
import { addProductToCart } from '../services/cart.service.js'

const router = express.Router()

// GET - Obtener TODOS los carritos
router.get('/', cartController.getCarts)

// GET /:cid - Obtener un carrito por ID
router.get('/:cid', cartController.getCartById)

// POST - Publicar un carrito
router.post('/', cartController.createCart)

// POST /:cid/product/:pid - Publicar un producto (por id) dentro del id del carrito
// router.post('/:cid/product/:pid', cartController.addProductToCart)

// // DELETE api/carts/:cid/products/:pid - elimina el producto seleccionado del carrito
router.delete('/:cid/products/:pid', cartController.deleteProductFromCart)

// PUT api/carts/:cid  - Actualiza el carrito YA CREADO. Pues se puede actualizar agregando mas productos
router.put('/:cid', cartController.updateCartProducts)

// PUT api/carts/:cid/products/:pid - Actualizar la cantidad de un producto ya creado
router.put('/:cid/products/:pid', cartController.updateProductQuantity)

// DELETE api/carts/:cid - elemina TODOS los productos del carrito
router.delete('/:cid', cartController.clearCart)

// Ruta para que el usuario autenticado agregue productos a su carrito
router.post('/user/add/:pid',
    passportCall('current'),
    authorization('user'),
    cartController.addProductToUserCart 
)

export default router