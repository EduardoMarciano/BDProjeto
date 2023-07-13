const mysql = require('mysql');

const connection = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: '@@root123Edu',
  database: 'BDprojeto'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conexão estabelecida com sucesso');
});
/*
  TABELAS DAS 8 ENTIDADES. RELACIONAMETO ENTRE ELAS:
  
    users:professors (N:N)
    users:posts (1:N)
    users:comments (1:N)
    users:reports (1:N)
    departments:professors (1:N)
    departments:disciplines (1:N)
    professors:turmas (1:N)
    disciplines:turmas (1:N)
    professors:comments (1:N)
    disciplines:comments (1:N)
    turmas:comments (1:N)

*/

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_adm BOOLEAN NOT NULL,
    token INT,
    image BLOB,
    course VARCHAR(255) NOT NULL
)`;

const createProfessorsTable = `
  CREATE TABLE IF NOT EXISTS professors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE CASCADE
)`;

const createDepartmentsTable = `
  CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
)`;

const createDisciplinesTable = `
  CREATE TABLE IF NOT EXISTS disciplines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE CASCADE
)`;

const createTurmasTable = `
  CREATE TABLE IF NOT EXISTS turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professor_id INT NOT NULL,
    discipline_id INT NOT NULL,
    local VARCHAR(255) NOT NULL,
    horario VARCHAR(255) NOT NULL,
    numero INT NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES professors(id)
    ON DELETE CASCADE,
    FOREIGN KEY (discipline_id) REFERENCES disciplines(id)
    ON DELETE CASCADE
)`;

const createPostsTable = `
  CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    likes INT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
)`;

const createCommentsTable = `
  CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    professor_id INT,
    discipline_id INT,
    turma_id INT,
    content VARCHAR(255) NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
    FOREIGN KEY (professor_id) REFERENCES professors(id),
    FOREIGN KEY (discipline_id) REFERENCES disciplines(id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id)
)`;

const createReportsTable = `
  CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    comment_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id)
    ON DELETE CASCADE
)`;

const createUserProfessorTable = `
  CREATE TABLE IF NOT EXISTS user_professor (
    user_id INT NOT NULL,
    professor_id INT NOT NULL,
    PRIMARY KEY (user_id, professor_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
    FOREIGN KEY (professor_id) REFERENCES professors(id)
    ON DELETE CASCADE
)`;

//  CRIAÇÃO DAS TABELAS NO BANCO DE DADOS

connection.query(createUsersTable, (error) => {
  if (error) {
    console.error('Erro ao criar tabela "users": ' + error.stack);
    return;
  }
  console.log('Tabela "users" criada com sucesso');
});

connection.query(createPostsTable, (error) => {
  if (error) {
    console.error('Erro ao criar tabela "posts": ' + error.stack);
    return;
  }
  console.log('Tabela "posts" criada com sucesso');
});

connection.query(createCommentsTable, (error) => {
  if (error) {
    console.error('Erro ao criar tabela "comments": ' + error.stack);
    return;
  }
  console.log('Tabela "comments" criada com sucesso');
});

connection.query(createDepartmentsTable, (error) => {
  if (error) {
    console.error('Erro ao criar tabela "departments": ' + error.stack);
    return;
  }
  console.log('Tabela "departments" criada com sucesso');
});

connection.query(createProfessorsTable, (error) => {
  if (error) {
    console.error('Erro ao criar tabela "professors": ' + error.stack);
    return;
  }
  console.log('Tabela "professors" criada com sucesso');
});

connection.query(createDisciplinesTable, (error) => {
  if (error) {
    console.error('Erro ao criar tabela "disciplines": ' + error.stack);
    return;
  }
  console.log('Tabela "disciplines" criada com sucesso');
});

connection.query(createTurmasTable, (error) => {
  if (error) {
    console.error('Erro ao criar tabela "turmas": ' + error.stack);
    return;
  }
  console.log('Tabela "turmas" criada com sucesso');
});

connection.query(createReportsTable, (error) => {
  if (error) {
    console.error('Erro ao criar tabela "reports": ' + error.stack);
    return;
  }
  console.log('Tabela "reports" criada com sucesso');
});


connection.query(createUserProfessorTable, (error) => {
  if (error) {
    console.error('Erro ao criar tabela "user_professor": ' + error.stack);
    return;
  }
  console.log('Tabela "user_professor" criada com sucesso');
});


// CRIAÇÃO DE PROCEDURES
const createProcedureListAllPosts = `
  CREATE PROCEDURE IF NOT EXISTS ListAllPosts()
  BEGIN
    SELECT * FROM posts;
  END
`;

const createProcedureListUserPosts = `
  CREATE PROCEDURE IF NOT EXISTS ListUserPosts(IN userId INT)
  BEGIN
    SELECT * FROM posts WHERE user_id = userId;
  END
`;

const createProcedureListAllProfessors = `
  CREATE PROCEDURE IF NOT EXISTS ListAllProfessors()
  BEGIN
    SELECT * FROM professors;
  END
`;

const createProcedureListAllDisciplines = `
  CREATE PROCEDURE IF NOT EXISTS ListAllDisciplines()
  BEGIN
    SELECT * FROM disciplines;
  END
`;

const createProcedureListAllTurmas = `
  CREATE PROCEDURE IF NOT EXISTS ListAllTurmas()
  BEGIN
    SELECT * FROM turmas;
  END
`;

const createProcedureQuery = `
    CREATE PROCEDURE IF NOT EXISTS GetAllPosts()
    BEGIN
        SELECT posts.*, users.username, users.created_time AS user_created_time, users.image AS user_image
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        ORDER BY posts.created_time DESC;
    END
`;

// Criação das procedures no banco de dados
connection.query(createProcedureListAllPosts, (error) => {
  if (error) {
    console.error('Erro ao criar a procedure "ListAllPosts": ' + error.stack);
    return;
  }
  console.log('Procedure "ListAllPosts" criada com sucesso');
});

connection.query(createProcedureQuery, (error, results) => {
  if (error) {
    console.error('Erro ao criar a stored procedure:', error);
    return;
  }
  console.log('Stored procedure criada com sucesso!');
});

connection.query(createProcedureListUserPosts, (error) => {
  if (error) {
    console.error('Erro ao criar a procedure "ListUserPosts": ' + error.stack);
    return;
  }
  console.log('Procedure "ListUserPosts" criada com sucesso');
});

connection.query(createProcedureListAllProfessors, (error) => {
  if (error) {
    console.error('Erro ao criar a procedure "ListAllProfessors": ' + error.stack);
    return;
  }
  console.log('Procedure "ListAllProfessors" criada com sucesso');
});

connection.query(createProcedureListAllDisciplines, (error) => {
  if (error) {
    console.error('Erro ao criar a procedure "ListAllDisciplines": ' + error.stack);
    return;
  }
  console.log('Procedure "ListAllDisciplines" criada com sucesso');
});

connection.query(createProcedureListAllTurmas, (error) => {
  if (error) {
    console.error('Erro ao criar a procedure "ListAllTurmas": ' + error.stack);
    return;
  }
  console.log('Procedure "ListAllTurmas" criada com sucesso');
});

// CRIAÇÃO DE VIEWS
const createViewUserReportsAndComments = `
  CREATE OR REPLACE VIEW UserReportsAndComments AS
  SELECT r.id AS report_id, r.user_id AS report_user_id, c.id AS comment_id, c.content AS comment_content, c.created_time AS comment_created_time, u.username AS user_username, u.email AS user_email
  FROM reports r
  JOIN comments c ON r.comment_id = c.id
  JOIN users u ON c.user_id = u.id;
`;

connection.query(createViewUserReportsAndComments, (error) => {
  if (error) {
    console.error('Erro ao criar a view "UserReportsAndComments": ' + error.stack);
    return;
  }
  console.log('View "UserReportsAndComments" criada com sucesso');
});

module.exports = connection;