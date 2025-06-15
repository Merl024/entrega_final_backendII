import { userModel } from '../models/user.model.js'
import { generateToken, isValidPassword, createHash } from '../utils.js'

export const register = async (req, res) => {
    if (!req.user) {
        // Passport pone el mensaje de error en req.authInfo.message si usas failureFlash
        return res.status(400).json({ status: "Error", msg: "No se pudo registrar el usuario" })
    }
    res.status(201).json({ status: "Success", msg: "Usuario creado con éxito", user: req.user })
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email: email })

        if (!user) {
            return res.status(204).send({ error: "Not Found", msg: `El usuario con el correo ${email} no fue encontrado` })
        }
        if (!isValidPassword(user, password)) {
            return res.status(401).send({ status: "Error", msg: "La contraseña o el usuario no coinciden" })
        }

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
}

export const current = async (req, res) => {
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

export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;

        if (req.user._id !== uid) {
            return res.status(403).send({
                status: 'error',
                message: 'No tienes permiso para modificar este usuario'
            });
        }

        const { password, role, ...updatableFields } = req.body;

        if (req.user.role === 'admin' && role) {
            updatableFields.role = role;
        }

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
        res.status(500).send({
            status: 'error',
            message: 'No se pudo actualizar el usuario',
            details: error.message
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const deleteUser = await userModel.findByIdAndDelete(req.params.uid)
        if (!deleteUser) {
            return res.status(404).send({ error: "Usuario no encontrado" })
        }
        res.send({ msg: "Usuario eliminado con exito" })
    } catch (error) {
        res.status(500).send({ error: "Error al eliminar al usuario" })
    }
}

export const failRegister = (req, res) => {
    res.status(401).send({ msg: 'Error al registrase' })
}

export const failLogin = (req, res) => {
    res.status(401).send({ msg: 'Error al loguearse' })
}

export const failAuth = (req, res) => {
    res.status(401).json({ status: "error", message: "Error de autenticación: usuario no autenticado o token inválido" });
}