import express from 'express'
import * as productController from '../controllers/product.controller.js'

const router = express.Router()

// GET - trae los productos por paginacion y muetra un json segun las indicaciones.
router.get('/', productController.getProducts);

// GET /:pid - Obtener un producto por ID
router.get('/:pid', productController.getProductById);

// POST - Agregar un nuevo producto
router.post('/', productController.createProduct);

// PUT /:pid - Actualizar un producto por ID
router.put('/:pid', productController.updateProduct);

// DELETE /:pid - Eliminar un producto por ID
router.delete('/:pid', productController.deleteProduct);

export default router
