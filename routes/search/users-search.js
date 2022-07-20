const express = require("express");
const router = express.Router();
require("dotenv").config();

const { UserModel } = require("../../schemas/user");

const validateToken = require("../../middleware/validateToken");
router.all("*", [validateToken]);

router.post("/search-users", (req, res) => {
    const query = UserModel.find();

    console.log(req.body.userId);

    try {
        query.exec((err, found) => {
            const filterFound = found.filter((el) => {
                const userName = el.name.toLocaleLowerCase();
                const userSurname = el.surname.toLocaleLowerCase();

                const searchName = req.body.search.toLocaleLowerCase();

                if (req.body.userId !== el["_id"].toString()) {
                    return (
                        userName.includes(searchName) ||
                        userSurname.includes(searchName)
                    );
                }
            });
            const sortFound = filterFound.sort();

            sortFound.forEach((el) => {
                delete el.password;
            });

            res.json({
                found: sortFound,
            });
        });
    } catch (e) {
        res.json({
            found: [],
        });
    }
});

module.exports = router;
