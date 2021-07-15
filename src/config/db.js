// conexion a la base de datos 
// mysql://b0517abcc67928:49e5a881@us-cdbr-east-04.cleardb.com/heroku_0d540b685cd786f?reconnect=true
const mysql= require('mysql');
// funciona porque el servidor esta conectado anteriormente 
// y ligado a la carpeta /env/.env
const conexion_bd = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASS,
    database: process.env.DB_DATABASE
};

function handleDisconnect(conexion_bd) {
    connection = mysql.createPool(conexion_bd)

    connection.getConnection(function(err){
        if(err){
            console.log("error when connecting to db:",err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    connection.on("error", function(err){
        console.log('db error', err);
        if(err.code === "PROTOCOL_CONNECTION_LOST"){
            handleDisconnect();
        } else {
            throw err;
        }
    })
}

handleDisconnect(conexion_bd);

module.exports = connection;























