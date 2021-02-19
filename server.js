const app = require('./app')
const connectDatabase = require('./config/database')

const dotenv = require('dotenv');
const cloudinary = require('cloudinary');
//Manejar Exepciones
process.on("uncaughtException", err=>{
    console.log(`Error: ${err.message}`);
    console.log('Bajando servidor por Uncaught Exception');
    process.exit(1)
})

//Config
dotenv.config({path: 'config/config.env'})
//Conectando a la base de datos

connectDatabase();
//Cloudinary COnfig
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server inicia en el PUERTO: ${process.env.PORT} en ${process.env.NODE_ENV} mode.`)
})

//Manejar Promise Rejections
process.on("unhandledRejection", err =>{
    console.log(`Error: ${err.message}`);
    console.log('Bajando Servidor por Promise Rejection');
    server.close(()=>{
        process.exit(1)
    })
})