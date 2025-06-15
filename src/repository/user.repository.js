import UserDao from '../dao/mongo/user.dao.js'

const userDao = new UserDao()

export const findAll = () => userDao.findAll()
export const findById = (id) => userDao.findById(id)
export const findByEmail = (email) => userDao.findByEmail(email)
export const create = (data) => userDao.create(data)
export const update = (id, data) => userDao.update(id, data)
export const deleteUser = (id) => userDao.delete(id)