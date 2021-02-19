const User = require('../models/user');
const Staff = require('../models/staff');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')

const crypto = require('crypto');
const cloudinary= require('cloudinary');

//Registar un usuario
exports.registerUser = catchAsyncErrors(async (req, res, next)=>{
    const {nombres, apellidos, email, password, celular, ocupacion, fechaNac} = req.body;
    const user = await User.create({
        nombres,
        apellidos,
        email,
        password,
        avatar:{
            public_id: 'Prueba id',
            url: 'Prueba url'
        },
        celular,
        ocupacion,
        fechaNac: new Date(fechaNac),
    })
    sendToken(user, 200, res)
})
//Login user
exports.loginUser = catchAsyncErrors( async(req, res, next) =>{
    const { email, password } = req.body;

    if(!email || !password){
        return next (new ErrorHandler('Please enter email and password'), 400);
    }

    //Finding user in database
    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler('Email o password invalidos', 401));
    }

    //Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next (new ErrorHandler('email o Password invalidos', 401));
    }

    sendToken(user, 200, res)

})
//LogoutUser
exports.logoutUser = catchAsyncErrors(async (req, res, next)=>{
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Cierre de sesion exitoso'
    })
})
//Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next)=>{
    const user = await User.findOne({email:req.body.email});
    if (!user){
        return next(new ErrorHandler('No se encontro ningun usuario con este email', 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false})

    //Crear url para reset el password
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Para resetear su password vaya al siguiente link:\n\n${resetUrl}\n\nSi tu no solicitaste reiniciar tu password ignora este email.`
    try{
        await sendEmail({
            email: user.email,
            subject: 'Recuperar contraseña Odontoclinic',
            message
        })
        res.status(200).json({
            success: true,
            message: `Email enviado a: ${user.email}`
        })
    }catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message, 500))
    }
})
//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next)=> {
    //Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({resetPasswordToken, resetPasswordExpire: {$gt: Date.now()}})
    if (!user){
        return next(new ErrorHandler('El token para resetear el password es invalido o ya expiro', 400))
    }
    if (req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Los password no coinciden', 400))
    }
    //COnfigurando nuevo password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)
});
//Obtener datos usuario actual logeado
exports.getUserProfile = catchAsyncErrors(async (req, res, next)=>{
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})
//Change/Update Password
exports.updatePassword = catchAsyncErrors(async (req, res, next)=>{
    const user = await User.findById(req.user.id).select('+password');
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched){
        return next(new ErrorHandler('Password antiguo es incorrecto'));
    }
    user.password = req.body.password;
    await user.save();
    sendToken(user, 200, res)
})
//Update user Profile
exports.updateUserProfile = catchAsyncErrors(async (req, res, next)=>{
    const newUserData ={
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        email: req.body.email,
        celular: req.body.celular,
        ocupacion: req.body.ocupacion,
        fechaNac: req.body.fechaNac
    }
    //Update avatar falta
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true
    })
})


//Registrar Staff
exports.registerStaff = catchAsyncErrors(async (req, res, next)=>{
    const result = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: 'avatars',
        width: 150,
        crop: "scale"
    })

    const {nombres, apellidos, email, password, celular, especialidad, fechaNac} = req.body;
    const staff = await Staff.create({
        nombres,
        apellidos,
        email,
        password,
        avatar:{
            public_id: result.public_id,
            url: result.secure_url
        },
        // avatar:{
        //     public_id: 'Pruebaid',
        //     url: 'pruebaurl'
        // },
        celular,
        especialidad,
        fechaNac: new Date(fechaNac),
    })
    sendToken(staff, 200, res)
})
//Login Staff
exports.loginStaff = catchAsyncErrors( async(req, res, next) =>{
    const { email, password } = req.body;

    if(!email || !password){
        return next (new ErrorHandler('Please enter email and password'), 400);
    }

    //Finding user in database
    const staff = await Staff.findOne({email}).select('+password');

    if(!staff){
        return next(new ErrorHandler('Email o password invalidos', 401));
    }

    //Check if password is correct
    const isPasswordMatched = await staff.comparePassword(password);

    if(!isPasswordMatched){
        return next (new ErrorHandler('email o Password invalidos', 401));
    }

    sendToken(staff, 200, res)
})
//Logout Staff
exports.logoutStaff = catchAsyncErrors(async (req, res, next)=>{
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Cierre de sesion exitoso'
    })
})
//Forgot Password Staff
exports.forgotPasswordStaff = catchAsyncErrors(async (req, res, next)=>{
    const staff = await Staff.findOne({email:req.body.email});
    if (!staff){
        return next(new ErrorHandler('No se encontro ningun usuario con este email', 404));
    }
    const resetToken = staff.getResetPasswordToken();
    await staff.save({validateBeforeSave: false})

    //Crear url para reset el password
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Para resetear su password vaya al siguiente link:\n\n${resetUrl}\n\nSi tu no solicitaste reiniciar tu password ignora este email.`
    try{
        await sendEmail({
            email: staff.email,
            subject: 'Recuperar contraseña Odontoclinic',
            message
        })
        res.status(200).json({
            success: true,
            message: `Email enviado a: ${staff.email}`
        })
    }catch (error) {
        staff.resetPasswordToken = undefined;
        staff.resetPasswordExpire = undefined;

        await staff.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message, 500))
    }
})
//Reset Password Staff
exports.resetPasswordStaff = catchAsyncErrors(async (req, res, next)=> {
    //Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const staff = await Staff.findOne({resetPasswordToken, resetPasswordExpire: {$gt: Date.now()}})
    if (!staff){
        return next(new ErrorHandler('El token para resetear el password es invalido o ya expiro', 400))
    }
    if (req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Los password no coinciden', 400))
    }
    //COnfigurando nuevo password
    staff.password = req.body.password;
    staff.resetPasswordToken = undefined;
    staff.resetPasswordExpire = undefined;

    await staff.save();

    sendToken(staff, 200, res)
});
//Obtener datos Staff actual
exports.getStaffProfile = catchAsyncErrors(async (req, res, next)=>{
    const staff = await Staff.findById(req.staff.id)
    res.status(200).json({
        success: true,
        staff
    })
})
//Change/Update Password Staff
exports.updatePasswordStaff = catchAsyncErrors(async (req, res, next)=>{
    const staff = await Staff.findById(req.staff.id).select('+password');
    const isMatched = await staff.comparePassword(req.body.oldPassword);
    if (!isMatched){
        return next(new ErrorHandler('Password antiguo es incorrecto'));
    }
    staff.password = req.body.password;
    await staff.save();
    sendToken(staff, 200, res)
})
//Update Staff Profile
exports.updateStaffProfile = catchAsyncErrors(async (req, res, next)=>{
    const newUserData ={
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        email: req.body.email,
        celular: req.body.celular,
        especialidad: req.body.especialidad,
        fechaNac: req.body.fechaNac
    }
    //Update avatar falta
    const staff = await Staff.findByIdAndUpdate(req.staff.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true
    })
})
//Get all Users
exports.allUsers = catchAsyncErrors(async (req, res, next)=>{
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})
//Get all Staffs
exports.allStaffs = catchAsyncErrors(async (req, res, next)=>{
    const staffs = await Staff.find();
    res.status(200).json({
        success: true,
        staffs
    })
})
//Get Usuario especifico
exports.getUserDetails = catchAsyncErrors(async (req, res, next)=>{
    const user = await User.findById(req.params.id);
    if (!user){
        return next(new ErrorHandler(`No se encontro ningun usuario con el id: ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user
    })
})
//Get Staff especifico
exports.getStaffDetails = catchAsyncErrors(async (req, res, next)=>{
    const staff = await Staff.findById(req.params.id);
    if (!staff){
        return next(new ErrorHandler(`No se encontro ningun staff con el id: ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        staff
    })
})
//Update Staff especifico
exports.updateStaff = catchAsyncErrors(async (req, res, next)=>{
    const newUserData ={
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        //email: req.body.email,
        //celular: req.body.celular,
        especialidad: req.body.especialidad,
        fechaNac: req.body.fechaNac,
        rol: req.body.rol
    }
    //Update avatar falta
    const staff = await Staff.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true
    })
})
//Delete User
exports.deleteUser = catchAsyncErrors(async (req, res, next)=>{
    const user = await User.findById(req.params.id);
    if (!user){
        return next(new ErrorHandler(`No se encontro ningun usuario con el id: ${req.params.id}`))
    }
    //Remove avatar falta
    await user.remove();
    res.status(200).json({
        success: true,
    })
})
//Delete Staff
exports.deleteStaff = catchAsyncErrors(async (req, res, next)=>{
    const staff = await Staff.findById(req.params.id);
    if (!staff){
        return next(new ErrorHandler(`No se encontro ningun staff con el id: ${req.params.id}`))
    }
    //Remove avatar falta
    await staff.remove();
    res.status(200).json({
        success: true,
    })
})