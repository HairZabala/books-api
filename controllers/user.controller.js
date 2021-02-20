const { usuariosConectados } = require("../sockets/socket");
const User = require('../models/user.model');
const validator = require('email-validator');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { generateToken } = require('../helpers/jwt.helper');

// Servicio para obtener todos los ID's de los usuarios.
const getUsersIds = async(req, res) => {

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

const getUsers = async(req, res) => {

    try {

        const [usersDB, userCount] = await Promise.all([
            User.find({ status: true }, 'name email img role google status')
            .exec(),

            User.countDocuments({ status: true })
        ]);

        res.json({
            status: true,
            count: userCount,
            users: usersDB
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error: {
                msg: 'Error inesperado, favor revisar el Log del sistema.'
            }
        })
    }

};

const createUser = async(req, res) => {

    try {
        const body = req.body;

        if (!validator.validate(body.email)) {
            return res.status(400).json({
                status: false,
                error: {
                    msg: 'El email es inválido. Favor verifique.'
                }
            });
        }

        // valido que el email sea unico.
        const emailUnique = await User.findOne({ email: String(body.email).toLowerCase() });

        if (emailUnique) {
            return res.status(400).json({
                status: false,
                error: {
                    msg: `El email ${String(body.email).toLowerCase()} ya se encuentra registrado. Favor verifique.`
                }
            });
        }

        const user = new User({
            name: body.name,
            email: String(body.email).toLowerCase(),
            password: bcrypt.hashSync(body.password, bcrypt.genSaltSync()),
            img: body.img,
            role: body.role,
        });

        const userDB = await user.save();

        // Generar JWT para inicio de sesion
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
            error: error.errors,
            msg: 'Error inesperado, favor revisar el Log del sistema.'
        })
    }
};

const updateUser = async(req, res) => {

    try {
        const id = req.params.id;
        const body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

        if (body.email && !validator.validate(body.email)) {
            return res.status(400).json({
                status: false,
                error: {
                    msg: 'El email es inválido. Favor verifique.'
                }
            });
        }

        const userDB = await User.findById(id);

        if (!userDB) {
            return res.status(404).json({
                status: false,
                error: {
                    msg: 'El usuario no existe en la BD'
                }
            });
        }

        if (!userDB.status) {
            return res.status(404).json({
                status: false,
                error: {
                    msg: 'No es posible modificar un usuario con estado inactivo. Verifique.'
                }
            });
        }

        const userUpdated = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' });

        res.json({
            status: true,
            user: userUpdated
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error: {
                msg: 'Error inesperado, favor revisar el Log del sistema.'
            }
        })
    }


}

const deleteUser = async(req, res) => {

    try {
        let id = req.params.id;

        // User.findByIdAndDelete(id, (error, userDeleted) => {
        const userDeleted = await User.findByIdAndUpdate(id, { status: false }, { new: true });

        if (!userDeleted) {
            return res.status(404).json({
                status: false,
                error: {
                    msg: 'El usuario no existe en la BD'
                }
            });
        }

        res.json({
            status: true,
            user: userDeleted
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            error: {
                msg: 'Error inesperado, favor revisar el Log del sistema.'
            }
        })
    }

}

module.exports = {
    getUsersIds,
    getUsersDetails,
    getUsers,
    createUser,
    updateUser,
    deleteUser
}