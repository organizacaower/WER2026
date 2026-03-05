//traduciones xd
const countryTranslations = {
  Brazil: {
    es: "Brasil",
    en: "Brazil",
    pt: "Brasil"
  },
  Argentina: {
    es: "Argentina",
    en: "Argentina",
    pt: "Argentina"
  },
  Germany: {
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
function translateCountry(country, lang) {
  return countryTranslations[country]?.[lang] || country;
}

async function loadCommittee() {
  const lang = getLanguageFromURL();
  const list = document.getElementById("committee-list");

  try {
    const response = await fetch("/data/committee.json");
    const committee = await response.json();

    list.innerHTML = "";

    committee.forEach(person => {
      const country = translateCountry(person.country, lang);

      const li = document.createElement("li");
      li.textContent = `${person.name}, ${person.institution}, ${country}`;
      list.appendChild(li);
    });

  } catch (error) {
    console.error("Error cargando comité:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadCommittee);