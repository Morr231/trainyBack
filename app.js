const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

// const Text = require("./schemas/text");
// const IeltsFirstPart = require("./schemas/IeltsFirstPart");
// const { UserModel } = require("./schemas/user");

const port = process.env.PORT || 5000;

const app = express();

const signRouter = require("./routes/sign");

const userVerificationRouter = require("./routes/sendMail/sendMail");
const forgotPassword = require("./routes/sendMail//forgotPassword");

const userRouter = require("./routes/userInfo");
const firstEnterRouter = require("./routes/firstEnter");

const randomRouter = require("./routes/randomTopics/randomTopic");
// const IelstFPRouter = require("./routes/randomTopics/randomIeltsFP");

const textRouter = require("./routes/text/text");
const textCommentRouter = require("./routes/text/comment");
const allCommentsRouter = require("./routes/text/getComments");
const changeTextPrivacyRouter = require("./routes/text/changePrivacy");

const getUserRouter = require("./routes/user/getUser");

const settingsRouter = require("./routes/settings");
const achievedRouter = require("./routes/achieved");

const usersSearchRouter = require("./routes/search/users-search");
const incomingRequests = require("./routes/friend/incomingRequests");
const allFriendsRequests = require("./routes/friend/allFriends");

const addFriendRouter = require("./routes/friend/addFriend");
const skipFriendRouter = require("./routes/friend/skipFriend");
const acceptFriendRouter = require("./routes/friend/acceptFriend");

const savePostRouter = require("./routes/userFeed/savePost");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(signRouter);
app.use(userVerificationRouter);
app.use(forgotPassword);

app.use("/user", userRouter);
app.use("/user", achievedRouter);
app.use("/user", firstEnterRouter);
app.use("/user", getUserRouter);

app.use("/settings", settingsRouter);

app.use(randomRouter);
// app.use(IelstFPRouter);

app.use("/text", textRouter);
app.use("/text", textCommentRouter);
app.use("/text", allCommentsRouter);
app.use("/text", changeTextPrivacyRouter);

app.use("/search", usersSearchRouter);

app.use("/friend", allFriendsRequests);
app.use("/friend", addFriendRouter);
app.use("/friend", skipFriendRouter);
app.use("/friend", incomingRequests);
app.use("/friend", acceptFriendRouter);

app.use("/post", savePostRouter);

mongoose
    .connect(
        process.env.NODE_ENV === "production"
            ? process.env.MONGODB_PROD_URL
            : process.env.MONGODB_DEV_URL
    )
    .then((result) => {
        console.log("Connected");

        // const query = UserModel.find();
        // query.exec((err, found) => {
        //     found.forEach(function (doc) {
        //         doc.friends = [];
        //         doc.incomingRequests = [];
        //         doc.followers = [];
        //         doc.save().then(() => console.log("Saved"));
        //     });
        // });

        app.listen(port);
    })
    .catch((err) => {
        console.log(err);
    });
