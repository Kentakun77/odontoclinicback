const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const errorMiddleware = require('./middlewares/errors')

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(fileUpload());


//Importar todas las rutas
const odontogramas = require('./routes/odontograma');
const auth = require('./routes/auth');
const ticket = require('./routes/ticket');

app.use('/api/v1', odontogramas)
app.use('/api/v1', auth)
app.use('/api/v1', ticket)
//Middleware para los errores
app.use(errorMiddleware);

module.exports = app;