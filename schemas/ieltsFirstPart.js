const mongoose = require("mongoose");
const { Schema } = mongoose;

const IeltsFirstPartSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
});

exports.IeltsFPModel = mongoose.model("IeltsFirstPart", IeltsFirstPartSchema);
