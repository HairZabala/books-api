/**
 *  Ruta: /api/users
 **/
const { Router } = require('express');
const { check } = require('express-validator');
const { getUsersIds, getUsersDetails, getUsers, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validarCampos } = require('../middlewares/validar-campos.middleware');
const router = Router();

router.get('/', getUsersIds);
router.get('/detalle', getUsersDetails);
router.get('/getAll', getUsers);

router.post('/create', [
    check('name', 'Nombre del usuario es requerido').not().isEmpty(),
    check('email', 'Email del usuario es requerido.').not().isEmpty(),
    check('password', 'La constraseña es requerida.').not().isEmpty(),
    validarCampos
], createUser);

router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

module.exports = router;