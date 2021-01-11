/**
 *  Ruta: /api/users
 **/
const { Router } = require('express');
const { getUsersIds, getUsersDetails } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const router = Router();

router.get('/', getUsersIds);
router.get('/detalle', getUsersDetails);

module.exports = router;