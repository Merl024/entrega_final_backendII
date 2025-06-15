// Importaciones base 
import express from 'express'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import cookieParser from 'cookie-parser'

// Utils
import __dirname from './utils.js'
import { Server } from 'socket.io'

// Routers
import viewsRouter from './routers/views.router.js'
import productRouter from './routers/product.router.js'
import cartRouter from './routers/cart.router.js'
import userViewsRouter from './routers/user.views.routes.js'
import sessionRouter from './routers/session.router.js'

// Models
import { productModel } from './models/product.model.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'


const app = express()
const SERVER_PORT = 8080

// Middleware para recibir objetos JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuraciones de handlebars
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// CONEXION A MONGO DB COMPASS
const MONGO_URL = 'mongodb://localhost:27017/entregable?retryWrites=true&w=majority'

// Cookie parser
app.use(cookieParser('SecretoCoder'))

// Middleware de passport
initializePassport()
app.use(passport.initialize())

// Rutas
app.use('/', viewsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/users', userViewsRouter )
app.use('/api/sessions', sessionRouter)

// Server listen 
const httpServer = app.listen(SERVER_PORT, () => {
    console.log(`Servidor corriendo en el puerto ${SERVER_PORT}`);    
})

// Conexion con la base de datos
const connecMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log('Conectado con la base de datos');
        
    } catch (error) {
        console.log('No se pudo conectar con la base de datos');
        process.exit()        
    }
}

// Iniciamos la conexion
connecMongoDB()


// Servidor WebSocket
const socketServer = new Server(httpServer)

socketServer.on('connection', async (socket) => {
    console.log("Usuario conectado");
    
    const products = await productModel.find().lean(); 
    socket.emit('products', products);
    
    // Escuchar nuevo producto
    socket.on('newProduct', async (product) => {
        try {
            await productModel.create(product); 
            const updatedProducts = await productModel.find().lean();
            socketServer.emit('products', updatedProducts);
        } catch (error) {
            socket.emit('error', { message: 'Error al agregar el producto' });
        }
    });
    
    // Eliminando el producto
    socket.on('deleteProduct', async (productId) => {
        try {
            const result = await productModel.findByIdAndDelete(productId); 
            if (result) {
                const updatedProducts = await productModel.find().lean();
                socketServer.emit('products', updatedProducts);
            } else {
                socket.emit('error', { message: 'Producto no encontrado' });
            }
        } catch (error) {
            socket.emit('error', { message: 'Error al eliminar el producto' });
        }
    });

    // Actualizando el producto
    socket.on('updateProduct', async (productId, updatedProduct) => {
        if (!productId || productId === 'undefined') {
            socket.emit('error', { message: 'ID del producto no válido' });
            return;
        }
        try {
            const product = await productModel.findByIdAndUpdate(productId, updatedProduct, { new: true });
            if (product) {
                const updatedProducts = await productModel.find().lean();
                socketServer.emit('products', updatedProducts);
            } else {
                socket.emit('error', { message: 'Producto no encontrado' });
            }
        } catch (error) {
            socket.emit('error', { message: 'Error al actualizar el producto' });
        }
    }); 
})

export { socketServer }