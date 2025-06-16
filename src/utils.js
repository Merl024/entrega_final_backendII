// Configuraciones
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Dependencias
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Metodo para encriptar contraseñas
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// Metodo para comparar contraseñas
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

// Llave secreta para firmar el token
export const PRIVATE_KEY = 'coderSecret'

// Funcion para generar el token
export const generateToken = user => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: 3600 })
}

// Middleware para autenticacion en las rutas
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info){
            if (error) return next(error) // Si hay un error paramos la ejecucion

            if(!user){
                return res.status(401).send({ status: 'error', error: info.messages ? info.messages : info.toString() })
            }

            req.user = user 
            next()         
        }) (req, res, next)
    }
}

export const authorization = role => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ status: 'error', error: 'Unauthorized' })

        if (req.user.role !== role) return res.status(403).send({ status: 'error', msg: 'El usuario no tiene permisos para este rol' })

        next()
    }
}

export default __dirname