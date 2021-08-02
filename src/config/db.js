// conexion a la base de datos 
// mysql://b0517abcc67928:49e5a881@us-cdbr-east-04.cleardb.com/heroku_0d540b685cd786f?reconnect=true
const mysql = require('mysql');
// funciona porque el servidor esta conectado anteriormente 
// y ligado a la carpeta /env/.env
const conexion_bd = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE

};
function handleDisconnect(conexion_bd) {
    connec = mysql.createPool(conexion_bd)

    connec.getConnection(function (err) {
        if (err) {
            console.log("error en la base de datos :", err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    connec.on("error", function (err) {
        console.log('Error en la BD aca', err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            handleDisconnect();
        } else {
            throw err;
        }
    })
}

handleDisconnect(conexion_bd);
























