import * as cartService from '../services/cart.service.js'
import { cartModel } from '../models/cart.model.js';
import { productModel } from '../models/product.model.js';
import { userModel } from '../models/user.model.js';

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
        res.status(201).send({ status: 'success', payload: cart })
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

export const deleteProductFromCart = async (req, res) => {
    return cartService.deleteProductFromCart(req, res);
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

export const addProductToUserCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.pid;
        const quantity = parseInt(req.body.quantity, 10) || 1;

        // Buscar usuario
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Buscar producto
        const product = await productModel.findById(productId);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

        if (product.stock < quantity) {
            return res.status(400).json({ error: 'No hay suficiente stock disponible' });
        }

        let cartId = user.cart[0];
        let cart = await cartModel.findById(cartId);
        if (!cart) {

            const newCart = await cartModel.create({ products: [] });
            user.cart = [newCart._id];
            await user.save();
            cart = newCart;
        }

        const prodIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (prodIndex !== -1) {
            cart.products[prodIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        await cart.save();

        res.json({ status: 'success', message: 'Producto agregado al carrito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const purchaseCart = async (req, res) => {
    try {

        const cart = await cartModel.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const user = req.user; 
        const ticket = await cartService.purchaseCart(user, cart);

        res.json({ status: 'success', ticket });
    } catch (error) {
        console.error('Error en purchaseCart:', error);
        res.status(500).json({ error: error.message });
    }
};