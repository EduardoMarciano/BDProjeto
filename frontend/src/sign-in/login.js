function goToPerfil(userId, is_adm) {
  let enviar = document.getElementById("enter");
  
  sessionStorage.setItem('userId', userId);
  sessionStorage.setItem('is_adm', is_adm);

  enviar.addEventListener("click", function() {
    window.location.href = "perfil.html";

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
  
  const email = document.getElementById('login-user').value;
  const password = document.getElementById('login-password-form').value;

  if (EmailIsCorrect(email)) {
    const data = {
      email: email,
      password: password,
    };

  fetch('http://localhost:5600/html/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data),
})
  .then(response => {
    if (response.status === 200) {
      console.log('Usuário tem permissão de acesso.');

      response.json().then(userData => {
        goToPerfil(userData.userId, userData.isAdm);
      });
    } else {
      console.log('Credenciais erradas.');

      fetch('popup.html')
        .then(response => response.text())
        .then(popupHTML => {
          let popupContainer = document.getElementById('popup');
          popupContainer.innerHTML = popupHTML;
          popupContainer.textContent = "E-mail e/ou senha incorreto(a).";
        });
    }
  });
  }
}

function showPassword(elementId, button) {
  let form = document.getElementById(elementId);

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