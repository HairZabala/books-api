const User = require('../models/user.model');
const validator = require('email-validator');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { generateToken } = require('../helpers/jwt.helper');

const getUsers = (req, res) => {

    try {
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || 5;

        User.find({ status: true }, 'name email img role google status')
            .skip(skip)
            .limit(limit)
            .exec((error, users) => {
                if (error) {
                    return res.status(400).json({
                        status: false,
                        error
                    });
                }

                User.countDocuments({ status: true }, (error, countUsers) => {
                    res.json({
                        status: true,
                        count: countUsers,
                        users
                    })
                });

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

const createUser = (req, res) => {

    try {
        const body = req.body;

        if (!validator.validate(body.email)) {
            return res.status(400).json({
                status: false,
                error: {
                    message: 'El email es inválido. Favor verifique.'
                }
            });
        }

        const user = new User({
            name: body.name,
            email: body.email,
            password: bcrypt.hashSync(body.password, bcrypt.genSaltSync()),
            img: body.img,
            role: body.role,
        });

        user.save(async(error, userDB) => {
            if (error) {
                return res.status(400).json({
                    status: false,
                    error
                });
            }

            // Generar JWT para inicio de sesion
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
        })
    }
};

const updateUser = (req, res) => {

    try {
        const id = req.params.id;
        const body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

        console.log(body);

        if (!validator.validate(body.email)) {
            return res.status(400).json({
                status: false,
                error: {
                    message: 'El email es inválido. Favor verifique.'
                }
            });
        }

        User.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (error, userDB) => {
            if (error) {
                return res.status(400).json({
                    status: false,
                    hair: true,
                    error
                });
            }

            if (!userDB) {
                return res.status(404).json({
                    status: false,
                    error: {
                        message: 'El usuario no existe en la BD'
                    }
                });
            }

            res.json({
                status: true,
                user: userDB
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


}

const deleteUser = (req, res) => {

    try {
        let id = req.params.id;

        // User.findByIdAndDelete(id, (error, userDeleted) => {
        User.findByIdAndUpdate(id, { status: false }, { new: true }, (error, userDeleted) => {
            if (error) {
                return res.status(400).json({
                    status: false,
                    error
                });
            }

            if (!userDeleted) {
                return res.status(404).json({
                    status: false,
                    error: {
                        message: 'El usuario no existe en la BD'
                    }
                });
            }

            res.json({
                status: true,
                user: userDeleted
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

}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}