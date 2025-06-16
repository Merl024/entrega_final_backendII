import mongoose from 'mongoose';

// Colección de tickets
const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }, // email del usuario
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
            quantity: Number
        }
    ]
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);