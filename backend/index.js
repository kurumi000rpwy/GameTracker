//Importacion de paquetes necesarios
const {User, Game, Review} = require('./models/models.js'); //Modelo de la db
const connectDB = require('./config/db.js'); //conectar a la base de datos
const mongoose = require('mongoose');//requerimiento para la base d datoas
const express = require('express');//express para el server
const bcrypt = require('bcrypt');//para el encriptado
const chalk = require('chalk');//para los colores de la consola
//const path = require('path');//para las rutas y archivos
const xss = require('xss');

//Nivel de encryptado
const hashLevel = 10

const app = express();
const port = 8080;

//Conectar a la base de datos
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Archivos de public (para que se vea la pagina)
/*app.use(express.static(path.join(__dirname, 'public')));

//Ruta raiz
app.get('/', (req, res) => {
	res.send(`
		Servidor node en http://localhost:8080
		
		Servidor react en http://localhost:5173`);
});

//Acceso a la pagina de crear cuenta
app.get("/register", (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'register.html'));		
}); 

//Acceso a la pagina de crear cuenta
app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
*/
//Ingresar
app.post("/login", async (req, res) => {
	try{
		let identifier = xss(req.body.identifier);
		let password = xss(req.body.password);
		
		//Verificar si llego algo del js
		if(!identifier || !password){
			return res.json({success: false, messge: "Faltan campos"});
		}
		
		//Ver si es email o username
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

		if(!validPassword){
			return res.json({success: false, message: "Contrasena incorrecta"});
		}

		res.send(`Bienvenido ${user}`);
			

	}catch(error){
		console.log(error);
	}
});

//Crear usuario
app.post("/api/register", async (req, res) => {
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

			res.json()
		}
	}catch(error){
		res.send(error)
		console.log(error)
	}
});

//Ver los juegos
app.get("/games", async (req, res) => {
	res.sendFile(path.join(__dirname, "public", "games.html"));
});

//Listar juegos
app.get("/api/games", async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = 6;
	const skip = (page - 1) * limit;

	const total = await Game.countDocuments();
	const games = await Game.find().skip(skip).limit(limit);

	if(total === 0){
		return res.json({success: false, message: "No hay juegos"});
	}

	res.json({success: true, games, totalPages: Math.ceil(total / limit), page});
});

//pagina para agregar juegos
app.get("/games/add", async (req, res) => {
	res.sendFile(path.join(__dirname, "public", "add.html"));
});

//agregar juegos
app.post("/games/add", async (req, res) => {
	try{
		const title = xss(req.body.title);
		const description = xss(req.body.description);
		const genre = xss(req.body.genre);
		const platform = xss(req.body.platform);
		const img = req.body.img;
		const releaseDate = req.body.releaseDate;

		if(!title || !description || !img){
			res.json({success: false, message: "Faltan campos"});
		}

		const newGame = new Game({
			title,
			description,
			genre: Array.isArray(genre) ? genre : [genre],
			platform: Array.isArray(platform) ? platform : [platform],
			img,
			releaseDate
		});
		
		await newGame.save();
		res.json({success: true, message: "se agrego el juego."});


	}catch(error){
		console.log(error);
	}
});


//Iniciar servidor
app.listen(port, () => {
	console.log(`${chalk.green('[ + ]')} Servidor node corriendo en ${chalk.cyan(`http://localhost:${port}/api`)}`);
	console.log(`${chalk.green('[ + ]')} Servidor react corriendo en ${chalk.cyan(`http://localhost:5173/`)}`);
});
