const mongoose = require('mongoose');
require('./Game');
require('./Review');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    favoriteGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
    gamesProgress: [{
        game: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
        progress: { type: Number, default: 0 }
    }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    gamification: {
        level: { type: Number, default: 1 },
        exp: { type: Number, default: 0 },
        badges: [{ type: String }]
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;
