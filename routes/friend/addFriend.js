const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserModel } = require("../../schemas/user");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.post("/add", (req, res) => {
    const users = UserModel.findOne({ _id: req.body.userId });

    try {
        users.exec((err, found) => {
            found.incomingRequests.push(req.body.myId);

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
