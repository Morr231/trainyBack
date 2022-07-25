const mongoose = require("mongoose");
const { Schema } = mongoose;

const IeltsFirstPartSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("IeltsFirstPart", IeltsFirstPartSchema);
