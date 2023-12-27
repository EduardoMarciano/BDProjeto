import { createConnection } from '../../config/node_modules/mysql/index.js';
import { config } from '../../config/node_modules/dotenv/lib/main.js';

config({path: "../../.env"});
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const connection = createConnection({
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

import createTables from './startQueries/tables.mjs';
import createStoredProcedures from './startQueries/procedures.mjs';
import createViews from './startQueries/views.mjs';

async function createAll() {
  await createTables(connection);
  await createStoredProcedures(connection);
  await createViews(connection);
};

createAll();

export default connection;