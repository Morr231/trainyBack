const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserPostCommentModel } = require("../../schemas/postCommentSchema");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.post("/get-comments", (req, res) => {
    const user = UserPostCommentModel.find({
        _id: req.body.comments,
    }).populate("user");

    try {
        user.exec((e, found) => {
            const users = [];

            found.forEach((el) => {
                users.push({
                    name: el.user.name,
                    surname: el.user.surname,
                    username: el.user.username,
                    imageUrl: el.user.imageUrl,
                    userId: el.user["_id"],
                });
            });

            delete found.user;

            res.json({
                found: found,
                users: users,
            });
        });
    } catch (e) {
        res.json({
            found: [],
        });
    }
});

module.exports = router;
