const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../helpers/jwt.helper');


const login = async(req, res) => {

    try {
        let body = req.body;

        const userDB = await User.findOne({ email: body.email });

        if (!userDB) {
            return res.status(400).json({
                status: false,
                error: {
                    msg: '(Usuario) o contraseña incorrectos.'
                }
            });
        }

        if (!userDB.status) {
            return res.status(400).json({
                status: false,
                error: {
                    msg: 'Usuario no se encuentra activo en el sistema, favor comuniquese con el adminitrador.'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                status: false,
                error: {
                    msg: 'Usuario o (contraseña) incorrectos.'
                }
            });
        }

        // Generar token.
        const token = await generateToken(userDB);

        res.json({
            status: true,
            user: userDB,
            token
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

const renewToken = async(req, res) => {

    try {

        const user = await User.findById(req.user.uid);

        // Generar token.
        const token = await generateToken(user);

        res.json({
            status: true,
            token,
            user,
            // menu: getMenuFrontEnd(user.role)
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            errors: [{
                msg: 'Error inesperado, favor revisar el Log del sistema.'
            }]
        });
    }

}

module.exports = {
    login,
    renewToken
}