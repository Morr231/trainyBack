const mongoose = require("mongoose");
const { Schema } = mongoose;

const textsSchema = new Schema({
    text: {
        type: String,
        // required: true,
    },
    topic: {
        type: String,
        // required: true,
    },
    date: {
        type: Date,
        // required: true,
    },
    wordCount: {
        type: Number,
        // required: true,
    },
    timeSpend: {
        type: Number,
        default: null,
    },
    imageUrl: {
        type: String,
        default: null,
    },
});

const dateSchema = new Schema({
    date: {
        type: String,
    },
    count: {
        type: Number,
    },
});

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
        type: textsSchema,
        default: null,
    },
    longestEssay: {
        type: textsSchema,
        default: null,
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

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    texts: {
        type: [textsSchema],
        default: null,
    },
    daysTextCount: [dateSchema],
    statistics: { type: statsSchema, default: null },
});

exports.UserModel = mongoose.model("User", userSchema);
exports.UserTextModel = mongoose.model("UserText", textsSchema);
