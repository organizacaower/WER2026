fetch("../dates.json")
  .then(res => res.json())
  .then(data => {

    // Detectar idioma en la URL
    const parts = window.location.pathname.split("/");
    const lang = parts[2] || "es"; // por defecto español

    // Crear formateador de fechas según idioma
    const dateFormatter = new Intl.DateTimeFormat(lang, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // Función para convertir fecha "9 de marzo de 2026"  
    // en formato ISO para luego formatearla con Intl.DateTimeFormat
    function parseSpanishDate(spanish) {
      // Dividimos por espacios y extraemos partes
      const parts = spanish.split(" ");
      const day = parts[0];
      const month = parts[2];
      const year = parts[4];

      // Mapa simple de meses en español a número
      const months = {
        "enero": "01",
        "febrero": "02",
        "marzo": "03",
        "abril": "04",
        "mayo": "05",
        "junio": "06",
        "julio": "07",
        "agosto": "08",
        "septiembre": "09",
        "octubre": "10",
        "noviembre": "11",
        "diciembre": "12"
      };

      const mm = months[month.toLowerCase()];
      return `${year}-${mm}-${day.padStart(2, "0")}T00:00:00`;
    }

    // Renderiza una fecha con badges
    const renderFecha = (fechaObj) => {
      let html = "";

      // Si hay estado original y extendido
      if (fechaObj.status.includes("extended") && fechaObj.original) {
        const origDate = new Date(parseSpanishDate(fechaObj.original));
        html += `<del>${dateFormatter.format(origDate)}</del><br>`;
      }

      const actualDate = new Date(parseSpanishDate(fechaObj.actual));
      html += `<strong>${dateFormatter.format(actualDate)}</strong>`;

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
        headerHTML += `<th>${data[track].nombre}</th>`;
      }
    });
    headerHTML += `</tr>`;
    thead.innerHTML = headerHTML;

    // -------- Filas --------
    const filas = [
      { key: "abstract", label: { es: "Presentación de Título y resumen", en: "Title & Abstract Submission", pt: "Submissão de Título e Resumo" }[lang] },
      { key: "paper", label: { es: "Envío de artículo", en: "Paper Submission", pt: "Submissão de Artigo" }[lang] },
      { key: "notification", label: { es: "Notificación", en: "Notification", pt: "Notificação" }[lang] },
      { key: "cameraReady", label: { es: "Versión final", en: "Final Version", pt: "Versão Final" }[lang] }
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