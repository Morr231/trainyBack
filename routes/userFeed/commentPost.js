const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserPostModel } = require("../../schemas/postSchema");
const { UserPostCommentModel } = require("../../schemas/postCommentSchema");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.post("/comment", (req, res) => {
    const user = UserPostModel.findOne({
        _id: req.body.postId,
    });

    try {
        user.exec((e, found) => {
            const newComment = {
                user: req.body.userId,
                date: req.body.date,
                text: req.body.text,
            };

            const newCommentModel = new UserPostCommentModel(newComment);

            newCommentModel.save().then((savedComment) => {
                found.comments.push(savedComment["_id"]);

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
