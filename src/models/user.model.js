import mongoose from "mongoose"

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'El email no es válido']
    },
    age: {
        type: Number,
        required: true,
        min: [0, 'La edad no puede ser negativa'],
        max: [100, 'La edad no puede ser mayor a 120']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    cart: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'carts',
        default: []
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    }
})

export const userModel = mongoose.model(userCollection, userSchema)