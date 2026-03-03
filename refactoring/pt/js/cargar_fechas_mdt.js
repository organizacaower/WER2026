
fetch('../dates.json')   // <-- tu archivo JSON
  .then(response => response.json())
  .then(data => {

    const rrt = data.MDT;   // 🔹 Solo Regular Research Track
    const lista = document.getElementById('fechas-lista');

    const fechas = [
      { label: "Presentación de Título y Resumen", value: rrt.abstract.actual },
      { label: "Envío de artículo", value: rrt.paper.actual },
      { label: "Notificación", value: rrt.notification.actual },
      { label: "Versión final", value: rrt.cameraReady.actual }
    ];

    fechas.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `${item.label}: <b>${item.value}</b>`;
      lista.appendChild(li);
    });

  })
  .catch(error => console.error("Error cargando fechas:", error));
