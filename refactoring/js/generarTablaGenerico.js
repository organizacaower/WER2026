fetch("../fechas_formateadas.json")
  .then(res => res.json())
  .then(data => {

    const ordenTracks = ["RRT", "SRTT", "IT", "MDT", "TT", "JFT", "ST"];
    const thead = document.getElementById("tabla-head");
    const tbody = document.getElementById("tabla-body");

    // Detectar idioma desde la ruta actual
    const parts = window.location.pathname.split("/");
    let lang = parts[2]; 
    if (!["es", "en", "pt"].includes(lang)) {
      lang = "es"; // fallback si no encuentra idioma válido
    }

    // Mapear idioma a un locale completo para Intl.DateTimeFormat
    const localeMap = {
      es: "es-ES",
      en: "en-US",
      pt: "pt-BR"
    };
    const locale = localeMap[lang] || "es-ES";

    // Crear formateador de fecha según idioma (Intl.DateTimeFormat)
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // Función para convertir dd/mm/aaaa → Date
    function parseDMY(str) {
      const [dd, mm, yyyy] = str.split("/");
      return new Date(`${yyyy}-${mm}-${dd}`);
    }

    // Renderiza una celda de fecha
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

    // Construir encabezado de tabla
    let headerHTML = `<tr><th></th>`;
    ordenTracks.forEach(track => {
      if (data[track]) headerHTML += `<th>${data[track].nombre}</th>`;
    });
    headerHTML += `</tr>`;
    thead.innerHTML = headerHTML;

    // Etiquetas traducidas por idioma
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

    // Actualizar título de tabla automáticamente si existe un elemento con id="important-dates-title"
    const titleEl = document.getElementById("important-dates-title");
    if (titleEl) titleEl.textContent = labels[lang].title;

    // Generar filas de datos con traducciones
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