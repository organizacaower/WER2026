fetch("../data/papers.json")
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById("papers-container");

    // Nombres completos de los tracks
    const trackNames = {
      "RRT": "Regular Research Track (WER-RT)",
      "JFT": "Journal First Track (WER-JFT)",
      "MDT": "Master's and Doctoral Track (WER-MDT)",
      "TT": "Tutorial Track (WER-TT)",
      "IT": "Industry Track (WER-IT)",
      "SRTT": "Software Requirements Tools Track (WER-SRTT)",
      "ST": "Student's Track (WER-ST)"
    };

    // Orden en que se muestran
    const ordenTracks = ["RRT","JFT","MDT","TT","IT","SRTT","ST"];

    // Formatear autores
    function formatearAutores(authors) {
      return authors.map(a => `${a.nombre} ${a.apellido}`).join(", ");
    }

    // Crear HTML de cada paper
    function crearPaperHTML(paper) {
      return `
        <li>
          <b>${paper.title}</b>
          <p><small><i>${formatearAutores(paper.authors)}</i></small></p>
        </li>
      `;
    }

    // Agrupar papers por track
    const tracks = {};
    data.forEach(p => {
      if (!tracks[p.track]) tracks[p.track] = [];
      tracks[p.track].push(p);
    });

    // Generar todo dinámicamente
    ordenTracks.forEach(track => {
      if (!tracks[track]) return;

      // Título del track
      const title = document.createElement("h3");
      title.className = "text-success";
      title.id = `${track}-title`;
      title.innerText = trackNames[track] || track;

      // Lista de papers
      const ul = document.createElement("ul");

      tracks[track].forEach(paper => {
        ul.innerHTML += crearPaperHTML(paper);
      });

      // Insertar en el DOM
      container.appendChild(title);
      container.appendChild(ul);
      container.appendChild(document.createElement("hr"));
    });

  })
  .catch(err => console.error("Error cargando JSON:", err));