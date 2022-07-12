// Required packages
const mysql = require('mysql2');
const inquirer = require('inquirer'); // Version inquirer@8.2.4 to avoid issues
const cTable = require('console.table');
const sequelize = require('./config/connection')

// Connection required to utilize the mysql import
// App will be able to create and read tables via inquirer, console.table, mySQL 
// and the command prompt.

// Depending on the choice, show, update or add to relevant tables. Repeat unless 
// Quit.
const initialMenu = [
  {
    type: 'list',
    name: 'optionSelection',
    message: 'What would you like to do?',
    choices: ['View All Employees', 
              'View All Roles',
              'View All Departments',
              'Update Employee Role',
              'Add Employee',
              'Add Role',
              'Add Department',
              'Quit']
  }
];

function inqPrompt() {
  inquirer
  .prompt(initialMenu)
    .then((answers) => {
      if (answers.optionSelection === 'View All Employees') {

      } else if (answers.optionSelection === 'View All Roles') {

      } else if (answers.optionSelection === 'View All Departments') {

      } else if (answers.optionSelection === 'Update Employee Role') {

      } else if (answers.optionSelection === 'Add Employee') {

      } else if (answers.optionSelection === 'Add Role') {

      } else if (answers.optionSelection === 'Add Department') {

      } else if (answers.optionSelection === 'Quit') {
        return
      }
    })
}