const mongoose = require("mongoose");
const { Schema } = mongoose;

const oneAchievement = new Schema({
    title: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    achievedTime: {
        type: Date,
        default: null,
    },
    achieved: {
        type: Boolean,
        default: false,
    },
    rank: {
        type: String,
        default: "",
    },
});

const achievementSchema = new Schema({
    achievements: { type: [oneAchievement], default: [] },
});

exports.UserAchievementModel = mongoose.model(
    "UserAchievement",
    achievementSchema
);
