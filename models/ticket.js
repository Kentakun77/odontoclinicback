const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    refUsuario: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    fechaCita:{
        type: Date,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    descripcion: {
        type: String
    },
    estado:{
        type: String,
        required: true,
        enum: {
            values: [
                'Aceptado',
                'Rechazado',
                'Pendiente'
            ]
        },
        default: 'Pendiente'
    }
})
module.exports = mongoose.model('Ticket', ticketSchema)