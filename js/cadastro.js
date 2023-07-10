function showPassword(n, selected_passaword) {
    console.log("test")
    var senha = document.getElementsByClassName(selected_passaword)[n];

    console.log(senha)

    var button = document.getElementsByClassName("show-password")[n];

    if (senha.type === "password") {

      senha.type = "text";
      button.querySelector("i").classList.remove("fa-eye");
      button.querySelector("i").classList.add("fa-eye-slash");

    } else {
      senha.type = "password";
      button.querySelector("i").classList.remove("fa-eye-slash");
      button.querySelector("i").classList.add("fa-eye");
    }
  }