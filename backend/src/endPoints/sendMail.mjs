import { createTransport } from '../../../config/node_modules/nodemailer/lib/nodemailer';
require('../../../config/node_modules/dotenv/lib/main').config();

const user = process.env.MAIL_USER;
const password = process.env.MAIL_PASSWORD;

function gerarToken(){
  let numeroAleatorio = 0;

  while (numeroAleatorio < 100000){
    numeroAleatorio =Math.floor(Math.random() * 1000000)
  
  }
  return numeroAleatorio;

}

async function enviarEmail(token, reciverMail) {
  
  const transporter = createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: user,
      pass: password
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

export default {
  gerarToken,
  enviarEmail
};