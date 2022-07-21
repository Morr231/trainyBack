const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = (text, email, emailSubject) => {
    console.log(process.env.MY_EMAIL, process.env.MY_PASSWORD);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.MY_PASSWORD,
        },
    });

    console.log(email);

    const mailOptions = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: emailSubject,
        text: text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};

exports.sendMail = sendMail;
