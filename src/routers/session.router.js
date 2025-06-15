import { Router } from 'express'
import passport from 'passport'
import * as sessionController from '../controllers/session.controller.js'

const router = Router()

router.post('/register', 
    passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register', session: false }),
    sessionController.register
)

router.post('/login', 
    sessionController.login
)

router.get('/current', 
    passport.authenticate('current', { session: false, failureRedirect: '/api/sessions/fail-auth' }),
    sessionController.current
)

router.put('/:uid', 
    passport.authenticate('current', { session: false }),
    sessionController.updateUser
)

router.delete('/:uid', 
    sessionController.deleteUser
)

router.get('/fail-register', 
    sessionController.failRegister
)

router.get('/fail-login', 
    sessionController.failLogin
)

router.get('/fail-auth', 
    sessionController.failAuth
)

export default router