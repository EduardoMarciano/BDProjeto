import express from '../../config/node_modules/express/index.js';
import { json } from '../../config/node_modules/body-parser/index.js';
import { query as _query } from './conetion.mjs';
import { gerarToken, enviarEmail } from './sendMail.mjs';

const app = express();
const port = 5600;    
import { differenceInHours, differenceInDays, differenceInWeeks } from 'date-fns';

app.use(json());

// Habilitar o CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post("/html/cadastro", (req, res) => {
  const {username, password, email, role, gender, is_adm, course} = req.body;
  let query = 'SELECT * FROM users WHERE email = ?';

  _query(query, [email], function(err, result) {
    if (result.length <= 0) {
      query = 'INSERT INTO users (username, password, email, role, gender, is_adm, course) VALUES (?, ?, ?, ?, ?, ?, ?)';
      _query(query, [username, password, email, role, gender, is_adm, course], function(err, result) {
        console.log("Usuário Cadastrado.");
        res.status(200).send();
      });
    } else {
      return res.status(500).send("Já há usuário com este e-mail");
    }
  });
});

app.post("/html/login", (req, res) => {
  const { email, password } = req.body;
  let query = 'SELECT users.username, users.password, users.id, users.is_adm FROM users WHERE email = ?';

  _query(query, [email], function(err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao buscar usuário');
    }

    if (result.length === 1 && result[0].password === password) {
      const userId = result[0].id;
      const isAdm = result[0].is_adm;
      console.log("Entrada do Usuário permitida.")
      return res.status(200).json({ userId,isAdm });
    } else {
      return res.status(500).send("Não encontrado ou não liberado");
    }
  });
});

app.post("/html/conferir-email", (req, res) => {
  const {email} = req.body;
  let query = 'SELECT users.id FROM users WHERE email = ?';

  _query(query, [email], function(err, result) {

    if ((result.length === 1)) {
      let userId = result[0].id;
      let token = gerarToken();

      query = 'UPDATE users SET token = ? WHERE id = ?';

      _query(query, [token, userId], function(err, result) {

        enviarEmail(token, email);
        console.log("Entrada do Usuário permitida.");

        return res.status(200).send(userId.toString());

      })
    } else {
      return res.status(500).send("Não encontrado ou não liberado");
    }
  });
});

app.post("/html/conferir-token", (req, res) => {
  const {token} = req.body;
  let query = 'SELECT * from users WHERE token = ?';

  _query(query, [token], function(err, result) {
    
    if(result.length === 1){     
      console.log("Token correto.");
      return res.status(200).send();
    }else{
      return res.status(500).send("Não encontrado ou não liberado");
    }
  })
});


app.post("/html/recuperar-senha", (req, res) => {
  const {password, userId} = req.body;
  
  let query = 'SELECT * from users WHERE id = ?';
  _query(query, [userId], function(err, result) {
    
    if(result.length === 1){
      console.log('exite');
      query = 'UPDATE users SET password = ? WHERE id = ?';
      _query(query, [password, userId], function(err, result) {
        console.log(password);
        console.log("Senha cadastrada.");      
        res.status(200).send(userId.toString());
      })
    
    }else{
      return res.status(500).send("Não cadastrada.");
    }

  })
});


app.post("/html/perfil", (req, res) => {
  const {userId} = req.body;
  
  let query = 'SELECT * from users WHERE id = ?';
  _query(query, [userId], function(err, result) {
    
    if(result.length === 1){

        let username  = result[0].username;
        let role      = result[0].role;
        let email     = result[0].email;
        let image     = result[0].image;
        
        const buffer = Buffer.from(image, 'hex');
        image = buffer.toString('utf-8');

        const data = {
          username: username,
          role:     role,
          email:    email,
          userId:   userId,
          image:    image
      };
        
        console.log("Carregando dados do usuário.");      
        res.status(200).send(data);

      }
    
    else{
      return res.status(500).send("Não cadastrada.");
    }
  })
});

