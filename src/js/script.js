const map = L.map('map', {
      minZoom: 2,
      maxZoom: 4,
      center: [0, 0],
      zoom: 1,
      crs: L.CRS.Simple // Coordinate Reference System - Simple for non-geographical purposes
});

// Dimensions of your map in pixels
const w = 6684/2,
      h = 4004/2,
      url = 'assets/map.webp';

// Calculate the edges of the image, in leaflet's coordinate system
const southWest = map.unproject([0, h], map.getMaxZoom() - 1),
    northEast = map.unproject([w, 0], map.getMaxZoom() - 1),
    bounds = new L.LatLngBounds(southWest, northEast);

L.imageOverlay(url, bounds).addTo(map);
map.setMaxBounds(bounds);

const locations = [
    {lat: -80, lng: 275, text: 'This is the Amberly Museum.'},
    {lat: -115, lng: 135, text: 'Second location description.'},
];

locations.forEach(function(location) {
    const marker = L.marker([location.lat, location.lng]).addTo(map);
    marker.bindPopup(location.text);

    marker.on('click', function(e) {
        map.setView(e.target.getLatLng(), 4);
    });

});

// map.on('mousemove', function(e) {
//     const lat = e.latlng.lat;
//     const lng = e.latlng.lng;
//     console.log(`Latitude: ${lat}, Longitude: ${lng}`);
// });

