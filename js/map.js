  var map = L.map('map').setView([-34.9214, -57.9544], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);


const lugares = [
  { nombre: "UTN", coords: [-34.904184, -57.9265614] },
  { nombre: "Plaza Moreno", coords: [-34.9211, -57.9545] },
  { nombre: "Ezeiza", coords: [-34.8222, -58.5358] },
  { nombre: "Aeroparque", coords: [-34.5592, -58.4156] }
];

const markers = [];

lugares.forEach(l => {
  const m = L.marker(l.coords).addTo(map).bindPopup(l.nombre);
  markers.push(m);
});

const group = L.featureGroup(markers);
map.fitBounds(group.getBounds());