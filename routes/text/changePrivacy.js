const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserTextModel } = require("../../schemas/userTextSchema");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.post("/change-privacy", (req, res) => {
    const text = UserTextModel.findOne({ _id: req.body.text });

    try {
        text.exec((e, found) => {
            found.privacy = req.body.privacy;

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
