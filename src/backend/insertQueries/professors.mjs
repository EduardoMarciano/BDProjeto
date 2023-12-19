const professors = [
    { name: 'JOSE ALFREDO RUIZ letGAS',     department_id: 429 },
    { name: 'EDSON MINTSU HUNG',            department_id: 443 },
    { name: 'PEDRO GARCIA FREITAS',         department_id: 508 },
    { name: 'FLAVIA FERREIRA RAMOS ZAPATA', department_id: 518 },
    { name: 'NILO MAKIUCHI',                department_id: 524},
    { name: 'FABIANO ARAUJO SOARES',        department_id: 673},
];
  
  const checkExistingProfessorQuery = 'SELECT id FROM professors WHERE department_id = ?';
  const insertProfessorQuery = 'INSERT INTO professors (name, department_id) VALUES (?, ?)';
  
  professors.forEach((professor, index) => {
    conetion.query(checkExistingProfessorQuery, professor.department_id, (error, results) => {
      if (error) {
        console.error(`Erro ao verificar a existência do professor ${professor.name}: ${error.stack}`);
        return;
      }
  
      if (results.length > 0) {
        console.log(`Professor da disciplina ${index + 1} já existe. Ignorando inserção.`);
        return;
      }
  
      conetion.query(insertProfessorQuery, [professor.name, professor.department_id], (error, results) => {
        if (error) {
          console.error(`Erro ao inserir professor da disciplina ${index + 1}: ${error.stack}`);
          return;
        }
        console.log(`Professor ${professor.name} inserido com sucesso.`);
      });
    });
});

export default insertProfessors;