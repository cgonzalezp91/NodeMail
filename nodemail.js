#!/usr/bin/env node

'use strict'
/* eslint new-cap: "off" */

const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const args = require('args')
const tableify = require('./modules/tools/html-tablefy')
const json2xls = require('json2xls')
const fs = require('fs')
const path = require('path')
const sendEmail = require('./modules/sendemail')
const getusers = require('./modules/dbquerys/getusers')
const anexo24aam = require('./modules/dbquerys/anexo24')
const anexo24aamexpo = require('./modules/dbquerys/anexo24aamexpo')
const { aamemail, testemail, configemail } = require('./config/keys')

clear()
console.log(
  chalk.green(
    figlet.textSync('Node Mail Server', { horizontalLayout: 'full' })
  )
)

let Opciones = {
  from: configemail.auth.user,
  to: '',
  cc: '',
  subject: 'Example',
  html: ''
}
const finalmessage = `<br><font>Este es un correo automatizado, favor de no responder</font><br><br>`
const inquirer = require('./modules/whattorun')

args
  .option('run', 'Run without asking questions')
  .option('debug', 'Testing mode (remplace email)')

const flags = args.parse(process.argv)

if (flags.debug) {
  console.log(
    chalk.yellow(
      figlet.textSync('Debug Mode', { horizontalLayout: 'default' })
    )
  )
}
const run = async () => {
  try {
    const credentials = await inquirer.askwhattorun()
    // console.log(credentials)
    if (credentials.Users === 'Y' || credentials.Users === 'y') {
      await sendusers()
    }
    if (credentials.AAMIMPO === 'Y' || credentials.AAMIMPO === 'y') {
      await aamImpo()
    }
    if (credentials.AAMEXPO === 'Y' || credentials.AAMEXPO === 'y') {
      await aamExpo()
    }
  } catch (ex) {
    console.log(ex.message)
  }
}

async function runall () {
  console.log(chalk.black.bgCyan.bold('Run Automatically!'))
  await sendusers()
  await aamImpo()
  await aamExpo()
}

if (flags.run) {
  runall()
} else {
  run()
}

async function sendusers () {
  console.log(chalk.blue(`Getting users from DB`))
  const usuarios = await getusers()
  const html = tableify(usuarios.recordset, {border: '1'})
  const mailOptions = Object.assign({}, Opciones)
  mailOptions.subject = 'Users Report'
  mailOptions.html = html + finalmessage
  await sendEmail.email(mailOptions)
}

async function aamImpo () {
  console.log(chalk.black.bgMagenta(`Getting Anexo24 Impo report from DB`))
  const beginmessage = `<br><font>Buen dia,</font><br><br> 
  <br><font>REPORTE DE ANEXO24 IMPO</font><br><br>`
  const middlemessage = `<br><font><strong>Reporte Adjunto</strong></font><br><br>`
  const anexo24 = await anexo24aam()
  let xls = json2xls(anexo24.recordset)
  let date = new Date().toISOString()
    .replace(/T.*/, '') // replace T with a space
  fs.writeFileSync(path.join(__dirname, `/reports/AAM ${date}Impo.xlsx`), xls, 'binary')
  // const html = tableify(anexo24.recordset, {border: '1'})
  const mailOptions = Object.assign({}, Opciones)
  mailOptions.subject = 'AAM MAQUILADORA MEXICO S DE RL DE CV ANEXO24 IMPO'
  debugMode(mailOptions)
  mailOptions.attachments = [{filename: `AAM ${date}Impo.xlsx`, path: path.join(__dirname, `/reports/AAM ${date}Impo.xlsx`)}]
  mailOptions.html = beginmessage + middlemessage + finalmessage
  await sendEmail.email(mailOptions)
}

async function aamExpo () {
  console.log(chalk.black.bgWhite(`Getting Anexo24 Expo report from DB`))
  const beginmessage = `<br><font>Buen dia,</font><br><br> 
  <br><font>REPORTE DE ANEXO24 EXPO</font><br><br>`
  const middlemessage = `<br><font><strong>Reporte Adjunto</strong></font><br><br>`
  const anexo24 = await anexo24aamexpo()
  let xls = json2xls(anexo24.recordset)
  let date = new Date().toISOString()
    .replace(/T.*/, '') // replace T with a space
  fs.writeFileSync(path.join(__dirname, `/reports/AAM ${date}Expo.xlsx`), xls, 'binary')
  // const html = tableify(anexo24.recordset, {border: '1'})
  const mailOptions = Object.assign({}, Opciones)
  mailOptions.subject = 'AAM MAQUILADORA MEXICO S DE RL DE CV ANEXO24 EXPO'
  debugMode(mailOptions)
  mailOptions.attachments = [{filename: `AAM ${date}Expo.xlsx`, path: path.join(__dirname, `/reports/AAM ${date}Expo.xlsx`)}]
  mailOptions.html = beginmessage + middlemessage + finalmessage
  await sendEmail.email(mailOptions)
}

function debugMode (mailOptions) {
  if (flags.debug) {
    return mailOptions.to = testemail.email
  } else {
    // mailOptions.cc += 'tatiana.valdez@aacab.com.mx;'
    // return mailOptions.to = aamemail.email
  }
}
