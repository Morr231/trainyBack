const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
const { UserModel } = require("../schemas/user");

const validateToken = require("../middleware/validateToken");

router.all("*", [validateToken]);

router.post("/edit-profile", (req, res) => {
    const query = UserModel.findOne({ username: req.tokenData.username });

    query.exec((err, found) => {
        if (err) return handleError(err);

        let usernameChanged = false;

        if (req.body.name) {
            found.name = req.body.name;
        }

        if (req.body.surname) {
            found.surname = req.body.surname;
        }

        if (req.body.username) {
            found.username = req.body.username;
            usernameChanged = true;
        }

        if (req.body.email) {
            found.email = req.body.email;
        }

        if (req.body.description) {
            found.description = req.body.description;
        }

        found.save().then((item) => {
            res.json({
                saved: true,
                usernameChanged: usernameChanged,
                userChanged: true,
            });
            console.log("Text saved");
        });
    });
});

module.exports = router;
