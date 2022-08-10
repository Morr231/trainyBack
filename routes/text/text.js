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

    wordCount--;

    const newText = {
        ...req.body,
        wordCount: wordCount,
    };

    const user = UserModel.findOne({
        username: req.tokenData.username,
    }).populate("texts statistics daysTextCount");

    try {
        user.exec((err, found) => {
            if (err) return HandleError(err);

            if (found) {
                let foundTextIndex = -1;
                found.texts.forEach((el, index) => {
                    if (newText.topic === el.topic) {
                        foundTextIndex = index;
                    }
                });

                if (foundTextIndex === -1) {
                    const newTextModel = new UserTextModel(newText);

                    newTextModel.save().then((savedText) => {
                        found.texts.push(savedText["_id"]);

                        found.save().then((item) => {
                            const newStats = getStatistics([newText], item);

                            found.statistics.daysStreak = newStats.daysStreak;
                            found.statistics.fastestEssay =
                                newStats.fastestEssay;
                            found.statistics.longestEssay =
                                newStats.longestEssay;
                            found.statistics.averageWPM = newStats.averageWPM;
                            found.statistics.averageTime = newStats.averageTime;
                            found.statistics.averageWordCount =
                                newStats.averageWordCount;
                            found.statistics.dailyWordCount =
                                newStats.dailyWordCount;
                            found.statistics.dailyTime = newStats.dailyTime;

                            found.statistics.save().then((item) => {
                                res.json({
                                    saved: true,
                                    textId: savedText["_id"],
                                });
                                console.log("Text saved");
                            });
                        });
                    });
                } else {
                    imageUrl = found.texts[foundTextIndex].imageUrl;

                    let public_id = imageUrl.split("/");
                    public_id = public_id[public_id.length - 1].split(".")[0];

                    cloudinary.v2.uploader.destroy(public_id, (err, result) => {
                        console.log(err, result);
                    });

                    found.texts[foundTextIndex].regime = newText.regime;
                    found.texts[foundTextIndex].text = newText.text;
                    found.texts[foundTextIndex].topic = newText.topic;
                    found.texts[foundTextIndex].date = newText.date;
                    found.texts[foundTextIndex].finished = newText.finished;
                    found.texts[foundTextIndex].wordCount = newText.wordCount;
                    found.texts[foundTextIndex].timeSpend = newText.timeSpend;
                    found.texts[foundTextIndex].imageUrl = newText.imageUrl;

                    found.texts[foundTextIndex].save().then(() => {
                        console.log(found.texts[foundTextIndex]);

                        const newStats = getStatistics(found.texts, found);

                        found.statistics.daysStreak = newStats.daysStreak;
                        found.statistics.fastestEssay = newStats.fastestEssay;
                        found.statistics.longestEssay = newStats.longestEssay;
                        found.statistics.averageWPM = newStats.averageWPM;
                        found.statistics.averageTime = newStats.averageTime;
                        found.statistics.averageWordCount =
                            newStats.averageWordCount;
                        found.statistics.dailyWordCount =
                            newStats.dailyWordCount;
                        found.statistics.dailyTime = newStats.dailyTime;

                        found.statistics.save().then((item) => {
                            res.json({
                                saved: true,
                                textId: found.texts[foundTextIndex]["_id"],
                            });
                            console.log("Text saved");
                        });
                    });
                }
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
