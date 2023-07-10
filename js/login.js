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