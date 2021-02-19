const mongoose = require('mongoose');

const dienteSchema = new mongoose.Schema({
    numDiente: {
        type: Number,
        required: true,
    },
    tratamiento: {
        type: String,
        required: true
    },
    caracteristicas: String,
    estado: {
        type: Boolean,
        required: true,
        default: true
    },
    fechaInicio: {
        type: Date,
        required: true,
        default: Date.now
    },
    fechaAvance: {
        type: Date
    },
    fechaFinal: {
        type: Date
    }
});

const odontogramaSchema = new mongoose.Schema({
    refUsuario: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    refStaff: {
        type: mongoose.Schema.ObjectId,
        ref: 'Staff'
    },
    dientes: [{
        type: dienteSchema,
        required: true,
    }],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    estado: {
        type: Boolean,
        default: true
    },
    refTicket:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Odontograma', odontogramaSchema)