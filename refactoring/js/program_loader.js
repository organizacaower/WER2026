document.addEventListener("DOMContentLoaded", () => {

  // detectar idioma (URL o <html lang>)
  const url = window.location.pathname;
  const match = url.match(/\/(es|en|pt)(?:\/|$)/);
  const lang = match
    ? match[1]
    : (document.documentElement.lang || "es");

  console.log("LANG:", lang);

  // cargar ambos JSON en paralelo
  Promise.all([
    fetch('../program.json').then(res => {
      if (!res.ok) throw new Error("Error cargando program.json");
      return res.json();
    }),
    fetch('../traducciones_programa.json').then(res => {
      if (!res.ok) throw new Error("Error cargando traducciones_programa.json");
      return res.json();
    })
  ])
  .then(([programa, traducciones]) => {

    const tabla = document.getElementById("tabla-programa");

    if (!tabla) {
      console.error("No existe #tabla-programa");
      return;
    }

    // helper traducción
    const tDia = (id) =>
      traducciones?.[lang]?.dias?.[id] ||
      traducciones?.es?.dias?.[id] ||
      id;

    const tEvento = (id) =>
      traducciones?.[lang]?.eventos?.[id] ||
      traducciones?.es?.eventos?.[id] ||
      id;

    let html = "<thead><tr>";

    // encabezados
    programa.dias.forEach(dia => {
      html += `
        <th class="bg-dark text-white">
          ${tDia(dia.dia_id)}, ${dia.fecha}
        </th>`;
    });

    html += "</tr></thead><tbody><tr>";

    // contenido
    programa.dias.forEach(dia => {
      html += "<td>";

      if (!dia.eventos) {
        html += "</td>";
        return;
      }

      dia.eventos.forEach(ev => {

        let clase = "";

        if (ev.tipo === "break") {
          clase = "bg-primary text-white rounded p-1";
        }

        html += `
          <p class="${clase}">
            <b>${ev.hora || ""}</b> ${tEvento(ev.titulo_id)}
          </p>
        `;
      });

      html += "</td>";
    });

    html += "</tr></tbody>";

    tabla.innerHTML = html;

  })
  .catch(error => {
    console.error("Error general:", error);
  });

});