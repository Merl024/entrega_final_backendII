import mongoose from "mongoose";

// Colección de carritos
const cartCollection = 'carts'

// Esquema de item del carrito (contiene el producto y la cantidad)
const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'productos', 
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 
    }
});

// Esquema de carrito
const cartSchema = new mongoose.Schema({
    products: {
        type: [cartItemSchema], 
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
}, { 
    // Ocultar la version
    toJSON: {
        transform: (doc, ret) => {
            delete ret.__v; 
            return ret;
        }
    },
    toObject: {
        transform: (doc, ret) => {
            delete ret.__v; 
            return ret;
        }
    }
});

cartSchema.pre('findOne', function (next) {
    this.populate('products.product');
    next();
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
