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
        likesNumber: {
            type: Number,
            default: 0,
        },
        whoLiked: {
            type: [{ type: Schema.Types.ObjectId, ref: "User" }],
            default: [],
        },
    },
    dislikes: {
        dislikesNumber: {
            type: Number,
            default: 0,
        },
        whoDisliked: {
            type: [{ type: Schema.Types.ObjectId, ref: "User" }],
            default: [],
        },
    },
});

exports.UserPostCommentModel = mongoose.model(
    "UserPostComment",
    postCommentSchema
);
