import express from 'express'
import * as userController from '../controllers/user.controller.js'

const router = express.Router()

router.get('/', userController.getUsers)
router.get('/:uid', userController.getUserById)
router.post('/', userController.createUser)
router.put('/:uid', userController.updateUser)
router.delete('/:uid', userController.deleteUser)

export default router