const express = require('express');
const app = express();

app.use('/api/users', require('./user.routes'));
app.use('/api/login', require('./auth.routes'));
app.use('/api/messages', require('./messages.routes'));

module.exports = app;