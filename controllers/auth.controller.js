const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../helpers/jwt.helper');


const login = async(req, res) => {

    try {
        let body = req.body;

        User.findOne({ email: body.email }, async(error, userDB) => {
            if (error) {
                return res.status(500).json({
                    status: false,
                    error
                });
            }

            if (!userDB) {
                return res.status(400).json({
                    status: false,
                    error: {
                        message: '(Usuario) o contraseña incorrectos.'
                    }
                });
            }

            if (!userDB.status) {
                return res.status(400).json({
                    status: false,
                    error: {
                        message: 'Usuario no se encuentra activo en el sistema, favor comuniquese con el adminitrador.'
                    }
                });
            }

            if (!bcrypt.compareSync(body.password, userDB.password)) {
                return res.status(400).json({
                    status: false,
                    error: {
                        message: 'Usuario o (contraseña) incorrectos.'
                    }
                });
            }

            // Generar token.
            const token = await generateToken(userDB);

            res.json({
                status: true,
                user: userDB,
                token
            })
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error: {
                message: 'Error inesperado, favor revisar el Log del sistema.'
            }
        });
    }


}


module.exports = {
    login
}