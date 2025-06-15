import { Router } from 'express'
import passport from 'passport'

// Modelo
import { userModel } from '../models/user.model.js'

// Utils
import { generateToken, isValidPassword, createHash } from '../utils.js'



const router = Router()

// ========================================
//              REGISTER
// ========================================

router.post('/register', 
    passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register', session: false }),
    async (req, res) => {
        res.send({ status: "Succes", msg: "Usuario creado con exito" })
    }
)

// ========================================
//               LOGIN
// ========================================

router.post('/login', async (req, res) =>{
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email: email })

        console.log("Usuario encontrado " + user);

        /* Hacemos las validaciones necesarias para saber si existe el usuario y le mandamos una respuesta
        en caso que la contraseña no coincida con el usuario (email) */
        if(!user){
            console.warn(`El usuario con el correo ${email} no existe`)
            return res.status(204).send({ error: "Not Found", msg: `El usuario con el correo ${email} no fue encontrado`})
        }
        
        if(!isValidPassword(user, password)){
            console.warn(`Credenciales incorrectas para el usuario de correo ${email}`)
            return res.status(401).send({ status: "Error", msg: "La contraseña o el usuario no coinciden" })
        }

        /* Una vez que se hicieron las validaciones necesarias manejando los errores.
        Definimos en una variable que elementos quiero dentro del token y lo guardamos en la cookie */
        const tokenUser = {
            _id: user._id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            cart: user.cart,
            role: user.role
        }

        const access_token = generateToken(tokenUser)

        res.cookie('jwtCookieToken', access_token, {
            maxAge: 120000,
            httpOnly: true
        })

        res.send({ 
            status: "Success", 
            msg: `El token ha sido generado con exito: ${access_token}`,
            role: user.role 
        })

    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})


// ========================================
//                 CURRENT
// ========================================

router.get('/current', 
    passport.authenticate('current', { session: false, failureRedirect: '/api/sessions/fail-auth' }),
    async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).send({ status: "error", message: "Usuario no autenticado" })
            }

            res.send({
                status: "success",
                payload: {
                    name: req.user.name,
                    email: req.user.email,
                    age: req.user.age,
                    role: req.user.role,
                    carts: req.user.carts
                }
            })
        } catch (error) {
            res.status(500).json({ 
                status: "error", 
                message: `Error al obtener el usuario actual: ${error.message}` 
            });
        }
    }
)

// OTROS ENDPOINTS DEL CRUD

// UPDATE
router.put('/:uid', 
    passport.authenticate('current', { session: false }),
    async (req, res) => {
        try {
            const { uid } = req.params;
            
            if (req.user._id !== uid) {
                return res.status(403).send({ 
                    status: 'error', 
                    message: 'No tienes permiso para modificar este usuario' 
                });
            }

            // Agarramos solo los campos que se quieran editar
            const { password, role, ...updatableFields } = req.body;
            
            if (req.user.role === 'admin' && role) {
                updatableFields.role = role;
            }
            
            // Si se proporciona una nueva contraseña, hashearla
            if (password) {
                updatableFields.password = createHash(password);
            }

            const updatedUser = await userModel.findByIdAndUpdate(
                uid, 
                updatableFields, 
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).send({ 
                    status: 'error', 
                    message: 'Usuario no encontrado' 
                });
            }

            res.send({ 
                status: 'success', 
                message: 'Usuario actualizado correctamente',
                user: {
                    name: `${updatedUser.first_name} ${updatedUser.last_name}`,
                    email: updatedUser.email,
                    age: updatedUser.age,
                    cart: updatedUser.cart,
                    role: updatedUser.role
                }
            });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).send({ 
                status: 'error', 
                message: 'No se pudo actualizar el usuario',
                details: error.message 
            });
        }
    }
);

// DELETE 
router.delete('/:uid', async(req, res) => {
    try {
        const deleteUser = await userModel.findByIdAndDelete(req.params.uid)
        if(!deleteUser){
            return res.status(404).send({ error: "Usuario no encontrado" })
        }

        res.send({ msg: "Usuario eliminado con exito" })
    } catch (error) {
        res.status(500).send({ error: "Error al eliminar al usuario" })
    }
})

/* ENDOPOINTS EN CASO QUE FALLE EL LOGIN, REGISTER O CURRENT*/

router.get('/fail-register', (req, res) => {
    res.status(401).send({ msg: 'Error al registrase' })
})

router.get('/fail-login', (req, res) => {
    res.status(401).send({ msg: 'Error al loguearse' })
})

router.get('/fail-auth', (req, res) => {
    res.status(401).json({ status: "error", message: "Error de autenticación: usuario no autenticado o token inválido" });
})

export default router