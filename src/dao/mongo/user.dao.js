import { userModel } from '../../models/user.model.js'

export default class UserDao {
    async findAll() {
        return userModel.find()
    }
    async findById(id) {
        return userModel.findById(id)
    }
    async findByEmail(email) {
        return userModel.findOne({ email })
    }
    async create(data) {
        return userModel.create(data)
    }
    async update(id, data) {
        return userModel.findByIdAndUpdate(id, data, { new: true })
    }
    async delete(id) {
        return userModel.findByIdAndDelete(id)
    }
}