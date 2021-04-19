const User = require('../models/user.model');
const validator = require('email-validator');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { generateToken } = require('../helpers/jwt.helper');


const getUsers = async(req, res) => {

    try {

        const [usersDB, userCount] = await Promise.all([
            User.find({ status: true }, 'name email role status')
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
            errors: [{
                msg: 'Something is wrong, please check the system log.'
            }]
        })
    }

};

const createUser = async(req, res) => {

    try {
        const body = req.body;

        if (!validator.validate(body.email)) {
            return res.status(400).json({
                status: false,
                errors: [{
                    msg: 'Email is invalid, please verify it.'
                }]
            });
        }

        // valido que el email sea unico.
        const emailUnique = await User.findOne({ email: String(body.email).toLowerCase() });

        if (emailUnique) {
            return res.status(400).json({
                status: false,
                errors: [{
                    msg: `The email ${String(body.email).toLowerCase()} is already registered. please verify it.`
                }]
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
            errors: [{
                msg: 'Something is wrong, please check the system log.'
            }]
        })
    }
};

const updateUser = async(req, res) => {

    try {
        const id = req.params.id;
        const body = _.pick(req.body, ['name', 'email', 'role', 'status']);

        if (body.email && !validator.validate(body.email)) {
            return res.status(400).json({
                status: false,
                error: {
                    msg: 'Email is invalid, please verify it.'
                }
            });
        }

        // valido que el email sea unico.
        const emailUnique = await User.findOne({ email: String(body.email).toLowerCase() });

        if (emailUnique) {
            return res.status(400).json({
                status: false,
                errors: [{
                    msg: `The email ${String(body.email).toLowerCase()} is already registered. please verify it.`
                }]
            });
        }

        const userDB = await User.findById(id);

        if (!userDB) {
            return res.status(404).json({
                status: false,
                errors: [{
                    msg: 'User does not exist in DB.'
                }]
            });
        }

        if (!userDB.status) {
            return res.status(404).json({
                status: false,
                errors: [{
                    msg: 'It is not posible to modify a inactive user, please verify it.'
                }]
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
            errors: [{
                msg: 'Something is wrong, please check the system log.'
            }]
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
                errors: [{
                    msg: 'User does not exist in DB.'
                }]
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
            errors: [{
                msg: 'Something is wrong, please check the system log.'
            }]
        })
    }

}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}