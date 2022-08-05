const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserModel } = require("../../schemas/user");
const { UserPostModel } = require("../../schemas/postSchema");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.post("/like", (req, res) => {
    const user = UserPostModel.findOne({
        _id: req.body.postId,
    });

    try {
        user.exec((e, found) => {
            if (req.body.dislikedBefore) {
                found.dislikes.whoDisliked.splice(
                    found.dislikes.whoDisliked.indexOf(req.body.userId)
                );
                found.dislikes.dislikesNumber--;
            }

            if (req.body.likePressed) {
                found.likes.likesNumber--;
                found.likes.whoLiked.splice(
                    found.likes.whoLiked.indexOf(req.body.userId)
                );
            } else {
                found.likes.likesNumber++;
                found.likes.whoLiked.push(req.body.userId);
            }

            found.save().then(() => {
                res.json({
                    saved: true,
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
