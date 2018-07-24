'use strict'
const nodemailer = require('nodemailer')
const chalk = require('chalk')
const { configemail } = require('../config/keys')

module.exports = {
  email: (mailOptionsp) => {
    let transporter = nodemailer.createTransport(configemail)

    let mailOptions = mailOptionsp
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      } else {
        console.log(chalk.green('Message sent: %s', info.messageId))
        return console.log(chalk.blue('Message sent: %s', info.response))
      }
    })
  }
}

// async function sendEmail(mailOptionsp) {
//     let transporter = nodemailer.createTransport(configemail);

//     let mailOptions = mailOptionsp
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         else {
//             return console.log(chalk.green('Message sent: %s', info.messageId))
//         }
//     });
// }

// module.exports = sendEmail
