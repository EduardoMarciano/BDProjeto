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
               INNER JOIN users ON posts.user_id = users.id WHERE user_id = ?`;

  connection.query(query, [userId], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao carregar os posts');
      return;
    }

    const posts = [];

    for (let i = 0; i < result.length; i++) {
      const post = result[i];
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

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
