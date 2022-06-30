const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
    const authHeader = req.headers["autorization"];

    const token = authHeader ? authHeader.split(" ")[1] : null;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.tokenData = decoded;
        next();
    });
};

module.exports = validateToken;
