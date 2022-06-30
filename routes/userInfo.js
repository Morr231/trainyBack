const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
const { UserModel } = require("../schemas/user");

const validateToken = require("../middleware/validateToken");

router.all("*", [validateToken]);

router.get("/data", (req, res) => {
    const query = UserModel.findOne({ username: req.tokenData.username });

    query.exec((err, found) => {
        if (err) return handleError(err);

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
            res.json({
                userInfo: found,
            });
        });
    });
});

module.exports = router;
