//traduciones xd
const countryTranslations = {
  BR: {
    es: "Brasil",
    en: "Brazil",
    pt: "Brasil"
  },
  AR: {
    es: "Argentina",
    en: "Argentina",
    pt: "Argentina"
  },
  ES: {
    es: "España",
    en: "Spain",
    pt: "Espanha"
  },
  CL: {
    es: "Chile",
    en: "Chili",
    pt: "Pimentão"
  },
  UY: {
    es: "Uruguay",
    en: "Uruguay",
    pt: "Uruguai"
  },
  EC: {
    es: "Ecuador",
    en: "Ecuador",
    pt: "Equador"
  },
  PT: {
    es: "Portugal",
    en: "Portugal",
    pt: "Portugal"
  },
  PE: {
    es: "Peru",
    en: "Peru",
    pt: "Peru"
  },
  DE: {
    es: "Alemania",
    en: "Germany",
    pt: "Alemanha"
  }
};
function getLanguageFromURL() {
  const path = window.location.pathname.toLowerCase();

  if (/\/es(\/|$)/.test(path)) return "es";
  if (/\/pt(\/|$)/.test(path)) return "pt";
  if (/\/en(\/|$)/.test(path)) return "en";

  return "en"; // besto
}
function translateCountries(countryString,lang){

  const codes = countryString.split(",").map(c => c.trim());

  return codes
    .map(code => countryTranslations[code]?.[lang] || code)
    .join(", ");
}

async function loadCommittee(){

  const lang = getLanguageFromURL();
  const list = document.getElementById("committee-list");

  // id del body: RRT
  const pageTrack = document.body.id;

  // convertir a formato del JSON
  const jsonTrack = "WER-" + pageTrack;
  console.log(jsonTrack)

  try{

    const response = await fetch("../program_comite.json");
    const committee = await response.json();

    list.innerHTML = "";
    
    committee
      .filter(person => person.track == jsonTrack)
      .forEach(person => {

        console.log("PERSONA" + jsonTrack)
        const countries = translateCountries(person.country,lang);
        console.log("COUNTRIES" + countries)

        const li = document.createElement("li");
        li.textContent =
          `${person.name}, ${person.institution}, ${countries}`;

        list.appendChild(li);
      });

  }catch(error){
    console.error("Error cargando comité:",error);
  }
}

document.addEventListener("DOMContentLoaded",loadCommittee);