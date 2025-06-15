import { cartModel } from '../../models/cart.model.js'

export default class CartDao {
    async findAll() {
        return cartModel.find()
    }
    async findById(id) {
        return cartModel.findById(id).populate('products.product')
    }
    async create(data) {
        return cartModel.create(data)
    }
    async save(cart) {
        return cart.save()
    }
    async findByIdAndUpdate(id, update, options) {
        return cartModel.findByIdAndUpdate(id, update, options)
    }
    async findOneAndUpdate(filter, update, options) {
        return cartModel.findOneAndUpdate(filter, update, options)
    }
}
