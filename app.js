// 1- Invocamos a libreria express
const express = require('express');

const app = express();

// 2- Seteamos urlencoded para capturar datos del formulario 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 3- Invovamos a dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' }); //Ruta donde vamos a guardar todas las variables de entorno 

// 4- Setear el directorio public
app.use('/resources', express.static('/public'));
app.use('/resources', express.static(__dirname + '/public'));

// 5- Establecer motor de plantillas ejs
app.set('view engine', 'ejs');

// 6- Invocar al modulo para hash de pass
const bcryptjs = require('bcryptjs');

// 7- Variables de session 
const session = require('express-session');
app.use(session({
    secret: 'secret', //clave secreta
    resave: true, //forma de guardar sesiones
    saveUninitialized: true
}));

// 8- Invocamos al modulo de la conexión a la base de datos
const connection = require('./database/db');

// 9- Estableciendo las rutas
app.get('/login', (req, res) => {
    res.render('login');
});

// 10- Autentiacion
app.post('/auth', async(req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    if (user && pass) {
        connection.query('SELECT * FROM user WHERE user = ?', [user], async(error, results) => {
            //const passHash = await bcryptjs.hash(results[0].pass, 8)
            if (results.length == 0 || pass != results[0].pass) {
                res.render('login', {
                    alert: true,
                    alertTitle: "ERROR",
                    alertMessage: "¡Usuario y/o contraseña incorrecto!",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                })
            } else {
                req.session.loggedin = true;
                req.session.name = results[0].name;
                res.render('login', {
                    alert: true,
                    alertTitle: "¡BIENVENIDO!",
                    alertMessage: "¡Login Correcto!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });
            }
            res.end();
        })
    } else {
        res.render('login', {
            alert: true,
            alertTitle: "ADVERTENCIA",
            alertMessage: "Por favor llena todos los campos.",
            alertIcon: 'warning',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    }
});

// 11- Método para controlar que está auth en todas las páginas
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        connection.query('SELECT * FROM libro', (error, results) => {
            if (error) {
                throw error;
            } else {
                return res.render('gestion', {
                    login: true,
                    name: req.session.name,
                    results: results
                });
            }
        })
    } else {
        return res.render('index', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
});

//Logout
//Destruye la sesión.
app.get('/logout', function(req, res) {
    req.session.destroy(() => {
        res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
    })
});

app.listen(5000, (req, res) => {
    console.log('SERVER RUNNING IN http://localhost:3000')
});