import ProductRepository from '../repository/product.repository.js'
import ProductDTO from '../dto/product.dto.js'

const productRepository = new ProductRepository()

export const getProducts = async (page, limit) => {
    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)
    const totalProducts = await productRepository.countProducts()
    const totalPages = Math.ceil(totalProducts / limitNumber)
    const skip = (pageNumber - 1) * limitNumber
    const products = await productRepository.getProducts(skip, limitNumber)
    const productsDTO = products.map(p => new ProductDTO(p))
    return { products: productsDTO, totalPages, pageNumber, limitNumber }
}

export const getProductById = async (id) => {
    const product = await productRepository.getProductById(id)
    return product ? new ProductDTO(product) : null
}

export const createProduct = async (data) => {
    const newProduct = await productRepository.createProduct(data)
    return new ProductDTO(newProduct)
}

export const updateProduct = async (id, data) => {
    const updatedProduct = await productRepository.updateProduct(id, data)
    return updatedProduct ? new ProductDTO(updatedProduct) : null
}

export const deleteProduct = async (id) => {
    return await productRepository.deleteProduct(id)
}