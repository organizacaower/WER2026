fetch("../dates_ddmmaaaa.json")
  .then(res => res.json())
  .then(data => {

    const ordenTracks = ["RRT", "SRTT", "IT", "MDT", "TT", "JFT", "ST"];
    const thead = document.getElementById("tabla-head");
    const tbody = document.getElementById("tabla-body");

    // Detectar idioma de la ruta
    const parts = window.location.pathname.split("/");
    let lang = parts[2];
    if (!["es","en","pt"].includes(lang)) lang = "es";

    // Crear formateador de fecha para mostrar
    const dateFormatter = new Intl.DateTimeFormat(lang, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // Parsea dd/mm/aaaa a Date
    function parseDMY(str) {
      const [dd, mm, yyyy] = str.split("/");
      return new Date(`${yyyy}-${mm}-${dd}`);
    }

    // Renderiza
    function renderFecha(fechaObj) {
      let html = "";
      if (fechaObj.status.includes("extended") && fechaObj.original) {
        html += `<del>${dateFormatter.format(parseDMY(fechaObj.original))}</del><br>`;
      }
      html += `<strong>${dateFormatter.format(parseDMY(fechaObj.actual))}</strong>`;

      if (fechaObj.status.includes("extended")) html += `<span class="badge bg-danger ms-2">NEW</span>`;
      if (fechaObj.status.includes("hard")) html += `<span class="badge bg-dark ms-2">HARD DEADLINE</span>`;
      return html;
    }

    // Header
    let headerHTML = `<tr><th></th>`;
    ordenTracks.forEach(track => {
      if (data[track]) headerHTML += `<th>${data[track].nombre}</th>`;
    });
    headerHTML += `</tr>`;
    thead.innerHTML = headerHTML;

    // Etiquetas traducibles
    const labels = {
      es: {
        abstract: "Presentación de Título y resumen",
        paper: "Envío de artículo",
        notification: "Notificación",
        cameraReady: "Versión final"
      },
      en: {
        abstract: "Title & Abstract Submission",
        paper: "Paper Submission",
        notification: "Notification",
        cameraReady: "Final Version"
      },
      pt: {
        abstract: "Submissão de Título e Resumo",
        paper: "Submissão de Artigo",
        notification: "Notificação",
        cameraReady: "Versão Final"
      }
    };

    const filas = [
      { key: "abstract", label: labels[lang].abstract },
      { key: "paper", label: labels[lang].paper },
      { key: "notification", label: labels[lang].notification },
      { key: "cameraReady", label: labels[lang].cameraReady }
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