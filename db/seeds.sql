INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");


INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Sales Associate", 60000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Account Manager", 160000, 3),
       ("Accountant", 110000, 3),
       ("Legal Team Lead", 200000, 4),
       ("Lawyer", 140000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Wilkins", 1, null),
       ("Thomas", "James", 1, 1),
       ("Kevin", "Books", 2, null),
       ("Sarah", "Graves", 2, 2),
       ("Tony", "Wagner", 3, null),
       ("Elliot", "Mendez", 3, 3),
       ("Lyla", "Indra", 4, null),
       ("Charles", "Thomas", 4, 4);
       