const mongoose = require('mongoose');

const Review = mongoose.model("Review", {
	user: {type: mongoose.Schema.Types.ObjectId, required: true},
	game: {type: mongoose.Schema.Types.ObjectId, required: true},

	//Calificacion de estrellas
	rating: {type: Number, min: 1, max: 5, required: true},
	//Comentario
	comment: {type: String, default: ""},

	//Fecha de la resenia
	createdAt: {type: Date, default: Date.now}
});

module.exports = Review;
