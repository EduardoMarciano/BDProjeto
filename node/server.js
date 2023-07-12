const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./geraEntidades.js');
const { gerarToken, enviarEmail } = require('./sendMail.js');
const app = express();
const port = 5600;    
const { differenceInHours, differenceInDays, differenceInWeeks } = require('date-fns');

app.use(bodyParser.json());

// Habilitar o CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post("/html/cadastro", (req, res) => {
  const {username, password, email, role, gender, is_adm, course} = req.body;
  var query = 'SELECT * FROM users WHERE email = ?';

  connection.query(query, [email], function(err, result) {
    if (result.length <= 0) {
      query = 'INSERT INTO users (username, password, email, role, gender, is_adm, course) VALUES (?, ?, ?, ?, ?, ?, ?)';
      connection.query(query, [username, password, email, role, gender, is_adm, course], function(err, result) {
        console.log("Usuário Cadastrado.");
        res.status(200).send();
      });
    } else {
      return res.status(500).send("Já há usuário com este e-mail");
    }
  });
});

app.post("/html/login", (req, res) => {
  const {email, password} = req.body;
  var query = 'SELECT users.username, users.password, users.id FROM users WHERE email = ?';

  connection.query(query, [email], function(err, result) {

    if ((result.length === 1) && (result[0].password === password)) {
      const userId = result[0].id;
      console.log("Entrada do Usuário permitida.")
      return res.status(200).send(userId.toString());
    } else {
      return res.status(500).send("Não encontrado ou não liberado");
    }
  });
});

app.post("/html/conferir-email", (req, res) => {
  const {email} = req.body;
  var query = 'SELECT users.id FROM users WHERE email = ?';

  connection.query(query, [email], function(err, result) {

    if ((result.length === 1)) {
      var userId = result[0].id;
      var token = gerarToken();

      query = 'UPDATE users SET token = ? WHERE id = ?';

      connection.query(query, [token, userId], function(err, result) {

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
  query = 'SELECT * from users WHERE token = ?';

  connection.query(query, [token], function(err, result) {
    
    if(result.length === 1){     
      console.log("Token correto.");
      return res.status(200).send(userId.toString());
    }else{
      return res.status(500).send("Não encontrado ou não liberado");
    }
  })
});


app.post("/html/recuperar-senha", (req, res) => {
  const {password, userId} = req.body;
  
  var query = 'SELECT * from users WHERE id = ?';
  connection.query(query, [userId], function(err, result) {
    
    if(result.length === 1){
      console.log('exite');
      query = 'UPDATE users SET password = ? WHERE id = ?';
      connection.query(query, [password, userId], function(err, result) {
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
  
  var query = 'SELECT * from users WHERE id = ?';
  connection.query(query, [userId], function(err, result) {
    
    if(result.length === 1){

        var username  = result[0].username;
        var role     = result[0].role;
        var email     = result[0].email;

        const data = {
          username: username,
          role:     role,
          email:    email,
          userId:   userId,
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

  var query = `SELECT posts.*, users.username, users.created_time AS user_created_time, users.image AS user_image FROM posts 
               INNER JOIN users ON posts.user_id = users.id WHERE user_id = ?
               ORDER BY posts.created_time DESC`;

  connection.query(query, [userId], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao carregar os posts');
      return;
    }

    const posts = [];

    for (let i = 0; i < result.length; i++) {
      const post = result[i];

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
  const { userId } = req.body;

  var query = `CALL GetAllPosts()`;

  connection.query(query, function(err, result) {
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
    });

    res.status(200).json(posts);
  });
});

app.post('/html/perfil-new-post', (req, res) => {
  const { userId, content } = req.body;
  
  console.log(userId, content);

  var query = `INSERT INTO posts (user_id, content, created_time) VALUES (?, ?, NOW())`;

  connection.query(query, [userId, content], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao criar o novo post');
      return;
    }

    res.status(200).send('Novo post criado com sucesso');
  });
});


app.post('/html/perfil-delete-post', (req, res) => {
  const { userId, postId } = req.body;
  var query = `DELETE FROM posts WHERE id = ? `;

  connection.query(query, [postId], function(err, result) {
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
  var query = `DELETE FROM users WHERE id = ? `;

  connection.query(query, [userId], function(err, result) {
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
  var query = 'SELECT * FROM users WHERE email = ?';

  connection.query(query, [email], function(err, result) {
    if (result.length <= 0) {
      query = 'UPDATE users SET username = ?, email = ?, role = ?, gender = ?, is_adm = ?, course = ? WHERE id = ?';
      connection.query(query, [username, email, role, gender, is_adm, course, userId], function(err, result) {
        console.log("Dados do usuário atualizados.");
        res.status(200).send();
      });
    } else {
      return res.status(500).send("Já há usuário com este e-mail");
    }
  });
});

app.post("/html/feed-professor", (req, res) => {
  const { userId } = req.body;

  var query = `SELECT DISTINCT
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

  connection.query(query, function(err, result) {
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

  const query = `INSERT INTO comments (user_id, professor_id, content) VALUES (?, ?, ?)`;

  connection.query(query, [userId, professorId, content], function(err, result) {
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

  var query = `SELECT
                comments.id AS comment_id,
                comments.content AS comment_content,
                comments.created_time AS comment_created_time,
                users.username AS user_username,
                users.image AS user_image
              FROM
                comments
                JOIN users ON comments.user_id = users.id
              WHERE
                comments.professor_id = ?
              ORDER BY
                comments.created_time DESC`;

  connection.query(query, [professorId], function(err, result) {
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
    });

    // Ordenar os comentários pelo mais novo primeiro
    comments.sort((a, b) => new Date(b.comment_created_time) - new Date(a.comment_created_time));

    res.status(200).json(comments);
  });
});

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));