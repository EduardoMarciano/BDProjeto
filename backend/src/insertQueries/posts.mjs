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
    conetion.query(checkExistingPostQuery, [post.user_id, post.content], (error, results) => {
      if (error) {
        console.error(`Erro ao verificar a existência do post ${index + 1}: ${error.stack}`);
        return;
      }
  
      if (results.length > 0) {
        console.log(`Post ${index + 1} já existe para o usuário ${post.user_id}. Ignorando inserção.`);
        return;
      }
  
      conetion.query(insertPostQuery, [post.user_id, post.content], (error, results) => {
        if (error) {
          console.error(`Erro ao inserir post ${index + 1}: ${error.stack}`);
          return;
        }
        console.log(`Post ${index + 1} inserido com sucesso.`);
      });
    });
  });

export default insertPosts;