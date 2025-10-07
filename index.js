//Importacion de paquetes necesarios
const {User, Game, Review} = require('');
const connectDB = require('./config/db.js');
const mongoose = require('mongoose');
const express = require('express');
const chalk = require('chalk');
const path = require('path');



//Conectar a la base de datos
connectDB();

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
//Archivos de public (para que se vea la pagina)
app.use(express.static(path.join(__dirname, 'public')));

userFunctions.createUser()

//Ruta raiz
app.get('/', (req, res) => {
	res.send(`Servidor activo en el puerto ${port}.`);
});

//Iniciar servidor
app.listen(port, () => {
	console.log(`Servidor corriendo en ${chalk.green(`http://localhost:${port}/`)}`);
});
