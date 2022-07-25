const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserTextModel } = require("../../schemas/userTextSchema");
const { UserCommentModel } = require("../../schemas/commentSchema");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.get("/all-comments/:id", (req, res) => {
    const query = UserTextModel.findOne({ _id: req.params["id"] }).populate(
        "comments"
    );

    try {
        query.exec((err, found) => {
            const allCommentIds = [];

            found.comments.forEach((el) => {
                allCommentIds.push(el["_id"]);
            });

            // const users = UserModel.find({
            //     _id: {
            //         $in: userIds,
            //     },
            // });

            const allComments = UserCommentModel.find({
                _id: {
                    $in: allCommentIds,
                },
            }).populate("user");

            allComments.exec((err, comments) => {
                console.log(err, comments);

                const filteredUsers = [];

                comments.forEach((el) => {
                    filteredUsers.push({
                        id: el.user["_id"],
                        name: el.user.name,
                        surname: el.user.surname,
                        imageUrl: el.user.imageUrl,
                    });
                });

                console.log(found);

                res.json({
                    found: found.comments,
                    users: filteredUsers,
                });
            });
        });
    } catch (e) {
        res.json({
            found: [],
        });
    }
});

module.exports = router;
