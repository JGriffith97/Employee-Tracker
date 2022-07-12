// Required packages
const mysql = require('mysql2');
const inquirer = require('inquirer'); // Version inquirer@8.2.4 to avoid issues
const cTable = require('console.table');
const sequelize = require('./config/connection')

// Connection required to utilize the mysql import
// App will be able to create and read tables via inquirer, console.table, mySQL and the command prompt.

const initialMenu = [
  {
    type: 'list',
    name: 'optionSelection',
    message: 'What would you like to do?',
    choices: ['View All Employees', 
              'Add Employee',
              'Update Employee Role',
              'View All Roles',
              'Add Role',
              'View All Departments',
              'Add Department',
              'Quit']
  }
];