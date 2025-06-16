import express from 'express'
import * as userController from '../controllers/user.controller.js'

const router = express.Router()

// GET /api/users/ - Obtener todos los usuarios
router.get('/', userController.getUsers)

// GET /api/users/:uid - Obtener un usuario por ID
router.get('/:uid', userController.getUserById)

// POST /api/users/ - Crear un nuevo usuario
router.post('/', userController.createUser)

// PUT /api/users/:uid - Actualizar un usuario por ID
router.put('/:uid', userController.updateUser)

// DELETE /api/users/:uid - Eliminar un usuario por ID
router.delete('/:uid', userController.deleteUser)

export default router