require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const { dbConnection } = require('./database/config');

// Configuracion de todas las acciones del socket en el servidor.
const socket = require('./sockets/socket');

// Crear el servidor de express
const app = express();

// Configurando y parseando la lectura de data.
app.use(express.json());

// Configuracion global de las rutas de la aplicacion.
app.use(require('./routes/config.routes'));

const httpServer = http.createServer(app);
global.io = socketIO(httpServer, { cors: { origin: true, credentials: true } });

// configuracion del socket.
io.on('connection', (client) => {

    // Conectar usuario
    socket.conectarUsuario(client);

    // Configurar usuario
    socket.configurarUsuario(client, io);

    // obtener Usuarios
    socket.obtenerUsuarios(client, io);

    // Escuchar mensajes;
    socket.mensaje(client, io);

    socket.disconnect(client, io);

});

// Coneccion a la BD..
dbConnection();

httpServer.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});