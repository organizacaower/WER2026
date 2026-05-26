  var map = L.map('map').setView([-34.9214, -57.9544], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);


  // 🔥 FIX CLAVE
  setTimeout(function () {
    map.invalidateSize();
  }, 200);

  // UTN FRLP
  L.marker([-34.9042599, -57.9262465])
    .addTo(map)
    .bindPopup("UTN FRLP (WER)");

  // Facultad de Informática UNLP
  L.marker([-34.90348, -57.9376558])
    .addTo(map)
    .bindPopup("Facultad de Informática UNLP");

  // Plaza Moreno
  L.marker([-34.9211, -57.9545])
    .addTo(map)
    .bindPopup("Plaza Moreno / Catedral");

  // Hoteles (ejemplo centrado)
  L.marker([-34.9230, -57.9560])
    .addTo(map)
    .bindPopup("Zona de Hoteles");

  // Aeropuerto Ezeiza
  L.marker([-34.8222, -58.5358])
    .addTo(map)
    .bindPopup("Aeropuerto Ezeiza");

  // Aeroparque
  L.marker([-34.5592, -58.4156])
    .addTo(map)
    .bindPopup("Aeroparque");