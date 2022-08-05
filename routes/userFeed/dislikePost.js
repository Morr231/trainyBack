const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserModel } = require("../../schemas/user");
const { UserPostModel } = require("../../schemas/postSchema");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.post("/dislike", (req, res) => {
    const user = UserPostModel.findOne({
        _id: req.body.postId,
    });

    try {
        user.exec((e, found) => {
            if (req.body.likedBefore) {
                found.likes.whoLiked.splice(
                    found.likes.whoLiked.indexOf(req.body.userId)
                );
                found.likes.likesNumber--;
            }

            if (req.body.dislikePressed) {
                found.dislikes.dislikesNumber--;
                found.dislikes.whoDisliked.splice(
                    found.dislikes.whoDisliked.indexOf(req.body.userId)
                );
            } else {
                found.dislikes.dislikesNumber++;
                found.dislikes.whoDisliked.push(req.body.userId);
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
