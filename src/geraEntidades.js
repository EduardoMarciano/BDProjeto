const db = require('./db.js');

// POVOA O BANCO DE DADOS COM ALUNOS
const users = [
  {
    username: 'Eduardo Marciano',
    password: 'Cenoura@12',
    email: 'e.marciano.meneses@gmail.com',
    role: 'administrador',
    gender: 'male',
    is_adm: true,
    course: 'Ciência da Computação',
    image: '/DATA/0.png'
  },
  {
    username: 'Alice Brown',
    password: 'Banana@34',
    email: 'alice.brown@gmail.com',
    role: 'aluno',
    gender: 'female',
    is_adm: false,
    course: 'Engenharia da Computação',
    image: '/DATA/1.png'
  },
  {
    username: 'Bob Smith',
    password: 'Abacaxi@56',
    email: 'bob.smith@gmail.com',
    role: 'aluno',
    gender: 'male',
    is_adm: false,
    course: 'Licenciatura em Computação',
    image: '/DATA/2.png'
  },
  {
    username: 'Carol Johnson',
    password: 'Pera@78',
    email: 'carol.johnson@gmail.com',
    role: 'aluno',
    gender: 'female',
    is_adm: false,
    course: 'Ciência da Computação',
    image: '/DATA/3.png'
  },
  {
    username: 'Dave Williams',
    password: 'Morango@90',
    email: 'dave.williams@gmail.com',
    role: 'aluno',
    gender: 'male',
    is_adm: false,
    course: 'Engenharia da Computação',
    image: '/DATA/4.png'
  },
  {
    username: 'Emily Jones',
    password: 'Melancia@12',
    email: 'emily.jones@gmail.com',
    role: 'aluno',
    gender: 'female',
    is_adm: false,
    course: 'Licenciatura em Computação',
    image: '/DATA/5.png'
  }
];

const checkExistingUserQuery = 'SELECT id FROM users WHERE email = ?';
const insertUserQuery = 'INSERT INTO users SET ?';

users.forEach((user) => {
  db.query(checkExistingUserQuery, user.email, (error, results) => {
    if (error) {
      console.error('Erro ao verificar usuário existente: ' + error.stack);
      return;
    }

    if (results.length > 0) {
      console.log(`Usuário com o e-mail ${user.email} já existe. Ignorando inserção.`);
      return;
    }

    db.query(insertUserQuery, user, (error, results) => {
      if (error) {
        console.error('Erro ao inserir usuário: ' + error.stack);
        return;
      }
      console.log(`Usuário ${user.username} inserido com sucesso. ID: ${results.insertId}`);
    });
  });
});

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

departments.forEach((department) => {
  db.query(checkExistingDepartmentQuery, department.id, (error, results) => {
    if (error) {
      console.error(`Erro ao verificar a existência do departamento ${department.name}: ${error.stack}`);
      return;
    }

    if (results.length > 0) {
      console.log(`Departamento com o ID ${department.id} já existe. Ignorando inserção.`);
      return;
    }

    db.query(insertDepartmentQuery, [department.id, department.name], (error, results) => {
      if (error) {
        console.error(`Erro ao inserir departamento ${department.name}: ${error.stack}`);
        return;
      }
      console.log(`Departamento ${department.name} inserido com sucesso. ID: ${department.id}`);
    });
  });
});

const disciplines = [
    { code: 'FTD0021', name: 'INTRODUÇÃO À ENGENHARIA MECATRÔNICA', department_id: 429 },
    { code: 'ENE0039', name: 'SISTEMAS DIGITAIS', department_id: 443 },
    { code: 'CIC0097', name: 'BANCOS DE DADOS', department_id: 508 },
    { code: 'MAT0053', name: 'CALCULO NUMERICO', department_id: 518 },
    { code: 'IFD0304', name: 'FISICA PARA DESENHO INDUSTRIAL', department_id: 524},
    { code: 'FGA0166', name: 'ELEMENTOS E MÉTODOS EM ELETRÔNICA', department_id: 673}
  ];
  
  const checkExistingDisciplineQuery = 'SELECT code FROM disciplines WHERE code = ?';
  const insertDisciplineQuery = 'INSERT INTO disciplines (code, name, department_id) VALUES (?, ?, ?)';
  
  disciplines.forEach((discipline) => {
    db.query(checkExistingDisciplineQuery, discipline.code, (error, results) => {
      if (error) {
        console.error(`Erro ao verificar a existência da disciplina ${discipline.name}: ${error.stack}`);
        return;
      }
  
      if (results.length > 0) {
        console.log(`Disciplina com o código ${discipline.code} já existe. Ignorando inserção.`);
        return;
      }
  
      db.query(insertDisciplineQuery, [discipline.code, discipline.name, discipline.department_id], (error, results) => {
        if (error) {
          console.error(`Erro ao inserir disciplina ${discipline.name}: ${error.stack}`);
          return;
        }
        console.log(`Disciplina ${discipline.name} inserida com sucesso. Código: ${discipline.code}`);
      });
    });
  });

