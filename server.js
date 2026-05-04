const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Logging de solicitudes (solo para desarrollo)
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    next();
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});

// Ruta para Inicio
app.get('/inicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Inicio.html'));
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 - Página no encontrada</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-indigo-200 flex items-center justify-center h-screen">
            <div class="bg-white p-10 rounded-lg text-center">
                <h1 class="text-6xl font-bold text-indigo-600 mb-4">404</h1>
                <p class="text-xl text-gray-700 mb-6">Página no encontrada</p>
                <a href="/" class="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600">Volver al inicio</a>
            </div>
        </body>
        </html>
    `);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
    Servidor de Finanzas Personales iniciado!
    --------------------------------------------
    Localhost:       http://localhost:${PORT}
    Acceso web:  http://localhost:${PORT}
    Credenciales de prueba:
       Usuario: admin
       Contraseña: 1234
    `);
});