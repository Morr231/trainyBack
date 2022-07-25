const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
    description: {
        type: String,
        default: null,
    },
    date: {
        type: Date,
        default: null,
    },
    text: {
        type: Schema.Types.ObjectId,
        ref: "UserText",
        default: null,
    },
    privacy: {
        type: String,
        default: null,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: [{ type: Schema.Types.ObjectId, ref: "UserPostComment" }],
        default: [],
    },
});

exports.UserPostModel = mongoose.model("UserPost", postSchema);
