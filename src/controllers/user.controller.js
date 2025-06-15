import * as userService from '../services/user.service.js'

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers()
        res.json(users)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.uid)
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const createUser = async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body)
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const updateUser = async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.params.uid, req.body)
        if (!updatedUser) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json(updatedUser)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const deleted = await userService.deleteUser(req.params.uid)
        if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json({ message: 'Usuario eliminado exitosamente' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}