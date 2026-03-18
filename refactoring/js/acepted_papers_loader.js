fetch("../articulos_aceptados.json")
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById("papers-container");
    const url = window.location.pathname;
    const match = url.match(/\/(es|en|pt)(?:\/|$)/);
    const lang = match ? match[1] : "es";
    const translations = {
      es: {
        verMas: "Ver más",
        verPaper: "Ver paper",
        noDisponible: "No disponible"
      },
      en: {
        verMas: "View more",
        verPaper: "View paper",
        noDisponible: "Not available"
      },
      pt: {
        verMas: "Ver mais",
        verPaper: "Ver artigo",
        noDisponible: "Não disponível"
      }
    };

    const trackNames = {
      es: {
        RRT: "Track de investigación (WER-RT)",
        SRTT: "Track de herramientas en Requisitos de Software (WER-SRTT)",
        IT: "Track de la Industria (WER-IT)",
        MDT: "Track de trabajos Doctorales y de Maestría (WER-MDT)",
        TT: "Track de Tutoriales (WER-TT)",
        JFT: "Journal First Track (WER-JFT)",
        ST: "Track de Estudiantes (WER-ST)"
      },
      en: {
        RRT: "Regular Research Track (WER-RT)",
        SRTT: "Software Requirements Tools Track (WER-SRTT)",
        IT: "Industry Track (WER-IT)",
        MDT: "Master's and Doctoral Track (WER-MDT)",
        TT: "Tutorial Track (WER-TT)",
        JFT: "Journal First Track (WER-JFT)",
        ST: "Student's Track (WER-ST)"
      },
      pt: {
        RRT: "Trilha de Pesquisa (WER-RT)",
        SRTT: "Trilha de Ferramentas de Requisitos de Software (WER-SRTT)",
        IT: "Trilha da Indústria (WER-IT)",
        MDT: "Trilha de Mestrado e Doutorado (WER-MDT)",
        TT: "Trilha de Tutoriais (WER-TT)",
        JFT: "Journal First Track (WER-JFT)",
        ST: "Trilha de Estudantes (WER-ST)"
      }
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
          ${translations[lang].verMas}
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
      title.innerText = trackNames[lang][track];

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
    paper.abstract || translations[lang].noDisponible;

  document.getElementById("paper-link").innerHTML = `
    <div class="text-end">
      <a href="${paper.file_name}" target="_blank" class="btn btn-primary">
        ${translations[lang].verPaper}
      </a>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('paperModal'));
  modal.show();
}
