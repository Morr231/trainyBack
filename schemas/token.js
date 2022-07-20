const mongoose = require("mongoose");
const { Schema } = mongoose;

const tokenSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: Number,
        required: true,
    },
});

exports.TokenModel = mongoose.model("token", tokenSchema);
