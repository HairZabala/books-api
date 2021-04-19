require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Configurando y parseando la lectura de data.
app.use(express.json());

// Configurando el cors.
app.use(cors());

// Configuracion global de las rutas de la aplicacion.
app.use(require('./routes/config.routes'));

// Coneccion a la BD..
dbConnection();

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});