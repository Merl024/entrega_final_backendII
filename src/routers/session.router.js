import { Router } from 'express'
import passport from 'passport'
import * as sessionController from '../controllers/session.controller.js'

const router = Router()

// POST /api/sessions/register - Registrar un nuevo usuario
router.post('/register', 
    passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register', session: false }),
    sessionController.register
)

// POST /api/sessions/login - Iniciar sesión
router.post('/login', 
    sessionController.login
)

// GET /api/sessions/current - Obtener el usuario autenticado actual
router.get('/current', 
    passport.authenticate('current', { session: false, failureRedirect: '/api/sessions/fail-auth' }),
    sessionController.current
)

// PUT /api/sessions/:uid - Actualizar usuario por ID
router.put('/:uid', 
    passport.authenticate('current', { session: false }),
    sessionController.updateUser
)

// DELETE /api/sessions/:uid - Eliminar usuario por ID
router.delete('/:uid', 
    sessionController.deleteUser
)

// GET /api/sessions/fail-register - Falla en registro
router.get('/fail-register', 
    sessionController.failRegister
)

// GET /api/sessions/fail-login - Falla en login
router.get('/fail-login', 
    sessionController.failLogin
)

// GET /api/sessions/fail-auth - Falla en autenticación
router.get('/fail-auth', 
    sessionController.failAuth
)

// RUTAS PARA RECUPERACIÓN DE CONTRASEÑA
// PUT /api/sessions/:uid - Actualizar usuario por ID
router.post('/reset-password-request', sessionController.resetPasswordRequest)

// GET /api/sessions/reset-password/:token - Renderizar formulario de nueva contraseña
router.get('/reset-password/:token', sessionController.renderResetPassword)

// POST /api/sessions/reset-password - Restablecer contraseña
router.post('/reset-password', sessionController.resetPassword)

export default router