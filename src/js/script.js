const MAP_WIDTH = 6684 / 2,
    MAP_HEIGHT = 4004 / 2,
    MAP_URL = 'assets/map.webp',
    POLYGON_COLOR = '#00f',
    MAX_ZOOM = 4,
    MIN_ZOOM = 2,
    INITIAL_ZOOM = 1,
    DEBUG_MODE = false; // Set to true for debugging

const map = L.map('map', {
    attributionControl: false,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    center: [0, 0],
    zoom: INITIAL_ZOOM,
    crs: L.CRS.Simple
});

const bounds = new L.LatLngBounds(
    map.unproject([0, MAP_HEIGHT], MAX_ZOOM - 1),
    map.unproject([MAP_WIDTH, 0], MAX_ZOOM - 1)
);

L.imageOverlay(MAP_URL, bounds).addTo(map);
map.setMaxBounds(bounds);

const marker_locations = [
    {lat: -87, lng: 375, text:'1'},
    {lat: -95, lng: 384, text:'2'},
    {lat: -53, lng: 314, text:'Train Station'},
    {lat: -71, lng: 322, text:'3'},
    {lat: -71, lng: 250, text:'4'},
    {lat: -115, lng: 272, text:'5'},
    {lat: -115, lng: 327, text:'6'},
    {lat: -104, lng: 348, text:'7'},
    {lat: -111, lng: 232, text:'8'},
    {lat: -113, lng: 224, text:'9'},
    {lat: -121, lng: 200, text:'10'},
    {lat: -98, lng: 207, text:'11'},
    {lat: -80, lng: 275, text: 'Main Building'},
    {lat: -107, lng: 174, text:'12'},
    {lat: -120, lng: 151, text:'13'},
    {lat: -118, lng: 111, text:'14'},
    {lat: -198, lng: 68, text:'15'},
    {lat: -163, lng: 20, text:'16'},
    {lat: -29, lng: 100, text:'Bus Stop?'},
    {lat: -125, lng: 70, text:'17'}
];
const area_coords = [
    [-102, 191],
    [-103, 195],
    [-105, 198],
    [-114, 201],
    [-119, 184],
    [-123, 164],
    [-119, 162],
    [-117, 163],
    [-111, 187],
    [-105, 187]
];

const area = L.polygon(area_coords, {color: POLYGON_COLOR}).addTo(map);
area.bindPopup('This is a colored region.');
area.on('click', () => map.fitBounds(area.getBounds()));

marker_locations.forEach(location => addMarker(location));

function addMarker(location) {
    const marker = L.marker([location.lat, location.lng]).addTo(map);
    marker.bindPopup(location.text);
    marker.on('click', e => map.setView(e.target.getLatLng(), MAX_ZOOM));
}

if (DEBUG_MODE) {
    map.on('click', function(e) {
        const lat = Math.round(e.latlng.lat);
        const lng = Math.round(e.latlng.lng);
        const formattedText = `{lat: ${lat}, lng: ${lng}, text:''},`;
        navigator.clipboard.writeText(formattedText).then(() => {
            console.log('Coordinates copied to clipboard:', formattedText);
        }).catch(err => {
            console.error('Failed to copy coordinates to clipboard:', err);
        });
    });
}

