const mongoose = require("mongoose");
const { Schema } = mongoose;

const statsSchema = new Schema({
    daysStreak: {
        type: Number,
        default: 0,
    },
    bestDay: {
        type: Number,
        default: 0,
    },
    fastestEssay: {
        type: Number,
        default: 0,
    },
    longestEssay: {
        type: Number,
        default: 0,
    },
    averageWPM: {
        type: Number,
        default: 0,
    },
    averageTime: {
        type: Number,
        default: 0,
    },
    averageWordCount: {
        type: Number,
        default: 0,
    },
    dailyWordCount: {
        type: [],
        default: 0,
    },
    dailyTime: {
        type: [],
        default: 0,
    },
});

exports.UserStatsModel = mongoose.model("UserStats", statsSchema);
