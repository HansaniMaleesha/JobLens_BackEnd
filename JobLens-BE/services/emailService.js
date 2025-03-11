const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS }
});

const sendEmail = async (email) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Your Application is Under Review",
        text: "Dear Applicant, your CV is under review. We will get back to you soon.",
    });
};

module.exports = { sendEmail };
