const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const Text = require("./schemas/text");

const port = process.env.PORT || 5000;

const app = express();

const signRouter = require("./routes/sign");
const userRouter = require("./routes/userInfo");
const randomRouter = require("./routes/randomTopic");
const textRouter = require("./routes/text");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(signRouter);
app.use("/user", userRouter);
app.use(randomRouter);
app.use("/text", textRouter);

mongoose
    .connect(process.env.MONGODB_URL)
    .then((result) => {
        console.log("Connected");

        app.listen(port);
    })
    .catch((err) => {
        console.log(err);
    });
