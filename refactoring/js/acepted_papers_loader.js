fetch("../articulos_aceptados.json")
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById("papers-container");

    const trackNames = {
      "RRT": "Regular Research Track (WER-RT)",
      "JFT": "Journal First Track (WER-JFT)",
      "MDT": "Master's and Doctoral Track (WER-MDT)",
      "TT": "Tutorial Track (WER-TT)",
      "IT": "Industry Track (WER-IT)",
      "SRTT": "Software Requirements Tools Track (WER-SRTT)",
      "ST": "Student's Track (WER-ST)"
    };

    const ordenTracks = ["RRT","JFT","MDT","TT","IT","SRTT","ST"];

    function formatearAutores(authors) {
      return authors.map(a => `${a.nombre} ${a.apellido}`).join(", ");
    }

    // 🔥 crear cada paper con botón
    function crearPaperHTML(paper, index) {
      return `
        <li>
          <b>${paper.title}</b>
          <p><small><i>${formatearAutores(paper.authors)}</i></small></p>
          <button class="btn btn-sm btn-primary" onclick="abrirModal(${index})">
            Ver más
          </button>
        </li>
      `;
    }

    // Guardamos data global para usar en modal
    window.papersData = data;

    const tracks = {};
    data.forEach(p => {
      if (!tracks[p.track]) tracks[p.track] = [];
      tracks[p.track].push(p);
    });

    let globalIndex = 0;

    ordenTracks.forEach(track => {
      if (!tracks[track]) return;

      const title = document.createElement("h3");
      title.className = "text-success";
      title.innerText = trackNames[track];

      const ul = document.createElement("ul");

      tracks[track].forEach(paper => {
        ul.innerHTML += crearPaperHTML(paper, globalIndex);
        globalIndex++;
      });

      container.appendChild(title);
      container.appendChild(ul);
      container.appendChild(document.createElement("hr"));
    });

  });

// 🔥 función que abre el modal
function abrirModal(index) {
  const paper = window.papersData[index];

  document.getElementById("modalTitle").innerText = paper.title;
  document.getElementById("modalAuthors").innerText =
    paper.authors.map(a => `${a.nombre} ${a.apellido}`).join(", ");

  document.getElementById("modalAbstract").innerText =
    paper.abstract || "No disponible";
    document.getElementById("paper-link").innerHTML = `
  <a href="${paper.file_name}" target="_blank" class="btn btn-primary">
    Ver paper
  </a>
`;

  // Bootstrap modal
  const modal = new bootstrap.Modal(document.getElementById('paperModal'));
  modal.show();
}
