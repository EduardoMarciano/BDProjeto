const mysql = require('mysql');
require('dotenv').config();

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const connection = mysql.createConnection({
  host:'localhost',
  user: user,
  password: password,
  database: 'BDprojeto'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conexão estabelecida com sucesso');
});

const  createTables            = require('./startQueries/tables');
const  createStoredProcedures  = require('./startQueries/procedures');
const  createViews             = require('./startQueries/views');

const createAll = async () => {
  await createTables(connection);
  await createStoredProcedures(connection);
  await createViews(connection);
};

createAll();
module.exports = connection;