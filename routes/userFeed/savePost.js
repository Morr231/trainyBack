const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserModel } = require("../../schemas/user");
const { UserPostModel } = require("../../schemas/postSchema");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.post("/save", (req, res) => {
    const user = UserModel.findOne({
        username: req.tokenData.username,
    });

    try {
        user.exec((e, found) => {
            const newPost = {
                description: req.body.description,
                date: req.body.date,
                text: req.body.text,
                privacy: req.body.privacy,
            };

            const newPostModel = UserPostModel(newPost);

            newPostModel.save().then(() => {
                found.posts.push(newPostModel["_id"]);

                found.save().then(() => {
                    res.json({
                        saved: true,
                    });
                });
            });
        });
    } catch (e) {
        res.json({
            error: true,
        });
    }
});

module.exports = router;
