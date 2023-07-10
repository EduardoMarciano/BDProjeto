function goToRecuperarSenha() {
    var enviar = document.getElementById("enter");
  
    enviar.addEventListener("click", function() {
      window.location.href = "recuperar-senha.html";
  
    });
  }
    
  function checarDados() {
    const token = document.getElementById('login-user').value;

      const data = {
        token: token,
      };
  
      fetch('http://localhost:5600/html/conferir-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      }).then(response => {
  
        if (response.status === 200) {
          console.log('Usuário tem permissão de acesso.');
          goToRecuperarSenha();
  
        } else {
          console.log('Credenciais erradas.');
  
          fetch('popup.html')
            .then(response => response.text())
            .then(popupHTML => {
              let popupContainer = document.getElementById('popup');
              popupContainer.innerHTML = popupHTML;
              popupContainer.textContent = "Token incorreto.";
            });
        }
      });
}