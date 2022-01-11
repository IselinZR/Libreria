//Invocamos a la conexion de la DB
const connection = require('../database/db.js');

//GUARDAR un REGISTRO
exports.save = (req, res) => {
    const isbn = req.body.isbn;
    const titulo = req.body.titulo;
    const autor = req.body.autor;
    const editorial = req.body.editorial;
    const anoPublicacion = req.body.anoPublicacion;
    connection.query('INSERT INTO libro SET ?', { isbn: isbn, titulo: titulo, autor: autor, editorial: editorial, anoPublicacion: anoPublicacion }, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            //console.log(results); 
            return res.render('create', {
                alert: true,
                alertTitle: "OPERACIÓN EXITOSA",
                alertMessage: "¡Se inserto registro correctamente!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            });
        }
    });
};

//ACTUALIZAR un REGISTRO
exports.update = (req, res) => {
    const id = req.body.idLibro;
    const isbn = req.body.isbn;
    const titulo = req.body.titulo;
    const autor = req.body.autor;
    const editorial = req.body.editorial;
    const anoPublicacion = req.body.anoPublicacion;
    connection.query('UPDATE libro SET ? WHERE idLibro = ?', [{ isbn: isbn, titulo: titulo, autor: autor, editorial: editorial, anoPublicacion: anoPublicacion }, id], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            //res.redirect('/')
            return res.render('edit', {
                alert: true,
                alertTitle: "OPERACIÓN EXITOSA",
                alertMessage: "¡Se modifico registro correctamente!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: '',
                libro: results[0]
            });
        }
    });
};