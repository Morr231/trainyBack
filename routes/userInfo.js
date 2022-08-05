const express = require("express");
const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.REACT_APP_CLOUDINARY_NAME,
    api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
    api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
});

const router = express.Router();

const { UserModel } = require("../schemas/user");
const { UserDatesModel } = require("../schemas/dateSchema");
const { UserTextModel } = require("../schemas/userTextSchema");

const validateToken = require("../middleware/validateToken");

router.all("*", [validateToken]);

router.get("/my-data", (req, res) => {
    UserModel.findOne({
        username: req.tokenData.username,
    })
        .populate("achievements posts texts")
        .exec((err, found) => {
            if (err) return HandleError(err);

            const calendarValues = [];

            const texts = UserTextModel.find({
                _id: {
                    $in: found.texts,
                },
            });

            texts.exec((err, allText) => {
                allText.forEach((el) => {
                    const elDate = `${el.date.getFullYear()}-${Math.floor(
                        (el.date.getMonth() + 1) / 10
                    )}${
                        Math.floor(el.date.getMonth() + 1) % 10
                    }-${el.date.getDate()}`;

                    let valIndex = -1;

                    calendarValues.forEach((val, index) => {
                        if (val.date === elDate) {
                            valIndex = index;
                        }
                    });

                    if (valIndex !== -1) {
                        calendarValues[valIndex].count++;
                    } else {
                        calendarValues.push({ date: elDate, count: 1 });
                    }
                });

                let maxValue = -1;

                calendarValues.forEach((el) => {
                    if (el.count > maxValue) {
                        maxValue = el.count;
                    }
                });

                calendarValues.forEach((el) => {
                    el.count = Math.floor((el.count / maxValue) * 4);
                    if (el.count === 0) {
                        el.count = 1;
                    }
                });

                const newDates = new UserDatesModel();
                newDates.dates = calendarValues;

                newDates.save().then((dates) => {
                    found.daysTextCount = dates["_id"];

                    found.save().then((done) => {
                        let newDone = { ...done }._doc;

                        delete newDone.password;
                        delete newDone.daysTextCount;

                        newDone.daysTextCount = calendarValues;

                        res.json({
                            userInfo: newDone,
                        });
                    });
                });
            });
        });
});

router.post("/update-photo", (req, res) => {
    const query = UserModel.findOne({ username: req.tokenData.username });

    console.log("Hello");

    query.exec((err, found) => {
        if (err) return handleError(err);

        if (found.imageUrl) {
            let public_id = found.imageUrl.split("/");
            public_id = public_id[public_id.length - 1].split(".")[0];

            cloudinary.v2.uploader.destroy(public_id, (err, result) => {
                console.log(err, result);
            });
        }
        found.imageUrl = req.body.imageUrl;

        found.save().then(() => {
            res.json({
                saved: true,
            });
        });
    });
});

module.exports = router;
