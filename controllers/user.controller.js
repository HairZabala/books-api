const { usuariosConectados } = require("../sockets/socket");

// Servicio para obtener todos los ID's de los usuarios.
const getUsersIds = (req, res) => {

    try {

        io.clients((err, clientes) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    err
                })
            }

            res.json({
                status: true,
                clientes,
            })
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

// Servicio para obtener los detalles de todos los usuarios.
const getUsersDetails = (req, res) => {

    try {

        res.json({
            status: true,
            clientes: usuariosConectados.getLista()
        })


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

module.exports = {
    getUsersIds,
    getUsersDetails
}