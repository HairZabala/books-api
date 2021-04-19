const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    status: {
        type: Boolean,
        default: true
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let { __v, _id, ...userObject } = user.toObject();
    delete userObject.password;
    userObject.uid = _id;
    return userObject;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = model('User', userSchema);