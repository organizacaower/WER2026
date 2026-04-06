const container = document.getElementById("program-container");

// idioma
const url = window.location.pathname;
const match = url.match(/\/(es|en|pt)(?:\/|$)/);
const lang = match ? match[1] : "es";

let traducciones = {};
let programa = {};
let papers = [];

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
  const match = paper.paper_session?.match(/(\d+)/);
  const session = match ? match[1] : null;
  const trackMap = {
    "RRT": "researchtrack",
    "IT": "industrytrack",
    "JFT": "journalfirsttrack",
    "SRTT": "requirementtoolstrack",
    "TT": "tutorialtrack",
    "MDT": "mastersanddoctoraltrack",
    "ST":"studentstrack"
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

      html += `
        <h4 class="${clase}" ${style}>
          ${evento.hora} | ${t(evento.titulo)}
        </h4>
      `;

      const claveEvento = normalizarKey(evento.titulo);

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

    });

    html += `</div>`;
  });

  container.innerHTML = html;
}

// cargar datos
async function cargarDatos() {
  const [progRes, tradRes, papersRes] = await Promise.all([
    fetch("../program.json"),
    fetch("../traducciones_programa.json"),
    fetch("../articulos_aceptados.json")
  ]);

  programa = await progRes.json();
  traducciones = await tradRes.json();
  papers = await papersRes.json();

  renderPrograma();
}

cargarDatos();