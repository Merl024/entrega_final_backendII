import * as userRepository from '../repository/user.repository.js'
import UserDTO from '../dto/user.dto.js'

export const getUsers = async () => {
    const users = await userRepository.findAll()
    return users.map(u => new UserDTO(u))
}

export const getUserById = async (id) => {
    const user = await userRepository.findById(id)
    return user ? new UserDTO(user) : null
}

export const getUserByEmail = async (email) => {
    const user = await userRepository.findByEmail(email)
    return user ? new UserDTO(user) : null
}

export const createUser = async (data) => {
    const newUser = await userRepository.create(data)
    return new UserDTO(newUser)
}

export const updateUser = async (id, data) => {
    const updatedUser = await userRepository.update(id, data)
    return updatedUser ? new UserDTO(updatedUser) : null
}

export const deleteUser = async (id) => {
    return await userRepository.deleteUser(id)
}