app.post("/html/perfil-post", (req, res) => {
  const { userId } = req.body;

  let query = `SELECT posts.*, users.username, users.created_time AS user_created_time, users.image AS user_image FROM posts 
               INNER JOIN users ON posts.user_id = users.id WHERE user_id = ?
               ORDER BY posts.created_time DESC`;

  _query(query, [userId], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao carregar os posts');
      return;
    }

    const posts = [];

    for (const element of result) {
      const post = element;

      const postDate = new Date(post.created_time);

      const hoursDiff = differenceInHours(new Date(), postDate);
      const daysDiff = differenceInDays(new Date(), postDate);
      const weeksDiff = differenceInWeeks(new Date(), postDate);

      let formattedDuration = '';

      if (hoursDiff < 24) {
        formattedDuration = `${Math.floor(hoursDiff)} horas atrás`;
      } else if (hoursDiff < 48) {
        formattedDuration = '1 dia atrás';
      } else if (daysDiff < 7) {
        formattedDuration = `${Math.floor(daysDiff)} dias atrás`;
      } else {
        formattedDuration = `${Math.floor(weeksDiff)} semanas atrás`;
      }

      // Atualize a propriedade 'created_time' com a data tratada
      post.created_time = formattedDuration;
      const buffer = Buffer.from(post.user_image, 'hex');
      post.user_image = buffer.toString('utf-8');
      posts.push({
        id: post.id,
        user_image: post.user_image,
        username: post.username,
        created_time: post.created_time,
        content: post.content
      });
    }

    res.status(200).json(posts);
  });
});


app.post("/html/feed-post", (req, res) => {

  let query = `CALL GetAllPosts()`;

  _query(query, function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao carregar os posts');
      return;
    }
    
    const posts = JSON.parse(JSON.stringify(result));
    posts[0].forEach((post) => {

      const postDate = new Date(post.created_time);
      

      const hoursDiff = differenceInHours(new Date(), postDate);
      const daysDiff = differenceInDays(new Date(), postDate);
      const weeksDiff = differenceInWeeks(new Date(), postDate);
      
      let formattedDuration = '';
      
      if (hoursDiff < 24) {
        formattedDuration = `${Math.floor(hoursDiff)} horas atrás`;
      } else if (hoursDiff < 48) {
        formattedDuration = ' 1 dia atrás';
      } else if (daysDiff < 7) {
        formattedDuration = `${Math.floor(daysDiff)}  dias atrás`;
      } else {
        formattedDuration = `${Math.floor(weeksDiff)}  semanas atrás`;
      }
      
      // Atualize a propriedade 'created_time' com a data tratada
      post.created_time = formattedDuration;
      const buffer = Buffer.from(post.user_image, 'hex');
      post.user_image = buffer.toString('utf-8');
    });

    res.status(200).json(posts);
  });
});

app.post('/html/perfil-new-post', (req, res) => {
  const { userId, content } = req.body;
  
  console.log(userId, content);

  let query = `INSERT INTO posts (user_id, content, created_time) VALUES (?, ?, NOW())`;

  _query(query, [userId, content], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao criar o novo post');
      return;
    }

    res.status(200).send('Novo post criado com sucesso');
  });
});


app.post('/html/perfil-delete-post', (req, res) => {
  const {postId} = req.body;
  let query = `DELETE FROM posts WHERE id = ? `;

  _query(query, [postId], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao deletar o novo post');
      return;
    }

    res.status(200).send('Post deletado com sucesso');
  });
});

app.post('/html/perfil-delete-user', (req, res) => {
  const {userId} = req.body;
  let query = `DELETE FROM users WHERE id = ? `;

  _query(query, [userId], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao deletar o user');
      return;
    }

    res.status(200).send('User deletado com sucesso');
  });
});

app.post("/html/editar-dados", (req, res) => {
  const { username, email, role, gender, is_adm, course, userId } = req.body;
  let query = 'SELECT * FROM users WHERE email = ?';

  _query(query, [email], function(err, result) {
    if (result.length <= 0) {
      query = 'UPDATE users SET username = ?, email = ?, role = ?, gender = ?, is_adm = ?, course = ? WHERE id = ?';
      _query(query, [username, email, role, gender, is_adm, course, userId], function(err, result) {
        console.log("Dados do usuário atualizados.");
        res.status(200).send();
      });
    } else {
      return res.status(500).send("Já há usuário com este e-mail");
    }
  });
});