const professors = [
    { name: 'JOSE ALFREDO RUIZ letGAS', department_id: 429 },
    { name: 'EDSON MINTSU HUNG', department_id: 443 },
    { name: 'PEDRO GARCIA FREITAS', department_id: 508 },
    { name: 'FLAVIA FERREIRA RAMOS ZAPATA', department_id: 518 },
    { name: 'NILO MAKIUCHI', department_id: 524},
    { name: 'FABIANO ARAUJO SOARES', department_id: 673},
  ];
  
  const checkExistingProfessorQuery = 'SELECT id FROM professors WHERE department_id = ?';
  const insertProfessorQuery = 'INSERT INTO professors (name, department_id) VALUES (?, ?)';
  
  professors.forEach((professor, index) => {
    db.query(checkExistingProfessorQuery, professor.department_id, (error, results) => {
      if (error) {
        console.error(`Erro ao verificar a existência do professor ${professor.name}: ${error.stack}`);
        return;
      }
  
      if (results.length > 0) {
        console.log(`Professor da disciplina ${index + 1} já existe. Ignorando inserção.`);
        return;
      }
  
      db.query(insertProfessorQuery, [professor.name, professor.department_id], (error, results) => {
        if (error) {
          console.error(`Erro ao inserir professor da disciplina ${index + 1}: ${error.stack}`);
          return;
        }
        console.log(`Professor ${professor.name} inserido com sucesso.`);
      });
    });
  });

  const turmas = [
    { professor_id: 1, discipline_id: 1,  horario:'6M12 ', local:'FT/ENE BT',   numero:1},
    { professor_id: 2, discipline_id: 2,  horario:'24M34', local:'FT BT-13/15', numero:2},
    { professor_id: 3, discipline_id: 3,  horario:'35T45', local:'PAT AT 021', numero:1},
    { professor_id: 4, discipline_id: 4,  horario:'35T45', local:'ICC ANF. 6', numero:3},
    { professor_id: 5, discipline_id: 5,  horario:'35T23', local:'PAT AT 012', numero:2},
    { professor_id: 6, discipline_id: 6,  horario:'35T23', local:'FGA - SALA I2', numero:1},
  ];
  
  const checkExistingTurmaQuery = 'SELECT id FROM turmas WHERE professor_id = ? AND discipline_id = ? AND horario = ? AND local = ? AND numero = ?';
  const insertTurmaQuery = 'INSERT INTO turmas (professor_id, discipline_id, horario, local, numero) VALUES (?, ?, ?, ?, ?)';
  
  turmas.forEach((turma, index) => {
    db.query(checkExistingTurmaQuery, [turma.professor_id, turma.discipline_id, turma.horario, turma.local, turma.numero], (error, results) => {
      if (error) {
        console.error(`Erro ao verificar a existência da turma ${index + 1}: ${error.stack}`);
        return;
      }
  
      if (results.length > 0) {
        console.log(`Turma ${index + 1} já existe. Ignorando inserção.`);
        return;
      }
  
      db.query(insertTurmaQuery, [turma.professor_id, turma.discipline_id, turma.horario, turma.local, turma.numero], (error, results) => {
        if (error) {
          console.error(`Erro ao inserir turma ${index + 1}: ${error.stack}`);
          return;
        }
        console.log(`Turma ${index + 1} inserida com sucesso.`);
      });
    });
  });
