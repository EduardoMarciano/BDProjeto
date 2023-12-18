function goToToken(userId) {
  let enviar = document.getElementById("enter");
  
  sessionStorage.setItem('userId', userId);

  enviar.addEventListener("click", function() {
    window.location.href = "conferir-token.html";

  });
}

function EmailIsCorrect(email) {
  let design = /\S+@\S+\.\S+/;
  let permitir = design.test(email);

  if (permitir) {
    return true;
  } else {
    fetch('popup.html')
      .then(response => response.text())
      .then(popupHTML => {
        let popupContainer = document.getElementById('popup');
        popupContainer.innerHTML = popupHTML;
      });

    return false;
  }
}

function checarDados() {
  const email = document.getElementById('request-email-password-recovery-user').value;
  const userId = sessionStorage.getItem('userId');

  if (EmailIsCorrect(email)) {
    const data = {
      email: email,
      userId: userId,
    };

    fetch('http://localhost:5600/html/conferir-email', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    }).then(response => {

      if (response.status === 200) {
        console.log('Usuário tem permissão de acesso.');
        response.text().then(userId => {
          goToToken(userId);
        });

      } else {
        console.log('Credenciais erradas.');

        fetch('popup.html')
          .then(response => response.text())
          .then(popupHTML => {
            let popupContainer = document.getElementById('popup');
            popupContainer.innerHTML = popupHTML;
            popupContainer.textContent = "E-mail não existente.";
          });
      }
    });
  }
}
