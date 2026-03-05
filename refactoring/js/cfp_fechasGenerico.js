fetch("../fechas_formateadas.json")
  .then(res => res.json())
  .then(data => {

    // ✨ Leer el atributo data-track desde el HTML
    const trackKey = document.body.dataset.track;

    if (!trackKey || !data[trackKey]) {
      console.error("Track no encontrado en JSON:", trackKey);
      return;
    }

    const trackData = data[trackKey];
    const lista = document.getElementById('fechas-lista');

    // ---------------------
    // 🌍 Detectar idioma en la URL
    const url = window.location.pathname;
    const match = url.match(/\/(es|en|pt)(?:\/|$)/);
    let lang = match ? match[1] : "es";

    const localeMap = {
      es: "es-ES",
      en: "en-US",
      pt: "pt-BR"
    };
    const locale = localeMap[lang] || "es-ES";

    // 🗓 Formateador de fechas
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // ---------------------
    // 🧩 Parse dd/mm/yyyy → Date
    function parseDMY(str) {
      const [dd, mm, yyyy] = str.split("/");
      const d = new Date(`${yyyy}-${mm}-${dd}`);
      d.setDate(d.getDate() + 1); // mantener coherencia con el otro script
      return d;
    }

    // ---------------------
    // 🕒 Tomar la fecha original más nueva si es un arreglo
    function getUltimaOriginal(original) {
      if (!original) return null;
      if (typeof original === "string") return original;

      if (Array.isArray(original)) {
        return original.reduce((max, curr) =>
          parseDMY(curr) > parseDMY(max) ? curr : max
        );
      }
      return null;
    }

    // ---------------------
    // 🎨 Render de una fecha con extensiones
    function renderFecha(fechaObj) {
      let html = "";

      // Normalizar originales a array
      let originales = [];
      if (fechaObj.original) {
        originales = Array.isArray(fechaObj.original)
          ? fechaObj.original
          : [fechaObj.original];
      }

      // Ordenar originales: viaja a nueva
      originales.sort((a, b) => parseDMY(a) - parseDMY(b));

      // 👉 Fecha actual (siempre arriba)
      html += `<strong>${dateFormatter.format(parseDMY(fechaObj.actual))}</strong>`;

      if (fechaObj.status.includes("extended"))
        html += ` <span class="badge bg-warning ms-2">NEW</span>`;

      if (fechaObj.status.includes("hard"))
        html += ` <span class="badge bg-danger ms-2">HARD DEADLINE</span>`;

      // 👉 Fechas anteriores tachadas
      originales.forEach(fecha => {
        html += `<br><del>${dateFormatter.format(parseDMY(fecha))}</del>`;
      });

      return html;
    }

    // ---------------------
    // 📍 Traducciones
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

    // ✏️ Título
    const titleEl = document.getElementById("important-dates-title");
    if (titleEl) titleEl.textContent = labels[lang].title;

    // ---------------------
    // 🪄 Armar lista dinámica
    const fechas = [
      { key: "abstract",     label: labels[lang].abstract },
      { key: "paper",        label: labels[lang].paper },
      { key: "notification", label: labels[lang].notification },
      { key: "cameraReady",  label: labels[lang].cameraReady }
    ];

    fechas.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `${item.label}: ${renderFecha(trackData[item.key])}`;
      lista.appendChild(li);
    });

  })
  .catch(error => console.error("Error cargando fechas:", error));