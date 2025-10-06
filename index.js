//Importacion de paquetes necesarios
const connectDB = require('./config/db.js');
const mongoose = require('mongoose');
const express = require('express');
const chalk = require('chalk');
const path = require('path');

//Conectar a la base de datos
connectDB();

const app = express();
const port = 8080;

//Archivos de public (para que se vea la pagina)
app.use(express.static(path.join(__dirname, 'public')));

//Ruta raiz
app.get('/', (req, res) => {
	res.send(`Servidor activo en el puerto ${port}.`);
});

//Iniciar servidor
app.listen(port, () => {
	console.log(`Servidor corriendo en ${chalk.green(`http://localhost:${port}/`)}`);
});
