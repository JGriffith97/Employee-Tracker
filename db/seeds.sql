INSERT INTO department (id, name)
VALUES (1, "Sales"),
       (2, "Engineering"),
       (3, "Finance"),
       (4, "Legal");


INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Sales Lead", 100000, 1),
       (2, "Sales Associate", 60000, 1),
       (3, "Lead Engineer", 150000, 2),
       (4, "Software Engineer", 120000, 2),
       (5, "Account Manager", 160000, 3),
       (6, "Accountant", 110000, 3),
       (7, "Legal Team Lead", 200000, 4),
       (8, "Lawyer", 140000, 4);


INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "John", "Wilkins", 1, null),
       (2, "Thomas", "James", 2, 1),
       (3, "Kevin", "Books", 3, null),
       (4, "Sarah", "Graves", 4, 3),
       (5, "Tony", "Wagner", 5, null),
       (6, "Elliot", "Mendez", 6, 5),
       (7, "Lyla", "Indra", 7, null),
       (8, "Charles", "Thomas", 8, 7);
       