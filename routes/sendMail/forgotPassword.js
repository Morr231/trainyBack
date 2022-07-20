const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserModel } = require("../../schemas/user");

const { sendMail } = require("../../mail/user-verification");

router.post("/forgot-password", (req, res) => {
    const query = UserModel.findOne({ email: req.body.email });

    query.exec((err, found) => {
        if (err) HandleError(err);

        if (found) {
            const numbers = "0123456789";

            const chars =
                "abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let password = "";

            for (let i = 0; i <= 5; i++) {
                let randomNumber = Math.floor(Math.random() * chars.length);
                password += chars.substring(randomNumber, randomNumber + 1);
            }

            for (let i = 0; i <= 5; i++) {
                let randomNumber = Math.floor(Math.random() * numbers.length);
                password += numbers.substring(randomNumber, randomNumber + 1);
            }

            sendMail(
                `Random password: ${password}`,
                req.body.email,
                "Your temporary trainy password"
            );

            found.password = password;

            found.save().then(() => {
                res.json({ found: true });
            });
        } else {
            res.json({ found: false });
        }
    });
});

module.exports = router;
