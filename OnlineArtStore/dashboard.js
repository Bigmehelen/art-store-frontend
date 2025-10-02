function goToLogin() {
  window.location.href = "sign-in/login.html";
}

function goToRegister() {
  window.location.href = "sign-in/signup.html";
}

document.getElementById("loginBtn").addEventListener("click", goToLogin);
document.getElementById("registerBtn").addEventListener("click", goToRegister);
