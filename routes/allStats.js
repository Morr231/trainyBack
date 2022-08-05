const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

const { UserStatsModel } = require("../schemas/statsSchema");

const validateToken = require("../middleware/validateToken");

router.all("*", [validateToken]);

router.get("/all-stats/:id", (req, res) => {
    const query = UserStatsModel.findOne({ _id: req.params["id"] });

    try {
        query.exec((err, found) => {
            console.log(found["_id"]);

            res.json({ found: found });
        });
    } catch (e) {
        res.json({
            found: [],
        });
    }
});

module.exports = router;
