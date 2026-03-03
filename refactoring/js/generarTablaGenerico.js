fetch("../dates.json")
  .then(res => res.json())
  .then(data => {

    // Detectar idioma desde la URL
    const parts = window.location.pathname.split("/");
    const lang = parts[2] || "es"; // por defecto ES

    // Diccionario de traducciones para las etiquetas de filas
    const i18nLabels = {
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

    // Formateador de fechas según idioma
    const dateFormatter = new Intl.DateTimeFormat(lang, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const renderFecha = (fechaObj) => {
      let html = "";

      if (fechaObj.status.includes("extended") && fechaObj.original) {
        html += `<del>${dateFormatter.format(new Date(fechaObj.original))}</del><br>`;
      }

      html += `<strong>${dateFormatter.format(new Date(fechaObj.actual))}</strong>`;

      if (fechaObj.status.includes("extended")) {
        html += `<span class="badge bg-danger ms-2">NEW</span>`;
      }
      if (fechaObj.status.includes("hard")) {
        html += `<span class="badge bg-dark ms-2">HARD DEADLINE</span>`;
      }

      return html;
    };

    const ordenTracks = ["RRT", "SRTT", "IT", "MDT", "TT", "JFT", "ST"];

    const thead = document.getElementById("tabla-head");
    const tbody = document.getElementById("tabla-body");

    // -------- Header --------
    let headerHTML = `<tr><th></th>`;
    ordenTracks.forEach(track => {
      if (data[track]) {
        headerHTML += `<th>${track}</th>`;
      }
    });
    headerHTML += `</tr>`;
    thead.innerHTML = headerHTML;

    // -------- Filas --------
    const filas = [
      { key: "abstract", label: i18nLabels[lang].abstract },
      { key: "paper", label: i18nLabels[lang].paper },
      { key: "notification", label: i18nLabels[lang].notification },
      { key: "cameraReady", label: i18nLabels[lang].cameraReady }
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