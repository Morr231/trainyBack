const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

const { UserModel } = require("../schemas/user");
const { UserAchievementModel } = require("../schemas/achievementSchema");

const validateToken = require("../middleware/validateToken");

router.all("*", [validateToken]);

router.post("/achieve", (req, res) => {
    const query = UserModel.findOne({
        username: req.tokenData.username,
    });

    try {
        query.exec((err, found) => {
            const achievementsQuery = UserAchievementModel.findOne({
                _id: found.achievements,
            });

            achievementsQuery.exec((err, allAchievements) => {
                allAchievements.achievements.forEach((el, index) => {
                    if (
                        el.title.toLowerCase() === req.body.title.toLowerCase()
                    ) {
                        achievementIndex = index;
                    }
                });

                const achievement =
                    allAchievements.achievements[achievementIndex];

                if (!achievement.achieved) {
                    achievement.achieved = true;
                    achievement.achievedTime = req.body.achievedTime;

                    allAchievements.save().then((item) => {
                        res.json({ exists: false });
                    });
                } else {
                    res.json({ exists: true });
                }
            });
        });
    } catch (e) {
        res.json({
            saved: false,
        });
    }
});

module.exports = router;
