//Importacion de paquetes necesarios
const {User, Game, Review} = require('./models/models.js'); //Modelo de la db
const connectDB = require('./config/db.js'); //conectar a la base de datos

const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');//requerimiento para la base d datoas
const express = require('express');//express para el server
const bcrypt = require('bcryptjs');//para el encriptado
const chalk = require('chalk');//para los colores de la consola
const cors = require('cors');
const xss = require('xss');
const jwt = require("jsonwebtoken");
//Nivel de encryptado
const hashLevel = 10

const app = express();
const port = 8080;

//Conectar a la base de datos
connectDB();
app.use(cors({
	  origin: "http://localhost:5173",
	  methods: ["GET", "POST", "PUT", "DELETE"],
	  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
const SECRET_KEY = "7f3a2b9c1e4d8a55e3a60d9b7ef4a0c1";

app.post("/api/login", async (req, res) => {
	try{
		let identifier = xss(req.body.identifier);
		let password = xss(req.body.password);
		
		//Verificar si llego algo del js
		if(!identifier || !password){
			return res.json({success: false, message: "Faltan campos"});
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
		
		//Crear rl tokrn de la cookie
		const token = jwt.sign(
			 { username: user.username, email: user.email },
			 SECRET_KEY,
			 { expiresIn: "2h" }
			 );

		res.cookie("token", token, {
			httpOnly: true,
			sameSite: "lax",
			secure: false, // ponlo en true si usas HTTPS
			maxAge: 2 * 60 * 60 * 1000, // 2 horas
			});

		res.json({
			  success: true,
			  message: `Bienvenido ${user.username}`,
			  user: {
				      _id: user._id,
				      username: user.username,
				      email: user.email,
				    },
		});
			

	}catch(error){
		console.error(error);
		res.status(500).json({ success: false, message: "Error interno del servidor" });
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
			 return res.json({ success: false, message: `El usuario ${username} ya existe` });
		}if(emailExist){
			 return res.json({ success: false, message: `El correo ${email} ya está registrado` });
		}else{
			//Encryptar contrasenia
			let hashedPassword = await bcrypt.hash(password, hashLevel);
			
			//Crear usuario
			const newUser = new User({username, email, password: hashedPassword});
			await newUser.save();

			return res.json({ success: true, message: "Usuario creado correctamente" });
		}
	}catch(error){
		res.send(error)
		console.log(error)
	}
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
app.post("/api/logout", (req, res) => {
	  res.clearCookie("token", {
		      httpOnly: true,
		      sameSite: "lax",
		      secure: false, // pon true si usas HTTPS
		    });
	  res.json({ success: true, message: "Sesión cerrada correctamente" });
});

//pagina admin
app.get("/api/adminz", requireAuth, (req, res) => {
	if(req.user.username !== "adminz") {
		return res.status(403).json({ error: "Acceso denegado" });
	}
	res.json({ message: "Bienvenido, adminz." });
});

//agregar juegos
app.post("/adminz/add/game", async (req, res) => {
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

app.get("/api/userinfo", (req, res) => {
	  const token = req.cookies.token;

	  if (!token) {
		      return res.json({ success: false, message: "No hay token" });
		    }

	  try {
		      const decoded = jwt.verify(token, SECRET_KEY); // usa la misma constante del login
		      res.json({
			            success: true,
			            user: { username: decoded.username, email: decoded.email },
			          });
		    } catch (error) {
			        res.json({ success: false, message: "Token inválido o expirado" });
			      }
});


// Obtener favoritos del usuario
app.get("/api/user/:id/favorites", async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .populate("favoritegames") // <- Carga la info de los juegos completos
            .exec();

        if (!user) {
            return res.json({ success: false, message: "Usuario no encontrado" });
        }

        return res.json({
            success: true,
            favorites: user.favoritegames
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error al obtener favoritos" });
    }
});
app.post("/api/favorites/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;

    // 1️⃣ Verificamos que exista el ID del juego
    if (!gameId) {
      return res.status(400).json({ success: false, message: "No se recibió el ID del juego" });
    }

    // 2️⃣ Intentamos obtener el token desde cookie o encabezado Authorization
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("⚠️ No se encontró token en la solicitud");
      return res.status(401).json({ success: false, message: "Usuario no autenticado" });
    }

    // 3️⃣ Verificamos y decodificamos el token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      console.error("❌ Token inválido:", error.message);
      return res.status(403).json({ success: false, message: "Token inválido o expirado" });
    }

    // 4️⃣ Buscamos al usuario usando el username del token
    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      console.log("⚠️ Usuario no encontrado:", decoded.username);
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // 5️⃣ Buscamos el juego en la base de datos
    const game = await Game.findById(gameId);
    if (!game) {
      console.log("⚠️ Juego no encontrado:", gameId);
      return res.status(404).json({ success: false, message: "Juego no encontrado" });
    }

    // 6️⃣ Alternamos entre agregar o eliminar
    const index = user.favoritegames.indexOf(gameId);
    let isFavorite;
    if (index === -1) {
      user.favoritegames.push(gameId);
      isFavorite = true;
    } else {
      user.favoritegames.splice(index, 1);
      isFavorite = false;
    }

    await user.save();

    res.json({
      success: true,
      isFavorite,
      favoritegames: user.favoritegames,
      message: isFavorite
        ? `${game.title} añadido a favoritos`
        : `${game.title} eliminado de favoritos`,
    });
  } catch (error) {
    console.error("💥 Error al actualizar favoritos:", error);
    res.status(500).json({ success: false, message: "Error al actualizar favoritos" });
  }
});
app.get("/api/games/:id", async (req, res) => {
  try {
    // Buscar el juego por título (sin importar mayúsculas/minúsculas)
    const game = await Game.findOne({
      title: { $regex: new RegExp(`^${req.params.id}$`, "i") },
    })
      // Poblar las reseñas y los usuarios que las escribieron
      .populate({
        path: "reviews",
        populate: { path: "user", select: "username" },
      });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Juego no encontrado",
      });
    }

    // Responder con el juego y las reseñas pobladas
    res.json({
      success: true,
      game,
      reviews: game.reviews || [],
    });
  } catch (err) {
    console.error("Error al obtener el juego:", err);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// Obtener reseñas de un juego
app.get("/api/reviews/:gameId", async (req, res) => {
  try {
    const reviews = await Review.find({ game: req.params.gameId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.json({ success: false, message: "Error al obtener las reseñas" });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const { username, gameTitle, rating, comment } = req.body;

    if (!username || !gameTitle || !rating) {
      return res.json({ success: false, message: "Faltan campos obligatorios" });
    }

    // Buscar usuario por username
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ success: false, message: "Usuario no encontrado" });
    }

    // Buscar juego por título (usa regex para no importar mayúsculas/minúsculas)
    const game = await Game.findOne({
      title: { $regex: new RegExp(`^${gameTitle}$`, "i") },
    });
    if (!game) {
      return res.json({ success: false, message: "Juego no encontrado" });
    }

    // Crear nueva reseña usando los IDs correctos
    const newReview = new Review({
      user: user._id,
      game: game._id,
      rating,
      comment,
    });

    await newReview.save();

    // Vincular la reseña con usuario y juego
    await User.findByIdAndUpdate(user._id, { $push: { reviews: newReview._id } });
    await Game.findByIdAndUpdate(game._id, { $push: { reviews: newReview._id } });

    const populatedReview = await newReview.populate("user", "username");

    res.json({
      success: true,
      message: "Reseña agregada correctamente",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Error al agregar reseña:", error);
    res.json({ success: false, message: "Error al agregar la reseña" });
  }
});
//Iniciar servidor
app.listen(port, () => {
	console.log(`${chalk.green('[ + ]')} Servidor node corriendo en ${chalk.cyan(`http://localhost:${port}/api`)}`);
	console.log(`${chalk.green('[ + ]')} Servidor react corriendo en ${chalk.cyan(`http://localhost:5173/`)}`);
});

//revisar si anda loguado
function requireAuth(req, res, next) {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ error: "No autenticado" });

	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		req.user = decoded;
		next();
	} catch {
		return res.status(403).json({ error: "Token inválido" });
	}
}

function onlyAdminz(req, res, next) {
	if(req.user.username !== "adminz") {
		return res.status(403).json({ mensaje: "Acceso solo para Cristian" });
	}
	next();
}
