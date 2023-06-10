const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

exports.sendEmail = asyncHandler(async (data, req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: process.env.MAIL,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.htm,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});
