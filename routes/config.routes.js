const express = require('express');
const app = express();

app.use('/api/users', require('./user.routes'));
app.use('/api/login', require('./auth.routes'));

module.exports = app;