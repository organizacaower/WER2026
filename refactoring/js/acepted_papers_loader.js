const container = document.getElementById("papers-container");

// 🌐 idioma
const url = window.location.pathname;
const match = url.match(/\/(es|en|pt)(?:\/|$)/);
const lang = match ? match[1] : "es";

// 🔥 track desde URL
const params = new URLSearchParams(window.location.search);
const selectedTrack = params.get("track");

// 🌐 traducciones
const translations = {
  es: {
    verMas: "Ver más",
    verPaper: "Ver paper",
    noDisponible: "No disponible",
    autores: "Autores:",
    abstract: "Resumen:"
  },
  en: {
    verMas: "View more",
    verPaper: "View paper",
    noDisponible: "Not available",
    autores: "Authors:",
    abstract: "Abstract:"
  },
  pt: {
    verMas: "Ver mais",
    verPaper: "Ver artigo",
    noDisponible: "Não disponível",
    autores: "Autores:",
    abstract: "Resumo:"
  }
};

// 🧠 nombres de tracks
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

const ordenTracks = ["RTT","JFT","MDT","TT","IT","SRTT","ST"];

fetch("../articulos_aceptados.json")
  .then(res => res.json())
  .then(data => {

    function formatearAutores(authors) {
      return authors.map(a => `${a.nombre} ${a.apellido}`).join(", ");
    }

    function crearPaperHTML(paper) {
      return `
        <li>
          <b>${paper.title}</b>
          <p><small><i>${formatearAutores(paper.authors)}</i></small></p>
          <button class="btn btn-sm btn-primary" onclick='abrirModal(${JSON.stringify(paper)})'>
            ${translations[lang].verMas}
          </button>
        </li>
      `;
    }

    // 🔥 FILTRADO POR TRACK
    let filteredData = data;
    if (selectedTrack) {
      filteredData = data.filter(p => p.track === selectedTrack);
    }

    // guardar global para modal
    window.papersData = filteredData;

    // agrupar por track
    const tracks = {};
    filteredData.forEach(p => {
      if (!tracks[p.track]) tracks[p.track] = [];
      tracks[p.track].push(p);
    });

    // 🔥 título si hay filtro
    if (selectedTrack && trackNames[lang][selectedTrack]) {
      const h2 = document.createElement("h2");
      h2.className = "mb-4";
      h2.innerText = trackNames[lang][selectedTrack];
      container.appendChild(h2);
    }

    // 🔥 decidir qué tracks mostrar
    const tracksAmostrar = selectedTrack ? [selectedTrack] : ordenTracks;

    tracksAmostrar.forEach(track => {
      if (!tracks[track]) return;

      // si NO hay filtro, mostramos títulos por track
      if (!selectedTrack) {
        const title = document.createElement("h3");
        title.className = "text-success";
        title.innerText = trackNames[lang][track];
        container.appendChild(title);
      }

      const ul = document.createElement("ul");

      tracks[track].forEach(paper => {
        ul.innerHTML += crearPaperHTML(paper);
      });

      container.appendChild(ul);
      container.appendChild(document.createElement("hr"));
    });

  });


// 🔥 MODAL
function abrirModal(paper) {
  document.getElementById("label-authors").innerText =
    translations[lang].autores;

  document.getElementById("label-abstract").innerText =
    translations[lang].abstract;

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