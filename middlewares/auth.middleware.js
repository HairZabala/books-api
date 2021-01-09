let jwt = require('jsonwebtoken');

// =========================================
// Verificar token
// =========================================
let verifyToken = (req, res, next) => {
    let authorization = req.get('Authorization');

    let token;
    if (authorization) {
        token = authorization.split(' ')[1];
    } else {
        token = null;
    }

    jwt.verify(token, process.env.SEED, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                status: false,
                error
            });
        }

        req.user = decoded.user;
        next();

    });
}

// ===============================
// Verifica administrador role
// ===============================
let verifyAdmin_Role = (req, res, next) => {

    let user = req.user;

    if (!(user.role === "ADMIN_ROLE")) {

        return res.status(400).json({
            status: false,
            error: {
                message: 'El usuario no es administrador'
            }
        });
    }

    next();

};

module.exports = {
    verifyToken,
    verifyAdmin_Role
}