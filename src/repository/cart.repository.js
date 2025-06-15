import CartDao from '../dao/mongo/cart.dao.js'

const cartDao = new CartDao()

export const findAll = () => cartDao.findAll()
export const findById = (id) => cartDao.findById(id)
export const create = (data) => cartDao.create(data)
export const save = (cart) => cartDao.save(cart)
export const findByIdAndUpdate = (id, update, options) => cartDao.findByIdAndUpdate(id, update, options)
export const findOneAndUpdate = (filter, update, options) => cartDao.findOneAndUpdate(filter, update, options)