const mongoose = require("mongoose");
const { Schema } = mongoose;

const statsSchema = new Schema({
    daysStreak: {
        type: Number,
        default: null,
    },
    bestDay: {
        type: Number,
        default: null,
    },
    fastestEssay: {
        type: [{ type: Schema.Types.ObjectId, ref: "UserText" }],
        default: [],
    },
    longestEssay: {
        type: [{ type: Schema.Types.ObjectId, ref: "UserText" }],
        default: [],
    },
    averageWPM: {
        type: Number,
        default: null,
    },
    averageTime: {
        type: Number,
        default: null,
    },
    averageWordCount: {
        type: Number,
        default: null,
    },
    dailyWordCount: {
        type: [],
        default: null,
    },
    dailyTime: {
        type: [],
        default: null,
    },
});

exports.UserStatsModel = mongoose.model("UserStats", statsSchema);
