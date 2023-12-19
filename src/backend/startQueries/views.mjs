import util from 'util';

// DEFINIÇÃO DA VIEW
const createViewUserReportsAndComments = `
  CREATE OR REPLACE VIEW UserReportsAndComments AS
  SELECT r.id AS report_id, r.user_id AS report_user_id, c.id AS comment_id, c.content AS comment_content, c.created_time AS comment_created_time, u.username AS user_username, u.email AS user_email
  FROM reports r
  JOIN comments c ON r.comment_id = c.id
  JOIN users u ON c.user_id = u.id;
`;

const createView = async (ViewName, connection, createQuery) => {
  try {
    const promisifiedQuery = util.promisify(connection.query).bind(connection);
    await promisifiedQuery(createQuery);
    
    console.log(`View armazenada "${ViewName}" criada com sucessa`);
  } 
  catch (error) {
    console.error(`Erro ao criar view armazenada "${ViewName}": ${error.stack}`);
  }
};

const createViews = async (connection) => {
  await createView('UserReportsAndComments', connection, createViewUserReportsAndComments);
};

export default createViews;