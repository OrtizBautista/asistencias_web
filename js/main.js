document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");

  btnLogin.addEventListener("click", () => {
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();
    const mensaje = document.getElementById("mensaje");

    if (usuario === "admin" && contrasena === "admin") {
      localStorage.setItem("rol", "admin");
      window.location.href = "admin.html";
    } else if (usuario === "preceptor" && contrasena === "preceptor") {
      localStorage.setItem("rol", "preceptor");
      window.location.href = "preceptor.html";
    } else {
      mensaje.textContent = "Usuario o contraseña incorrectos.";
    }
  });
});
