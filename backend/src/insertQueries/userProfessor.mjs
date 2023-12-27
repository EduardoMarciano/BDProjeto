const userProfessorPairs = [
    { user_id: 1, professor_id: 4 },
    { user_id: 1, professor_id: 2 },
    { user_id: 2, professor_id: 5 },
    { user_id: 2, professor_id: 1 },
    { user_id: 3, professor_id: 6 },
    { user_id: 3, professor_id: 2 },
    { user_id: 4, professor_id: 3 },
    { user_id: 4, professor_id: 2 },
    { user_id: 5, professor_id: 1 },
    { user_id: 5, professor_id: 4 },
    { user_id: 6, professor_id: 5 },
    { user_id: 6, professor_id: 3 },
  ];

const checkExistingUserProfessorQuery = 'SELECT COUNT(*) AS count FROM user_professor WHERE user_id = ? AND professor_id = ?';

async function checkExistingUserProfessor(user_id, professor_id, connection) {
    return new Promise((resolve, reject) => {
        connection.query(checkExistingUserProfessorQuery, [user_id, professor_id], (error, results) => {
            if (error) {
                console.error('Erro ao verificar relação aluno professor existentes: ' + error.stack);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

const insertUserProfessorQuery = 'INSERT INTO user_professor (user_id, professor_id) VALUES (?, ?)';

async function insertUserProfessor(user_id, professor_id, connection) {
    return new Promise((resolve, reject) => {
        connection.query(insertUserProfessorQuery, [user_id, professor_id], (error, results) => {
            if (error) {
                console.error('Erro ao inserir relação aluno professor: ' + error.stack);
                reject(error);
            } else {
                console.log(`Relação aluno professor |${user_id}|${professor_id}| inserido com sucesso. ID: ${results.insertId}`);
                resolve();
            }
        });
    });
}

async function insertUserProfessors(connection) {
    try {
        for (const userProfessor of userProfessorPairs) {
            
            let user_id = userProfessor.fisrt();
            let professor_id = userProfessor.second();
            
            try {
                const existingUserProfessor = await checkExistingUserProfessor(user_id, professor_id, connection);

                if (existingUserProfessor.length > 0) {
                    console.log(`Relação aluno professor com o id |${userProfessor.user_id}|${userProfessor.professor_id}| já existe. Ignorando inserção.`);
                    throw new Error("Já há relação aluno professor cadastrado com este par de ids.");
                } else {
                    insertUserProfessor(user_id, professor_id, connection);
                }
            } catch (error) {
                console.error('Erro durante a inserção, pilha de erro: ' + error.stack);
            }
        }
    } catch (error) {
        console.error('Erro durante a inserção, pilha de erro: ' + error.stack);
    }
}

export default insertUserProfessors;