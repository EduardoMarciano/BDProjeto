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
  
    Users Professor (N:N)
    Users Posts (1:N)
    Users Comments (1:N)
    Users Reports (1:N)
    Departments Professors (1:N)
    Departments Disciplines (1:N)
    Professors Classes (N:N)
    Disciplines Classes (1:N)
    Posts Comments (1:N)

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

const createPostsTable = `
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      content VARCHAR(255) NOT NULL,
      likes INT,
      created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      image BLOB,
      FOREIGN KEY (user_id) REFERENCES users(id)
)`;

const createCommentsTable = `
  CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes INT,
    content VARCHAR(255) NOT NULL,
    image BLOB,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
)`;

const createDepartmentsTable = `
  CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )`;

const createProfessorsTable = `
  CREATE TABLE IF NOT EXISTS professors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
  )`;

const createDisciplinesTable = `
  CREATE TABLE IF NOT EXISTS disciplines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
  )`;

const createClassesTable = `
  CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professor_id INT NOT NULL,
    discipline_id INT NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES professors(id),
    FOREIGN KEY (discipline_id) REFERENCES disciplines(id)
  )`;

const createReportsTable = `
  CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`;

// TABELAS INTERMEDIÁRIAS QUE FAZEM A LIGAÇÃO DE RELAÇÕES (N:N)

const createUserProfessorTable = `
  CREATE TABLE IF NOT EXISTS user_professor (
    user_id INT NOT NULL, 
    professor_id INT NOT NULL,
    PRIMARY KEY (user_id, professor_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (professor_id) REFERENCES professors(id)
  )`;

const createProfessorClassTable = `
  CREATE TABLE IF NOT EXISTS professor_class (
    professor_id INT NOT NULL,
    class_id INT NOT NULL,
    PRIMARY KEY (professor_id, class_id),
    FOREIGN KEY (professor_id) REFERENCES professors(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
  )`;

connection.query(createUserProfessorTable, (error) => {
  if (error) {
    console.error('Erro ao criar tabela "user_professor": ' + error.stack);
    return;
  }
  console.log('Tabela "user_professor" criada com sucesso');
});

connection.query(createProfessorClassTable, (error) => {
  if (error) {
    console.error('Erro ao criar tabela "professor_class": ' + error.stack);
    return;
  }
  console.log('Tabela "professor_class" criada com sucesso');
});

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

connection.query(createClassesTable, (error) => {
  if (error) {
    console.error('Erro ao criar tabela "classes": ' + error.stack);
    return;
  }
  console.log('Tabela "classes" criada com sucesso');
});

connection.query(createReportsTable, (error) => {
  if (error) {
    console.error('Erro ao criar tabela "reports": ' + error.stack);
    return;
  }
  console.log('Tabela "reports" criada com sucesso');
});


// CRIAÇÃO DE PROCEDURES

// CRIAÇÃO DE VIEWS
module.exports = connection;