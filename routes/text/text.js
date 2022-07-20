const express = require("express");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.REACT_APP_CLOUDINARY_NAME,
    api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
    api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
});

const { UserModel } = require("../..//schemas/user");

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

    const user = UserModel.findOne({ username: req.tokenData.username });

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
                found.texts.push(newText);
            } else {
                imageUrl = found.texts[foundTextIndex].imageUrl;

                let public_id = imageUrl.split("/");
                public_id = public_id[public_id.length - 1].split(".")[0];

                cloudinary.v2.uploader.destroy(public_id, (err, result) => {
                    console.log(err, result);
                });

                found.texts[foundTextIndex] = newText;
            }

            found.save().then((item) => {
                if (foundTextIndex !== -1) {
                    found.statistics = getStatistics(found, item);

                    found.save().then((item) => {
                        res.json({ saved: true });
                        console.log("Text saved");
                    });
                }
            });
        } else {
            res.json({ saved: false });
        }
    });
});

router.delete("/delete/:id", (req, res) => {
    const user = UserModel.findOne({ username: req.tokenData.username });

    user.exec((err, found) => {
        if (err) return HandleError(err);

        if (found) {
            const deletingIndex = req.params.id;

            imageUrl = found.texts[deletingIndex].imageUrl;

            let public_id = imageUrl.split("/");
            public_id = public_id[public_id.length - 1].split(".")[0];

            cloudinary.v2.uploader.destroy(public_id, (err, result) => {
                console.log(err, result);
            });

            found.texts.splice(deletingIndex, 1);

            found.save().then((item) => {
                found.statistics = getStatistics(found, item);

                found.save().then((item) => {
                    res.json({ deleted: true });
                });
            });
        } else {
            res.json({ deleted: false });
        }
    });
});

module.exports = router;
