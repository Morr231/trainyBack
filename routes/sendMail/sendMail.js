const express = require("express");
const router = express.Router();
require("dotenv").config();

const { TokenModel } = require("../../schemas/token");

const { sendMail } = require("../../mail/user-verification");

router.post("/send-email", (req, res) => {
    const query = TokenModel.findOne({ email: req.body.email });

    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    sendMail(
        `Random number: ${randomNumber}`,
        req.body.email,
        "Verify your trainy account!"
    );

    query.exec((err, found) => {
        if (err) return HandleError(err);

        console.log(randomNumber);

        if (!found) {
            const emailToken = new TokenModel();

            emailToken.email = req.body.email;
            emailToken.token = randomNumber;

            emailToken.save().then(() => {
                res.json({
                    saved: true,
                });
            });
        } else {
            found.token = randomNumber;
            found.save().then((item) => {
                console.log(item);
                res.json({
                    saved: true,
                });
            });
        }
    });
});

module.exports = router;
