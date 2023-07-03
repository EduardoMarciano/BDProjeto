function goToToken() {
  var enviar = document.getElementById("enter");

  enviar.addEventListener("click", function() {
    window.location.href = "conferir-token.html";

  });
}

function EmailIsCorrect() {
  //const enviarEmail = require('./node/sendMail.js');
  var emailInput = document.getElementById('request-email-password-recovery-user');
  var email = emailInput.value;

  var design = /\S+@\S+\.\S+/;
  var permitir = design.test(email);

  if (permitir) {
    //enviarEmail('meneses.m.eduardo@gmail.com');
    goToToken();
  } else {
    fetch('popup.html')
      .then(response => response.text())
      .then(popupHTML => {
        let popupContainer = document.getElementById('popup');
        popupContainer.innerHTML = popupHTML;
        popupContainer.style.backgroundColor = "brown";
      });
  }
}
