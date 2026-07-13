// ============================================
    // 📊 GRÁFICO DE TORTA: Aceptados vs Rechazados
    // ============================================
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Aceptados', 'Rechazados'],
            datasets: [{
                data: [71, 116],
                backgroundColor: [
                    '#28a745',
                    '#dc3545'
                ],
                borderColor: [
                    '#1e7e34',
                    '#bd2130'
                ],
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: { size: 14 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

    // ============================================
    // 📊 GRÁFICO DE BARRAS: Participantes por País
    // ============================================
    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: [
                'Argentina', 'Brasil', 'España', 'Colombia', 'México',
                'Chile', 'Perú', 'Uruguay', 'Ecuador', 'Portugal'
            ],
            datasets: [{
                label: 'Participantes',
                data: [45, 28, 22, 18, 15, 12, 10, 8, 6, 5],
                backgroundColor: [
                    '#74b9ff', '#00b894', '#fdcb6e', '#e17055', '#6c5ce7',
                    '#00cec9', '#fd79a8', '#ffeaa7', '#55a3f8', '#a29bfe'
                ],
                borderColor: [
                    '#0984e3', '#00a381', '#e5b85c', '#d63031', '#5f3dc4',
                    '#00b5b0', '#e84393', '#f0d895', '#3d8ef5', '#8680f7'
                ],
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: { size: 12 }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { size: 12 }
                    }
                }
            }
        }
    });

    // ============================================
    // 🗺️ MAPA DEL MUNDO: Universidades
    // ============================================
    const map = L.map('map').setView([20, -20], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Datos ficticios de universidades
    const universidades = [
        { nombre: "Universidad de Buenos Aires", pais: "Argentina", lat: -34.6037, lng: -58.3816, papers: 12 },
        { nombre: "Universidad Nacional de La Plata", pais: "Argentina", lat: -34.9205, lng: -57.9536, papers: 8 },
        { nombre: "Universidad Nacional de Córdoba", pais: "Argentina", lat: -31.4201, lng: -64.1888, papers: 6 },
        { nombre: "USP - Universidade de São Paulo", pais: "Brasil", lat: -23.5505, lng: -46.6333, papers: 15 },
        { nombre: "UNICAMP", pais: "Brasil", lat: -22.8184, lng: -47.0563, papers: 9 },
        { nombre: "Universidad de Chile", pais: "Chile", lat: -33.4489, lng: -70.6693, papers: 7 },
        { nombre: "Pontificia UC de Chile", pais: "Chile", lat: -33.4419, lng: -70.6452, papers: 5 },
        { nombre: "Universidad de los Andes", pais: "Colombia", lat: 4.6492, lng: -74.0628, papers: 8 },
        { nombre: "Universidad Nacional de Colombia", pais: "Colombia", lat: 4.6389, lng: -74.0817, papers: 6 },
        { nombre: "UNAM", pais: "México", lat: 19.3366, lng: -99.1887, papers: 10 },
        { nombre: "ITESM", pais: "México", lat: 25.6514, lng: -100.2895, papers: 7 },
        { nombre: "Universidad de Sevilla", pais: "España", lat: 37.3891, lng: -5.9845, papers: 9 },
        { nombre: "Universidad Politécnica de Madrid", pais: "España", lat: 40.4528, lng: -3.6835, papers: 6 },
        { nombre: "Universidad de Valladolid", pais: "España", lat: 41.6521, lng: -4.7245, papers: 4 },
        { nombre: "Universidad de la República", pais: "Uruguay", lat: -34.9011, lng: -56.1645, papers: 5 },
        { nombre: "ESPOL", pais: "Ecuador", lat: -2.1456, lng: -79.9639, papers: 4 },
        { nombre: "PUCP", pais: "Perú", lat: -12.0685, lng: -76.9813, papers: 5 },
        { nombre: "Universidad de San Martín", pais: "Perú", lat: -12.0776, lng: -76.9771, papers: 3 },
        { nombre: "Universidad de Lisboa", pais: "Portugal", lat: 38.7369, lng: -9.1427, papers: 4 },
        { nombre: "University of Auckland", pais: "Nueva Zelanda", lat: -36.8509, lng: 174.7645, papers: 3 },
        { nombre: "MIT", pais: "EE.UU.", lat: 42.3601, lng: -71.0942, papers: 2 },
        { nombre: "University of Twente", pais: "Países Bajos", lat: 52.2389, lng: 6.8484, papers: 3 },
        { nombre: "University of Limerick", pais: "Irlanda", lat: 52.6738, lng: -8.5772, papers: 2 },
        { nombre: "University of Victoria", pais: "Canadá", lat: 48.4634, lng: -123.3117, papers: 2 }
    ];

    // Icono personalizado para los marcadores
    const universityIcon = L.divIcon({
        html: '<div style="background-color: #0984e3; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
        className: 'custom-university-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    // Agregar marcadores al mapa
    universidades.forEach(u => {
        const marker = L.marker([u.lat, u.lng], { icon: universityIcon }).addTo(map);
        marker.bindPopup(`
            <div style="text-align:center; min-width:180px;">
                <strong style="color:#0984e3;">${u.nombre}</strong><br>
                <small style="color:#636e72;">📍 ${u.pais}</small><br>
                <span style="background:#dfe6e9; padding:3px 10px; border-radius:10px; font-size:0.85em; margin-top:5px; display:inline-block;">
                    📄 ${u.papers} papers
                </span>
            </div>
        `);
    });