
fetch('../data/programacao.json')
  .then(res => res.json())
  .then(data => {
    const tabla = document.getElementById("tabla-programa");

    let html = "<thead><tr>";

    // encabezados
    data.dias.forEach(dia => {
      html += `
        <th class="bg-dark text-white">
          ${dia.dia}, ${dia.fecha}
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
            <b>${ev.hora}</b> ${ev.titulo}
          </p>
        `;
      });

      html += "</td>";
    });

    html += "</tr></tbody>";

    tabla.innerHTML = html;
  });
