const classes = [
    { professor_id: 1, discipline_id: 1,  horario:'6M12 ', local:'FT/ENE BT',     numero:1},
    { professor_id: 2, discipline_id: 2,  horario:'24M34', local:'FT BT-13/15',   numero:2},
    { professor_id: 3, discipline_id: 3,  horario:'35T45', local:'PAT AT 021',    numero:1},
    { professor_id: 4, discipline_id: 4,  horario:'35T45', local:'ICC ANF. 6',    numero:3},
    { professor_id: 5, discipline_id: 5,  horario:'35T23', local:'PAT AT 012',    numero:2},
    { professor_id: 6, discipline_id: 6,  horario:'35T23', local:'FGA - SALA I2', numero:1},
  ];
  
  const checkExistingTurmaQuery = 'SELECT id FROM classes WHERE professor_id = ? AND discipline_id = ? AND horario = ? AND local = ? AND numero = ?';
  const insertTurmaQuery = 'INSERT INTO classes (professor_id, discipline_id, horario, local, numero) VALUES (?, ?, ?, ?, ?)';
  
  classes.forEach((turma, index) => {
    conetion.query(checkExistingTurmaQuery, [turma.professor_id, turma.discipline_id, turma.horario, turma.local, turma.numero], (error, results) => {
      if (error) {
        console.error(`Erro ao verificar a existência da turma ${index + 1}: ${error.stack}`);
        return;
      }
  
      if (results.length > 0) {
        console.log(`Turma ${index + 1} já existe. Ignorando inserção.`);
        return;
      }
  
      conetion.query(insertTurmaQuery, [turma.professor_id, turma.discipline_id, turma.horario, turma.local, turma.numero], (error, results) => {
        if (error) {
          console.error(`Erro ao inserir turma ${index + 1}: ${error.stack}`);
          return;
        }
        console.log(`Turma ${index + 1} inserida com sucesso.`);
      });
    });
  });

export default insertClasses;