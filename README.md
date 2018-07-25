# Node Mail Server

This is a command line interface app in nodejs made to query a DB in mssql server with the help of the module [mssql](https://www.npmjs.com/package/mssql) and send the receiving data through email with the help of [nodemailer](https://nodemailer.com/about/).

## Usage

First of all you need to install the dependencies

```
npm install
```
### Pretty Console
We use this modules to make the console more pretty
```js
const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const args = require('args')
```

You can see more about them in their respective documentations 
 * [chalk](https://www.npmjs.com/package/chalk)
 * [clear](https://www.npmjs.com/package/clear)
 * [figlet](https://www.npmjs.com/package/figlet)
 * [args](https://www.npmjs.com/package/args)

### Data
The receiving data from the DB can be send in 2 ways (the data always come in json format).


 1. Transform the json to an html table and send the email in html format, this is better if the data doesn't have to many columns
 2. If there are to many columns is better to transform the data in an .xls file to open it by Excel (by defualt the file name is the date of when is created, i suggest to add some extra comment to identify mutiple file).

### Database Queries
We use a SQL Server database to stroage and bring data form the DB, with the help of the module [mssql](https://www.npmjs.com/package/mssql)

Inside the folder modules/dbquerys you need to define a module to make the query to the db an export this module, you can see the `getusers.js` as an example


### Config File
You need to add a file inside the config folder preferably with the name of `keys.js`
Inside this file you need to include in json format the credentials to the DB `configdb`, the credentials of the email `configemail` and if you like and another groups of emails so you can acceses all the diferente groups
Example

```js

module.exports = {
    configdb: {
        user: 'dbuser',
        password: 'dbpass',
        server: 'port', // You can use 'localhost\\instance' to connect to named instance
        database: 'database name',

        options: {
            encrypt: false // Use this if you're on Windows Azure, this is required in new versions
        }
    },

    configemail: {   
        host: 'smtp.example.com',
        port: '587',
        secure: false,
        auth: {
            user: 'username@domaine.com', // generated ethereal user
            pass: 'password' // generated ethereal password
        }
    },
    aamemail: {   
        email: 'oneemail@domaine.com; secondeemaile@domaine.com'        
    },
    testemail: {   
        email: 'cgonzalezp91@gmail.com;'        
    }
}

```
### Asking Questions (What to Run?)
By defualt this cli is made to ask if you want to run the respective query (for testing propuse), you can define this inside `modules/whattorun.js` this with the help of [inquirer](https://www.npmjs.com/package/inquirer)

```js
const inquirer = require('inquirer')
module.exports = {

  askwhattorun: () => {
    const questions = [
      {
        name: 'Users',
        type: 'input',
        message: 'Run Users?(N/Y):',
        validate: value => {
          if (value === 'N' || value === 'Y' || value === 'y' || value === 'n') {
            return true
          } else {
            return 'Please select N for no and Y for yes.'
          }
        }
      },
      {
        name: 'Example',
        type: 'input',
        message: 'Run Example?(N/Y):',
        validate: value => {
          if (value === 'N' || value === 'Y' || value === 'y' || value === 'n') {
            return true
          } else {
            return 'Please select N for no and Y for yes.'
          }
        }
      },
      
    ]
    return inquirer.prompt(questions)
  }
}

```

The main idea is that you can select between Y or N so the program can know with queries is going to run and send the data in a email.

### Args Usage
The app is prepared to receive 2 flags with the help of [args](https://www.npmjs.com/package/args)
 * -d or -debug, this flag is made to replace all the existing emails with the one you denied by the test.
 * -r or -run, this flag is made to run without asking any question all the functions and send them (the propuse of this is to automatically run the program by some task manager and send every reports that you denifed)
Also you can send 2 extra flags
 * -h or -help to see al the flags that you can use
 * -v or -version to see the version of the program
This 2 are automatically created by `args`

### Main File (nodemail)

The `nodemail.js` is the main file wich run all the reports and send the emails with the help of the `modules/sendemail.js`
in this file you can see 2 main functions `run` and `runall` the run function is the one who ask questions and depending on the responce resived by the user, send the email or not.

```js
const run = async () => {
  try {
    const credentials = await inquirer.askwhattorun()
    // console.log(credentials)
    if (credentials.Users === 'Y' || credentials.Users === 'y') {
      await sendusers()
    }
  } catch (ex) {
    console.log(ex.message)
  }
}

```
The runall is made to run everything inside without asking questions (task manager)

```js
async function runall () {
  console.log(chalk.black.bgCyan.bold('Run Automatically!'))
  await sendusers()
}
```

Inside this 2 functions you define all the functions that is going to make the query and send de email 
This example send the data in an html table 

```js

async function sendusers () {
  console.log(chalk.blue(`Getting users from DB`))
  const usuarios = await getusers()
  const html = tableify(usuarios.recordset, {border: '1'})
  const mailOptions = Object.assign({}, Opciones)
  mailOptions.subject = 'Users Report'
  mailOptions.html = html
  await sendEmail.email(mailOptions)
}
```

### From JSON to HTML Table

The `tableify` function is a module that transfor the json to an html, this is the module in npm [html-tableify](https://github.com/ly-tools/html-tableify) but i adapted the code for a more looking good table, thats why you can found the module inside `modules/tools/html-tablefy.js`
So you just need to import the function from the local file

```js
const tableify = require('./modules/tools/html-tablefy')
```

### JSON to XLS
With the help of the module [json2xls](https://www.npmjs.com/package/json2xls) we can send an Excel file with the data, this options is when you have a lot of columns inside your query and the html is not an option.
You need to impor the following modules to use this option

```js
const json2xls = require('json2xls')
const fs = require('fs')
const path = require('path')
```
After importing this modules we can use a function like this
```js
async function sendusersfile () {
  console.log(chalk.black.bgMagenta(`Getting users from DB`))
  const usuarios = await getusers()
  let xls = json2xls(usuarios.recordset)
  let date = new Date().toISOString()
    .replace(/T.*/, '') // replace T and everything after with empty
  fs.writeFileSync(path.join(__dirname, `/reports/${date}.xlsx`), xls, 'binary')
  const mailOptions = Object.assign({}, Opciones)
  mailOptions.subject = 'Users Report'
  mailOptions.attachments = [{filename: `${date}.xlsx`, path: path.join(__dirname, `/reports/${date}.xlsx`)}]
  mailOptions.html = 'Report goes attached'
  await sendEmail.email(mailOptions)
}
```
We use the `let date` to check the current date and that date to the file name.
The `mailOptions` object is what the nodemailer ask for us to send it by parameters, we construct a default mailOption and use this as a template creating new objects with `Object.assign` and modificating what we need

### EMAIL
Finally we use [nodemailer](https://nodemailer.com/about/) to send the data, we have a module inside `modules/sendemail.js` that we use to use nodemailer passing the parameters that is needed to send the email
