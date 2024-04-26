function getDynamicPopupOptions() {
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;

    return {
        maxWidth: screenWidth * 0.5, 
        maxHeight: screenHeight * 0.9, 
        autoPan: true,
        autoPanPadding: [20, 20],
        keepInView: true
    };
}

function createColoredMarkerIcon(color) {
    const markerHtml = `
        <div class="pin">
            <div class="pin-top" style="border-color: ${color}"></div>
            <div class="pin-bottom" style="border-top-color: ${color}"></div>
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
    const imageHTML = marker.image ? `<img src="assets/images/${marker.image}" class="pin-image">` : '';

    const popupContent = `
        <div class="pin-content">
            ${titleHTML}
            <div class="pin-body">
                ${textHTML}
                ${imageHTML}
            </div>
        </div>
    `;

    const customMarker = L.marker([marker.lat, marker.lng], {
        icon: createColoredMarkerIcon(marker.color || DEFAULT_COLOR),
        title: marker.title || '',
        alt: marker.title || 'Pin'
    }).addTo(map);

    customMarker.bindPopup(popupContent, getDynamicPopupOptions());
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

// Place Greenwood Village area marker
const greenwoodVillageAreaCoords = [
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

const gwTitleHTML = '<h1 class="pin-title">Greenwood Village</h1>';
const gwTextHTML = '<p>In this area I would expect to see lots of people demonstrating or participating in workshops. There may be sounds of machines and tools. This area could be quite loud if there are lots of people working. There may be smells such as wood and varnish.</p>';
const gwImageHTML = '<img src="assets\\images\\greenwood.jpg" class="pin-image">';

const gwPopupContent = `
    <div class="pin-content">
        ${gwTitleHTML}
        <div class="pin-body">
            ${gwTextHTML}
            ${gwImageHTML}
        </div>
    </div>
`;

const greenwoodVillageArea = L.polygon(greenwoodVillageAreaCoords, {color: "#502771"}).addTo(map); // Craft
greenwoodVillageArea.bindPopup(gwPopupContent, getDynamicPopupOptions());
greenwoodVillageArea.on('click', () => map.fitBounds(greenwoodVillageArea.getBounds()));

// Place Print Shop Zone area marker
const printShopZoneAreaCoords = [
    [-115, 61],
    [-131, 50],
    [-136, 50],
    [-138, 57],
    [-134, 62],
    [-135, 84],
    [-124, 89],
    [-120, 89],
    [-118, 78],
]
const textHTML = "This area contains the <b>Ironmonger's Shop</b>, <b>Machine Shop</b>, <b>Print Shop</b>, <b>Road Steam and Stationary Engine Shed</b>, and <b>Humphrey's Barn & Cottage Kitchen</b>. As I walk around this part of the museum I might hear a quiet whirring and get faint smells. There might be a few machines being operated showing how you they are used and some of the things they can create. This area includes the print shop, the ironmongers shop, the machine shop and the Road Steam and Stationary Engine shed. In the Road Steam and Stationary Engine shed, when some of the engines are being operated there might be the smell of smoke, the whirring is also louder here. In the print shop itself I may smell some oils and it is more brightly lit. In this area it is more likely that I’ll hear sounds from the road. Some of the machines here can be quite noisy but they aren’t always being operated."

const printShopZoneArea = L.polygon(printShopZoneAreaCoords, {color: "#ea9312"}).addTo(map); // industry
printShopZoneArea.bindPopup(textHTML, getDynamicPopupOptions());
printShopZoneArea.on('click', () => map.fitBounds(printShopZoneArea.getBounds()));

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
        const formattedText = `{"lat": ${lat}, "lng": ${lng}, "title": "", "text": "", "color": ""},`;
        // const formattedText = `[${lat}, ${lng}],`
        navigator.clipboard.writeText(formattedText).then(() => {
            console.log('Coordinates copied to clipboard:', formattedText);
        }).catch(err => {
            console.error('Failed to copy coordinates to clipboard:', err);
        });
    });
}