fetch("../dates.json")
  .then(res => res.json())
  .then(data => {

    const ordenTracks = ["RRT", "SRTT", "IT", "MDT", "TT", "JFT", "ST"];

    const thead = document.getElementById("tabla-head");
    const tbody = document.getElementById("tabla-body");

    // -------- FUNCION PARA RENDERIZAR UNA FECHA --------
    const renderFecha = (fechaObj) => {

      let html = "";

      if (fechaObj.status.includes("extended") && fechaObj.original) {
        html += `<del>${fechaObj.original}</del><br>`;
      }

      html += `<strong>${fechaObj.actual}</strong>`;

      if (fechaObj.status.includes("extended")) {
        html += `<span class="badge bg-danger ms-2">NEW</span>`;
      }

      if (fechaObj.status.includes("hard")) {
        html += `<span class="badge bg-dark ms-2">HARD DEADLINE</span>`;
      }

      return html;
    };

    // -------- GENERAR HEADER --------
    let headerHTML = `<tr><th></th>`;

    ordenTracks.forEach(track => {
      if (data[track]) {
        headerHTML += `<th>${track}</th>`;
      }
    });

    headerHTML += `</tr>`;
    thead.innerHTML = headerHTML;

    // -------- FILAS --------
    const filas = [
      { key: "abstract", label: "Presentación de Título y resumen" },
      { key: "paper", label: "Envío de artículo" },
      { key: "notification", label: "Notificación" },
      { key: "cameraReady", label: "Versión final" }
    ];

    filas.forEach(fila => {

      let rowHTML = `<tr><td><strong>${fila.label}</strong></td>`;

      ordenTracks.forEach(track => {
        if (data[track]) {
          rowHTML += `<td>${renderFecha(data[track][fila.key])}</td>`;
        }
      });

      rowHTML += `</tr>`;
      tbody.innerHTML += rowHTML;

    });

  })
  .catch(err => console.error("Error cargando fechas:", err));