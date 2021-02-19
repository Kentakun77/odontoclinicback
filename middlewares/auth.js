const Staff = require('../models/staff');
const User = require('../models/user');
const catchAsyncErrors = require('./catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

// Verificar si el staff esta autenticado
exports.isAuthenticatedStaff = catchAsyncErrors(async (req, res, next)=>{
    const {token} = req.cookies;
    if (!token){
        return next(new ErrorHandler('Debes Logearte Primero', 401))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.staff = await Staff.findById(decoded.id);
    next()
})
// Verificar si el user esta autenticado
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next)=>{
    const {token} = req.cookies;
    if (!token){
        return next(new ErrorHandler('Debes Logearte Primero', 401))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);
    next()
})
//Verificar Roles de Staff
exports.authorizeRoles = (...roles)=>{
    return (req, res, next)=>{
        if (!roles.includes(req.staff.rol)){
            return next(
            new ErrorHandler(`Rol (${req.staff.rol}) no esta autorizado`, 403))
        }
        next()
    }
}