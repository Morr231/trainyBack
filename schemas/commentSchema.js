const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
    text: {
        type: String,
        // required: true,
        default: null,
    },
    date: {
        type: Date,
        default: null,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    startPosition: {
        type: Number,
        defalt: null,
    },
    endPosition: {
        type: Number,
        defalt: null,
    },
    yPos: {
        type: Number,
        defalt: null,
    },
});

exports.UserCommentModel = mongoose.model("UserComment", commentSchema);
