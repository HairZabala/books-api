/**
 *  Ruta: /api/messages
 **/
const { Router } = require('express');
const { sendPrivateMessage, sendMessageToEveryone } = require('../controllers/message.controller');
const router = Router();

router.post('/send/:id', sendPrivateMessage);
router.post('/sendToAll', sendMessageToEveryone);

module.exports = router;