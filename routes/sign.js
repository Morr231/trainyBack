const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { UserModel } = require("../schemas/user");
const { TokenModel } = require("../schemas/token");

const { UserAchievementModel } = require("../schemas/achievementSchema");
const { UserStatsModel } = require("../schemas/statsSchema");
const { UserDatesModel } = require("../schemas/dateSchema");

const { fillAchievements } = require("./fillAchievements");

function generateAccessToken(username) {
    return jwt.sign({ username }, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
    });
}

router.post("/signUp", (req, res) => {
    const tokenQuery = TokenModel.findOne({ email: req.body.email });

    try {
        tokenQuery.exec((err, found) => {
            if (req.body.number == found.token) {
                const query = UserModel.findOne({ email: req.body.email });

                query.exec((err, found) => {
                    if (!found) {
                        const stats = new UserStatsModel();
                        const dates = new UserDatesModel();
                        const achievements = new UserAchievementModel();

                        achievements.achievements = fillAchievements();

                        stats.save();
                        dates.save();

                        achievements.save().then((userAchievements) => {
                            const user = new UserModel({
                                ...req.body,
                                statistics: stats["_id"],
                                daysTextCount: dates["_id"],
                                achievements: userAchievements["_id"],
                            });

                            user.save().then((item) => {
                                const token = generateAccessToken(
                                    req.body.username
                                );

                                res.json({
                                    saved: true,
                                    token: `Bearer ${token}`,
                                    username: req.body.username,
                                });
                                console.log("data saved in DB");
                            });
                        });
                    } else {
                        res.json({ saved: false });
                    }
                });
            } else {
                res.json({ token: false });
            }
        });
    } catch (e) {
        res.json({
            saved: false,
        });
    }
});

router.post("/signIn", (req, res) => {
    const query = UserModel.findOne({ email: req.body.email });

    try {
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
    } catch (e) {
        res.json({
            saved: false,
        });
    }
});

module.exports = router;
