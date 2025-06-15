import ProductDao from '../dao/mongo/product.dao.js'

const productDao = new ProductDao()

export default class ProductRepository {
    getProducts = (skip, limit) => productDao.findAll(skip, limit)
    countProducts = () => productDao.countDocuments()
    getProductById = (id) => productDao.findById(id)
    createProduct = (data) => productDao.create(data)
    updateProduct = (id, data) => productDao.update(id, data)
    deleteProduct = (id) => productDao.delete(id)
}