//rutas para todas las vistas de la aplicación
const { createConnection } = require('mysql');
const app = require('../../config/server');
const bcryptjs = require('bcryptjs')
const connection = require('../../config/db');
const moment = require('moment')

module.exports = app => {
    // Metodos get para renderizar vistas y demas 
    app.get('/', (req, res) => {
        console.log(req.session + 'aca revisa');
        if (req.session.loggedin) {
            console.log("entra a loggedin");
            if (req.session.rol === 'admin') {
                res.redirect('/landi_page');
                console.log(req.session.rol === 'admin')
            } else if (req.session.rol === 'lider') {
                res.redirect('/landi_lider');
                console.log(req.session.rol === 'lider')
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
            name: req.session.name,
            idperfil: req.session.idperfil
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
                    req.session.name = results[0].user;
                    req.session.idperfil = results[0].idperfil;
                    console.log(results[0].idperfil)               // sesiones de usuario para saber si esta logueado
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
                            login: true,
                            idperfil: req.session.idperfil
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
                            login: true,
                            idperfil: req.session.idperfil
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
            name: req.session.name,
            idperfil: req.session.idperfil
        });
    });
    app.get('/landi_lider', (req, res) => {
        console.log(req.session);
        res.render('../views/landi_lider.ejs', {
            login: req.session.loggedin,
            name: req.session.name,
            idperfil: req.session.idperfil
        });
    });
    app.get('/metodologia', (req, res) => {
        connec.query("SELECT * FROM metodologia", (err, result) => {
            res.render('../views/metodologia.ejs', {
                m: moment,
                meet: result,
                login: req.session.loggedin,
                name: req.session.name,
                idperfil: req.session.idperfil
            });
        });
    });

    app.post('/metodologia', (req, res) => {
        const { nombreMetodologia, fechaInicial, fechaFinal, numeroParticipantes,
            actividades, costoTotal, fk_metodologia } = req.body;
        connec.query("INSERT INTO metodologia SET?", {
            nombreMetodologia: nombreMetodologia,
            fechaInicial: fechaInicial,
            fechaFinal: fechaFinal,
            numeroParticipantes: numeroParticipantes,
            actividades: actividades,
            costoTotal: costoTotal,
            fk_metodologia: fk_metodologia
        }, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/metodologia")
            }
        })
    });
    app.get('/deleted/:idmetodologia', (req, res) => {
        const idmetodologia = req.params.idmetodologia;
        connec.query("DELETE FROM metodologia WHERE idmetodologia=?", [idmetodologia], (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/metodologia")
            }
        })
    })
    app.post('/edi/:idmetodologia', (req, res) => {
        const idmetodologia = req.params.idmetodologia;
        const { fechaFinal, numeroParticipantes, actividades, costoTotal } = req.body;
        connec.query("UPDATE metodologia SET fechaFinal=?, numeroParticipantes=?, actividades=?, costoTotal=?  WHERE idmetodologia=?",
            [fechaFinal, numeroParticipantes, actividades, costoTotal, idmetodologia], (err, result) => {
                if (err) {
                    res.send(err)
                } else {
                    res.redirect("/metodologia")
                }
            })
    })

    //Conexion a los query en las BD para agregar registros al inventarios
    app.get('/plantilla', (req, res) => {
        connec.query("SELECT * FROM inventario", (err, result) => {
            res.render('../views/plantilla.ejs', {
                m: moment,
                invent: result,
                login: req.session.loggedin,
                name: req.session.name,
                idperfil: req.session.idperfil
            });
        });
    });
    /*Metodoo post para agregar datos a labase de datos al inventario */
    app.post('/plantilla', (req, res) => {
        const { nombreInventario, tipo, unidades, costo, fechaCaducidad,
            descripcion, estado, fechaUltimoInventario, fk_inventario } = req.body;
        connec.query("INSERT INTO inventario SET ?", {
            nombreInventario: nombreInventario,
            tipo: tipo,
            unidades: unidades,
            costo: costo,
            fechaCaducidad: fechaCaducidad,
            descripcion: descripcion,
            estado: estado,
            fechaUltimoInventario: fechaUltimoInventario,
            fk_inventario: fk_inventario
        }, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/plantilla")
            }
        })
    });
    //borrar elementos de la tabla inventario
    app.get('/delet/:idinventario', (req, res) => {
        const idinventario = req.params.idinventario;
        connec.query("DELETE FROM inventario WHERE idinventario=?", [idinventario], (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/plantilla")
            }
        })
    })
    // Editar el inventario 
    app.post('/edit/:idinventario', (req, res) => {
        const idinventario = req.params.idinventario;
        const { tipo, unidades, costo, estado, descripcion } = req.body;
        connec.query("UPDATE inventario SET tipo=?, unidades=?, costo=?, estado=?,descripcion=? WHERE idinventario=?",
            [tipo, unidades, costo, estado, descripcion, idinventario], (err, result) => {
                if (err) {
                    res.send(err)
                } else {
                    res.redirect("/plantilla")

                }
            })
    })


    // solicitud metodo get para renderizar 
    // la vista de registro del perfil
    app.get('/regisperfil', (req, res) => {
        res.render('../views/register.ejs', {
            login: req.session.loggedin,
            name: req.session.name,
            idperfil: req.session.idperfil
        });
    });
    // solicitud post para registrar perfil en la tabla perfil
    app.post('/regisperfil', async (req, res) => {
        const { user, rol, password } = req.body;
        console.log(req.body);
        let passwordHaash = await bcryptjs.hash(password, 8);
        connec.query("INSERT INTO perfil SET?", {
            user: user,
            rol: rol,
            password: passwordHaash
        }, async (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.render('../views/register.ejs', {
                    login: req.session.loggedin,
                    name: req.session.name,
                    idperfil: req.session.idperfil,
                    alert: true,
                    aleerTitle: "Registro Exitoso",
                    alertMessage: "success",
                    showConfirmButton: false,
                    timer: 2000,
                    ruta: ''
                });
            }
        })
    });
    /* solicitud metodo get para mostrar  un usuario de la bd*/
    app.get('/registrous', (req, res) => {
        connec.query("SELECT * FROM usuario", (err, result) => {
            res.render('../views/registrous.ejs', {
                m: moment,
                use: result,
                login: req.session.loggedin,
                name: req.session.name,
                idperfil: req.session.idperfil
            });
        });
    });
    // solicitud para insertar usuarios a la bd desde la vista principal
    app.post('/registrous', (req, res) => {
        const { nombres, apellidos, documento, identificacion,
            genero, fechavinculacion, remuneracion, estadoperfil, telefono, direccion, tipousuario,
            dependencia, email, comentario, id_usuario } = req.body;
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
            comentario: comentario,
            id_usuario: id_usuario
        }, async (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.render('../views/registrous.ejs', {
                    use: results,
                    login: req.session.loggedin,
                    name: req.session.name,
                    idperfil: req.session.idperfil,
                    alert: true,
                    alertTitle: "Registro Exitoso",
                    alertMessage: "success",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                    ruta: ''
                });
            }
        })
    });
    // metodo para borrar de la base de datos un usuario de la base de datos 
    app.get('/de/:idusuario', (req, res) => {
        const idusuario = req.params.idusuario;
        connec.query("DELETE FROM usuario WHERE idusuario=?", [idusuario], (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/registrous")
            }
        })
    });
    app.post('/edite/:idusuario', (req, res) => {
        const idusuario = req.params.idusuario;
        const { nombres, apellidos, documento, identificacion, genero,
            fechavinculacion, remuneracion, estadoperfil, telefono, direccion, tipousuario, dependencia,
            email, comentario } = req.body;
        connec.query("UPDATE usuario SET nombres=?, apellidos=?, documento=?, identificacion=?, genero=?, fechavinculacion=?, remuneracion=?, estadoperfil=?, telefono=?, direccion=?, tipousuario=?, dependencia=?, email=?, comentario=? WHERE idusuario=?",
            [nombres, apellidos, documento, identificacion, genero,
                fechavinculacion, remuneracion, estadoperfil, telefono, direccion, tipousuario, dependencia,
                email, comentario, idusuario], (err, result) => {
                    if (err) {
                        res.send(err)
                    } else {
                        res.redirect("/registrous")
                    }
                })
    });

}




