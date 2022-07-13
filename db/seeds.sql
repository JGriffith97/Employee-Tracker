INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");


INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, ),
       ("Sales Associate", 60000, ),
       ("Lead Engineer", 150000, ),
       ("Software Engineer", 120000, );


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Wilkins", , 1),
       ("Thomas", "James", , null),
       ("Kevin", "Books", , null),
       ("Sarah", "Graves", , null);