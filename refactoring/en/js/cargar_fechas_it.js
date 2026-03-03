
fetch('../dates.json')   // <-- tu archivo JSON
  .then(response => response.json())
  .then(data => {

    const rrt = data.IT;   // 🔹 Solo Regular Research Track
    const lista = document.getElementById('fechas-lista');

    const fechas = [
      { label: "Abstract submission deadline", value: rrt.abstract.actual },
      { label: "Paper submission", value: rrt.paper.actual },
      { label: "Notification", value: rrt.notification.actual },
      { label: "Camera-ready", value: rrt.cameraReady.actual }
    ];

    fechas.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `${item.label}: <b>${item.value}</b>`;
      lista.appendChild(li);
    });

  })
  .catch(error => console.error("Error cargando fechas:", error));
