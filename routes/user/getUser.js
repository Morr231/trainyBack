const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserModel } = require("../../schemas/user");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.get("/other/:id", (req, res) => {
    const query = UserModel.findOne({ username: req.params["id"] }).populate(
        "texts daysTextCount statistics achievements"
    );

    try {
        query.exec((err, found) => {
            console.log(found);

            if (found) {
                let newFound = { ...found }._doc;

                let tempDays = newFound.daysTextCount;
                delete newFound.daysTextCount;

                newFound.daysTextCount = tempDays.dates;
                res.json({
                    found: newFound,
                });
            } else {
                res.json({
                    found: null,
                });
            }
        });
    } catch (e) {
        res.json({
            found: null,
        });
    }
});

module.exports = router;
