const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { UserModel, UserTextModel } = require("../schemas/user");
const { TokenModel } = require("../schemas/token");

const { fillAchievements } = require("./fillAchievements");

function generateAccessToken(username) {
    return jwt.sign({ username }, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
    });
}

router.post("/signUp", (req, res) => {
    const tokenQuery = TokenModel.findOne({ email: req.body.email });

    tokenQuery.exec((err, found) => {
        if (err) return HandleError(err);
        console.log(req.body.number, found.token);

        if (req.body.number == found.token) {
            const query = UserModel.findOne({ email: req.body.email });
            query.exec((err, found) => {
                if (err) return HandleError(err);

                console.log(found);

                if (!found) {
                    const user = new UserModel({
                        ...req.body,
                        texts: [],
                        achievements: fillAchievements(),
                    });
                    user.save().then((item) => {
                        const token = generateAccessToken(req.body.username);

                        res.json({
                            saved: true,
                            token: `Bearer ${token}`,
                            username: req.body.username,
                        });
                        console.log("data saved in DB");
                    });
                } else {
                    res.json({ saved: false });
                }
            });
        } else {
            res.json({ token: false });
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
