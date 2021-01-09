const jwt = require('jsonwebtoken');

const generateToken = (user) => {

    return new Promise((resolve, reject) => {

        jwt.sign({ user }, process.env.SEED, {
            expiresIn: '30 days'
        }, (error, token) => {
            if (error) {
                reject('No se pudó generar el token.', error)
            } else {
                resolve(token);
            }
        });
    });

}

module.exports = {
    generateToken
}