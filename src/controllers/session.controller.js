import crypto from 'crypto'
import nodemailer from 'nodemailer'
import config from '../config/config.js'
import { userModel } from '../models/user.model.js'
import { generateToken, createHash, isValidPassword } from '../utils.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPsw
    }
})

export const register = async (req, res) => {
    if (!req.user) {
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
            first_name: user.first_name,
            last_name: user.last_name,
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

export const resetPasswordRequest = async (req, res) => {
    const { email } = req.body
    const user = await userModel.findOne({ email })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    const token = crypto.randomBytes(32).toString('hex')
    const expires = Date.now() + 3600000 // 1 hora

    user.resetToken = token
    user.resetTokenExpires = expires
    await user.save()

    const resetUrl = `${req.protocol}://${req.get('host')}/api/sessions/reset-password/${token}`
    await transporter.sendMail({
        from: config.gmailAccount,
        to: email,
        subject: 'Recuperación de contraseña',
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
               <a href="${resetUrl}">Restablecer contraseña</a>
               <p>Este enlace expirará en 1 hora.</p>`
    })
    res.json({ status: 'success', msg: 'Correo de recuperación enviado' })
}

export const renderResetPassword = async (req, res) => {
    const { token } = req.params
    const user = await userModel.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } })
    if (!user) return res.send('Enlace inválido o expirado')
    res.render('resetPassword', { token })
}

export const resetPassword = async (req, res) => {
    const { token, password } = req.body
    const user = await userModel.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } })
    if (!user) return res.status(400).json({ error: 'Enlace inválido o expirado' })

    if (isValidPassword(user, password)) {
        return res.status(400).json({ error: 'No puedes usar la misma contraseña anterior' })
    }

    user.password = createHash(password)
    user.resetToken = undefined
    user.resetTokenExpires = undefined
    await user.save()
    res.json({ status: 'success', msg: 'Contraseña restablecida correctamente' })
}

