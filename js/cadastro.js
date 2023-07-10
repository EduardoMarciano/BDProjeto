function goToLogin() {
  var enviar = document.getElementById("signup-confirm-button");

  enviar.addEventListener("click", function() {
    window.location.href = "login.html";
  });
}

function EmailIsCorrect(email) {
  var design = /\S+@\S+\.\S+/;
  var permitir = design.test(email);

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

function enviarDados() {
  const username = document.getElementById('signup-user').value;
  const gender = document.getElementById('gender').value;
  const role = document.getElementById('signup-role').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password-form').value;

  if (EmailIsCorrect(email)) {
    const data = {
      username: username,
      password: password,
      email: email,
      role: role,
      gender: gender,
      is_adm: false
    };

    fetch('http://localhost:5600/html/cadastro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    }).then(response => {
      if (response.status === 200) {
        console.log('Usuário cadastrado com sucesso');
        goToLogin();
      } else {
        console.log('Já cadastrado ou erro na consulta.');

        fetch('popup.html')
          .then(response => response.text())
          .then(popupHTML => {
            let popupContainer = document.getElementById('popup');
            popupContainer.innerHTML = popupHTML;
            popupContainer.textContent = "Já há um usuário cadastrado com este e-mail.";
          });
      }
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
