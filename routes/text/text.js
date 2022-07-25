const express = require("express");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.REACT_APP_CLOUDINARY_NAME,
    api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
    api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
});

const { UserModel } = require("../../schemas/user");
const { UserTextModel } = require("../../schemas/userTextSchema");
const { UserStatsModel } = require("../../schemas/statsSchema");

const validateToken = require("../../middleware/validateToken");
const getStatistics = require("../../helper/getStatistics");

const router = express.Router();

router.all("*", [validateToken]);

router.post("/save", (req, res) => {
    let wordCount = 0;

    const textFromUser = req.body.text.split(" ");

    for (let i = 0; i < textFromUser.length; i++) {
        if (textFromUser !== " ") {
            wordCount++;
        }
    }

    const newText = {
        ...req.body,
        wordCount: wordCount,
    };

    const user = UserModel.findOne({
        username: req.tokenData.username,
    });

    try {
        user.exec((err, found) => {
            if (err) return HandleError(err);

            if (found) {
                let foundTextIndex = -1;

                const texts = UserTextModel.find({
                    _id: {
                        $in: found.texts,
                    },
                });

                texts.exec(async (err, allTexts) => {
                    allTexts.forEach((el, index) => {
                        if (newText.topic === el.topic) {
                            foundTextIndex = index;
                        }
                    });

                    if (foundTextIndex === -1) {
                        const newTextModel = new UserTextModel(newText);

                        newTextModel.save().then(() => {
                            found.texts.push(newTextModel["_id"]);

                            found.save().then((item) => {
                                const userStats = UserStatsModel.findOne({
                                    _id: found.statistics,
                                });

                                userStats.exec((err, allStats) => {
                                    const newStats = getStatistics(
                                        [newText],
                                        item
                                    );

                                    allStats.daysStreak = newStats.daysStreak;
                                    allStats.fastestEssay =
                                        newStats.fastestEssay;
                                    allStats.longestEssay =
                                        newStats.longestEssay;
                                    allStats.averageWPM = newStats.averageWPM;
                                    allStats.averageTime = newStats.averageTime;
                                    allStats.averageWordCount =
                                        newStats.averageWordCount;
                                    allStats.dailyWordCount =
                                        newStats.dailyWordCount;
                                    allStats.dailyTime = newStats.dailyTime;

                                    allStats.save().then((item) => {
                                        res.json({
                                            saved: true,
                                            textId: newTextModel["_id"],
                                        });
                                        console.log("Text saved");
                                    });
                                });
                            });
                        });
                    } else {
                        imageUrl = allTexts[foundTextIndex].imageUrl;

                        let public_id = imageUrl.split("/");
                        public_id =
                            public_id[public_id.length - 1].split(".")[0];

                        cloudinary.v2.uploader.destroy(
                            public_id,
                            (err, result) => {
                                console.log(err, result);
                            }
                        );

                        allTexts[foundTextIndex].regime = newText.regime;
                        allTexts[foundTextIndex].text = newText.text;
                        allTexts[foundTextIndex].topic = newText.topic;
                        allTexts[foundTextIndex].date = newText.date;
                        allTexts[foundTextIndex].finished = newText.finished;
                        allTexts[foundTextIndex].wordCount = newText.wordCount;
                        allTexts[foundTextIndex].timeSpend = newText.timeSpend;
                        allTexts[foundTextIndex].imageUrl = newText.imageUrl;

                        allTexts[foundTextIndex].save().then(() => {
                            const userStats = UserStatsModel.findOne({
                                _id: found.statistics,
                            });

                            userStats.exec((err, allStats) => {
                                const newStats = getStatistics(allTexts, found);

                                allStats.daysStreak = newStats.daysStreak;
                                allStats.fastestEssay = newStats.fastestEssay;
                                allStats.longestEssay = newStats.longestEssay;
                                allStats.averageWPM = newStats.averageWPM;
                                allStats.averageTime = newStats.averageTime;
                                allStats.averageWordCount =
                                    newStats.averageWordCount;
                                allStats.dailyWordCount =
                                    newStats.dailyWordCount;
                                allStats.dailyTime = newStats.dailyTime;

                                allStats.save().then((item) => {
                                    res.json({
                                        saved: true,
                                        textId: allTexts[foundTextIndex]["_id"],
                                    });
                                    console.log("Text saved");
                                });
                            });
                        });
                    }
                });
            } else {
                res.json({ saved: false });
            }
        });
    } catch (e) {
        res.json({
            saved: false,
        });
    }
});

router.delete("/delete/:id", (req, res) => {
    const user = UserModel.findOne({
        username: req.tokenData.username,
    }).populate("texts");

    user.exec(async (err, found) => {
        if (err) return HandleError(err);

        if (found) {
            const deletingId = req.params.id;

            let deletingIndex = -1;
            let deletingText = {};

            found.texts.forEach((el, index) => {
                if (el["_id"].toString() === deletingId) {
                    deletingIndex = index;
                    deletingText = el;
                }
            });

            let imageUrl = deletingText.imageUrl;

            let public_id = imageUrl.split("/");
            public_id = public_id[public_id.length - 1].split(".")[0];

            cloudinary.v2.uploader.destroy(public_id, (err, result) => {
                console.log(err, result);
            });

            found.texts.splice(deletingIndex);
            await UserTextModel.deleteOne({ _id: deletingId });

            found.save().then((item) => {
                const userStats = UserStatsModel.findOne({
                    _id: found.statistics,
                });

                userStats.exec((err, allStats) => {
                    const newStats = getStatistics(found.texts, found);

                    allStats.daysStreak = newStats.daysStreak;
                    allStats.fastestEssay = newStats.fastestEssay;
                    allStats.longestEssay = newStats.longestEssay;
                    allStats.averageWPM = newStats.averageWPM;
                    allStats.averageTime = newStats.averageTime;
                    allStats.averageWordCount = newStats.averageWordCount;
                    allStats.dailyWordCount = newStats.dailyWordCount;
                    allStats.dailyTime = newStats.dailyTime;

                    allStats.save().then((item) => {
                        res.json({ saved: true });
                        console.log("Text saved");
                    });
                });
            });
        } else {
            res.json({ deleted: false });
        }
    });
});

module.exports = router;
