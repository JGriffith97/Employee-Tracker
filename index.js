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

// ----------------------------------------------------------------------------------------------------- //

let empOptsArray = [];
function getEmployees() {
  let p = new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employee', async function (err, results) {
        console.log(results)
      empOptsArray = results
      resolve("Resolved")
    })
  })
  return p
}

// ----------------------------------------------------------------------------------------------------- //

let managersArray = []
function getManager() {
  let p4 = new Promise((resolve, reject) => {
    connection.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL', async function (err, results) {
      managersArray = results

      resolve("Resolved")
    })
  })
  return p4
}

// ----------------------------------------------------------------------------------------------------- //

let empRolesArray = [];
function getRoles() {
  let p2 = new Promise((resolve, reject) => {
    connection.query('SELECT id, title FROM role', async function (err, results) {
      empRolesArray = results 

      resolve("Resolve")
    })
  })
  return p2
}

// ----------------------------------------------------------------------------------------------------- //

let empDptsArray = [];
function getDepartment() {
  let p3 = new Promise((resolve, reject) => {
    connection.query('SELECT id, name FROM department', async function (err, results) {
      empDptsArray = results

      resolve("Resolve")
    })
  })
  return p3
}

// ----------------------------------------------------------------------------------------------------- //

// department, role, employee --- are the tables.
function inqPrompt() {
  inquirer.prompt(initialMenu)
    .then((answers) => {

      if (answers.optionSelection === 'View All Employees') {
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

          var empPromptObjects = []
          empOptsArray.forEach(emp => {
            let newEmpObj = {
              name: `${emp.first_name} ${emp.last_name}`,
              value: emp
            }
            empPromptObjects.push(newEmpObj);
          })

          const employees = [
            {
              type: 'list',
              name: 'empOptions',
              message: "Select the employee you'd like to update.",
              choices: empPromptObjects
            }
          ];

          inquirer.prompt(employees)
            .then((empAnswer) => {

              employeeAnswer = empAnswer.empOptions;
              if (employeeAnswer !== null) {
                getRoles().then((role) => {

                  var rolesPromptObjects = []
                  empRolesArray.forEach(role => {
                    let newRoleObj = {
                      name: role.title,
                      value: role
                    }
                    rolesPromptObjects.push(newRoleObj);
                  })

                  const roles = [
                    {
                      type: 'list',
                      name: 'empRoles',
                      message: "Select the new role for the employee.",
                      choices: rolesPromptObjects
                    }
                  ];

                  inquirer.prompt(roles)
                    .then((rolesAnswer) => {
                      empRoleAnswer = rolesAnswer.empRoles;

                      const sql = `UPDATE employee SET role_id = ? WHERE id = ?`
                      const params = [empRoleAnswer.id, employeeAnswer.id]
                      connection.query(sql, params, (err, result) => {
                        if (err) {
                          console.log('Error - line 182')
                        } else {
                          console.log("Success")
                        }
                        inqPrompt()
                      })
                    })
                })
              }
            })
        })
        
// ----------------------------------------------------------------------------------------------------- //
      } else if (answers.optionSelection === 'Add Employee') {

        getRoles().then((result) => {
          let empAnswers;
          let empManagerAnswers;

          var rolePromptObjs = []
          empRolesArray.forEach(role => {
            let newRoleObj = {
              name: role.title,
              value: role.id
            }
            rolePromptObjs.push(newRoleObj)
          })

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
              choices: rolePromptObjs
            },
          ];

          inquirer.prompt(addEmpQs)
            .then((answers) => {
              empAnswers = answers

              getManager().then((manager) => {
                
                var managerPromptObjects = []
                managersArray.forEach(mngr => {
                  let managerObj = {
                    name: `${mngr.first_name} ${mngr.last_name}`,
                    value: mngr.id
                  }
                  managerPromptObjects.push(managerObj)
                })
                console.log("Line 243: ", managerPromptObjects)
                const managerQ = [
                  {
                    type: 'list',
                    name: 'managerId',
                    message: "Whom is this employee's manager?",
                    choices: managerPromptObjects
                  }
                ];

                inquirer.prompt(managerQ)
                  .then((managerAnswer) => {
                    empManagerAnswers = managerAnswer

                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                 VALUES (?, ?, ?, ?)`
                    const params = [empAnswers.addEmpFirstName, empAnswers.addEmpLastName, empAnswers.addEmpJob, empManagerAnswers.managerId]
                    connection.query(sql, params, (err, result) => {
                      if (err) {
                        console.log('Error - line 262')
                      } else {
                        console.log('Success')
                      }
                      inqPrompt()
                    })
                  })

              })
            })
        });



// ----------------------------------------------------------------------------------------------------- //
      } else if (answers.optionSelection === 'Add Role') {
        getDepartment().then((department) => {
          
          var DepPromptObjs = []
          empDptsArray.forEach(dep => {
            let newDepObj = {
              name: dep.name,
              value: dep.id
            }
            DepPromptObjs.push(newDepObj)
          })

          const addRoleQs = [
            {
              type: 'input',
              name: 'addRoleName',
              message: "What is the name of the new role?",
            },
            {
              type: 'number',
              name: 'addRoleSalary',
              message: "What is the salary of this role?"
            },
            {
              type: 'list',
              name: 'addRoleDepartment',
              message: "To which department does this role belong?",
              choices: DepPromptObjs
            }
          ];

          inquirer.prompt(addRoleQs)
            .then((answers) => {
              const sql = `INSERT INTO role (title, salary, department_id)
                           VALUES (?, ?, ?)`
              const params = [answers.addRoleName, answers.addRoleSalary, answers.addRoleDepartment]
              connection.query(sql, params, (err, result) => {
                if (err) {
                  console.log('Error - Line 315')
                } else {
                  console.log('Success')
                }
                inqPrompt()
              })
            })
        })

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

// ----------------------------------------------------------------------------------------------------- //
// Function callers. inqPrompt is main. The rest are for testing the individual functions. 

inqPrompt();
// getEmployees();
// getManager();
// getRoles();
// getDepartment();