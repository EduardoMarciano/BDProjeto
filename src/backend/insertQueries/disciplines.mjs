const disciplines = [
  { code: 'FTD0021', name: 'INTRODUÇÃO À ENGENHARIA MECATRÔNICA', department_id: 429},
  { code: 'ENE0039', name: 'SISTEMAS DIGITAIS', department_id: 443},
  { code: 'CIC0097', name: 'BANCOS DE DADOS', department_id: 508},
  { code: 'MAT0053', name: 'CALCULO NUMERICO', department_id: 518},
  { code: 'IFD0304', name: 'FISICA PARA DESENHO INDUSTRIAL', department_id: 524},
  { code: 'FGA0166', name: 'ELEMENTOS E MÉTODOS EM ELETRÔNICA', department_id: 673}
];

const checkExistingDisciplineQuery = 'SELECT code FROM disciplines WHERE code = ?';

async function checkExistingDiscipline(code, connection) {
  return new Promise((resolve, reject) => {
      connection.query(checkExistingDisciplineQuery, [code], (error, results) => {
          if (error) {
              console.error('Erro ao verificar diciplinas existentes: ' + error.stack);
              reject(error);
          } else {
              resolve(results);
          }
      });
  });
}

const insertDisciplineQuery = 'INSERT INTO disciplines (code, name, department_id) VALUES (?, ?, ?)';

async function insertDiscipline(connection, dicipline) {
  return new Promise((resolve, reject) => {
      connection.query(insertDisciplineQuery, [dicipline.code, dicipline.name, dicipline.department_id], (error, results) => {
          if (error) {
              console.error('Erro ao inserir departamento: ' + error.stack);
              reject(error);
          } else {
              console.log(`Usuário ${department.name} inserido com sucesso. ID: ${results.insertId}`);
              resolve();
          }
      });
  });
}

async function insertDisciplines(connection) {
  try {
      for (const dicipline of disciplines) {
          try {
              const existingDicipline = await insertDiscipline(connection, dicipline.id);

              if (existingDicipline.length > 0) {
                  console.log(`Diciplina com o código ${dicipline.code} já existe. Ignorando inserção.`);
                  throw new Error("Já há diciplina cadastrada com este código.");
              } else {
                  insertDiscipline(connection, dicipline);
              }
          } catch (error) {
              console.error('Erro durante a inserção, pilha de erro: ' + error.stack);
          }
      }
  } catch (error) {
      console.error('Erro durante a inserção, pilha de erro: ' + error.stack);
  }
}

export default insertDisciplines;