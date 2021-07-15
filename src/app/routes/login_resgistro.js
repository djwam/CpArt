//rutas para todas las vistas de la aplicación
const { createConnection } = require('mysql');
const app = require('../../config/server');
const bcryptjs = require('bcryptjs')
const connection = require('../../config/db');

module.exports = app => {
    // Metodos get para renderizar vistas y demas 
    app.get('/', (req, res) => {
        res.render('../views/index.ejs');
    });
    //---------------------------------------
    //Metodos POST 
    // Metodo  post en el index para loguin  
    app.post('/auth', async (req, res) => {
        const { name, user, rol, pass } = req.body;
        console.log(req.body);
        let = passWordHaash = await bcryptjs.hash(pass, 8);
        if (name && rol && user && pass) {
            connection.query('SELECT * FROM perfil WHERE name=?, rol=?, usuario=?, password=? ',
                [name, rol, user, passWordHaash], async (err, results) => {
                    console.log(results);
                    const valid = await bcryptjs.compare(pass, results[0].pass)
                    if (results.length === 0 || !valid) {
                        res.send('USUARIO Y/O CONTRASEÑA INCORRECTA');
                    } else {
                        if (rol === admin) {
                            res.render('../views/landi_page.ejs');
                        } else if (rol === lider) {
                            res.render('../views/metodologia.ejs')
                        }
                        //res.send('LOGIN CORRECTO');
                    }
                })
        }
    });
    app.get('/landi_page', (req, res) => {
        res.render('../views/landi_page.ejs');
    });
    // se confugura la ruta para la vista de registro del perfil 
    app.get('/register', (req, res) => {
        res.render('../views/register.ejs');
    });
    app.get('/plan', (req, res) => {
        res.render('../views/tabla.ejs');
    });

    app.get('/tabla', (req, res) => {
        res.render('../views/tabla.ejs');
    });
    //Conexion a los query en las BD para agregar registros al inventarios
    app.get('/plantilla', (req, res) => {
        connection.query("SELECT * FROM inventario", (err, result) => {
            res.render('../views/plantilla.ejs', {
                inventario: result
            });
        });
    });
    /*Metodoo post para agregar datos a labase de datos */
    app.post('/plantilla', (req, res) => {
        const { nombreInventario, tipo, unidades, costo, fechaCaducidad,
            descripcion, estado, fechaUltimoInventario } = req.body;
        connection.query("INSERT INTO inventario SET ?", {
            nombreInventario: nombreInventario,
            tipo: tipo,
            unidades: unidades,
            costo: costo,
            fechaCaducidad: fechaCaducidad,
            descripcion: descripcion,
            estado: estado,
            fechaUltimoInventario: fechaUltimoInventario
        }, (err, result) => {
            if (err) {
                res.sen(err);
            } else {
                res.redirect("/plantilla")
            }
        })
    });


    app.get('/metodologia', (req, res) => {
        res.render('../views/metodologia.ejs');
    });
    // solicitud metodo get para renderizar 
    // la vista de registro del perfil
    app.get('/registrous', (req, res) => {
        res.render('../views/registrous.ejs');
    });
    // solicitud post para registrar perfil en la tabla registrous
    app.post('/registrous', async (req, res) => {
        const { user, name, rol, pass } = req.body;
        console.log(req.body);
        let passwordHaash = await bcryptjs.hash(pass, 8);
        connection.query("INSERT INTO perfil SET?", {
            user: user,
            name: name,
            rol: rol,
            pass: passwordHaash
        }, async (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.render('../views/registrous.ejs', {
                    alert: tue,
                    aleerTitle: "Registro Exitoso",
                    alertMessage: "success",
                    showConfirmButton: false,
                    timer: false,
                    ruta: ''
                });
            }
        })
    });
    /* solicitud metodo get para registrar un usuario en la bd*/
    app.get('/regis', (req, res) => {
        res.render('../views/registrous.ejs');
    });
    app.post('/regis', (req, res) => {
        const { nombres, apellidos, documento, identificacion, genero, fechavinculacion,
            remuneracion, estadoperfil, email, telefono, direccion, tipousuario, dependencia, comentario } = req.body;
        console.log(req.body);
        connection.query("INSERT INTO usuario SET?", {
            nombres: nombres,
            apellidos: apellidos,
            documento: documento,
            identificacion: identificacion,
            genero: genero,
            fechavinculacion: fechavinculacion,
            remuneracion: remuneracion,
            estadoperfil: estadoperfil,
            email: email,
            telefono: telefono,
            direccion: direccion,
            tipousuario: tipousuario,
            dependencia: dependencia,
            comentario: comentario,
        }, async (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.send("Registro Exitoso");
            }
        })
    });

    app.get('/delete/:idinventario', (req, res) => {
        const idinventario = req.params.idinventario;
        connection.query("DELETE FROM inventario WHERE idinventario=?", [idinventario], (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/plantilla")
            }
        })
    })


    app.post('/edit/:idinventario', (req, res) => {
        const idinventario = req.params.id;
        const { tipo, unidades, costo, descripcion, estado } = req.body;
        connection.query("UPDATE inventario SET tipo=?, unidades=?, costo=?, descripcion=?, estado=? WHERE idinventario",
            [tipo, unidades, costo, descripcion, estado], (err, result) => {
                if (err) {
                    res.send(err)
                } else {
                    res.redirect("/plantilla")
                }
            })
    })
}


