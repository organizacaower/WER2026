fetch('../dates.json')
  .then(response => response.json())
  .then(data => {

    // ✨ Leer el atributo data-track desde el HTML
    const trackKey = document.body.dataset.track;

    if (!trackKey || !data[trackKey]) {
      console.error("Track no encontrado en JSON:", trackKey);
      return;
    }

    const trackData = data[trackKey];
    const lista = document.getElementById('fechas-lista');

    const fechas = [
      { label: "Presentación de Título y Resumen", value: trackData.abstract.actual },
      { label: "Envío de artículo",                 value: trackData.paper.actual },
      { label: "Notificación",                       value: trackData.notification.actual },
      { label: "Versión final",                      value: trackData.cameraReady.actual }
    ];

    fechas.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `${item.label}: <b>${item.value}</b>`;
      lista.appendChild(li);
    });

  })
  .catch(error => console.error("Error cargando fechas:", error));