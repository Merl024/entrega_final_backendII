import { Router } from "express";
import { authorization, passportCall } from "../utils.js";
import { userModel } from "../models/user.model.js";
import { productModel } from "../models/product.model.js";

const router = Router()

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

// Ruta para usuarios normales: solo ven sus datos y productos de su(s) carrito(s)
router.get('/',
    passportCall('current'),
    authorization('user'),
    async (req, res) => {
        // Poblar los carritos y productos del usuario actual
        const user = await userModel.findById(req.user._id).populate({
            path: 'cart',
            populate: {
                path: 'products.product',
                model: 'productos'
            }
        }).lean();

        // Extraer todos los productos de todos los carritos del usuario
        let allProducts = [];
        if (user.cart && user.cart.length > 0) {
            user.cart.forEach(cart => {
                if (cart.products) {
                    allProducts = allProducts.concat(cart.products);
                }
            });
        }

        res.render('profile', {
            user,
            allProducts,
            isAdmin: false
        });
    }
)

// Ruta para admins: ven todos los productos de todos los carritos
router.get('/admin',
    passportCall('current'),
    authorization('admin'),
    async (req, res) => {
        // Buscar todos los usuarios y poblar sus carritos y productos
        const users = await userModel.find().populate({
            path: 'cart',
            populate: {
                path: 'products.product',
                model: 'productos'
            }
        }).lean();

        // Extraer todos los productos de todos los carritos de todos los usuarios
        let allProducts = [];
        users.forEach(user => {
            if (user.cart && user.cart.length > 0) {
                user.cart.forEach(cart => {
                    if (cart.products) {
                        allProducts = allProducts.concat(cart.products);
                    }
                });
            }
        });

        res.render('profile', {
            user: req.user,
            allProducts,
            isAdmin: true
        });
    }
)

router.get('/shop',
    passportCall('current'),
    authorization('user'),
    async (req, res) => {
        const products = await productModel.find().lean();
        res.render('shop', { products, user: req.user });
    }
);

export default router