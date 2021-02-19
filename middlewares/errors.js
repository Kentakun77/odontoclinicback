const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) =>{
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }
    if (process.env.NODE_ENV === 'PRODUCTION'){
        let error = {...err}
        error.message = err.message

        //Mongoose id incorrecto
        if (err.name === 'CastError'){
            const message = `Recurso no encontrado. Invalido ID: ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        // Manejando Mongoose validation error
        if (err.name === 'ValidatorError'){
            const message = object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400)
        }
        //Manejando Moongose duplicate key error
        if (err.code === 11000){
            const message = `${Object.keys(err.keyValue)} duplicado ingresado`;
            error = new ErrorHandler(message, 400)
        }
        //Manejando JWT incorrecto error
        if (err.name === 'JsonWebTokenError'){
            const message = 'JSON Web Token es invalido intenta de nuevo!!!'
            error = new ErrorHandler(message, 400)
        }
        //Manejando JWT expiracion error
        if (err.name === 'TokenExpiredError'){
            const message = 'JSON Web Token ha expirado intenta de nuevo!!!'
            error = new ErrorHandler(message, 400)
        }
        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Error del servidor'
        })
    }

}