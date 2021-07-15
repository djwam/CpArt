//correr el servidor verificar que se ejecute
// se configura el servidor en este index.js

const app= require('./config/server');
const rutas=require('./app/routes/login_resgistro')
rutas(app);
// se importa la conexion de la bd en este archivo 
const connection= require('./config/db');




// TODO se debe escuchar el servidor en un puerto y se configura de esta manera
app.listen(app.get('port'),()=>{
    console.log('servidor en el puerto', app.get('port'));
});

