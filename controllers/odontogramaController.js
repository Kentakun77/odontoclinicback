const Odontograma = require('../models/odontograma');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')

//Crear nuevo odontograma
exports.newOdontograma = catchAsyncErrors(async (req, res, next)=>{
    //req.body.staff = req.staff.id;
    //req.body.refUsuario = req.refUsuario.id;

    const odontograma = await Odontograma.create(req.body)
    res.status(201).json({
        success: true,
        odontograma
    })
})

exports.getOdontogramas = catchAsyncErrors(async (req, res, next)=>{

    const resPerPage = 2;
    const odontogramaCount = await Odontograma.countDocuments();

    const apiFeatures = new APIFeatures(Odontograma.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage)
    const odontogramas = await apiFeatures.query;

    res.status(200).json({
        success: true,
        numeroRegistros: odontogramas.length,
        totalRegistros: odontogramaCount,
        odontogramas
    })
})

exports.getSingleOdontograma = catchAsyncErrors(async (req, res, next) =>{
    const odontograma = await Odontograma.findById(req.params.id);
    if (!odontograma){
        return next(new ErrorHandler('No se encuentra Odontograma', 404))
    }
    res.status(200).json({
        success: true,
        odontograma
    })
})

exports.updateOdontograma = catchAsyncErrors(async (req, res, next) =>{
    let odontograma = await Odontograma.findById(req.params.id);
    if (!odontograma){
        return next(new ErrorHandler('No se encuentra Odontograma', 404))
    }

    odontograma = await Odontograma.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        odontograma
    })
})