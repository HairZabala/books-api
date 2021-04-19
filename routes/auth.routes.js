/**
 *  Ruta: /api/login
 **/
const { Router } = require('express');
const { check } = require('express-validator');
const { login, renewToken } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validarCampos } = require('../middlewares/validar-campos.middleware');
const router = Router();

router.post('/', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validarCampos
], login);

router.get('/renew', verifyToken, renewToken)

module.exports = router;