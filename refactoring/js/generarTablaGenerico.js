fetch("../dates.json")
  .then(res => res.json())
  .then(data => {

    // Detectar idioma desde la URL
    const parts = window.location.pathname.split("/");
    let langCandidate = parts[2] || "es";  // por defecto, español

    // Validar que sea un locale soportado
    const supported = Intl.DateTimeFormat.supportedLocalesOf([langCandidate]);
    const lang = supported.length > 0 ? supported[0] : "es";

    // Formateador de fechas según idioma
    const dateFormatter = new Intl.DateTimeFormat(lang, {
      year: "numeric", month: "long", day: "numeric"
    });

    function parseSpanishDate(spanish) {
      const mapMonths = {
        "enero":"01","febrero":"02","marzo":"03","abril":"04",
        "mayo":"05","junio":"06","julio":"07","agosto":"08",
        "septiembre":"09","octubre":"10","noviembre":"11","diciembre":"12"
      };
      const parts = spanish.split(" ");
      const day = parts[0];
      const month = mapMonths[parts[2].toLowerCase()] || "01";
      const year = parts[4];
      return `${year}-${month}-${day.padStart(2,"0")}T00:00:00`;
    }

    const renderFecha = (fechaObj) => {
      let html = "";
      if (fechaObj.status.includes("extended") && fechaObj.original) {
        html += `<del>${dateFormatter.format(new Date(parseSpanishDate(fechaObj.original)))}</del><br>`;
      }
      html += `<strong>${dateFormatter.format(new Date(parseSpanishDate(fechaObj.actual)))}</strong>`;
      if (fechaObj.status.includes("extended")) html += `<span class="badge bg-danger ms-2">NEW</span>`;
      if (fechaObj.status.includes("hard")) html += `<span class="badge bg-dark ms-2">HARD DEADLINE</span>`;
      return html;
    };

    const ordenTracks = ["RRT","SRTT","IT","MDT","TT","JFT","ST"];
    const thead = document.getElementById("tabla-head");
    const tbody = document.getElementById("tabla-body");

    let headerHTML = `<tr><th></th>`;
    ordenTracks.forEach(track => {
      if (data[track]) headerHTML += `<th>${data[track].nombre}</th>`;
    });
    headerHTML += `</tr>`;
    thead.innerHTML = headerHTML;

    const labels = {
      abstract:    { es:"Presentación de Título y resumen", en:"Title & Abstract Submission", pt:"Submissão de Título e Resumo" },
      paper:       { es:"Envío de artículo", en:"Paper Submission", pt:"Submissão de Artigo" },
      notification:{ es:"Notificación", en:"Notification", pt:"Notificação" },
      cameraReady: { es:"Versión final", en:"Final Version", pt:"Versão Final" }
    };

    Object.keys(labels).forEach(key => {
      let rowHTML = `<tr><td><strong>${labels[key][lang]}</strong></td>`;
      ordenTracks.forEach(track => {
        if (data[track]) rowHTML += `<td>${renderFecha(data[track][key])}</td>`;
      });
      rowHTML += `</tr>`;
      tbody.innerHTML += rowHTML;
    });

  })
  .catch(err => console.error("Error cargando fechas:", err));