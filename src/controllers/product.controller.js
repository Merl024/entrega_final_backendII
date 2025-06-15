import * as productService from '../services/product.service.js'

export const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query
        const { products, totalPages, pageNumber, limitNumber } = await productService.getProducts(page, limit)
        const baseUrl = req.baseUrl + req.path
        const prevLink = pageNumber > 1 ? `${baseUrl}?page=${pageNumber - 1}&limit=${limitNumber}` : null
        const nextLink = pageNumber < totalPages ? `${baseUrl}?page=${pageNumber + 1}&limit=${limitNumber}` : null

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
            page: pageNumber,
            hasPrevPage: pageNumber > 1,
            hasNextPage: pageNumber < totalPages,
            prevLink,
            nextLink
        })
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.pid)
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' })
    }
}

export const createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body)
        res.status(201).json({ message: 'Producto agregado exitosamente', newProduct })
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.pid, req.body)
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json({ message: 'Producto actualizado exitosamente', updatedProduct })
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await productService.deleteProduct(req.params.pid)
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json({ message: 'Producto eliminado exitosamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' })
    }
}