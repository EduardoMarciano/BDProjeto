function goToLogin(userId) {
  var enviar = document.getElementById("password-recovery-confirm-button");
  
  sessionStorage.setItem('userId', userId);

  enviar.addEventListener("click", function() {
    window.location.href = "login.html";

  });
}

function passwordIsCorrect() {
  const password0 = document.getElementById('password-recovery-password-form').value;
  const password1 = document.getElementById('password-recovery-password-confirmation-form').value;
  
  var permitir = (password0 === password1);
  if (permitir) {
    return true;
  } else {
    return false;
  }
}

function checarDados() {
  const userId = parseInt(sessionStorage.getItem('userId'));
  console.log(userId);

  if (passwordIsCorrect()) {
    const password = document.getElementById('password-recovery-password-confirmation-form').value;
    const data = {
      password: password,
      userId: userId,
    };

    fetch('http://localhost:5600/html/recuperar-senha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    }).then(response => {

      if (response.status === 200) {
        console.log('Senha atualizada.');
        response.text().then(userId => {
          goToLogin(userId);
        });

      } else {
        console.log('Credenciais erradas.');
      }

    });

  } else{
    fetch('popup.html')
    .then(response => response.text())
    .then(popupHTML => {
      let popupContainer = document.getElementById('popup');
      popupContainer.innerHTML = popupHTML;
      popupContainer.textContent = "Senhas icorretas.";
    });


  }
}
function showPassword(elementId, button) {
    var form = document.getElementById(elementId);
  
    if (form.type === "password") {
      form.type = "text";
      button.querySelector("i").classList.remove("fa-eye");
      button.querySelector("i").classList.add("fa-eye-slash");
    } else {
      form.type = "password";
      button.querySelector("i").classList.remove("fa-eye-slash");
      button.querySelector("i").classList.add("fa-eye");
    }
  }