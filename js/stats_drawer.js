// stats_drawer.js - WER2026 Statistics Generator with Chart.js & Leaflet

document.addEventListener("DOMContentLoaded", async () => {
  try {
    let papersData = [];
    let pcData = [];

    // 1. Fetch data files with robust fallback paths
    try {
      const pRes = await fetch("todos_paper.json");
      papersData = await pRes.json();
    } catch (e) {
      const pRes = await fetch("../data/todos_paper.json");
      papersData = await pRes.json();
    }

    try {
      const pcRes = await fetch("program_committee.json");
      pcData = await pcRes.json();
    } catch (e) {
      const pcRes = await fetch("../data/program_committee.json");
      pcData = await pcRes.json();
    }

    // 2. Translations & Maps
    const countryNames = {
      AR: "Argentina", BR: "Brasil", ES: "España", CL: "Chile", UY: "Uruguay",
      EC: "Ecuador", PT: "Portugal", PE: "Perú", DE: "Alemania", US: "Estados Unidos",
      CO: "Colombia", MX: "México", CA: "Canadá", NL: "Países Bajos", IE: "Irlanda",
      NZ: "Nueva Zelanda", IT: "Italia", UK: "Reino Unido", FR: "Francia"
    };

    const countryFlags = {
      AR: "🇦🇷", BR: "🇧🇷", ES: "🇪🇸", CL: "🇨🇱", UY: "🇺🇾", EC: "🇪🇨",
      PT: "🇵🇹", PE: "🇵🇪", DE: "🇩🇪", US: "🇺🇸", CO: "🇨🇴", MX: "🇲🇽"
    };

    const trackNames = {
      "WER-RT": "Track de Investigación (WER-RT)",
      "WER-IT": "Track de la Industria (WER-IT)",
      "WER-MDT": "Track de Maestría y Doctorado (WER-MDT)",
      "WER-SRTT": "Track de Herramientas en Requisitos de Software (WER-SRTT)",
      "WER-ST": "Track de Estudiantes (WER-ST)",
      "WER-JFT": "Journal First Track (WER-JFT)",
      "WER-TT": "Track de Tutoriales (WER-TT)"
    };

    const trackPcMap = {
      "WER-RRT": "WER-RT", "WER-RT": "WER-RT", "WER-IT": "WER-IT",
      "WER-MDT": "WER-MDT", "WER-SRTT": "WER-SRTT", "WER-ST": "WER-ST",
      "WER-JFT": "WER-JFT", "WER-TT": "WER-TT"
    };

    const pcEmail = {};
    const pcName = {};
    pcData.forEach(c => {
      if (c.email) pcEmail[c.email.toLowerCase().trim()] = c;
      if (c.name) pcName[c.name.toLowerCase().trim()] = c;
    });

    // --- DOMAIN MAP CORREGIDO ---
    const domainMap = {
      // UNLP: Rectorado (Av. 7)
      "unlp.edu.ar": ["Universidad Nacional de La Plata", "AR", -34.9131, -57.9514],
      
      "uniriotec.br": ["UNIRIO - Universidade Federal do Estado do Rio de Janeiro", "BR", -22.9560, -43.1764],
      "unirio.br": ["UNIRIO - Universidade Federal do Estado do Rio de Janeiro", "BR", -22.9560, -43.1764],
      "uno.edu.ar": ["Universidad Nacional del Oeste", "AR", -34.6650, -58.6994],
      "ufg.br": ["Universidade Federal de Goiás", "BR", -16.6050, -49.2611],
      "ecomp.poli.br": ["Universidade de Pernambuco", "BR", -8.0519, -34.8872],
      "upe.br": ["Universidade de Pernambuco", "BR", -8.0519, -34.8872],
      "ime.uerj.br": ["Universidade do Estado do Rio de Janeiro", "BR", -22.9118, -43.2356],
      "uerj.br": ["Universidade do Estado do Rio de Janeiro", "BR", -22.9118, -43.2356],
      "ufrn.br": ["Universidade Federal do Rio Grande do Norte", "BR", -5.8428, -35.2014],
      "ita.br": ["Instituto Tecnológico de Aeronáutica", "BR", -23.2105, -45.8753],
      "ufpe.br": ["Universidade Federal de Pernambuco", "BR", -8.0476, -34.9515],
      "ufc.br": ["Universidade Federal do Ceará", "BR", -3.7460, -38.5744],
      "ufrrj.br": ["Universidade Federal Rural do Rio de Janeiro", "BR", -22.7600, -43.6853],
      "ufrj.br": ["Universidade Federal do Rio de Janeiro", "BR", -22.8622, -43.2239],
      
      // UNSAAC: Campus Perayoc (Cusco)
      "unsaac.edu.pe": ["Universidad Nacional de San Antonio Abad del Cusco", "PE", -13.5228, -71.9547],
      
      // UTN: Regional La Plata (Berisso)
      "utn.edu.ar": ["Universidad Tecnológica Nacional", "AR", -34.9080, -57.9255],
      
      "ifgoiano.edu.br": ["Instituto Federal Goiano", "BR", -15.3533, -49.6108],
      "ufba.br": ["Universidade Federal da Bahia", "BR", -12.9995, -38.5110],
      "untdf.edu.ar": ["Universidad Nacional de Tierra del Fuego", "AR", -54.8070, -68.3074],
      "unca.edu.ar": ["Universidad Nacional de Catamarca", "AR", -28.4689, -65.7790],
      "unicen.edu.ar": ["Universidad Nacional del Centro de la Prov. de Buenos Aires", "AR", -37.3288, -59.1368],
      "uner.edu.ar": ["Universidad Nacional de Entre Ríos", "AR", -32.4828, -58.2319],
      "uader.edu.ar": ["Universidad Autónoma de Entre Ríos", "AR", -31.7331, -60.5173],
      "unp.edu.ar": ["Universidad Nacional de la Patagonia San Juan Bosco", "AR", -45.8647, -67.4856],
      "ufcg.edu.br": ["Universidade Federal de Campina Grande", "BR", -7.2140, -35.9080],
      "erau.edu": ["Embry-Riddle Aeronautical University", "US", 29.1895, -81.0484],
      "unahur.edu.ar": ["Universidad Nacional de Hurlingham", "AR", -34.6144, -58.6360],
      "senac.br": ["Faculdade Senac Pernambuco", "BR", -8.0520, -34.8878],
      "utfpr.edu.br": ["Universidade Tecnológica Federal do Paraná", "BR", -25.4372, -49.2700],
      "usp.br": ["Universidade de São Paulo", "BR", -23.5598, -46.7314],
      "opus-software.com.br": ["Opus Software", "BR", -23.5678, -46.6922],
      "lmu.de": ["Ludwig-Maximilians-Universität München", "DE", 48.1508, 11.5802],
      "puc-rio.br": ["Pontifícia Universidade Católica do Rio de Janeiro", "BR", -22.9791, -43.2332],
      "unioeste.br": ["Universidade Estadual do Oeste do Paraná", "BR", -24.9880, -53.4500],
      "unsl.edu.ar": ["Universidad Nacional de San Luis", "AR", -33.2982, -66.3356],
      
      // U. Belgrano: Torre Universitaria (Zabala)
      "ub.edu.ar": ["Universidad de Belgrano", "AR", -34.5635, -58.4489]
    };

    // --- EXPLICIT AUTHOR MAP CORREGIDO (Coordenadas UNLP actualizadas) ---
    const explicitAuthorMap = {
      "ritasuzana@gmail.com": ["Universidade Federal da Bahia", "BR", -12.9995, -38.5110],
      "savio.essf@gmail.com": ["Universidade Federal da Bahia", "BR", -12.9995, -38.5110],
      "larissa.barbosa11@gmail.com": ["Universidade Federal da Bahia", "BR", -12.9995, -38.5110],
      // Coordenadas actualizadas a Rectorado UNLP
      "alanrodriguezagostini71@gmail.com": ["Universidad Nacional de La Plata", "AR", -34.9131, -57.9511],
      "maxi.rodriguez.3105@gmail.com": ["Universidad Nacional de La Plata", "AR", -34.9131, -57.9511],
      "daniela_ldl@ieee.org": ["Universidad Autónoma de Entre Ríos", "AR", -31.7413, -60.5115],
      "nicolasrizzo@gmail.com": ["Universidad Autónoma de Entre Ríos", "AR", -31.7413, -60.5115],
      "gilda.romero@gmail.com": ["Universidad Autónoma de Entre Ríos", "AR", -31.7413, -60.5115]
    };

    // 3. Process Section 1: Por cada Track (Papers)
    const paperTracks = ["WER-RT", "WER-IT", "WER-MDT", "WER-SRTT", "WER-ST"];
    const trackStats = {};

    paperTracks.forEach(t => {
      trackStats[t] = {
        key: t,
        name: trackNames[t] || t,
        enviados: 0,
        aceptados: 0
      };
    });

    papersData.forEach(p => {
      const t = p.Track;
      if (!trackStats[t]) {
        trackStats[t] = { key: t, name: trackNames[t] || t, enviados: 0, aceptados: 0 };
      }
      trackStats[t].enviados += 1;
      if (p.Decision === "ACCEPT") {
        trackStats[t].aceptados += 1;
      }
    });

    // Render "Por cada Track" Cards
    const tracksContainer = document.getElementById("tracks-container");
    if (tracksContainer) {
      tracksContainer.innerHTML = "";
      Object.keys(trackStats).forEach(tKey => {
        const tData = trackStats[tKey];
        const col = document.createElement("div");
        col.className = "col-lg-4 col-md-6 mb-4";
        col.innerHTML = `
          <div class="card h-100 border-0 shadow-sm custom-track-card">
            <div class="card-header border-0 py-3 text-center" style="background-color: #0984e3 !important; color: #ffffff !important;">
              <h4 class="h5 mb-0 font-weight-bold" style="color: #ffffff !important;">${tData.name}</h4>
            </div>
            <div class="card-body p-4">
              <div class="p-3 rounded bg-light border-start border-4 border-info">
                <h6 class="fw-bold text-dark mb-3"><i class="fas fa-file-alt me-2 text-info"></i>papers</h6>
                <div class="row text-center">
                  <div class="col-6">
                    <div class="small text-muted text-uppercase fw-bold">enviados</div>
                    <div class="fs-2 fw-bold" style="color: #0984e3 !important;">${tData.enviados}</div>
                  </div>
                  <div class="col-6">
                    <div class="small text-muted text-uppercase fw-bold">aceptados</div>
                    <div class="fs-2 fw-bold" style="color: #28a745 !important;">${tData.aceptados}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        tracksContainer.appendChild(col);
      });
    }

    // 4. Process Section 2: Miembros del Comité de Programa
    const uniquePcMembers = {};
    const allPcCountriesMap = {};
    const pcTrackStats = {};

    pcData.forEach(m => {
      const rawT = m.track;
      const t = trackPcMap[rawT] || rawT;

      if (!pcTrackStats[t]) {
        pcTrackStats[t] = {
          name: trackNames[t] || t,
          cantidad: 0,
          paises: new Set()
        };
      }

      pcTrackStats[t].cantidad += 1;
      if (m.country) {
        m.country.split(',').forEach(c => {
          const cleanC = c.trim();
          if (cleanC) {
            pcTrackStats[t].paises.add(cleanC);
          }
        });
      }

      // Unique member deduplication for overall PC stats & PC Pie Chart
      const pcKey = (m.email || "").trim().toLowerCase() || (m.name || "").trim().toLowerCase();
      if (!uniquePcMembers[pcKey]) {
        uniquePcMembers[pcKey] = m;
        if (m.country) {
          m.country.split(',').forEach(c => {
            const cleanC = c.trim();
            if (cleanC) {
              allPcCountriesMap[cleanC] = (allPcCountriesMap[cleanC] || 0) + 1;
            }
          });
        }
      }
    });

    const uniquePcCount = Object.keys(uniquePcMembers).length;

    // Populate PC Cantidad Total (Personas unívocas)
    const pcTotalCantidadElem = document.getElementById("pc-total-cantidad");
    if (pcTotalCantidadElem) {
      pcTotalCantidadElem.innerText = `${uniquePcCount} miembros`;
      pcTotalCantidadElem.style.cssText = "background-color: #0984e3 !important; color: #ffffff !important; font-size: 1.25rem !important; font-weight: 700 !important; padding: 8px 20px !important; border-radius: 20px !important;";
    }

    // Populate PC Países (lista)
    const pcPaisesListaElem = document.getElementById("pc-paises-lista");
    if (pcPaisesListaElem) {
      const sortedPcCountries = Object.keys(allPcCountriesMap).sort();
      pcPaisesListaElem.innerHTML = sortedPcCountries.map(c => `
        <span class="badge me-1 mb-1 p-2 fs-6" style="background-color: #e0f2fe !important; color: #0369a1 !important; border: 1px solid #7dd3fc !important; font-weight: 600 !important;">
          ${countryFlags[c] || '🌐'} ${countryNames[c] || c}
        </span>
      `).join("");
    }

    // Render Chart 3: PC Countries Pie Chart
    if (document.getElementById("chartPcCountries") && typeof Chart !== "undefined") {
      const sortedPcPairs = Object.entries(allPcCountriesMap).sort((a, b) => b[1] - a[1]);
      const pcLabels = sortedPcPairs.map(([code]) => `${countryFlags[code] || '🌐'} ${countryNames[code] || code}`);
      const pcValues = sortedPcPairs.map(([, val]) => val);
      const distinctColors = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#9B51E0', '#E91E63', '#00BCD4', '#8BC34A', '#FF5722', '#3F51B5', '#795548', '#607D8B'];
      const countryColorMap = {
        BR: '#0088FE', AR: '#FF8042', ES: '#00C49F', CL: '#9B51E0', UY: '#FFBB28',
        EC: '#E91E63', PT: '#8BC34A', PE: '#00BCD4', DE: '#FF5722', US: '#3F51B5',
        CO: '#795548', MX: '#607D8B'
      };
      const pcColors = sortedPcPairs.map(([code], idx) => countryColorMap[code] || distinctColors[idx % distinctColors.length]);

      new Chart(document.getElementById("chartPcCountries").getContext("2d"), {
        type: 'doughnut',
        data: {
          labels: pcLabels,
          datasets: [{
            data: pcValues,
            backgroundColor: pcColors,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { font: { family: 'Rubik', size: 12 }, padding: 10 } },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const val = context.raw;
                  const pct = ((val / total) * 100).toFixed(1);
                  return `${context.label}: ${val} (${pct}%)`;
                }
              }
            }
          }
        }
      });
    }

    // Populate PC breakdown per track with BRIGHT BLUE HEADERS and HIGH-CONTRAST BLUE BADGES
    const pcBreakdownElem = document.getElementById("pc-tracks-breakdown");
    if (pcBreakdownElem) {
      pcBreakdownElem.innerHTML = "";
      Object.keys(pcTrackStats).forEach(tKey => {
        const pcTData = pcTrackStats[tKey];
        const pcCountriesArray = Array.from(pcTData.paises).sort();
        const pcCountriesHtml = pcCountriesArray.map(c => `
          <span class="badge me-1 mb-1 p-1" style="background-color: #f8f9fa !important; color: #212529 !important; border: 1px solid #dee2e6 !important; font-weight: 500 !important;">${countryFlags[c] || '🌐'} ${countryNames[c] || c}</span>
        `).join(" ");

        const col = document.createElement("div");
        col.className = "col-lg-4 col-md-6 mb-4";
        col.innerHTML = `
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-header border-0 py-2 text-center" style="background-color: #00b4d8 !important; color: #ffffff !important; font-weight: bold !important;">
              ${pcTData.name}
            </div>
            <div class="card-body p-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="small text-muted text-uppercase fw-bold">cantidad:</span>
                <span class="badge" style="background-color: #0984e3 !important; color: #ffffff !important; font-size: 0.95rem !important; font-weight: 700 !important; padding: 6px 14px !important; border-radius: 20px !important;">${pcTData.cantidad} miembros</span>
              </div>
              <div>
                <div class="small text-muted text-uppercase fw-bold mb-1">países:</div>
                <div class="d-flex flex-wrap">${pcCountriesHtml}</div>
              </div>
            </div>
          </div>
        `;
        pcBreakdownElem.appendChild(col);
      });
    }

    // 5. Process Section 3: Total (Autores, Universidades & Países de Papers ACEPTADOS)
    const acceptedPapers = papersData.filter(p => p.Decision === "ACCEPT");
    const totalEnviados = papersData.length;
    const totalAceptados = acceptedPapers.length;
    const totalRechazados = totalEnviados - totalAceptados;

    // Render Chart 1: Aceptados vs Rechazados
    if (document.getElementById("chartAcceptanceRate") && typeof Chart !== "undefined") {
      const pctAceptados = totalEnviados ? ((totalAceptados / totalEnviados) * 100).toFixed(1) : "0.0";
      const pctRechazados = totalEnviados ? ((totalRechazados / totalEnviados) * 100).toFixed(1) : "0.0";

      new Chart(document.getElementById("chartAcceptanceRate").getContext("2d"), {
        type: 'doughnut',
        data: {
          labels: [`Aceptados (${pctAceptados}%)`, `Rechazados (${pctRechazados}%)`],
          datasets: [{
            data: [totalAceptados, totalRechazados],
            backgroundColor: ['#28a745', '#dc3545'],
            borderColor: ['#1e7e34', '#bd2130'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { font: { family: 'Rubik', size: 12 } } },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const val = context.raw;
                  const pct = total ? ((val / total) * 100).toFixed(1) : "0.0";
                  return `Cantidad: ${val} (${pct}%)`;
                }
              }
            }
          }
        }
      });
    }

    // Process Accepted Authors
    const allAuthors = {};
    const universities = {};
    const authorCountriesMap = {};

    acceptedPapers.forEach(p => {
      const rawAuthors = (p.Authors || "").replace(/\n/g, " ");
      const authorList = rawAuthors.split(",").flatMap(a => a.includes(" and ") ? a.split(" and ") : [a]).map(a => a.trim()).filter(Boolean);
      const mailsList = (p.Mails || "").replace(/\n/g, " ").split(",").map(m => m.trim().toLowerCase()).filter(Boolean);

      const paperResolutions = [];
      authorList.forEach((auth, i) => {
        const mail = mailsList[i] || mailsList[0] || "";
        let inst = null, country = null, lat = null, lng = null;

        if (pcEmail[mail]) {
          inst = pcEmail[mail].institution;
          country = pcEmail[mail].country;
        } else if (pcName[auth.toLowerCase()]) {
          inst = pcName[auth.toLowerCase()].institution;
          country = pcName[auth.toLowerCase()].country;
        } else if (explicitAuthorMap[mail]) {
          [inst, country, lat, lng] = explicitAuthorMap[mail];
        } else {
          for (const [dom, info] of Object.entries(domainMap)) {
            if (mail.includes(dom)) {
              [inst, country, lat, lng] = info;
              break;
            }
          }
        }
        paperResolutions.push({ name: auth, email: mail, inst, country, lat, lng });
      });

      const paperInst = paperResolutions.find(r => r.inst)?.inst || "Universidad Nacional de La Plata";
      const paperCountry = paperResolutions.find(r => r.country)?.country || "AR";

      paperResolutions.forEach(r => {
        if (!r.inst) r.inst = paperInst;
        if (!r.country) r.country = paperCountry;

        const key = r.name.toLowerCase().trim();
        if (!allAuthors[key]) {
          allAuthors[key] = r;
          if (r.country) {
            r.country.split(',').forEach(c => {
              const cleanC = c.trim();
              if (cleanC) authorCountriesMap[cleanC] = (authorCountriesMap[cleanC] || 0) + 1;
            });
          }

          const instName = r.inst;
          if (!universities[instName]) {
            universities[instName] = {
              nombre: instName,
              pais_code: r.country,
              pais: countryNames[r.country] || r.country,
              autores_count: 0,
              lat: r.lat || -34.9205,
              lng: r.lng || -57.9536
            };
          }
          universities[instName].autores_count += 1;
        }
      });
    });

    // Total Quick Numbers
    const totalEnviadosElem = document.getElementById("total-enviados");
    const totalAceptadosElem = document.getElementById("total-aceptados");
    const totalAutoresElem = document.getElementById("total-autores");
    const totalAutoresBadgeElem = document.getElementById("total-autores-badge");

    const totalAutores = Object.keys(allAuthors).length;

    if (totalEnviadosElem) totalEnviadosElem.innerText = totalEnviados;
    if (totalAceptadosElem) totalAceptadosElem.innerText = totalAceptados;
    if (totalAutoresElem) totalAutoresElem.innerText = totalAutores;
    if (totalAutoresBadgeElem) {
      totalAutoresBadgeElem.innerText = `${totalAutores} personas`;
      totalAutoresBadgeElem.style.cssText = "background-color: #0984e3 !important; color: #ffffff !important; font-size: 1.1rem !important; font-weight: 700 !important; padding: 8px 16px !important; border-radius: 20px !important;";
    }

    // Populate Author Countries List
    const autoresPaisesElem = document.getElementById("autores-paises-lista");
    if (autoresPaisesElem) {
      const sortedCountries = Object.keys(authorCountriesMap).sort();
      autoresPaisesElem.innerHTML = sortedCountries.map(c => `
        <span class="badge me-1 mb-1 p-2 fs-6" style="background-color: #e0f2fe !important; color: #0369a1 !important; border: 1px solid #7dd3fc !important; font-weight: 600 !important;">
          ${countryFlags[c] || '🌐'} ${countryNames[c] || c}
        </span>
      `).join("");
    }

    // Render Chart 2: Accepted Authors Countries Pie Chart
    if (document.getElementById("chartAuthorsCountries") && typeof Chart !== "undefined") {
      const sortedAuthorPairs = Object.entries(authorCountriesMap).sort((a, b) => b[1] - a[1]);
      const authorLabels = sortedAuthorPairs.map(([code]) => `${countryFlags[code] || '🌐'} ${countryNames[code] || code}`);
      const authorValues = sortedAuthorPairs.map(([, val]) => val);
      const distinctColors = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#9B51E0', '#E91E63', '#00BCD4', '#8BC34A', '#FF5722', '#3F51B5', '#795548', '#607D8B'];
      const countryColorMap = {
        BR: '#0088FE', AR: '#FF8042', ES: '#00C49F', CL: '#9B51E0', UY: '#FFBB28',
        EC: '#E91E63', PT: '#8BC34A', PE: '#00BCD4', DE: '#FF5722', US: '#3F51B5',
        CO: '#795548', MX: '#607D8B'
      };
      const authorColors = sortedAuthorPairs.map(([code], idx) => countryColorMap[code] || distinctColors[idx % distinctColors.length]);

      new Chart(document.getElementById("chartAuthorsCountries").getContext("2d"), {
        type: 'doughnut',
        data: {
          labels: authorLabels,
          datasets: [{
            data: authorValues,
            backgroundColor: authorColors,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { font: { family: 'Rubik', size: 12 }, padding: 10 } },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const val = context.raw;
                  const pct = ((val / total) * 100).toFixed(1);
                  return `${context.label}: ${val} (${pct}%)`;
                }
              }
            }
          }
        }
      });
    }

    // Populate Universities Table with Explicit Dark Text Inline Styles
    const univTableBody = document.getElementById("universidades-lista-body");
    if (univTableBody) {
      univTableBody.innerHTML = "";
      const sortedUnivs = Object.values(universities).sort((a, b) => b.autores_count - a.autores_count);
      sortedUnivs.forEach((u, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="color: #212529 !important;"><strong style="color: #212529 !important;">${idx + 1}</strong></td>
          <td style="color: #212529 !important;"><i class="fas fa-university me-2 text-primary"></i><strong style="color: #212529 !important;">${u.nombre}</strong></td>
          <td style="color: #212529 !important;">${countryFlags[u.pais_code] || '🌐'} ${u.pais}</td>
          <td><span class="badge rounded-pill px-3 py-2 fs-6" style="background-color: #0984e3 !important; color: #ffffff !important; font-weight: 700 !important;">${u.autores_count} autores</span></td>
        `;
        univTableBody.appendChild(tr);
      });
    }

    // Populate Leaflet Map for Universities of ACCEPTED papers ONLY
    if (document.getElementById("map") && typeof L !== "undefined") {
      const map = L.map('map').setView([-15, -60], 3);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);

      const universityIcon = L.divIcon({
        html: '<div style="background-color: #00b4d8; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
        className: 'custom-university-marker',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      // --- LISTA COMPLETA DE 30 INSTITUCIONES CON COORDENADAS Y DIRECCIONES ---
      const univCoordsList = [
        { nombre: "Universidad Nacional de La Plata", alias: ["UNLP"], pais: "Argentina", lat: -34.9131, lng: -57.9514, direccion: "Av. 7 776, La Plata, Buenos Aires, Argentina" },
        { nombre: "Universidade do Estado do Rio de Janeiro", alias: ["UERJ"], pais: "Brasil", lat: -22.9118, lng: -43.2356, direccion: "R. São Francisco Xavier 524, Maracanã, Río de Janeiro, Brasil" },
        { nombre: "UNIRIO - Universidade Federal do Estado do Rio de Janeiro", alias: ["UNIRIO", "Universidade Federal do Estado do Rio de Janeiro"], pais: "Brasil", lat: -22.9560, lng: -43.1764, direccion: "Av. Pasteur 296, Botafogo, Río de Janeiro, Brasil" },
        { nombre: "Universidade Federal do Ceará", alias: ["UFC"], pais: "Brasil", lat: -3.7460, lng: -38.5744, direccion: "Av. da Universidade 2853, Benfica, Fortaleza - CE, Brasil" },
        { nombre: "Universidad Tecnológica Nacional – Facultad Regional La Plata", alias: ["UTN", "Universidad Tecnológica Nacional", "U.T.N. – F.R.L.P."], pais: "Argentina", lat: -34.9080, lng: -57.9255, direccion: "Av. del Petróleo Argentino esq. 124, Berisso / La Plata, Argentina" },
        { nombre: "Universidade Federal da Bahia", alias: ["UFBA", "Universidad Federal de Bahía"], pais: "Brasil", lat: -12.9995, lng: -38.5110, direccion: "Av. Milton Santos s/nº, Ondina, Salvador - BA, Brasil" },
        { nombre: "Instituto Tecnológico de Aeronáutica", alias: ["ITA"], pais: "Brasil", lat: -23.2105, lng: -45.8753, direccion: "Praça Marechal Eduardo Gomes 50, São José dos Campos - SP, Brasil" },
        { nombre: "Universidade de Brasília", alias: ["UnB", "Universidad de Brasilia"], pais: "Brasil", lat: -15.7633, lng: -47.8703, direccion: "Campus Universitário Darcy Ribeiro, Brasilia - DF, Brasil" },
        { nombre: "Universidade Estadual do Oeste do Paraná", alias: ["UNIOESTE"], pais: "Brasil", lat: -24.9880, lng: -53.4500, direccion: "R. Universitária 1619, Cascavel - PR, Brasil" },
        { nombre: "Universidade Federal de Pernambuco", alias: ["UFPE", "Universidad Federal de Pernambuco"], pais: "Brasil", lat: -8.0476, lng: -34.9515, direccion: "Av. Prof. Moraes Rego 1235, Cidade Universitária, Recife - PE, Brasil" },
        { nombre: "Universidade de São Paulo", alias: ["USP", "Universidad de São Paulo"], pais: "Brasil", lat: -23.5598, lng: -46.7314, direccion: "R. da Reitoria 374, Cidade Universitária (Butantã), São Paulo - SP, Brasil" },
        { nombre: "Pontifícia Universidade Católica do Rio de Janeiro", alias: ["PUC-Rio", "Pontificia Universidad Católica de Río de Janeiro"], pais: "Brasil", lat: -22.9791, lng: -43.2332, direccion: "R. Marquês de São Vicente 225, Gávea, Río de Janeiro, Brasil" },
        { nombre: "Universidade Federal do Rio Grande do Norte", alias: ["UFRN", "Universidad Federal de Río Grande del Norte"], pais: "Brasil", lat: -5.8428, lng: -35.2014, direccion: "Campus Universitário, Lagoa Nova, Natal - RN, Brasil" },
        { nombre: "Universidad Autónoma de Entre Ríos", alias: ["UADER", "UADER: Rectorado"], pais: "Argentina", lat: -31.7331, lng: -60.5173, direccion: "Av. Francisco Ramírez 1143, Paraná, Entre Ríos, Argentina" },
        { nombre: "Universidad Nacional del Centro de la Prov. de Buenos Aires", alias: ["UNICEN", "Universidad Nacional del Centro"], pais: "Argentina", lat: -37.3288, lng: -59.1368, direccion: "Pinto 399, Tandil, Buenos Aires, Argentina" },
        { nombre: "Universidade Federal de Goiás", alias: ["UFG", "Federal University of Goiás - Campus Samambaia"], pais: "Brasil", lat: -16.6050, lng: -49.2611, direccion: "Av. Esperança s/n, Chácaras de Recreio Samambaia, Goiânia - GO, Brasil" },
        { nombre: "Universidade de Pernambuco", alias: ["UPE", "University of Pernambuco"], pais: "Brasil", lat: -8.0519, lng: -34.8872, direccion: "Av. Gov. Agamenon Magalhães, Santo Amaro, Recife - PE, Brasil" },
        { nombre: "Universidade Federal Rural do Rio de Janeiro", alias: ["UFRRJ"], pais: "Brasil", lat: -22.7600, lng: -43.6853, direccion: "BR-465, Km 07, Seropédica - RJ, Brasil" },
        { nombre: "Instituto Federal Goiano", alias: ["IFGoiano", "Federal Institute Goiano - Campus Ceres"], pais: "Brasil", lat: -15.3533, lng: -49.6108, direccion: "GO-154, km 218, Zona Rural, Ceres - GO, Brasil" },
        { nombre: "Universidad Nacional de Entre Ríos", alias: ["UNER"], pais: "Argentina", lat: -32.4828, lng: -58.2319, direccion: "Eva Duarte de Perón 24, Concepción del Uruguay, Entre Ríos, Argentina" },
        { nombre: "Universidade Federal de Campina Grande", alias: ["UFCG", "UFCG - Campus Campina Grande"], pais: "Brasil", lat: -7.2140, lng: -35.9080, direccion: "R. Aprígio Veloso 882, Universitário, Campina Grande - PB, Brasil" },
        { nombre: "Embry-Riddle Aeronautical University", alias: ["ERAU", "Embry-Riddle Aeronautical University - Daytona Beach"], pais: "Estados Unidos", lat: 29.1895, lng: -81.0484, direccion: "1 Aerospace Blvd, Daytona Beach, Florida, Estados Unidos" },
        { nombre: "Universidad Nacional de Hurlingham", alias: ["UNAHUR"], pais: "Argentina", lat: -34.6144, lng: -58.6360, direccion: "Av. Gdor. Vergara 2222, Villa Tesei, Buenos Aires, Argentina" },
        { nombre: "Faculdade Senac Pernambuco", alias: ["Senac PE"], pais: "Brasil", lat: -8.0520, lng: -34.8878, direccion: "R. do Pombal 57, Santo Amaro, Recife - PE, Brasil" },
        { nombre: "Opus Software", alias: [], pais: "Brasil", lat: -23.5678, lng: -46.6922, direccion: "R. Butantã 500/518, 4º andar, Pinheiros, São Paulo - SP, Brasil" },
        { nombre: "Universidad Nacional de San Antonio Abad del Cusco", alias: ["UNSAAC"], pais: "Perú", lat: -13.5228, lng: -71.9547, direccion: "Av. de La Cultura 773, Cusco, Perú" },
        { nombre: "Ludwig-Maximilians-Universität München", alias: ["LMU", "Universidad de Múnich"], pais: "Alemania", lat: 48.1508, lng: 11.5802, direccion: "Geschwister-Scholl-Platz 1, Múnich, Alemania" },
        { nombre: "Universidade Federal do Rio de Janeiro", alias: ["UFRJ"], pais: "Brasil", lat: -22.8622, lng: -43.2239, direccion: "R. Antônio Barros de Castro 119, Cidade Universitária, Río de Janeiro, Brasil" },
        { nombre: "Universidad de Belgrano", alias: ["UB"], pais: "Argentina", lat: -34.5635, lng: -58.4489, direccion: "Zabala 1837, Belgrano, CABA, Argentina" },
        { nombre: "Universidad Nacional del Oeste", alias: ["UNO"], pais: "Argentina", lat: -34.6650, lng: -58.6994, direccion: "Gral. Manuel Belgrano 369, San Antonio de Padua / Merlo, Buenos Aires, Argentina" }
      ];

      // Render ALL 30 universities on Leaflet Map
      const mapItems = [...univCoordsList];
      
      // Ensure any extra universities from dataset are also added
      Object.values(universities).forEach(u => {
        const exists = mapItems.some(item => 
          item.nombre.toLowerCase().trim() === u.nombre.toLowerCase().trim() ||
          (item.alias && item.alias.some(a => a.toLowerCase().trim() === u.nombre.toLowerCase().trim())) ||
          item.nombre.toLowerCase().includes(u.nombre.toLowerCase()) ||
          u.nombre.toLowerCase().includes(item.nombre.toLowerCase())
        );
        if (!exists) {
          mapItems.push(u);
        }
      });

      mapItems.forEach(u => {
        // Find if this university has author count from paper dataset
        const matchedUnivData = Object.values(universities).find(target => 
          target.nombre.toLowerCase().trim() === u.nombre.toLowerCase().trim() ||
          (u.alias && u.alias.some(a => a.toLowerCase().trim() === target.nombre.toLowerCase().trim())) ||
          target.nombre.toLowerCase().includes(u.nombre.toLowerCase()) ||
          u.nombre.toLowerCase().includes(target.nombre.toLowerCase())
        );

        const autoresCount = matchedUnivData ? matchedUnivData.autores_count : (u.autores_count || 0);
        const lat = u.lat;
        const lng = u.lng;

        if (lat && lng) {
          const marker = L.marker([lat, lng], { icon: universityIcon }).addTo(map);
          const addressHtml = u.direccion ? `<br><small style="color:#636e72; font-size:0.8em; display:block; margin-top:2px;">📍 ${u.direccion}</small>` : '';
          const autoresBadgeHtml = autoresCount > 0 
            ? `<span style="background:#0984e3; color:#ffffff; padding:3px 10px; border-radius:12px; font-size:0.85em; margin-top:6px; display:inline-block; font-weight:bold;">👥 ${autoresCount} autor${autoresCount > 1 ? 'es' : ''}</span>`
            : `<span style="background:#dfe6e9; color:#636e72; padding:3px 10px; border-radius:12px; font-size:0.8em; margin-top:6px; display:inline-block;">🏛️ Institución</span>`;

          marker.bindPopup(`
            <div style="text-align:center; min-width:200px; padding: 4px;">
              <strong style="color:#00b4d8; font-size:1.05em; display:block; margin-bottom:2px;">${u.nombre}</strong>
              <span style="color:#2d3436; font-size:0.88em; font-weight:500;">${u.pais}</span>
              ${addressHtml}
              ${autoresBadgeHtml}
            </div>
          `);
        }
      });
    }

  } catch (err) {
    console.error("Error loading stats data:", err);
  }
});