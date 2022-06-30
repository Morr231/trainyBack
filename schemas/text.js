const mongoose = require("mongoose");
const { Schema } = mongoose;

const textSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Text", textSchema);
