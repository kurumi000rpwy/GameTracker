const mongoose = require('mongoose');
require('./User');
require('./Game');

const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
}, { timestamps: true });

// Middleware para actualizar el promedio del juego
ReviewSchema.post("save", async function () {
    const Review = this.constructor;
    const Game = mongoose.model("Game");
    const reviews = await Review.find({ game: this.game });
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Game.findByIdAndUpdate(this.game, { averageRating: avg });
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
