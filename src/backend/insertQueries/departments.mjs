const departments = [
    { id: 429, name: 'FACULDADE DE TECNOLOGIA' },
    { id: 443, name: 'DEPTO ENGENHARIA ELÉTRICA' },
    { id: 508, name: 'DEPTO CIÊNCIAS DA COMPUTAÇÃO' },
    { id: 518, name: 'DEPARTAMENTO DE MATEMÁTICA' },
    { id: 524, name: 'INSTITUTO DE FÍSICA' },
    { id: 673, name: 'FACULDADE DO GAMA' }
  ];
  
const checkExistingDepartmentQuery = 'SELECT id FROM departments WHERE id = ?';
const insertDepartmentQuery = 'INSERT INTO departments (id, name) VALUES (?, ?)';
  
async function checkExistingDepartment(id ,connection) {
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

async function insertDepartment(connection, department) {
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

async function insertDepartments(connection) {
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

export default insertDepartments;