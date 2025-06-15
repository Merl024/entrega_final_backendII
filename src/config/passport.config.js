// Core de passport y sus dependencias
import passport from "passport";
import JWTStrategy from "passport-jwt";
import passportLocal from "passport-local";

import { createHash, isValidPassword, PRIVATE_KEY } from "../utils.js";
import { userModel } from "../models/user.model.js";

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
                // Verificando que el email no este ya registrado en la base de datos
                const userExist = await userModel.findOne({email})
                if(userExist){
                    res.json({msg: "El usuario ya existe "})
                    return done(null, false)                    
                }

                // En caso que no exista
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: cart || [],
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
        console.log('Cookies ' + req.cookies);

        token = req.cookies['jwtCookieToken']
        
        console.log('Token obtenido ' + token);        
    }

    return token
}

export default initializePassport