const usersPosts = [
    // User 1
    { user_id: 1, content: "O prédio de administração da faculdade é realmente impressionante!" },
    { user_id: 1, content: "Participei de uma festa incrível organizada pelo curso de Direito." },
    { user_id: 1, content: "Estou amando meu curso de Ciência da Computação. Aprendendo coisas incríveis!" },
    { user_id: 1, content: "Hoje tive uma aula de cálculo muito difícil. Preciso estudar mais." },
    { user_id: 1, content: "Conheci uma pessoa muito especial na turma de Sociologia. Meu coração bate mais forte!" },
    { user_id: 1, content: "A vida de estudante é uma montanha-russa de emoções!" },
    // User 2
    { user_id: 2, content: "O laboratório de física é realmente impressionante!" },
    { user_id: 2, content: "Participei de uma competição de programação muito desafiadora." },
    { user_id: 2, content: "Estou adorando meu curso de Engenharia da Computação. Muito conteúdo interessante!" },
    { user_id: 2, content: "Hoje tive uma aula de matemática avançada. Preciso praticar mais exercícios." },
    { user_id: 2, content: "Fiz amizade com um colega de turma super inteligente. Vamos estudar juntos!" },
    { user_id: 2, content: "A vida universitária é cheia de desafios, mas vale a pena!" },
    // User 3
    { user_id: 3, content: "A biblioteca da faculdade tem um acervo incrível!" },
    { user_id: 3, content: "Participei de um projeto de pesquisa na área de Inteligência Artificial." },
    { user_id: 3, content: "Estou me dedicando ao meu curso de Licenciatura em Computação. Quero ser um bom professor!" },
    { user_id: 3, content: "Hoje tive uma aula de programação. Estou melhorando minhas habilidades." },
    { user_id: 3, content: "Fui convidado para palestrar em um evento sobre educação. Estou empolgado!" },
    { user_id: 3, content: "A jornada acadêmica é desafiadora, mas estou determinado a alcançar meus objetivos!" },
    // User 4
    { user_id: 4, content: "As instalações do laboratório de eletrônica são excelentes!" },
    { user_id: 4, content: "Participei de uma competição de robótica e conquistamos o segundo lugar." },
    { user_id: 4, content: "Estou aprendendo muito no curso de Ciência da Computação. É incrível como a tecnologia avança rápido!" },
    { user_id: 4, content: "Hoje tive uma aula de estrutura de dados. Preciso praticar mais exercícios para fixar os conceitos." },
    { user_id: 4, content: "Conheci um professor super motivado na minha disciplina de Inteligência Artificial." },
    { user_id: 4, content: "Estou aproveitando ao máximo minha jornada universitária. Cada dia é uma oportunidade de aprendizado!" },
    // User 5
    { user_id: 5, content: "O auditório da faculdade é um ótimo lugar para eventos e palestras." },
    { user_id: 5, content: "Participei de um workshop sobre empreendedorismo na área de tecnologia." },
    { user_id: 5, content: "Estou cursando Engenharia da Computação e adoro resolver problemas complexos." },
    { user_id: 5, content: "Hoje tive uma aula de física. Preciso revisar alguns conceitos." },
    { user_id: 5, content: "Fiz amizade com um colega de turma que compartilha os mesmos interesses que eu." },
    { user_id: 5, content: "A vida universitária é cheia de desafios, mas também de muitas oportunidades de crescimento!" },
    // User 6
    { user_id: 6, content: "O campus da faculdade é lindo! Um lugar inspirador para estudar." },
    { user_id: 6, content: "Participei de uma palestra sobre desenvolvimento web. Muito interessante!" },
    { user_id: 6, content: "Estou me dedicando ao curso de Licenciatura em Computação. Quero ensinar de forma criativa e engajadora." },
    { user_id: 6, content: "Hoje tive uma aula de programação. Estou melhorando minhas habilidades de codificação." },
    { user_id: 6, content: "Conheci um professor muito carismático na disciplina de Banco de Dados." },
    { user_id: 6, content: "A vida universitária é uma jornada cheia de descobertas e aprendizados constantes!" },
  ];
  
  const insertPostQuery = 'INSERT INTO posts (user_id, content) VALUES (?, ?)';
  const checkExistingPostQuery = 'SELECT id FROM posts WHERE user_id = ? AND content = ?';
  
  usersPosts.forEach((post, index) => {
    db.query(checkExistingPostQuery, [post.user_id, post.content], (error, results) => {
      if (error) {
        console.error(`Erro ao verificar a existência do post ${index + 1}: ${error.stack}`);
        return;
      }
  
      if (results.length > 0) {
        console.log(`Post ${index + 1} já existe para o usuário ${post.user_id}. Ignorando inserção.`);
        return;
      }
  
      db.query(insertPostQuery, [post.user_id, post.content], (error, results) => {
        if (error) {
          console.error(`Erro ao inserir post ${index + 1}: ${error.stack}`);
          return;
        }
        console.log(`Post ${index + 1} inserido com sucesso.`);
      });
    });
  });

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
const insertUserProfessorQuery = 'INSERT INTO user_professor (user_id, professor_id) VALUES (?, ?)';
  
userProfessorPairs.forEach((pair, index) => {
    db.query(checkExistingUserProfessorQuery, [pair.user_id, pair.professor_id], (error, results) => {
      if (error) {
        console.error(`Erro ao verificar a existência da associação usuário-professor ${index + 1}: ${error.stack}`);
        return;
      }
  
      const count = results[0].count;
      if (count > 0) {
        console.log(`Associação usuário-professor ${index + 1} já existe. Ignorando inserção.`);
        return;
      }
  
      db.query(insertUserProfessorQuery, [pair.user_id, pair.professor_id], (error, results) => {
        if (error) {
          console.error(`Erro ao inserir associação usuário-professor ${index + 1}: ${error.stack}`);
          return;
        }
        console.log(`Associação usuário-professor ${index + 1} inserida com sucesso.`);
      });
    });
});

module.exports = db;
  