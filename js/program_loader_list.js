const container = document.getElementById("program-container");

// idioma
const url = window.location.pathname;
const match = url.match(/\/(es|en|pt)(?:\/|$)/);
const lang = match ? match[1] : "es";

let traducciones = {};
let programa = {};
let papers = [];

const textosDetalle = {
  es: {
    coordinador: "Coordinador",
    panelistas: "Panelistas",
    verMasPanel: "Ver más detalles del panel",
    titulo: "Título",
    presentadores: "Presentadores"
  },
  en: {
    coordinador: "Coordinator",
    panelistas: "Panelists",
    verMasPanel: "View panel details",
    titulo: "Title",
    presentadores: "Presenters"
  },
  pt: {
    coordinador: "Coordenador",
    panelistas: "Painelistas",
    verMasPanel: "Ver mais detalhes do painel",
    titulo: "Título",
    presentadores: "Apresentadores"
  }
};

// 🔧 normalizador (CLAVE para que todo coincida)
function normalizarKey(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// traducción
function t(key) {
  const k = normalizarKey(key);
  return traducciones[lang]?.[k] || key;
}


function obtenerClavePrograma(paper) {
  if (paper.paper_session) {
    const sessionNorm = normalizarKey(paper.paper_session);
    if (sessionNorm === "industrytrack" || sessionNorm === "industry") {
      return "industry";
    }
  }

  const match = paper.paper_session?.match(/(\d+)/);
  const session = match ? match[1] : null;
  const trackMap = {
    "RRT": "researchtrack",
    "IT": "industryandsrtt",
    "IT1": "industry",
    "JFT": "journalfirsttrack",
    "SRTT": "industryandsrtt",
    "TT": "tutorialtrack",
    "MDT": "mastersanddoctoraltrack",
    "ST": "studentstrack"
  };

  const base = trackMap[paper.track] || "";

  // ✔ con sesión
  if (session) {
    return normalizarKey(`${base}session${session}`);

  }

  // ✔ sin sesión → solo track
  return normalizarKey(base);
}

// 📦 agrupar papers
function agruparPapers(papers) {
  const grupos = {};

  papers.forEach(paper => {
    const clave = obtenerClavePrograma(paper);

    if (!grupos[clave]) {
      grupos[clave] = [];
    }

    grupos[clave].push(paper);
  });

  return grupos;
}

// estilos
function getClase(evento) {
  if (evento.tipo === "break") {
    if (normalizarKey(evento.titulo).includes("almoco")) {
      return "bg-primary text-white";
    }
    return "bg-dark text-white";
  }
  return "";
}

// render
function renderPrograma() {
  const papersPorSesion = agruparPapers(papers);

  let html = "";

  programa.dias.forEach((dia, index) => {

    html += `<div class="content">`;

    html += `
      <h2 id="day-${index + 1}" class="text-success">
        ${t(dia.dia)}, ${t(dia.fecha)}
      </h2>
    `;

    dia.eventos.forEach(evento => {

      const clase = getClase(evento);
      const style = clase
        ? 'style="padding:7px 12px; border-radius:10px;"'
        : '';

      if (evento.tipo === "note") {
        html += `
          <p class="text-muted fst-italic mt-3">
            ${t(evento.titulo)}
          </p>
        `;
      } else {
        const horaStr = evento.hora ? `${evento.hora} | ` : "";
        html += `
          <h4 class="${clase}" ${style}>
            ${horaStr}${t(evento.titulo)}
          </h4>
        `;
      }

      const claveEvento = normalizarKey(evento.titulo);

      // 🔥 eventos especiales (Panel de Industria y Tutorial)
      if (claveEvento === "panelindustria" || claveEvento.includes("panelindustria")) {
        const txt = textosDetalle[lang] || textosDetalle.es;
        html += `
          <ul>
            <li>
              <b>${txt.coordinador}:</b> Alejandro Oliveros<br>
              <b>${txt.panelistas}:</b> Sandra D'Agostino, Marcelo Talamona, Diego Fontdevila<br>
              <a href="industryPanel.html" class="text-primary"><small>${txt.verMasPanel} &rarr;</small></a>
            </li>
          </ul>
        `;
      } else if (claveEvento === "tutorialtrack" || claveEvento === "tutorialcontinuacion") {
        const txt = textosDetalle[lang] || textosDetalle.es;
        html += `
          <ul>
            <li>
              <b>${txt.titulo}:</b> Visión Socio-Técnica de la Gestión de los Requisitos<br>
              <small><b>${txt.presentadores}:</b> Graciela D.S. Hadad &amp; Julio C.S.P. Leite</small><br>
            </li>
          </ul>
        `;
      } else {
        // 🔥 buscar papers (con fallback a track)
        let papersEvento = papersPorSesion[claveEvento];

        if (!papersEvento) {
          const claveTrack = claveEvento.replace(/session\d+/, "");
          papersEvento = papersPorSesion[claveTrack];
        }

        // render
        if (papersEvento) {
          html += `<ul>`;

          papersEvento.forEach(paper => {
            const autores = paper.authors
              .map(a => `${a.nombre} ${a.apellido}`)
              .join(", ");

            html += `
              <li>
                <b>${paper.title}</b><br>
                <small>${autores}</small><br>
              </li>
            `;
          });

          html += `</ul>`;
        }
      }

    });

    html += `</div>`;
  });

  container.innerHTML = html;
}

// cargar datos
async function cargarDatos() {
  const [progRes, tradRes, papersRes] = await Promise.all([
    fetch("../data/program.json"),
    fetch("../data/traducciones_programa.json"),
    fetch("../data/articulos_aceptados.json")
  ]);

  programa = await progRes.json();
  traducciones = await tradRes.json();
  papers = await papersRes.json();

  renderPrograma();
}

cargarDatos();