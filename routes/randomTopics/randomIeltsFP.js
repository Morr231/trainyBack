const express = require("express");
const router = express.Router();
const { IeltsFPModel } = require("../../schemas/IeltsFirstPart");
require("dotenv").config();

// const validateToken = require("../middleware/validateToken");

// router.all("*", [validateToken]);

router.get("/randomIeltsFPTopic", (req, res) => {
    const query = IeltsFPModel.find({});
    query.exec((err, found) => {
        if (err) return handleError(err);

        const randomTopics = [];

        for (let i = 0; i < 5; i++) {
            randomTopics.push(found[Math.floor(Math.random() * found.length)]);
        }
        res.json({
            randomTopics: randomTopics,
        });
    });
});

module.exports = router;
