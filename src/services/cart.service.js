import * as cartRepository from '../repository/cart.repository.js'
import { productModel } from '../models/product.model.js'
import CartDTO from '../dto/cart.dto.js'
import { generateTicket } from './ticket.service.js';

export const getCarts = async (req, res) => {
    try {
        const carts = await cartRepository.findAll()
        res.json(carts.map(c => new CartDTO(c)))
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getCartById = async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartRepository.findById(cid)
        if (!cart) return res.status(404).json({ error: 'Carrito no existente' })
        res.json({ status: 'success', payload: new CartDTO(cart) })
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el carrito' })
    }
}

export const createCart = async (req, res) => {
    try {
        const newCart = await cartRepository.create(req.body)
        res.status(201).json(new CartDTO(newCart))
    } catch (error) {
        res.status(500).json({ error: 'Error al publicar el carrito' })
    }
}

export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params
        const cart = await cartRepository.findById(cid)
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })
        const product = await productModel.findById(pid)
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' })
        const productIndex = cart.products.findIndex(p => p.product._id.toString() === pid)
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1
        } else {
            cart.products.push({ product: pid, quantity: 1 })
        }
        const updatedCart = await cartRepository.save(cart)
        res.json({
            status: 'success',
            message: `Producto con ID ${pid} agregado/actualizado en el carrito ${cid}`,
            payload: new CartDTO(updatedCart)
        })
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto en el carrito' })
    }
}

export const deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params
        const cart = await cartRepository.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        )
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })
        res.json({
            status: 'success',
            message: `Producto con ID ${pid} eliminado del carrito ${cid}`,
            cart: new CartDTO(cart)
        })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto del carrito' })
    }
}

export const updateCartProducts = async (req, res) => {
    try {
        const { cid } = req.params
        const { products } = req.body
        if (!Array.isArray(products)) {
            return res.status(400).json({ error: 'El cuerpo debe contener un arreglo de productos.' })
        }
        const cart = await cartRepository.findById(cid)
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado.' })
        for (const item of products) {
            const productExists = await productModel.findById(item.product)
            if (!productExists) {
                return res.status(404).json({
                    error: `El producto con ID ${item.product} no existe.`,
                })
            }
        }
        cart.products = products
        const updatedCart = await cartRepository.save(cart)
        res.json({
            status: 'success',
            message: 'El carrito ha sido actualizado con los nuevos productos.',
            payload: new CartDTO(updatedCart),
        })
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito.' })
    }
}

export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body
        if (!quantity || typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({
                error: 'La cantidad debe ser un número mayor o igual a 1.',
            })
        }
        const updatedCart = await cartRepository.findOneAndUpdate(
            { _id: cid, 'products.product': pid },
            { $set: { 'products.$.quantity': quantity } },
            { new: true, runValidators: true }
        )
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado.' })
        }
        res.json({
            status: 'success',
            message: 'Cantidad actualizada correctamente.',
            payload: new CartDTO(updatedCart),
        })
    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar la cantidad del producto.',
        })
    }
}

export const clearCart = async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartRepository.findById(cid)
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })
        cart.products = []
        const updatedCart = await cartRepository.save(cart)
        res.json({
            status: 'success',
            message: 'Todos los productos han sido eliminados del carrito.',
            payload: new CartDTO(updatedCart),
        })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar los productos del carrito' })
    }
}

export const purchaseCart = async (user, cart) => {
    let total = 0;
    const purchasedProducts = [];

    // Filtra productos nulos o eliminados
    cart.products = cart.products.filter(item => item.product && item.product !== null);

    for (const item of cart.products) {
        const product = item.product; 
        if (product && product.stock >= item.quantity) {
            total += product.price * item.quantity;
            purchasedProducts.push({
                product,
                quantity: item.quantity
            });
            product.stock -= item.quantity;
            await product.save();
        }
    }

    // Genera ticket y envía factura
    const ticket = await generateTicket({
        user,
        products: purchasedProducts,
        amount: total
    });

    // Limpiamos el carrito
    cart.products = [];
    await cart.save();

    return ticket;
};