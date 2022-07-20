const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserModel } = require("../../schemas/user");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.post("/accept", (req, res) => {
    const users = UserModel.find({
        _id: {
            $in: [req.body.userId, req.body.myId],
        },
    });

    try {
        users.exec((err, found) => {
            const acceptingUser = found.filter(
                (el) => el["_id"].toString() === req.body.myId
            )[0];
            const sendingUser = found.filter(
                (el) => el["_id"].toString() === req.body.userId
            )[0];

            acceptingUser.incomingRequests.splice(
                acceptingUser.incomingRequests.indexOf(req.body.userId),
                1
            );

            sendingUser.friends.push(req.body.myId);
            acceptingUser.friends.push(req.body.userId);

            sendingUser.save();
            acceptingUser.save().then(() => {
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
