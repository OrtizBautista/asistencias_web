document.addEventListener("DOMContentLoaded", () => {
  const rol = localStorage.getItem("rol");
  if (!rol) {
    window.location.href = "index.html";
    return;
  }

  const alumnos = [
    { id: 1, nombre: "Goku" },
    { id: 2, nombre: "Vegeta" },
    { id: 3, nombre: "Gohan" },
    { id: 4, nombre: "Piccolo" },
    { id: 5, nombre: "Krillin" }
  ];

  // --- Página del preceptor ---
  if (document.body.contains(document.getElementById("tablaAlumnos"))) {
    const tabla = document.querySelector("#tablaAlumnos tbody");
    const fechaInput = document.getElementById("fecha");
    fechaInput.valueAsDate = new Date();

    alumnos.forEach(al => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${al.nombre}</td>
        <td class="has-text-success"><input type="checkbox" data-id="${al.id}" data-estado="Presente"></td>
        <td class="has-text-warning"><input type="checkbox" data-id="${al.id}" data-estado="Tarde"></td>
        <td class="has-text-danger"><input type="checkbox" data-id="${al.id}" data-estado="Ausente"></td>
      `;
      tabla.appendChild(fila);
    });

    document.getElementById("btnGuardar").addEventListener("click", () => {
      const fecha = fechaInput.value;
      if (!fecha) return alert("Seleccioná una fecha.");

      const checkboxes = document.querySelectorAll("#tablaAlumnos input[type='checkbox']");
      let asistencias = JSON.parse(localStorage.getItem("asistencias")) || {};
      if (!asistencias[fecha]) asistencias[fecha] = [];

      checkboxes.forEach(chk => {
        const id = parseInt(chk.dataset.id);
        const estado = chk.dataset.estado;
        const fila = chk.closest("tr");

        // Si el checkbox está marcado, guardamos el estado
        if (chk.checked) {
          const alumno = alumnos.find(a => a.id === id);
          asistencias[fecha].push({ id, nombre: alumno.nombre, estado });

          // Aplicar color visual a la fila
          fila.classList.remove("is-success", "is-warning", "is-danger");
          if (estado === "Presente") fila.classList.add("is-success");
          if (estado === "Tarde") fila.classList.add("is-warning");
          if (estado === "Ausente") fila.classList.add("is-danger");
        }
      });

      localStorage.setItem("asistencias", JSON.stringify(asistencias));
      alert("Asistencias guardadas correctamente.");
    });

    // --- Lógica para que solo se pueda marcar 1 opción por alumno ---
    const allCheckboxes = document.querySelectorAll("#tablaAlumnos input[type='checkbox']");
    allCheckboxes.forEach(chk => {
      chk.addEventListener("change", () => {
        if (chk.checked) {
          // Desmarcar otros checkboxes del mismo alumno
          const id = chk.dataset.id;
          document.querySelectorAll(`#tablaAlumnos input[data-id='${id}']`).forEach(c => {
            if (c !== chk) c.checked = false;
          });
        }
      });
    });
  }

});
// --- Página del admin ---
if (document.body.contains(document.getElementById("tablaReporte"))) {
  const btnVer = document.getElementById("btnVer");
  const tablaReporte = document.querySelector("#tablaReporte tbody");

  btnVer.addEventListener("click", () => {
    const fecha = document.getElementById("fechaReporte").value;
    if (!fecha) return alert("Seleccioná una fecha.");
    tablaReporte.innerHTML = "";

    const asistencias = JSON.parse(localStorage.getItem("asistencias")) || {};
    const registros = asistencias[fecha] || [];

    if (registros.length === 0) {
      tablaReporte.innerHTML = `<tr><td colspan="4">No hay asistencias registradas para esta fecha.</td></tr>`;
      return;
    }

    registros.forEach(r => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${r.nombre}</td>
        <td class="has-text-success">${r.estado === "Presente" ? "✔" : ""}</td>
        <td class="has-text-warning">${r.estado === "Tarde" ? "✔" : ""}</td>
        <td class="has-text-danger">${r.estado === "Ausente" ? "✔" : ""}</td>
      `;
      tablaReporte.appendChild(fila);
    });
  });
}
