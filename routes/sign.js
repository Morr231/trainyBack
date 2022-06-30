const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { UserModel, UserTextModel } = require("../schemas/user");

function generateAccessToken(username) {
    return jwt.sign({ username }, process.env.TOKEN_SECRET, {
        expiresIn: "1800s",
    });
}

router.post("/signUp", (req, res) => {
    const query = UserModel.findOne({ email: req.body.email });
    query.exec((err, found) => {
        if (err) return HandleError(err);

        if (!found) {
            const user = new UserModel({ ...req.body, texts: [] });
            user.save().then((item) => {
                const token = generateAccessToken(found.username);

                res.json({
                    saved: true,
                    token: `Bearer ${token}`,
                    username: found.username,
                });
                console.log("data saved in DB");
            });
        } else {
            res.json({ saved: false });
        }
    });
});

router.post("/signIn", (req, res) => {
    const query = UserModel.findOne({ email: req.body.email });
    query.exec((err, found) => {
        if (err) return HandleError(err);
        if (found && found.password === req.body.password) {
            const token = generateAccessToken(found.username);

            res.json({
                found: true,
                token: `Bearer ${token}`,
                username: found.username,
            });
        } else {
            res.json({ found: false });
        }
    });
});

module.exports = router;
