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
    comments: {
        type: [{ type: Schema.Types.ObjectId, ref: "UserPostComment" }],
        default: [],
    },
});

exports.UserPostModel = mongoose.model("UserPost", postSchema);
