// Required packages
const mysql = require('mysql2');
const inquirer = require('inquirer'); // Version inquirer@8.2.4 to avoid issues
const cTable = require('console.table');
const sequelize = require('./config/connection')

// Need to npm install the above.
// Connection required to utilize the mysql import