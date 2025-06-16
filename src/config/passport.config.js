// Core de passport y sus dependencias
import passport from "passport";
import JWTStrategy from "passport-jwt";
import passportLocal from "passport-local";

import { createHash, isValidPassword, PRIVATE_KEY } from "../utils.js";

// Modelos de usuario y carrito
import { userModel } from "../models/user.model.js";
import { cartModel } from "../models/cart.model.js";

// Estrategias de passport
const localStrategy = passportLocal.Strategy
const jwtStrategy = JWTStrategy.Strategy
const extractJWT = JWTStrategy.ExtractJwt

const initializePassport = () => {
    // ========================================
    //              REGISTER
    // ========================================

    passport.use('register', new localStrategy(
        {
            passReqToCallback: true, 
            usernameField: 'email'        
        },
        async (req, username, password, done) => {
            const { first_name, last_name, email, cart, age, role } = req.body

            try {
                // Verificando la contraseña
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
                if (!regex.test(password)) {
                    return done(null, false, { message: 'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número' })
                }

                // Verificando que los campos requeridos esten completos
                if (!first_name || !last_name || !age) {
                    return done(null, false, { message: 'Todos los campos son obligatorios' })
                }

                const userExist = await userModel.findOne({email})
                if(userExist){
                    res.json({msg: "El usuario ya existe "})
                    return done(null, false)                    
                }

                const newCart = await cartModel.create({ products: [] })

                // En caso que no exista
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: [newCart._id], 
                    role: role || 'user'
                }

                const result = await userModel.create(newUser)
                return done(null, result)
            } catch (error) {
                return done("Error al registrar un usuario " + error)
            }
        }
    ))

    // ========================================
    //               LOGIN
    // ========================================

    passport.use('login', new jwtStrategy(
        {
            jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        },
        async (jwt_payload, done) => {
            try {
                console.log("JWT obtenido " + jwt_payload);
                return done(null, jwt_payload.user)                
            } catch (error) {
                return done(error)
            }
        }
    ))

    // ========================================
    //               CURRENT
    // ========================================
    
    passport.use('current', new jwtStrategy(
        {
            jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        },
        async (jwt_payload, done) => {
        try {
            if (!jwt_payload.user) {
                return done(null, false, { message: 'No se encontró usuario en el token' })
            }
            return done(null, jwt_payload.user)
        } catch (error) {
            return done(error)
        }
    }
    ))

    passport.serializeUser((user, done) => {
        done(null, user,_id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id)
            done(null, user)
        } catch (error) {
            done( "Error deserializando el usuario"+ error)
        }
    })
}

/* =====================================
=           COOKIE EXTRACTOR          =
===================================== */

const cookieExtractor = req => {
    let token = null

    if(req && req.cookies){

        token = req.cookies['jwtCookieToken']
        
        console.log('Token obtenido ' + token);        
    }

    return token
}

export default initializePassport