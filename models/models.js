const mongoose = require('mongoose');

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

const GameSchema = mongoose.Schema({
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
GameSchema.prototype.updateAverageRating = async function(){
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

const ReviewSchema = mongoose.Schema({
        user: {type: mongoose.Schema.Types.ObjectId, required: true},
        game: {type: mongoose.Schema.Types.ObjectId, required: true},

        //Calificacion de estrellas
        rating: {type: Number, min: 1, max: 5, required: true},
        //Comentario
        comment: {type: String, default: ""},

        //Fecha de la resenia
        createdAt: {type: Date, default: Date.now}
});

const User = mongoose.model("User", UserSchema);
const Game = mongoose.model('Game', GameSchema);
const Review = mongoose.model('Review', ReviewSchema);

module.exports = {User, Game, Review};
