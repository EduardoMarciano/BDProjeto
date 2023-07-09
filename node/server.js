const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db.js');
const { gerarToken, enviarEmail } = require('./sendMail.js');
const app = express();
const port = 5600;

app.use(bodyParser.json());

// Habilitar o CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post("/html/cadastro", (req, res) => {
  const {username, password, email, role, gender, is_adm} = req.body;
  var query = 'SELECT * FROM users WHERE email = ?';

  connection.query(query, [email], function(err, result) {
    if (result.length <= 0) {
      query = 'INSERT INTO users (username, password, email, role, gender, is_adm) VALUES (?, ?, ?, ?, ?, ?)';
      connection.query(query, [username, password, email, role, gender, is_adm], function(err, result) {
        console.log("Usuário Cadastrado.");
        return res.status(200).send("Usuário Cadastrado.");
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





app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));