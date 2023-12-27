const users = [
    {
        username: 'Eduardo Marciano',
        password: 'Cenoura@12',
        email: 'e.marciano.meneses@gmail.com',
        role: 'administrador',
        gender: 'male',
        is_adm: true,
        course: 'Ciência da Computação',
        image: '../../resources/img/0.png'
    },
    {
        username: 'Alice Brown',
        password: 'Banana@34',
        email: 'alice.brown@gmail.com',
        role: 'aluno',
        gender: 'female',
        is_adm: false,
        course: 'Engenharia da Computação',
        image: '../../resources/img/1.png'
    },
    {
        username: 'Bob Smith',
        password: 'Abacaxi@56',
        email: 'bob.smith@gmail.com',
        role: 'aluno',
        gender: 'male',
        is_adm: false,
        course: 'Licenciatura em Computação',
        image: '../../resources/img/2.png'
    },
    {
        username: 'Carol Johnson',
        password: 'Pera@78',
        email: 'carol.johnson@gmail.com',
        role: 'aluno',
        gender: 'female',
        is_adm: false,
        course: 'Ciência da Computação',
        image: '../../resources/img/3.png'
    },
    {
        username: 'Dave Williams',
        password: 'Morango@90',
        email: 'dave.williams@gmail.com',
        role: 'aluno',
        gender: 'male',
        is_adm: false,
        course: 'Engenharia da Computação',
        image: '../../resources/img/4.png'
    },
    {
        username: 'Emily Jones',
        password: 'Melancia@12',
        email: 'emily.jones@gmail.com',
        role: 'aluno',
        gender: 'female',
        is_adm: false,
        course: 'Licenciatura em Computação',
        image: '../../resources/img/5.png'
    }
];

const checkExistingUserQuery = 'SELECT id FROM users WHERE email = ?';
const insertUserQuery = 'INSERT INTO users SET ?';

async function checkExistingUser(connection, email) {
    return new Promise((resolve, reject) => {
        connection.query(checkExistingUserQuery, [email], (error, results) => {
            if (error) {
                console.error('Erro ao verificar usuário existente: ' + error.stack);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

async function insertUser(connection, user) {
    return new Promise((resolve, reject) => {
        connection.query(insertUserQuery, user, (error, results) => {
            if (error) {
                console.error('Erro ao inserir usuário: ' + error.stack);
                reject(error);
            } else {
                console.log(`Usuário ${user.username} inserido com sucesso. ID: ${results.insertId}`);
                resolve();
            }
        });
    });
}

async function insertUsers(connection) {
    try {
        for (const user of users) {
            try {
                const existingUsers = await checkExistingUser(connection, user.email);

                if (existingUsers.length > 0) {
                    console.log(`Usuário com o e-mail ${user.email} já existe. Ignorando inserção.`);
                    throw new Error("Já há usuário cadastrado com este email.");
                } else {
                    insertUser(connection, user);
                }
            } catch (error) {
                console.error('Erro durante a inserção, pilha de erro: ' + error.stack);
            }
        }
    } catch (error) {
        console.error('Erro durante a inserção, pilha de erro: ' + error.stack);
    }
}

export default insertUsers;