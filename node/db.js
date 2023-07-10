const mysql = require('mysql');
const multer = require('multer');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: 'root',
  password: '@@root123Edu',
  database: 'CjrProcessoTrainee'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conexão estabelecida com sucesso');
});

const createUserTable = `
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
    image BLOB
  )`;

connection.query(createUserTable, (error) => {
  if (error) {
    console.error('Erro ao executar a query: ' + error.stack);
    return;
  }
  console.log('Tabela "users" criada com sucesso');

  const createPostTable = `
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      content VARCHAR(255) NOT NULL,
      likes INT,
      created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      image BLOB,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`;

  connection.query(createPostTable, (error) => {
    if (error) {
      console.error('Erro ao executar a query: ' + error.stack);
      return;
    }
    console.log('Tabela "posts" criada com sucesso');

    const createCommentTable = `
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

    connection.query(createCommentTable, (error) => {
      if (error) {
        console.error('Erro ao executar a query: ' + error.stack);
        return;
      }
      console.log('Tabela "comments" criada com sucesso');
    });
  });
});

module.exports = connection;
