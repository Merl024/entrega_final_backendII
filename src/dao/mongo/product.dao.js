import { productModel } from '../../models/product.model.js'

export default class ProductDao {
    async findAll(skip, limit) {
        return productModel.find().skip(skip).limit(limit)
    }
    async countDocuments() {
        return productModel.countDocuments()
    }
    async findById(id) {
        return productModel.findById(id).lean()
    }
    async create(data) {
        return productModel.create(data)
    }
    async update(id, data) {
        return productModel.findByIdAndUpdate(id, data, { new: true })
    }
    async delete(id) {
        return productModel.findByIdAndDelete(id)
    }
}