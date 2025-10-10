//Importacion de paquetes necesarios
const {User, Game, Review} = require('./models/models.js');
const connectDB = require('./config/db.js');
const mongoose = require('mongoose');
const express = require('express');
const chalk = require('chalk');
const path = require('path');

const app = express();
const port = 8080;

//Conectar a la base de datos
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
//Archivos de public (para que se vea la pagina)
app.use(express.static(path.join(__dirname, 'public')));

//Ruta raiz
app.get('/', (req, res) => {
	res.send(`Servidor activo en el puerto ${port}.`);
});

//Acceso a la pagina de crear cuenta
app.get("/register", (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'register.html'));		
}); 
//Crear usuario
app.post("/signup", async (req, res) => {
	try{
		const newUser = new User(req.body);
		await newUser.save();
		res.send(`Se creo el usuario ${newUser.username}.`);
	}catch(error){
		res.send(error)
	}
});

//Iniciar servidor
app.listen(port, () => {
	console.log(`${chalk.green('[ + ]')} Servidor corriendo en ${chalk.cyan(`http://localhost:${port}/`)}`);
});
