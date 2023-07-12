// Função para imprimir os dados dos professores
function printarProfessores() {
    const dadosProfessores = [
      { id: 1, nome: 'Professor 1'},
      { id: 2, nome: 'Professor 2'},
      { id: 3, nome: 'Professor 3'}
    ];
  
    for (const professor of dadosProfessores) {
      console.log(`Professor: ${professor.nome}`);
      printarAlunosPorProfessor(professor.id);
      console.log('-----------------------');
    }
  
    console.log('Todos os alunos dos professores foram impressos.');
  }
  
  // Função para imprimir os alunos de um professor específico
  function printarAlunosPorProfessor(professorId) {
    const dadosAlunos = {
      1: ['Aluno 1', 'Aluno 2', 'Aluno 3'],
      2: ['Aluno 4', 'Aluno 5'],
      3: ['Aluno 6', 'Aluno 7', 'Aluno 8', 'Aluno 9']
    };
  
    const alunos = dadosAlunos[professorId];
    for (const aluno of alunos) {
      console.log(`Aluno: ${aluno}`);
    }
  }
  
  // Chama a função para imprimir os dados dos professores
  printarProfessores();