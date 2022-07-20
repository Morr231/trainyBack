const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
const { UserModel } = require("../schemas/user");

const validateToken = require("../middleware/validateToken");

router.all("*", [validateToken]);

router.post("/first-enter", (req, res) => {
    console.log("Hello");

    const query = UserModel.findOne({ username: req.tokenData.username });

    query.exec((err, found) => {
        if (err) return handleError(err);

        found.firstEnter = false;

        found.save().then((item) => {
            delete found.password;
            res.json({ userInfo: found });
            console.log("Text saved");
        });
    });
});

module.exports = router;
