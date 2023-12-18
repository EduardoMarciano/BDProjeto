function goToPerfil() {
    let enviar = document.getElementById("signup-confirm-button");
  
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
  
  function editarDados() {
    let userId = parseInt(sessionStorage.getItem('userId'));
    const username = document.getElementById('signup-user').value;
    const gender = document.getElementById('gender').value;
    const role = document.getElementById('signup-role').value;
    const email = document.getElementById('signup-email').value;
    const course = document.getElementById('signup-course').value;
  
    if (EmailIsCorrect(email)) {
      const data = {
        username: username,
        email: email,
        role: role,
        gender: gender,
        is_adm: false,
        course: course,
        userId: userId
      };
  
      fetch('http://localhost:5600/html/editar-dados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      }).then(response => {
        if (response.status === 200) {
          console.log('Dados cadastrados com sucesso');
          goToPerfil();
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
  