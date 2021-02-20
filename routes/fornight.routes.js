/**
 *  Ruta: /api/fornight
 **/
const { Router } = require('express');
const { check } = require('express-validator');
const { createFornight, getFornights, updateFornight, deleteFornight, closeFornight } = require('../controllers/fornight.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validarCampos } = require('../middlewares/validar-campos.middleware');

const router = Router();

router.get('/', getFornights);
router.post('/create', [
    verifyToken,
    check('description', 'Descripción de la quincena es requerida.').not().isEmpty(),
    check('from', 'Fecha inicio es requerida').not().isEmpty(),
    check('to', 'Fecha fin es requerida').not().isEmpty(),
    validarCampos
], createFornight);

router.put('/update/:id', [
    verifyToken,
    check('id', 'El id de la quincena debe de ser válido').isMongoId(),
    validarCampos
], updateFornight);

router.put('/close/:id', [
    verifyToken,
    check('id', 'El id de la quincena debe de ser válido').isMongoId(),
    validarCampos
], closeFornight);

router.delete('/delete/:id', [
    verifyToken,
    check('id', 'El id de la quincena debe de ser válido').isMongoId(),
    validarCampos
], deleteFornight);



module.exports = router;