const User = require('../models/user.model');
const validator = require('email-validator');

const sendPrivateMessage = (req, res) => {

    const mensaje = req.body.mensaje;
    const de = req.body.de;
    const id = req.params.id;

    try {

        io.in(id).emit('mensaje-privado', { de, mensaje });

        res.json({
            status: true,
            mensaje,
            id
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error: {
                message: 'Error inesperado, favor revisar el Log del sistema.'
            }
        })
    }
};

const sendMessageToEveryone = (req, res) => {
    const mensaje = req.body.mensaje;
    const de = req.body.de;

    try {

        io.emit('mensaje-nuevo', { de, mensaje });

        res.json({
            status: true,
            mensaje,
            de
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error: {
                message: 'Error inesperado, favor revisar el Log del sistema.'
            }
        })
    }
}

module.exports = {
    sendPrivateMessage,
    sendMessageToEveryone
}