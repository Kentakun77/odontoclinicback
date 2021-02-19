const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    nombres: {
        type: String,
        required: [true, 'Porfavor ingrese su nombre o nombres']
    },
    apellidos:{
        type: String,
        required: [true, 'Porfavor ingrese su apellido o apellidos']
    },
    email: {
        type: String,
        required: [true, 'Porfavor ingrese su email'],
        unique: true,
        validate: [validator.isEmail, 'Porfavor entra un email valido']
    },
    password:{
        type: String,
        required: [true, 'Porfavor ingresa un password'],
        minlength: [6, 'Tu passwoird debe contener 6 caracteres como minimo'],
        select: false
    },
    avatar: {
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    celular: {
        type: Number,
        required: [true, 'Porfavor Ingresa tu celular']
    },
    fechaNac: {
        type: Date,
        required: true
    },
    ocupacion: {
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

//Encriptando Password antes de grabar en la abse de datos
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
});
//Return JWT Token
userSchema.methods.getJwtToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRESTIME
    });
};
//Comparar password
userSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password);
};

//Generar password reset Token
userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    //Token Expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000
    return resetToken
}

module.exports = mongoose.model('User', userSchema);