fetch("../dates.json")
  .then(res => res.json())
  .then(data => {

    const ordenTracks = ["RRT", "SRTT", "IT", "MDT", "TT", "JFT", "ST"];

    const thead = document.getElementById("tabla-head");
    const tbody = document.getElementById("tabla-body");

    // Detectar idioma desde la URL
    const parts = window.location.pathname.split("/");
    let lang = parts[2]; 
    if (!["es", "en", "pt"].includes(lang)) {
      lang = "es"; // fallback si no es uno de los esperados
    }

    // Preparar formateador de fechas según idioma
    const dateFormatter = new Intl.DateTimeFormat(lang, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // Función para parsear fecha del JSON (que están en español)
    function parseDateString(str) {
      const mapMonths = {
        "enero":"01","febrero":"02","marzo":"03","abril":"04","mayo":"05",
        "junio":"06","julio":"07","agosto":"08","septiembre":"09",
        "octubre":"10","noviembre":"11","diciembre":"12"
      };
      const parts = str.split(" ");
      const day = parts[0].padStart(2,"0");
      const month = mapMonths[parts[2].toLowerCase()] || "01";
      const year = parts[4];
      return `${year}-${month}-${day}T00:00:00`;
    }

    // Renderiza la fecha según idioma
    const renderFecha = (fechaObj) => {
      let html = "";
      if (fechaObj.status.includes("extended") && fechaObj.original) {
        html += `<del>${dateFormatter.format(new Date(parseDateString(fechaObj.original)))}</del><br>`;
      }
      html += `<strong>${dateFormatter.format(new Date(parseDateString(fechaObj.actual)))}</strong>`;

      if (fechaObj.status.includes("extended")) {
        html += `<span class="badge bg-danger ms-2">NEW</span>`;
      }
      if (fechaObj.status.includes("hard")) {
        html += `<span class="badge bg-dark ms-2">HARD DEADLINE</span>`;
      }
      return html;
    };

    // Generar el header
    let headerHTML = `<tr><th></th>`;
    ordenTracks.forEach(track => {
      if (data[track]) {
        headerHTML += `<th>${data[track].nombre}</th>`;
      }
    });
    headerHTML += `</tr>`;
    thead.innerHTML = headerHTML;

    // Traducciones de las etiquetas de filas según idioma
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