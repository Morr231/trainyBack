const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserModel } = require("../../schemas/user");
const { UserPostModel } = require("../../schemas/postSchema");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.get("/friends", (req, res) => {
    const user = UserModel.findOne({
        username: req.tokenData.username,
    })
        .populate("friends")
        .populate("posts");

    try {
        user.exec((e, found) => {
            // allPosts = [];

            console.log(found);

            // found.save().then(() => {
            //     res.json({
            //         saved: true,
            //     });
            // });
        });
    } catch (e) {
        res.json({
            error: true,
        });
    }
});

module.exports = router;
