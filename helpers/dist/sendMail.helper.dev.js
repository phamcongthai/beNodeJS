"use strict";

var nodemailer = require('nodemailer');

module.exports.sendMail = function _callee(recieverEmail, subject, content) {
  var transporter, mailOptions;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.NODE_MAILER_EMAIL,
              pass: process.env.NODE_MAILER_PASS
            }
          });
          mailOptions = {
            from: process.env.NODE_MAILER_EMAIL,
            to: recieverEmail,
            subject: subject,
            html: content
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response); // do something useful
            }
          });

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};