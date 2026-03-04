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
    // 🇮🇳 Detectar idioma en la URL con regex
    const url = window.location.pathname;
    const match = url.match(/\/(es|en|pt)(?:\/|$)/);

    // Si se encontró, usamos ese; si no, fallback a 'es'
    let lang = match ? match[1] : "es";
    console.log("Idioma detectado:", lang);

    // 🔤 Mapear a locales completos para Intl.DateTimeFormat
    const localeMap = {
      es: "es-ES",
      en: "en-US",
      pt: "pt-BR"
    };
    const locale = localeMap[lang] || "es-ES";

    // 🗓 Crear formateador de fechas según idioma
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // 🧩 Función para parsear dd/mm/aaaa → Date
    function parseDMY(str) {
      const [dd, mm, yyyy] = str.split("/");
      return new Date(`${yyyy}-${mm}-${dd}`);
    }

    // ---------------------
    // 📍 Diccionario de traducciones
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

    // ✏️ Actualizar título si existe
    const titleEl = document.getElementById("important-dates-title");
    if (titleEl) titleEl.textContent = labels[lang].title;

    // ---------------------
    // 🪄 Armar la lista de fechas con traducción
    const fechas = [
      { label: labels[lang].abstract,      value: dateFormatter.format(parseDMY(trackData.abstract.actual)) },
      { label: labels[lang].paper,         value: dateFormatter.format(parseDMY(trackData.paper.actual)) },
      { label: labels[lang].notification,  value: dateFormatter.format(parseDMY(trackData.notification.actual)) },
      { label: labels[lang].cameraReady,   value: dateFormatter.format(parseDMY(trackData.cameraReady.actual)) }
    ];

    fechas.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `${item.label}: <b>${item.value}</b>`;
      lista.appendChild(li);
    });

  })
  .catch(error => console.error("Error cargando fechas:", error));