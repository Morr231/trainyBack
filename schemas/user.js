const mongoose = require("mongoose");
const { Schema } = mongoose;

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
    description: {
        type: String,
        default: "",
    },
    imageUrl: {
        type: String,
        default: null,
    },
    firstEnter: {
        type: Boolean,
        default: true,
    },
    texts: {
        type: [{ type: Schema.Types.ObjectId, ref: "UserText" }],
        default: [],
    },
    daysTextCount: {
        type: Schema.Types.ObjectId,
        ref: "UserDate",
        default: null,
    },
    statistics: {
        type: Schema.Types.ObjectId,
        ref: "UserStats",
        default: null,
    },
    achievements: {
        type: Schema.Types.ObjectId,
        ref: "UserAchievement",
        default: null,
    },
    incomingRequests: {
        type: [{ type: Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    posts: {
        type: [{ type: Schema.Types.ObjectId, ref: "UserPost" }],
        default: [],
    },
});

exports.UserModel = mongoose.model("User", userSchema);
