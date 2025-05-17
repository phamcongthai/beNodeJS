const nodemailer = require('nodemailer');

module.exports.sendMail = async (recieverEmail, subject, content) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODE_MAILER_EMAIL,
            pass: process.env.NODE_MAILER_PASS
        }
    });

    const mailOptions = {
        from: process.env.NODE_MAILER_EMAIL,
        to: recieverEmail,
        subject: subject,
        html: content
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });
}