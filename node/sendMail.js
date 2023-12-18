const nodemailer = require('nodemailer');

function gerarToken(){
  let numeroAleatorio = 0;

  while (numeroAleatorio < 100000){
    numeroAleatorio =Math.floor(Math.random() * 1000000)
  
  }
  return numeroAleatorio;

}

async function enviarEmail(token, reciverMail) {
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: 'PROCESSOTRAINEECJR@outlook.com',
      pass: '!!jKzWZv@M4QMeW@'
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });

  const mailOptions = {

    
    from: 'PROCESSOTRAINEECJR@outlook.com',
    to: reciverMail,
    subject: 'Token para redefinir senha.',
    text:  "Aqui está seu token de autenticação: "+ token + ". Obrigado pela preferência."
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  gerarToken,
  enviarEmail
};