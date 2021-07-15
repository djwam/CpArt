// traer los modulos que son necesarios en el proyecto
const express= require('express');
const path= require('path');
const dotenv= require('dotenv');
const sessions= require('express-session');


const app = express();// inicializacion del servidor
// configuraciones del servidor 
// configuar puerto
app.set('port',process.env.PORT || 3000);
// configuracion del gestor de plantillas
app.set('view engine','ejs');
// configuracion de las rutas de las vistas el dirname ruta global
app.set('views',path.join(__dirname,'../app/views'));
// middlewares (para recibir facilemnte info de formularios) en el proyecto
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// configurar dotenv variables de entorno para conectar al la bd y las rutas de acceso a estas
dotenv.config({path: path.join(__dirname,'../env/.env')});
// como leer una archivo  css externo del servidor la ruta /resources guarda la variable del path.join(__dirname,'../' en la carpeta public)
app.use('/resources', express.static(path.join(__dirname,'../public')));

// confugurar el manejo de sessions dentro de la aplicacion 
app.use(sessions({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

module.exports=app;









