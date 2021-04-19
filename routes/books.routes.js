/**
 *  Ruta: /api/books
 **/
const { Router } = require('express');
const { check } = require('express-validator');
const { createBook, getBooks, getBook, updateBook, deleteBook, getBooksByYear } = require('../controllers/book.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validarCampos } = require('../middlewares/validar-campos.middleware');

const router = Router();

router.get('/', [ verifyToken ], getBooks);

router.get('/:id', [ 
    verifyToken,
    check('id', 'Book ID must be valid.').isMongoId(),
    validarCampos
], getBook);

router.get('/getbyyear/:year', [ verifyToken ], getBooksByYear);

router.post('/', [
    verifyToken,
    check('title', 'title is required').not().isEmpty(),
    check('author', 'author is required').not().isEmpty(),
    check('year', 'year of book release is required').not().isEmpty(),
    validarCampos
], createBook);

router.put('/:id', [
    verifyToken,
    check('id', 'Book ID must be valid.').isMongoId(),
    validarCampos
], updateBook);

router.delete('/:id', [
    verifyToken,
    check('id', 'Book ID must be valid.').isMongoId(),
    validarCampos
], deleteBook);



module.exports = router;