app.post("/html/feed-professor", (req, res) => {
  let query = `SELECT DISTINCT
                professors.id AS professor_id,
                professors.name AS professor_name,
                departments.name AS department_name,
                disciplines.code AS discipline_code,
                disciplines.name AS discipline_name,
                turmas.id AS turma_id
              FROM
                professors
                JOIN departments ON professors.department_id = departments.id
                JOIN disciplines ON disciplines.department_id = departments.id
                JOIN turmas ON turmas.discipline_id = disciplines.id
              WHERE
                professors.id = turmas.professor_id;
`;

  _query(query, function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao carregar os posts');
      return;
    }
    const posts = JSON.parse(JSON.stringify(result));
    res.status(200).json(posts);
  });
});


app.post('/html/feed-professor-new-comment', (req, res) => {
  const { userId, professorId, content } = req.body;
  
  console.log(professorId, content);

  const query = `INSERT INTO comments (user_id, professor_id, content, likes) VALUES (?, ?, ?, 0)`;

  _query(query, [userId, professorId, content], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao criar o novo comentário');
      return;
    }

    res.status(200).send('Novo comentário criado com sucesso');
  });
});



app.post("/html/feed-professor-comments", (req, res) => {
  const { professorId } = req.body;

  let query = `SELECT
        comments.id AS comment_id,
        comments.content AS comment_content,
        comments.created_time AS comment_created_time,
        comments.likes AS comment_likes,
        comments.user_id AS user_id,
        users.username AS user_username,
        users.image AS user_image,
        users.id AS user_id
  
    FROM
      comments
      JOIN users ON comments.user_id = users.id
    WHERE
      comments.professor_id = ?
    ORDER BY
      comments.created_time DESC`;

  _query(query, [professorId], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao carregar os comentários');
      return;
    }
    const comments = JSON.parse(JSON.stringify(result));

    // Tratar a data de criação do comentário
    comments.forEach(comment => {
      const commentDate = new Date(comment.comment_created_time);
      const currentDate = new Date();
      const timeDiff = Math.abs(currentDate - commentDate);
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Comentário criado hoje
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        if (hoursDiff > 1) {
          comment.comment_created_time = `${hoursDiff} horas atrás`;
        } else {
          const minutesDiff = Math.floor(timeDiff / (1000 * 60));
          comment.comment_created_time = `${minutesDiff} minutos atrás`;
        }
      } else if (daysDiff === 1) {
        // Comentário criado ontem
        comment.comment_created_time = '1 dia atrás';
      } else {
        // Comentário criado há mais de um dia
        comment.comment_created_time = `${daysDiff} dias atrás`;
      }
      const buffer = Buffer.from(comment.user_image, 'hex');
      comment.user_image = buffer.toString('utf-8');
    });

    // Ordenar os comentários pelo mais novo primeiro
    comments.sort((a, b) => new Date(b.comment_created_time) - new Date(a.comment_created_time));

    res.status(200).json(comments);
  });
});

app.post('/html/feed-professor-like', (req, res) => {
  const {commentId } = req.body;

  // Atualizar o número de curtidas no banco de dados
  const updateQuery = `UPDATE comments SET likes = likes + 1 WHERE id = ?`;

  _query(updateQuery, [commentId], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao atualizar o número de curtidas');
      return;
    }
    // Obter o novo número de curtidas do comentário
    const selectQuery = `SELECT likes FROM comments WHERE id = ?`;

    _query(selectQuery, [commentId], function(err, result) {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao obter o número de curtidas atualizado');
        return;
      }

      const updatedLikes = result[0].likes;
      res.status(200).json({ likes: updatedLikes });
    });
  });
});


app.post('/html/perfil-update-post', (req, res) => {
  const { postId, content } = req.body;

  // Atualizar o conteúdo do post no banco de dados
  const updateQuery = `UPDATE posts SET content = ? WHERE id = ?`;

  _query(updateQuery, [content, postId], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao atualizar o post');
      return;
    }

    res.status(200).send('Post atualizado com sucesso');
  });
});


app.post('/html/feed-professor-delete-comment', (req, res) => {
  const {commentId} = req.body;
  let query = `DELETE FROM comments WHERE id = ? `;

  _query(query, [commentId ], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao deletar o novo post');
      return;
    }
    res.status(200).send('Comment deletado com sucesso');
  });
});

