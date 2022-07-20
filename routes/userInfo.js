const express = require("express");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.REACT_APP_CLOUDINARY_NAME,
    api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
    api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
});

const router = express.Router();
const { UserModel } = require("../schemas/user");

const validateToken = require("../middleware/validateToken");

router.all("*", [validateToken]);

router.get("/data", (req, res) => {
    const query = UserModel.findOne({ username: req.tokenData.username });

    query.exec((err, found) => {
        if (err) return HandleError(err);

        const calendarValues = [];

        found.texts.forEach((el) => {
            const elDate = `${el.date.getFullYear()}-${Math.floor(
                (el.date.getMonth() + 1) / 10
            )}${Math.floor(el.date.getMonth() + 1) % 10}-${el.date.getDate()}`;

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

        found.daysTextCount = calendarValues;

        found.save().then((err, done) => {
            delete found.password;
            res.json({
                userInfo: found,
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
