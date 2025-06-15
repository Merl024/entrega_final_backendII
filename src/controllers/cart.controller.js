import * as cartService from '../services/cart.service.js'

export const getCarts = async (req, res) => {
    try {
        const carts = await cartService.getCarts()
        res.json(carts)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getCartById = async (req, res) => {
    try {
        const cart = await cartService.getCartById(req.params.cid)
        if (!cart) return res.status(404).json({ error: 'Carrito no existente' })
        res.json({ status: 'success', payload: cart })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const createCart = async (req, res) => {
    try {
        const newCart = await cartService.createCart(req.body)
        res.status(201).json(newCart)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const addProductToCart = async (req, res) => {
    try {
        const updatedCart = await cartService.addProductToCart(req.params.cid, req.params.pid)
        res.json({
            status: 'success',
            message: `Producto con ID ${req.params.pid} agregado/actualizado en el carrito ${req.params.cid}`,
            payload: updatedCart
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const deleteProductFromCart = async (req, res) => {
    try {
        const cart = await cartService.deleteProductFromCart(req.params.cid, req.params.pid)
        res.json({
            status: 'success',
            message: `Producto con ID ${req.params.pid} eliminado del carrito ${req.params.cid}`,
            cart
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const updateCartProducts = async (req, res) => {
    try {
        const updatedCart = await cartService.updateCartProducts(req.params.cid, req.body.products)
        res.json({
            status: 'success',
            message: 'El carrito ha sido actualizado con los nuevos productos.',
            payload: updatedCart,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const updateProductQuantity = async (req, res) => {
    try {
        const updatedCart = await cartService.updateProductQuantity(
            req.params.cid,
            req.params.pid,
            req.body.quantity
        )
        res.json({
            status: 'success',
            message: 'Cantidad actualizada correctamente.',
            payload: updatedCart,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const clearCart = async (req, res) => {
    try {
        const updatedCart = await cartService.clearCart(req.params.cid)
        res.json({
            status: 'success',
            message: 'Todos los productos han sido eliminados del carrito.',
            payload: updatedCart,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}