app.post('/html/feed-professor-report-comment', (req, res) => {
    const { userId, commentId } = req.body;
    
    // Verificar se já existe um report para o commentId
    const checkExistingReportQuery = `SELECT * FROM reports WHERE comment_id = ? LIMIT 1`;
    _query(checkExistingReportQuery, [commentId], function(err, result) {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao verificar o report existente');
        return;
      }
      
      // Se já existir um report, retornar uma mensagem informando
      if (result && result.length > 0) {
        res.status(400).send('Já existe um report para esse comment');
        return;
      }
      
      // Caso contrário, criar o novo report
      const createReportQuery = `INSERT INTO reports (user_id, comment_id) VALUES (?, ?)`;
      _query(createReportQuery, [userId, commentId], function(err, result) {
        if (err) {
          console.error(err);
          res.status(500).send('Erro ao criar o novo report');
          return;
        }
        res.status(200).send('Report criado com sucesso');
      });
    });
  });


app.post("/html/feed-report-comments", (req, res) => {
    let query = `SELECT
      comments.id AS comment_id,
      comments.content AS comment_content,
      comments.created_time AS comment_created_time,
      comments.likes AS comment_likes,
      comments.user_id AS user_id,
      users.username AS user_username,
      users.image AS user_image,
      users.id AS user_id
    FROM
      comments
      JOIN users ON comments.user_id = users.id
      JOIN UserReportsAndComments ON comments.id = UserReportsAndComments.comment_id
    WHERE
      UserReportsAndComments.report_id IS NOT NULL
    ORDER BY
      comments.created_time DESC`;
  
    _query(query, [], function(err, result) {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao carregar os comentários');
        return;
      }
      const comments = JSON.parse(JSON.stringify(result));
  

      comments.forEach(comment => {
        const commentDate = new Date(comment.comment_created_time);
        const currentDate = new Date();
        const timeDiff = Math.abs(currentDate - commentDate);
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
        if (daysDiff === 0) {

          const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
          if (hoursDiff > 1) {
            comment.comment_created_time = `${hoursDiff} horas atrás`;
          } else {
            const minutesDiff = Math.floor(timeDiff / (1000 * 60));
            comment.comment_created_time = `${minutesDiff} minutos atrás`;
          }
        } else if (daysDiff === 1) {

          comment.comment_created_time = '1 dia atrás';
        } else {

          comment.comment_created_time = `${daysDiff} dias atrás`;
        }
        const buffer = Buffer.from(comment.user_image, 'hex');
        comment.user_image = buffer.toString('utf-8');
      });
  
      // Ordenar os comentários pelo mais novo primeiro
      comments.sort((a, b) => new Date(b.comment_created_time) - new Date(a.comment_created_time));
  
      res.status(200).json(comments);
    });
  });



app.post('/html/feed-report-deny-report', (req, res) => {
  const { commentId } = req.body;

  // Excluir a denúncia da tabela "reports"
  const deleteReportQuery = `DELETE FROM reports WHERE comment_id = ?`;
  _query(deleteReportQuery, [commentId], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao recusar a denúncia');
      return;
    }

    res.status(200).send('Denúncia recusada com sucesso');
  });
});

app.post('/html/feed-report-accept-report', (req, res) => {
  const { commentId } = req.body;

  // Excluir o comentário da tabela "comments"
  const deleteCommentQuery = `DELETE FROM comments WHERE id = ?`;
  _query(deleteCommentQuery, [commentId], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao aceitar a denúncia e remover o comentário');
      return;
    }

    res.status(200).send('Denúncia aceita e comentário removido com sucesso');
  });
});

  
app.post('/html/perfil-change-image', (req, res) => {
  const userId = req.body.userId;

  let imagePath = req.body.imagePath;
  const segments = imagePath.split('\\');
  imagePath = segments[segments.length - 1];
  imagePath = "/DATA/" + imagePath

    const buffer = Buffer.from(imagePath, 'binary');

  const query = 'UPDATE users SET image = ? WHERE id = ?';
  _query(query, [buffer, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao sallet o caminho da imagem');
    }
    return res.status(200).send('Caminho da imagem atualizado com sucesso');
  });
});


app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));