const mongoose = require('mongoose');

const Game = mongoose.model("Game", {
	title: {tipe: String, required: true},
	description: {type: String, required: true},
	genre: [{type: String}],
	platform: [{type: String}],
	releaseDate: {type: Date},

	//Resenias por diferentes usuarios
	reviews: [{type: mongoose.Schema.Types.ObjectId, ref: "Review"}],

	//Promedio de estrellas
	averageRating: {type: Number, default: 0}
});

//Recalcular el promedio de estrellas
Game.prototype.updateAverageRating = async function(){
	const Review = mongoose.model("Review");
	const reviews = await Review.find({game: this._id});

	//Si la cantidad de resenias es igual a 0,lo deja en 0
	if(reviews.length === 0){
		this.averageRating = 0;	
	}
	else{
		const total = reviews.reduce((sum, r) => sum + r.rating, 0);
		this.averageRating = total / reviews.lenght;
	}

	await this.save();
};

module.exports = Game;
