fetch("../fechas_formateadas.json")
  .then(res => res.json())
  .then(data => {

    const ordenTracks = ["RRT","SRTT","IT","MDT","TT","JFT","ST"];
    const thead = document.getElementById("tabla-head");
    const tbody = document.getElementById("tabla-body");

    // Detectar idioma en la URL usando expresión regular
    const url = window.location.pathname;

    // Intentar encontrar 'es', 'en' o 'pt' en cualquier parte de la ruta
    const match = url.match(/\/(es|en|pt)(?:\/|$)/);

    // Si se encontró, usamos ese; si no, fallback a 'es'
    let lang = match ? match[1] : "es";
    // Mapear a locales completos
    const localeMap = {
      es: "es-ES",
      en: "en-US",
      pt: "pt-BR"
    };
    const locale = localeMap[lang];
    console.log(locale)

    // Formateador con locale válido
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    function parseDMY(str) {
      const [dd, mm, yyyy] = str.split("/");
      return new Date(`${yyyy}-${mm}-${dd}`);
    }

    function renderFecha(fechaObj) {
      let html = "";
      if (fechaObj.status.includes("extended") && fechaObj.original) {
        html += `<del>${dateFormatter.format(parseDMY(fechaObj.original))}</del><br>`;
      }
      html += `<strong>${dateFormatter.format(parseDMY(fechaObj.actual))}</strong>`;
      if (fechaObj.status.includes("extended")) html += ` <span class="badge bg-danger ms-2">NEW</span>`;
      if (fechaObj.status.includes("hard"))     html += ` <span class="badge bg-dark ms-2">HARD DEADLINE</span>`;
      return html;
    }

    let headerHTML = `<tr><th></th>`;
    ordenTracks.forEach(track => {
      if (data[track]) headerHTML += `<th>${data[track].nombre}</th>`;
    });
    headerHTML += `</tr>`;
    thead.innerHTML = headerHTML;

    const labels = {
      es: {
        title: "Fechas Importantes",
        abstract: "Presentación de Título y resumen",
        paper: "Envío de artículo",
        notification: "Notificación",
        cameraReady: "Versión final"
      },
      en: {
        title: "Important Dates",
        abstract: "Title & Abstract Submission",
        paper: "Paper Submission",
        notification: "Notification",
        cameraReady: "Final Version"
      },
      pt: {
        title: "Datas Importantes",
        abstract: "Submissão de Título e Resumo",
        paper: "Submissão de Artigo",
        notification: "Notificação",
        cameraReady: "Versão Final"
      }
    };

    const titleEl = document.getElementById("important-dates-title");
    if (titleEl) titleEl.textContent = labels[lang].title;

    const filas = [
      { key: "abstract", label: labels[lang].abstract },
      { key: "paper", label: labels[lang].paper },
      { key: "notification", label: labels[lang].notification },
      { key: "cameraReady", label: labels[lang].cameraReady }
    ];

    filas.forEach(fila => {
      let rowHTML = `<tr><td><strong>${fila.label}</strong></td>`;
      ordenTracks.forEach(track => {
        if (data[track]) rowHTML += `<td>${renderFecha(data[track][fila.key])}</td>`;
      });
      rowHTML += `</tr>`;
      tbody.innerHTML += rowHTML;
    });

  })
  .catch(err => console.error("Error cargando fechas:", err));