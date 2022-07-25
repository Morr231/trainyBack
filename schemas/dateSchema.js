const mongoose = require("mongoose");
const { Schema } = mongoose;

const oneDate = new Schema({
    date: {
        type: String,
    },
    count: {
        type: Number,
    },
});

const dateSchema = new Schema({
    dates: { type: [oneDate], default: [] },
});

exports.UserDatesModel = mongoose.model("UserDate", dateSchema);
