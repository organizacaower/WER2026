fetch('../program.json')
  .then(res => res.json())
  .then(data => {

    const tabla = document.getElementById("tabla-programa");

    // detectar idioma desde URL
    const url = window.location.pathname;
    const match = url.match(/\/(es|en|pt)(?:\/|$)/);
    const lang = match ? match[1] : "es";
    console.log("LANG:", lang);
    // helper de traducción (con fallback)
    const t = (obj) => obj?.[lang] || obj?.es || "";

    let html = "<thead><tr>";

    // encabezados
    data.dias.forEach(dia => {
      html += `
        <th class="bg-dark text-white">
          ${t(dia.dia)}, ${dia.fecha}
        </th>`;
    });

    html += "</tr></thead><tbody><tr>";

    // contenido
    data.dias.forEach(dia => {
      html += "<td>";

      dia.eventos.forEach(ev => {

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
  });