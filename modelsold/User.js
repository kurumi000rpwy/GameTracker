const mongoose = require('mongoose');
require('./Game.js');
require('./Review.js');

const UserSchema = new mongoose.Schema({
	//Nombre de usuario, email y contrasenia
	username: {type: String, required: true, unique: true},
	email: {type: String, required: true, unique: true}, 
	password: {type: String, required: true},

	//Descripcion del jugador
	bio: {type: String, default: "Soy alguien a quien le encantan los videojuegos!"},

	//Jugadores que tiene agregados
	friends: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],

	//Juegos favoritos
	favoritegames: [{type: mongoose.Schema.Types.ObjectId, ref: "Game"}],

	//Progreso de los juegos (completado, jugando etc)
	gameProgress: [{
		game: {type: mongoose.Schema.Types.ObjecttId, ref: "Game"},
		progress: {type: Number, min: 0, max: 100, default: 0},
		status: {
			type: String,
			enum: ["jugando", "completado", "en pausa", "abandonado"],
			default: "jugando"
		}
	}],

	//Resenias que tiene el usuario
	reviews: [{type: mongoose.Schema.Types.ObjectId, ref: "Review"}],

	//Gamificacion
	badges: [{type: String}]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
