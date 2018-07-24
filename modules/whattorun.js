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
        name: 'AAMIMPO',
        type: 'input',
        message: 'Run Anexo24 AAM IMPO?(N/Y):',
        validate: value => {
          if (value === 'N' || value === 'Y' || value === 'y' || value === 'n') {
            return true
          } else {
            return 'Please select N for no and Y for yes.'
          }
        }
      },
      {
        name: 'AAMEXPO',
        type: 'input',
        message: 'Run Anexo24 AAM EXPO?(N/Y):',
        validate: value => {
          if (value === 'N' || value === 'Y' || value === 'y' || value === 'n') {
            return true
          } else {
            return 'Please select N for no and Y for yes.'
          }
        }
      }
    ]
    return inquirer.prompt(questions)
  }
}
