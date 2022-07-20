const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserModel } = require("../../schemas/user");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.get("/incoming-requests", (req, res) => {
    const query = UserModel.findOne({ username: req.tokenData.username });

    try {
        query.exec((err, found) => {
            const userIds = [];

            found.incomingRequests.forEach((el) => {
                userIds.push(el["_id"].toString());
            });

            const users = UserModel.find({
                _id: {
                    $in: userIds,
                },
            });

            users.exec((err, reqs) => {
                reqs.forEach((el) => {
                    delete el.password;
                });

                res.json({
                    found: reqs,
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
