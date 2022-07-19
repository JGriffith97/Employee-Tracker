// Required packages
const mysql = require('mysql2');
const inquirer = require('inquirer'); // Version inquirer@8.2.4 to avoid issues
const cTable = require('console.table');
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
      'Update Employee Role',
      'Add Employee',
      'Add Role',
      'Add Department',
      'Quit (or use CTRL+C)'],
  }
];


// let empOpts;
// let empOptsArray = [];
function getEmployees() {
  let p = new Promise((resolve, reject) => {
    connection.query('SELECT CONCAT (first_name, " ", last_name) AS "name" FROM employee', async function (err, results) {
      results.forEach(employees => {
        for (const key in employees) {
          empOpts = employees[key]
          // console.log("empOpts: ", empOpts)
          // console.log(empOpts)
          empOptsArray.push(empOpts)
        }
      })
      // console.log("After forEach: ", empOpts)
      resolve("Resolved")
      // console.log("empOptsArray in getEmployee: ", empOptsArray)
    })
  })
  // console.log(p)
  return p
}

let empRoles;
let empRolesArray = [];
function getRole() {
  let p2 = new Promise((resolve, reject) => {
    connection.query('SELECT title FROM role', async function (err, results) {
      // console.log(results)
      results.forEach(roles => {
        for (const key in roles) {
          empRoles = roles[key]
          empRolesArray.push(empRoles)
        }
      })
      resolve("Resolve")
      // console.log("empRolesArray in getRole: ", empRolesArray)
    })
  })
  // console.log(p2)
  return p2
}


// department, role, employee --- are the tables.
function inqPrompt() {
  inquirer.prompt(initialMenu)
    .then((answers) => {

      // console.log("Answers", typeof answers.optionSelection)
      if (answers.optionSelection === 'View All Employees') {
        // SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id -- Working (as below)! Successfully joins 3 tables.
        connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id', async function (err, results) {
          console.table(`\n`, results)
          inqPrompt()
        })
// ----------------------------------------------------------------------------------------------------- //
      } else if (answers.optionSelection === 'View All Roles') {
        connection.query('SELECT role.id, role.title, department.name, role.salary FROM role JOIN department ON role.department_id = department.id', async function (err, results) {
          console.table(`\n`, results)
          inqPrompt()
        })
// ----------------------------------------------------------------------------------------------------- //
      } else if (answers.optionSelection === 'View All Departments') {
        connection.query('SELECT department.id, department.name FROM department', async function (err, results) {
          console.table(`\n`, results)
          inqPrompt()
        })
// ----------------------------------------------------------------------------------------------------- //
      } else if (answers.optionSelection === 'Update Employee Role') {

        getEmployees().then((result) => {

          let employeeAnswer;
          let empRoleAnswer;
          const employees = [
            {
              type: 'list',
              name: 'empOptions',
              message: "Select the employee you'd like to update.",
              choices: empOptsArray
            }
          ];

          inquirer.prompt(employees)
            .then((empAnswer) => {
              employeeAnswer = empAnswer;
              console.log(employeeAnswer)
              if (employeeAnswer !== null) {
                getRole().then((role) => {

                  const roles = [
                    {
                      type: 'list',
                      name: 'empRoles',
                      message: "Select the new role for the employee.",
                      choices: empRolesArray
                    }
                  ];

                  inquirer.prompt(roles)
                    .then((rolesAnswer) => {
                      empRoleAnswer = rolesAnswer;
                      console.log(empRoleAnswer);
                    })
                })
              }
            })
        })
        const sql = `UPDATE employee SET`
        connection.query()
// ----------------------------------------------------------------------------------------------------- //
      } else if (answers.optionSelection === 'Add Employee') {
        getRole();

        const addEmpQs = [
          {
            type: 'input',
            name: 'addEmpFirstName',
            message: "What is the employee's first name?",
          },
          {
            type: 'input',
            name: 'addEmpLastName',
            message: "What is the employee's last name?"
          },
          {
            type: 'list',
            name: 'addEmpJob',
            message: "What is this employee's role?",
            choices: empRolesArray
          },
          {
            type: 'list',
            name: 'addEmpManager',
            message: "Does this employee have a manager?",
            choices: [],
          }
        ]

        connection.query()
        inqPrompt()
// ----------------------------------------------------------------------------------------------------- //
      } else if (answers.optionSelection === 'Add Role') {

        const addRoleQs = [
          {
            type: 'input',
            name: roleName,
            message: "What is the name of the new role?",
          },
          {
            type: 'number',
            name: roleSalary,
            message: "What is the salary of this role?"
          },
          {
            type: 'list',
            name: roleDepartment,
            message: "To which department does this role belong?",
            choices: [],
          }
        ];

        connection.query()
        inqPrompt()
// ----------------------------------------------------------------------------------------------------- //
      } else if (answers.optionSelection === 'Add Department') {

        const addDepQs = [
          {
            type: "input",
            name: "addDpmnt",
            message: "What is the name of the new department?",
          }
        ];

        inquirer.prompt(addDepQs)
        .then((answers) => {
          let newDepartment;
          if (answers.addDpmnt) {
            newDepartment = answers.addDpmnt
           
            const sql = `INSERT INTO department (name)
              VALUES (?)`;
            connection.query(sql, newDepartment, (err, result) => {
              if (err) {
                console.log("Failure to insert into table.")
              }
              else {
                console.log("\n", "New department successfully added.")
                connection.query("SELECT * FROM department", async function (err, results) {
                  console.table("\n", results)
                  inqPrompt()
                })
              }
            })
          } else {
            console.log("\n", "Error in Add Department")
            process.exit()
          }
        })
// ----------------------------------------------------------------------------------------------------- //
      } else if (answers.optionSelection === 'Quit (or use CTRL+C)') {
        process.exit()
      }
    })
}


inqPrompt();
// getEmployees();
// getRole();