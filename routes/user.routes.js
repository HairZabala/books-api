/**
 *  Ruta: /api/users
 **/
const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validarCampos } = require('../middlewares/validar-campos.middleware');
const router = Router();

router.get('/', getUsers);
router.post('/create', [
    check('name', 'Username is required').not().isEmpty(),
    check('email', 'email is required').not().isEmpty(),
    check('password', 'password is required.').not().isEmpty(),
    validarCampos
], createUser);

router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

module.exports = router;