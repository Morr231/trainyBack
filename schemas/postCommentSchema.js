const mongoose = require("mongoose");
const { Schema } = mongoose;

const postCommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    date: {
        type: Date,
        default: null,
    },
    text: {
        type: String,
        default: null,
    },
    likes: {
        type: Number,
        default: null,
    },
    dislikes: {
        type: Number,
        default: null,
    },
});

exports.UserPostModel = mongoose.model("UserPostComment", postCommentSchema);
