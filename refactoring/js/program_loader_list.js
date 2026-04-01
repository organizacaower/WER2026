const container = document.getElementById("program-container");

// detectar idioma desde URL
const url = window.location.pathname;
const match = url.match(/\/(es|en|pt)(?:\/|$)/);
const lang = match ? match[1] : "es";

let traducciones = {};
let programa = {};

// función de traducción
function t(key) {
  return traducciones[lang]?.[key] || key;
}

// cargar JSONs
async function cargarDatos() {
  try {
    const [progRes, tradRes] = await Promise.all([
      fetch("../program.json"),
      fetch("../traducciones_programa.json")
    ]);

    programa = await progRes.json();
    traducciones = await tradRes.json();

    renderPrograma();

  } catch (error) {
    console.error("Error cargando datos:", error);
  }
}

// render
function renderPrograma() {
  let html = "";

  programa.dias.forEach(dia => {

    html += `
      <div class="dia">
        <h2> ${t(dia.dia)}, ${t(dia.fecha)}</h2>
        <ul class="lista-eventos">
    `;

    dia.eventos.forEach(evento => {
      html += `
        <li class="evento">
          <span class="hora">${evento.hora}</span>
          <span class="titulo">${t(evento.titulo)}</span>
        </li>
      `;
    });

    html += `
        </ul>
      </div>
    `;
  });

  container.innerHTML = html;
}

// iniciar
cargarDatos();