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
    regime: {
        type: String,
    },
    privacy: {
        type: String,
        default: "private",
    },
    date: {
        type: Date,
        // required: true,
    },
    finished: {
        type: Boolean,
        default: null,
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
    comments: {
        type: [{ type: Schema.Types.ObjectId, ref: "UserComment" }],
        default: [],
    },
});

exports.UserTextModel = mongoose.model("UserText", textsSchema);
