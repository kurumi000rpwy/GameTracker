//Importacion de paquetes necesarios
const {User, Game, Review} = require('./models/models.js'); //Modelo de la db
const connectDB = require('./config/db.js'); //conectar a la base de datos
const mongoose = require('mongoose');//requerimiento para la base d datoas
const express = require('express');//express para el server
const bcrypt = require('bcrypt');//para el encriptado
const chalk = require('chalk');//para los colores de la consola
const path = require('path');//para las rutas y archivos
const xss = require('xss');

//Nivel de encryptado
const hashLevel = 10

const app = express();
const port = 8080;

//Conectar a la base de datos
connectDB();

app.use(express.json());
app.use(xss());
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

//Acceso a la pagina de crear cuenta
app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

//Ingresar
app.post("/login", async (req, res) => {
	try{
		let {identifier, password} = xss(req.body);
		
		//Verificar si llego algo del js
		if(!identifier || !password){
			return res.json({success: false, messge: "Faltan campos"});
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		let query = {};
		if(emailRegex.test(identifier)){
			query = {email: identifier}
		}else{
			query = {username: identifier};
		}

		//Buscar wl usuarioo
		let user = await User.findOne(query);
		if(!user){
			return res.json({success: false, message: "Usuario no encontrado"});
		}

		//Validar lacontrasenia
		const validPassword = await bcrypt.compare(password, user.password);

		if(validPassword){
			return res.json({success: false, message: "Contrasena incorrecta"});
		}

		res.send("Inicio de sesion completado")
			

	}catch(error){
		console.log(error);
	}
});

//Crear usuario
app.post("/register", async (req, res) => {
	try{
		//Verificar si el usuario y email existen
		let {username, email, password} = req.body;

		usernameExist = await User.findOne({username});
		emailExist = await User.findOne({email});
		
		if(usernameExist){
			return res.send(`El nombre de usuario ${username} ya existe, por favor elige otro.`);
		}if(emailExist){
			return res.send(`El correo ${email} ya esta registrado, elige otro correo.`);
		}else{
			//Encryptar contrasenia
			let hashedPassword = await bcrypt.hash(password, hashLevel);
			
			//Crear usuario
			const newUser = new User({username, email, password: hashedPassword});
			await newUser.save();
			res.send(`Se creo el usuario ${newUser.username}.`);
		}
	}catch(error){
		res.send(error)
		console.log(error)
	}
});

//Iniciar servidor
app.listen(port, () => {
	console.log(`${chalk.green('[ + ]')} Servidor corriendo en ${chalk.cyan(`http://localhost:${port}/`)}`);
});
