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
    

    // Formateador con locale válido
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      month: "long",
      day: "numeric"
    });

    function parseDMY(str) {
      const [dd, mm, yyyy] = str.split("/");
      const d = new Date(`${yyyy}-${mm}-${dd}`); // clonar la fecha original
      d.setDate(d.getDate() + 1);         // sumarle 1 al día
      return d
    }
    function getUltimaFechaOriginal(original) {
      if (!original) return null;

      // Si es una sola fecha (string)
      if (typeof original === "string") return original;

      // Si es un arreglo de fechas ["dd/mm/yyyy", ...]
      if (Array.isArray(original)) {
        return original.reduce((max, curr) => {
          return parseDMY(curr) > parseDMY(max) ? curr : max;
        });
      }

      return null;
    }
    function renderFecha(fechaObj) {
      let html = "";
      const fechasOrdenadas = [...fechaObj.original].sort((a, b) => {
        return parseDMY(a) - parseDMY(b);
      });

      if (
        (fechaObj.status.includes("extended") || fechaObj.status.includes("hard")) &&
        fechaObj.original
      ) {

        // Si original es array → tachar todas
        if (Array.isArray(fechaObj.original)) {
         fechasOrdenadas.forEach(fecha => {
            html += `<del>${dateFormatter.format(parseDMY(fecha))}</del><br>`;
          });
        } 
        // Si es solo una fecha
        else {
          html += `<del>${dateFormatter.format(parseDMY(fechaObj.original))}</del><br>`;
        }
      }

  // fecha actual
  html += `<strong>${dateFormatter.format(parseDMY(fechaObj.actual))}</strong>`;

  if (fechaObj.status.includes("extended"))
    html += ` <span class="badge bg-warning ms-2">NEW</span>`;

  if (fechaObj.status.includes("hard"))
    html += ` <span class="badge bg-danger ms-2">HARD DEADLINE</span>`;

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
        if (data[track]) rowHTML += `<td style="white-space: nowrap;">${renderFecha(data[track][fila.key])}</td>`;
      });
      rowHTML += `</tr>`;
      tbody.innerHTML += rowHTML;
    });

  })
  .catch(err => console.error("Error cargando fechas:", err));