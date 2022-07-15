// Required packages
const mysql = require('mysql2');
const inquirer = require('inquirer'); // Version inquirer@8.2.4 to avoid issues
const cTable = require('console.table');
const UI = require('inquirer/lib/ui/baseUI');
require('dotenv').config()

// Connection required to utilize the mysql import
// App will be able to create and read tables via inquirer, console.table, mySQL 
// and the command prompt.
const connection = mysql.createConnection(
  {
    host: 'localhost',
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  console.log(`Connected to the ${process.env.DB_NAME} database.`)
  );

// Use console.table to show table elements.
// Adding to/amending them is another story.

// Depending on the choice, show, update or add to relevant tables. Repeat unless 
// Quit. Therefore, I want to be able to reuse this variable.
const initialMenu = [
  {
    type: 'list',
    name: 'optionSelection',
    message: 'What would you like to do?',
    choices: ['View All Employees', 
              'View All Roles', 
              'View All Departments', 
              'Update Employee Role', 'Add Employee', 
              'Add Role', 
              'Add Department', 
              'Quit (or use CTRL+C)'],
  }
];


// department, role, employee   are the tables.
function inqPrompt() {
  inquirer.prompt(initialMenu)
    .then((answers) => {

      if (answers.optionSelection === 'View All Employees') {
        // SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id -- Working (as below)! Successfully joins 3 tables.
        connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id', function (err, results) {
          console.table(`\n`, results, `\n`)
          inqPrompt()
        })
      } else if (answers.optionSelection === 'View All Roles') {
        connection.query('SELECT role.id, role.title, department.name, role.salary FROM role JOIN department ON role.department_id = department.id', async function (err, results) {
          console.table(`\n`, results, `\n`)
          inqPrompt()
        })
      } else if (answers.optionSelection === 'View All Departments') {
        connection.query('SELECT department.id, department.name FROM department', function (err, results) {
          console.table(`\n`, results, `\n`)
          inqPrompt()
        })
      } else if (answers.optionSelection === 'Update Employee Role') {

      } else if (answers.optionSelection === 'Add Employee') {

      } else if (answers.optionSelection === 'Add Role') {

      } else if (answers.optionSelection === 'Add Department') {

      } else if (answers.optionSelection === 'Quit (or use CTRL+C)') {
        process.exit()
      }
    })
}

inqPrompt();