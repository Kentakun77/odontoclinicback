const Ticket = require('../models/ticket');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')

//Crear nuevo ticket
exports.newTicket = catchAsyncErrors(async (req, res, next)=>{


    const {fechaCita, descripcion } = req.body;
    // const antCita = new Date(fechaCita).setHours(new Date(fechaCita).getHours()-1);
    // const despCita = new Date(fechaCita).setHours(new Date(fechaCita).getHours()+1);
    // console.log(new Date(antCita))
    // console.log(new Date(despCita))
    // const citaAntDesp = Ticket.find({'fechaCita': {"$gte": new Date(antCita), "$lte": new Date(despCita)}})
    // if (citaAntDesp){
    //     console.log(citaAntDesp)
    //     return next(new ErrorHandler('Ya existen citas muy cercanas a ese horario, elija otro horario', 404))
    // }
    const ticket = await Ticket.create({
        fechaCita: new Date(fechaCita),
        descripcion,
        refUsuario: req.user._id
    })
    res.status(200).json({
        success: true,
        ticket
    })
})
//Obtener ticket especifico
exports.getSingleTicket = catchAsyncErrors(async (req, res, next)=>{
    const ticket = await Ticket.findById(req.params.id).populate('refUsuario', 'nombres apellidos email ');
    if (!ticket){
        return next(new ErrorHandler(`No existe ninguna cita con ese id: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        ticket
    })
})
//Obtener tickets de usuario logeado
exports.myTickets = catchAsyncErrors(async (req, res, next)=>{
    const ticket = await Ticket.find({refUsuario: req.user._id})

    res.status(200).json({
        success: true,
        ticket
    })
})
//Obtener todos los tickets
exports.allTickets = catchAsyncErrors(async (req, res, next)=>{
    const resPerPage = 4;
    const ticketsCount = await Ticket.countDocuments();

    const apiFeatures = new APIFeatures(Ticket.find().populate('refUsuario', '_id nombres apellidos email celular').sort({createdAt: -1}), req.query)
        .search()
        .filter()
        .pagination(resPerPage)
    const tickets = await apiFeatures.query;


    res.status(200).json({
        totalTickets: ticketsCount,
        resPerPage,
        success: true,
        tickets
    })
})
//Update estado ticket
exports.updateTicket = catchAsyncErrors(async (req, res, next)=>{
    const ticket = await Ticket.findById(req.params.id);
    if (ticket.estado === "Aceptado" || ticket.estado === "Rechazado"){
        return next(new ErrorHandler(`Este ticket ya fue: ${ticket.estado}`, 400 ))
    }
    ticket.estado = req.body.estado;
    ticket.modifiedAt = Date.now();
    await ticket.save()
    res.status(200).json({
        success: true,
    })
})
//Delete ticket especifico
exports.deleteSingleTicket = catchAsyncErrors(async (req, res, next)=>{
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket){
        return next(new ErrorHandler(`No existe ninguna cita con ese id: ${req.params.id}`, 404))
    }
    await ticket.remove();
    res.status(200).json({
        success: true,
    })
})