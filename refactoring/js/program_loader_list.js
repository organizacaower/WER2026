const container = document.getElementById("program-container");

// idioma desde URL
const url = window.location.pathname;
const match = url.match(/\/(es|en|pt)(?:\/|$)/);
const lang = match ? match[1] : "es";

let traducciones = {};
let programa = {};

// 🔧 NORMALIZADOR (CLAVE)
function normalizarKey(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/[^a-z0-9]/g, ""); // quitar espacios, /, etc
}

// traducción segura
function t(key) {
  const k = normalizarKey(key);
  return traducciones[lang]?.[k] || key;
}

// estilos tipo bloque
function getClase(evento) {
  if (evento.tipo === "break") {
    if (normalizarKey(evento.titulo).includes("almoco")) {
      return "bg-primary text-white"; // almuerzo
    }
    return "bg-dark text-white"; // coffee
  }
  return "";
}

function renderPrograma() {
  let html = "";

  programa.dias.forEach((dia, index) => {

    html += `<div class="content">`;

    // encabezado día
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
    });

    html += `</div>`;
  });

  container.innerHTML = html;
}

// cargar datos
async function cargarDatos() {
  const [progRes, tradRes] = await Promise.all([
    fetch("../program.json"),
    fetch("../traducciones_programa.json")
  ]);

  programa = await progRes.json();
  traducciones = await tradRes.json();

  renderPrograma();
}

cargarDatos();