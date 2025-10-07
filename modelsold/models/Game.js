const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    genre: { type: String },
    platform: { type: String },
    releaseDate: { type: Date },
    averageRating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
}, { timestamps: true });

const Game = mongoose.model("Game", GameSchema);
module.exports = Game;
