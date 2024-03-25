function createColoredMarkerIcon(color) {
    const markerHtml = `
        <div class="pin">
            <div class="pin-top" style="border-color: ${color}"></div>
            <div class="pin-bottom" style="border-top: 17px solid ${color}"></div>
        </div>`;

    return L.divIcon({
        className: "custom-pin",
        iconAnchor: [12, 37],
        popupAnchor: [1, -28],
        html: markerHtml
    });
}

function addMarker(marker) {
    const titleHTML = marker.title ? `<h1 class="pin-title">${marker.title}</h1>` : '';
    const textHTML = marker.text ? `<p>${marker.text}</p>` : '';

    const popupContent = `${titleHTML}${textHTML}`;

    const customMarker = L.marker([marker.lat, marker.lng], {
        icon: createColoredMarkerIcon(marker.color || DEFAULT_COLOR),
        title: marker.title || '',
        alt: marker.title || 'Pin'
    }).addTo(map);

    customMarker.bindPopup(popupContent);
    customMarker.on('click', e => map.setView(e.target.getLatLng(), MAX_ZOOM));
}

// Set constants
const MAP_WIDTH = 6684 / 2,
    MAP_HEIGHT = 4004 / 2,
    MAP_URL = 'assets/map.webp',
    DEFAULT_COLOR = '#032C98',
    MAX_ZOOM = 4,
    MIN_ZOOM = 2,
    INITIAL_ZOOM = 1,
    DEBUG_MODE = false; // Set to true for debugging

// Load map image and create map
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

// Place area marker
const areaCoords = [
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
const area = L.polygon(areaCoords, {color: DEFAULT_COLOR}).addTo(map);
area.bindPopup('This is a colored region.');
area.on('click', () => map.fitBounds(area.getBounds()));

// Load and place markers from JSON file
fetch('assets/markers.json')
    .then(response => response.json())
    .then(data => {
        data.markers.forEach(marker => addMarker(marker));
    })
    .catch(error => console.error('Error loading markers:', error));

// Copy coordinates to clipboard on click
if (DEBUG_MODE) {
    map.on('click', function(e) {
        const lat = Math.round(e.latlng.lat);
        const lng = Math.round(e.latlng.lng);
        const formattedText = `{lat: ${lat}, lng: ${lng}, title:'', text:'', color:''},`;
        navigator.clipboard.writeText(formattedText).then(() => {
            console.log('Coordinates copied to clipboard:', formattedText);
        }).catch(err => {
            console.error('Failed to copy coordinates to clipboard:', err);
        });
    });
}