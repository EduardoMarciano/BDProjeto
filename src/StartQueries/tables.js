const util = require('util');

/*DEFINIÇÃO DAS TABELAS

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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
)`;

// TABELA PARA O RELACIONAMENTO (N:N)

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

const createTable = async (tableName, connection, createQuery) => {
  try {
    const promisifiedQuery = util.promisify(connection.query).bind(connection);
    await promisifiedQuery(createQuery);
    console.log(`Tabela "${tableName}" criada com sucesso`);
  } catch (error) {
    console.error(`Erro ao criar tabela "${tableName}": ${error.stack}`);
  }
};

const createTables = async (connection) => {
  await createTable('users',          connection, createUsersTable);
  await createTable('posts',          connection, createPostsTable);
  await createTable('departments',    connection, createDepartmentsTable);
  await createTable('professors',     connection, createProfessorsTable);
  await createTable('disciplines',    connection, createDisciplinesTable);
  await createTable('turmas',         connection, createTurmasTable);
  await createTable('user_professor', connection, createUserProfessorTable);
  await createTable('comments',       connection, createCommentsTable);
  await createTable('reports',        connection, createReportsTable);
};

module.exports = createTables;