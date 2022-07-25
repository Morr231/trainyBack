const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserTextModel } = require("../../schemas/userTextSchema");
const { UserCommentModel } = require("../../schemas/commentSchema");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.post("/comment/:id", (req, res) => {
    const query = UserTextModel.findOne({ _id: req.params["id"] });

    try {
        query.exec((err, found) => {
            const comment = {
                text: req.body.text,
                date: req.body.date,
                user: req.body.user,
                startPosition: req.body.startPosition,
                endPosition: req.body.endPosition,
                yPos: req.body.yPos,
            };

            const newComment = new UserCommentModel(comment);

            newComment.save().then((item) => {
                found.comments.push(item["_id"]);

                found.save().then(() => {
                    res.json({
                        saved: true,
                    });
                });
            });
        });
    } catch (e) {
        res.json({
            saved: false,
        });
    }
});

module.exports = router;
