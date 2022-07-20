const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserModel } = require("../../schemas/user");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.post("/skip", (req, res) => {
    const query = UserModel.findOne({ _id: req.body.userId });

    try {
        query.exec((err, found) => {
            found.followers.push(req.body.userId);

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
