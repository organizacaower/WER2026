document.addEventListener("DOMContentLoaded", () => {

  const url = window.location.pathname;
  const match = url.match(/\/(es|en|pt)(?:\/|$)/);
  const lang = match
    ? match[1]
    : (document.documentElement.lang || "es");

  console.log("LANG:", lang);

  Promise.all([
    fetch('../program.json').then(res => res.json()),
    fetch('../traducciones_programa.json').then(res => res.json())
  ])
  .then(([programa, traducciones]) => {

    const tabla = document.getElementById("tabla-programa");

    // 🔥 NORMALIZAR TEXTO → clave
    const normalize = (str) =>
      str
        ?.toLowerCase()
        .normalize("NFD")                 // quita tildes
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");             // quita espacios

    // 🔥 TRADUCTOR
    const t = (texto) => {
      const key = normalize(texto);
      return traducciones?.[lang]?.[key]
          || traducciones?.es?.[key]
          || texto;
    };

    let html = "<thead><tr>";

    // encabezados
    programa.dias.forEach(dia => {
      html += `
        <th class="bg-dark text-white">
          ${t(dia.dia)}, ${dia.fecha}
        </th>`;
    });

    html += "</tr></thead><tbody><tr>";

    // contenido
    programa.dias.forEach(dia => {
      html += "<td>";

      dia.eventos?.forEach(ev => {

        let clase = "";

        if (ev.tipo === "break") {
          clase = "bg-primary text-white rounded p-1";
        }

        html += `
          <p class="${clase}">
            <b>${ev.hora || ""}</b> ${t(ev.titulo)}
          </p>
        `;
      });

      html += "</td>";
    });

    html += "</tr></tbody>";

    tabla.innerHTML = html;

  })
  .catch(err => console.error("ERROR:", err));

});