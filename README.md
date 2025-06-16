# Entrega Final Backend II - Melisa Rivas

## Descripción

Este proyecto es una API y aplicación web para la gestión de usuarios, productos, carritos de compras y tickets de compra, con autenticación, autorización, recuperación de contraseña y envío de facturas por correo electrónico.
Para dicho proyecto, se esta utilizando una arquitectura de capas (persistencia, negocio, renderizado, routing y servicio). Asi como el uso del patron de diseño Repository 

---

## Estructura del Proyecto

```
src/
│
├── app.js                  # Archivo principal de la aplicación
├── utils.js                # Utilidades generales (hash, JWT, middlewares)
├── config/
│   ├── .env.default
│   ├── .env.development
│   ├── .env.production
│   ├── config.js
│   └── passport.config.js
├── controllers/
│   ├── cart.controller.js
│   ├── product.controller.js
│   ├── session.controller.js
│   └── user.controller.js
├── dao/
│   └── mongo/
├── dto/
│   ├── cart.dto.js
│   ├── product.dto.js
│   └── user.dto.js
├── models/
│   ├── cart.model.js
│   ├── product.model.js
│   ├── ticket.model.js
│   └── user.model.js
├── public/
│   └── js/
├── repository/
│   ├── cart.repository.js
│   ├── product.repository.js
│   └── user.repository.js
├── routers/
│   ├── cart.router.js
│   ├── product.router.js
│   ├── product.views.router.js
│   ├── session.router.js
│   ├── user.router.js
│   └── user.views.routes.js
├── services/
│   ├── cart.service.js
│   ├── product.service.js
│   ├── ticket.service.js
│   └── user.service.js
└── views/
    ├── carts.handlebars
    ├── layouts/
    ├── login.handlebars
    ├── profile.handlebars
    ├── realTimeProducts.handlebars
    ├── register.handlebars
    ├── resetPassword.handlebars
    └── shop.handlebars
```

---

## Instalación

1. Clona el repositorio.
2. Instala dependencias:
   ```
   npm install
   ```
3. Configura tu archivo `.env.development` con los datos de MongoDB y Gmail.
4. Inicia el servidor:
   ```
   npm run dev
   ```
   o
   ```
   nodemon src/app.js
   ```

---

## Rutas Principales

### **Vistas (Frontend)**

- `/users/login` - Login de usuario
- `/users/register` - Registro de usuario
- `/users/shop` - Tienda de productos (principal)
- `/users` - Perfil de usuario
- `/users/admin` - Panel de administrador, en donde se ven todas las carts de los usuarios, ademas de llevar al apartado de modificacion de productos
- `/realtimeproducts` - Gestión de productos en tiempo real
- `/carts/:cid` - Vista del carrito de compras

### **API REST**

#### **Usuarios**
- `GET /api/users/` - Obtener todos los usuarios
- `GET /api/users/:uid` - Obtener usuario por ID
- `POST /api/users/` - Crear usuario
- `PUT /api/users/:uid` - Actualizar usuario
- `DELETE /api/users/:uid` - Eliminar usuario

#### **Sesiones y autenticación**
- `POST /api/sessions/register` - Registrar usuario
- `POST /api/sessions/login` - Iniciar sesión
- `GET /api/sessions/current` - Obtener usuario autenticado
- `POST /api/sessions/reset-password-request` - Solicitar recuperación de contraseña
- `GET /api/sessions/reset-password/:token` - Formulario de nueva contraseña
- `POST /api/sessions/reset-password` - Restablecer contraseña

#### **Productos**
- `GET /api/products/` - Listar productos (paginación)
- `GET /api/products/:pid` - Obtener producto por ID
- `POST /api/products/` - Crear producto
- `PUT /api/products/:pid` - Actualizar producto
- `DELETE /api/products/:pid` - Eliminar producto

#### **Carritos**
- `GET /api/carts/` - Listar carritos
- `GET /api/carts/:cid` - Obtener carrito por ID
- `POST /api/carts/` - Crear carrito
- `DELETE /api/carts/:cid/products/:pid` - Eliminar producto del carrito
- `PUT /api/carts/:cid` - Actualizar productos del carrito
- `PUT /api/carts/:cid/products/:pid` - Actualizar cantidad de producto
- `DELETE /api/carts/:cid` - Vaciar carrito
- `POST /api/carts/user/add/:pid` - Agregar producto al carrito del usuario autenticado
- `POST /api/carts/:cid/purchase` - Finalizar compra y generar ticket

---

## Funcionalidades Clave

- **Autenticación y autorización** con JWT y Passport.
- **Gestión de usuarios** (registro, login, perfil, roles).
- **Gestión de productos** (CRUD, paginación, tiempo real con Socket.io).
- **Carrito de compras** por usuario autenticado.
- **Compra y generación de ticket** con código único y envío de factura por email.
- **Recuperación de contraseña** por correo electrónico.
- **Protección de rutas** según roles (`user`, `admin`).
- **Frontend con Handlebars** y scripts separados para cada vista.

---

## Notas Técnicas

- **Stock:** El stock solo se descuenta al finalizar la compra, no al agregar al carrito.
- **Tickets:** Solo se generan para productos con stock suficiente.
- **Correo:** Se usa Nodemailer con Gmail para enviar facturas y recuperación de contraseña.
- **DTOs y Repositorios:** Separación de lógica de acceso a datos y presentación.

---

## Scripts Frontend

- `/public/js/shop.js` - Lógica para agregar productos al carrito desde la tienda.
- `/public/js/cart.js` - Lógica para eliminar productos del carrito y finalizar compra.
- `/public/js/login.js`, `/public/js/register.js` - Formularios de login y registro.
- `/public/js/resetPassword.js`, `/public/js/resetPasswordForm.js` - Recuperación de contraseña.
- `/public/js/realTimeProducts.js` - Gestión en tiempo real de productos (admin).

---

## Consideraciones de Seguridad

- Las rutas sensibles requieren autenticación y autorización.
- Las contraseñas se almacenan hasheadas.
- Los tokens JWT tienen expiración configurable.

---

## Contacto

Proyecto realizado por **Melisa Rivas** para Backend II.

---
