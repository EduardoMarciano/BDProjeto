const util = require('util');

// DEFINIÇÃO DAS PROCEDURES
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


const createProcedure = async (procedureName, connection, createQuery) => {
  try {
    const promisifiedQuery = util.promisify(connection.query).bind(connection);
    await promisifiedQuery(createQuery);
    console.log(`Procedimento armazenado "${procedureName}" criado com sucesso`);
  } catch (error) {
    console.error(`Erro ao criar procedimento armazenado "${procedureName}": ${error.stack}`);
  }
};

const createProcedures = async (connection) => {
  await createProcedure('ListAllPosts',       connection, createProcedureListAllPosts);
  await createProcedure('GetAllPosts',        connection, createProcedureQuery);
  await createProcedure('ListUserPosts',      connection, createProcedureListUserPosts);
  await createProcedure('ListAllProfessors',  connection, createProcedureListAllProfessors);
  await createProcedure('ListAllDisciplines', connection, createProcedureListAllDisciplines);
  await createProcedure('ListAllTurmas',      connection, createProcedureListAllTurmas);
};

module.exports = createProcedures;