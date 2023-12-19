const classes = [
    { professor_id: 1, discipline_id: 1,  horario:'6M12 ', local:'FT/ENE BT',     numero:1},
    { professor_id: 2, discipline_id: 2,  horario:'24M34', local:'FT BT-13/15',   numero:2},
    { professor_id: 3, discipline_id: 3,  horario:'35T45', local:'PAT AT 021',    numero:1},
    { professor_id: 4, discipline_id: 4,  horario:'35T45', local:'ICC ANF. 6',    numero:3},
    { professor_id: 5, discipline_id: 5,  horario:'35T23', local:'PAT AT 012',    numero:2},
    { professor_id: 6, discipline_id: 6,  horario:'35T23', local:'FGA - SALA I2', numero:1},
  ];
  
  const checkExistingClassQuery = 'SELECT id FROM classes WHERE professor_id = ? AND discipline_id = ? AND horario = ? AND local = ? AND numero = ?';
  const insertClassQuery = 'INSERT INTO classes (professor_id, discipline_id, horario, local, numero) VALUES (?, ?, ?, ?, ?)';
  
  async function checkExistingClass(professor_id, discipline_id, horario, local, numero, connection) {
    return new Promise((resolve, reject) => {
        connection.query(checkExistingDepartmentQuery, [id], (error, results) => {
            if (error) {
                console.error('Erro ao verificar departamentos existentes: ' + error.stack);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

async function insertClass(connection, department) {
    return new Promise((resolve, reject) => {
        connection.query(insertDepartmentQuery, department, (error, results) => {
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

async function insertClasses(connection) {
    try {
        for (const departament of departments) {
            try {
                const existingDepartment = await checkExistingDepartment(connection, departament.id);

                if (existingDepartment.length > 0) {
                    console.log(`Departamento com o id ${departament.id} já existe. Ignorando inserção.`);
                    throw new Error("Já há departamento cadastrado com este id.");
                } else {
                    insertDepartment(connection, departament);
                }
            } catch (error) {
                console.error('Erro durante a inserção, pilha de erro: ' + error.stack);
            }
        }
    } catch (error) {
        console.error('Erro durante a inserção, pilha de erro: ' + error.stack);
    }
}

export default insertClasses;