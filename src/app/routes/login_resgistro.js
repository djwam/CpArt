//rutas para todas las vistas de la aplicación
const { createConnection } = require('mysql');
const app = require('../../config/server');
const bcryptjs = require('bcryptjs')
const connection = require('../../config/db');

module.exports = app => {
    // Metodos get para renderizar vistas y demas 
    app.get('/', (req, res) => {
        console.log(req.session + 'aca revisa');
        if (req.session.loggedin) {
            console.log("entra a loggedin");
            if (req.session.rol === 'admin') {
                res.redirect('/landi_page');
                console.log(req.session.rol === 'admin')
            } else if (req.session.rol = 'lider') {
                res.render('../views/landi_lider.ejs');
            }
        }
        else {
            console.log("entrando a si no ")
            res.redirect('/login');
        }

    });
    app.get('/login', (req, res) => {
        res.render('../views/index.ejs', {
            login: true,
            name: req.session.name
        });
    });
    app.get('/logout', (req, res) => {
        req.session.destroy(() => {
            res.redirect('/');
        })
    });

    //---------------------------------------
    //Metodos POST 
    // Metodo  post en el index para loguin para autenticacion 
    app.post('/auth', async (req, res) => {
        const { user, rol, password } = req.body;
        let passwordHaash = await bcryptjs.hash(password, 8);
        //console.log(req.body); se imprime en consola la cosnt 
        if (user && rol && password) {
            connec.query('SELECT * FROM perfil WHERE user=? AND rol=?', [user, rol], async (err, results) => {
                //console.log(results);  se hace la impresion para ver los errores en la consola 
                if (results.length === 0 || !(await bcryptjs.compare(password, results[0].password))) {
                    res.render('../views/index.ejs', {
                        alert: true,
                        alertTitle: 'Error',
                        alertMessage: 'usuario incorrecto',
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: '/'
                    });
                } else {
                    req.session.loggedin = true;
                    req.session.name = results[0].user;// sesiones de usuario para saber si esta logueado
                    if (rol === 'admin') {
                        req.session.rol = 'admin'
                        res.render('../views/landi_page.ejs', {
                            alert: true,
                            alertTitle: 'correcto',
                            alertMessage: 'usuario correcto',
                            alertIcon: 'success',
                            showConfirmButton: true,
                            timer: false,
                            ruta: 'landi_page',
                            name: req.session.name,
                            login: true
                        });
                        res.end()

                    } if (rol === 'lider') {
                        req.session.rol = 'lider';
                        res.render('../views/landi_lider.ejs', {
                            alert: true,
                            alertTitle: 'correcto',
                            alertMessage: 'usuario correcto',
                            alertIcon: 'success',
                            showConfirmButton: true,
                            timer: false,
                            ruta: 'landi_lider',
                            name: req.session.name,
                            login: true
                            //verificar estas rutas por que no se esta 
                            // redirecccionando al sitio que es cuando se loguea
                        });
                        res.end();
                    }
                }
            })
        }
    });
    /*Estas dos rutas son el metodo get para direccionar las vistas
    de la autenticacion*/
    app.get('/landi_page', (req, res) => {
        console.log(req.session);
        res.render('../views/landi_page.ejs', {
            login: req.session.loggedin,
            name: req.session.name
        });
    });
    app.get('/metodologia', (req, res) => {
        res.render('../views/metodologia.ejs');
    });
    app.get('/landi_lider', (req, res) => {
        res.render('../views/landi_lider.ejs');
    });


    // se confugura la ruta para la vista de registro del perfil 98765 
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
        connec.query("SELECT * FROM inventario", (err, result) => {
            res.render('../views/plantilla.ejs', {
                invent: result
            });
        });
    });
    /*Metodoo post para agregar datos a labase de datos al inventario */
    app.post('/plantilla', (req, res) => {
        const { nombreInventario, tipo, unidades, costo, fechaCaducidad,
            descripcion, estado, fechaUltimoInventario } = req.body;
        connec.query("INSERT INTO inventario SET ?", {
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
                res.send(err);
            } else {
                res.redirect("/plantilla")
            }
        })
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
                res.render('../views/register.ejs', {
                    alert: true,
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
    app.post('/regis', async (req, res) => {
        const { nombres, apellidos, documento, identificacion,
            genero, fechavinculacion, remuneracion, estadoperfil, telefono, direccion, tipousuario,
            dependencia, email, comentario } = req.body;
        console.log(req.body);
        connec.query("INSERT INTO usuario SET?", {
            nombres: nombres,
            apellidos: apellidos,
            documento: documento,
            identificacion: identificacion,
            genero: genero,
            fechavinculacion: fechavinculacion,
            remuneracion: remuneracion,
            estadoperfil: estadoperfil,
            telefono: telefono,
            direccion: direccion,
            tipousuario: tipousuario,
            dependencia: dependencia,
            email: email,
            comentario: comentario
        }, async (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.render('../views/registrous.ejs', {
                    alert: true,
                    aleerTitle: "Registro Exitoso",
                    alertMessage: "success",
                    showConfirmButton: false,
                    timer: false,
                    ruta: ''
                });
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

//mysql://b2293530885293:c9c3396f@us-cdbr-east-04.cleardb.com/heroku_619f4895c186a5c?reconnect=true


