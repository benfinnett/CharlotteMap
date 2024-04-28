// TODO: Improve UX on mobile

function getDynamicPopupOptions() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  return {
    maxWidth: screenWidth * 0.5,
    maxHeight: screenHeight * 0.9,
    autoPan: true,
    autoPanPadding: [20, 20],
    keepInView: true,
  };
}

function createColoredMarkerIcon(color) {
  const markerHtml = `
        <div class="pin">
            <div class="pin-top" style="border-color: ${color}"></div>
            <div class="pin-bottom" style="border-top-color: ${color}"></div>
        </div>
    `;

  return L.divIcon({
    className: "custom-pin",
    iconAnchor: [12, 37],
    popupAnchor: [1, -28],
    html: markerHtml,
  });
}

function createPopupHTML(title, text, imagePath) {
  const titleHTML = title ? `<h1 class="pin-title">${title}</h1>` : "";
  const textHTML = text ? `<p>${text}</p>` : "";
  const imageHTML = imagePath
    ? `<img src="assets/images/${imagePath}" class="pin-image">`
    : "";

  return `
        <div class="pin-content">
            ${titleHTML}
            <div class="pin-body">
                ${textHTML}
                ${imageHTML}
            </div>
        </div>
    `;
}

function addMarker(marker) {
  const colorCode =
    mapConfig.colors[marker.category] || mapConfig.colors.default;

  const customMarker = L.marker([marker.lat, marker.lng], {
    icon: createColoredMarkerIcon(colorCode),
    title: marker.title || "",
    alt: marker.title || "Pin",
  }).addTo(map);

  customMarker.bindPopup(
    createPopupHTML(marker.title, marker.text, marker.image),
    getDynamicPopupOptions()
  );
  customMarker.on("click", (e) =>
    map.setView(e.target.getLatLng(), mapConfig.maxZoom)
  );
}

function createAreaMarker(coords, color, popupContent) {
  const areaMarker = L.polygon(coords, { color: color }).addTo(map);
  areaMarker.bindPopup(popupContent, getDynamicPopupOptions());
  areaMarker.on("click", () => map.fitBounds(areaMarker.getBounds()));
}

async function loadAndPlaceMarkers() {
  try {
    const response = await fetch("assets/markers.json");
    const data = await response.json();
    data.markers.forEach(addMarker);
  } catch (error) {
    console.error("Error loading markers:", error);
  }

  markerAreas.forEach((area) =>
    createAreaMarker(area.coords, area.color, area.popupContent)
  );
}

function initialiseMap() {
  const map = L.map("map", {
    attributionControl: false,
    minZoom: mapConfig.minZoom,
    maxZoom: mapConfig.maxZoom,
    center: [0, 0],
    zoom: mapConfig.initialZoom,
    crs: L.CRS.Simple,
  });

  const bounds = new L.LatLngBounds(
    map.unproject([0, mapConfig.mapHeight], mapConfig.maxZoom - 1),
    map.unproject([mapConfig.mapWidth, 0], mapConfig.maxZoom - 1)
  );

  L.imageOverlay(mapConfig.mapUrl, bounds).addTo(map);
  map.setMaxBounds(bounds);

  return map;
}

function setup() {
  const map = initialiseMap();
  loadAndPlaceMarkers();

  if (mapConfig.debugMode) {
    map.on("click", function (e) {
      const lat = Math.round(e.latlng.lat);
      const lng = Math.round(e.latlng.lng);
      const formattedText = `{"lat": ${lat}, "lng": ${lng}, "title": "", "text": "", "color": ""},`;
      navigator.clipboard
        .writeText(formattedText)
        .then(() => {
          console.log("Coordinates copied to clipboard:", formattedText);
        })
        .catch((err) => {
          console.error("Failed to copy coordinates to clipboard:", err);
        });
    });
  }

  return map;
}

const mapConfig = {
  mapWidth: 3342, // 6684 / 2
  mapHeight: 2002, // 4004 / 2
  mapUrl: "assets/map.webp",
  maxZoom: 4,
  minZoom: 2,
  initialZoom: 1,
  debugMode: false,
  colors: {
    default: "#032C98",
    entrance: "#e23cb0",
    transport: "#e13434",
    craft: "#502771",
    industry: "#ea9312",
    communication: "#6d84d1",
    nature: "#aa641a",
  },
};

const markerAreas = [
  {
    coords: [
      [-102, 191],
      [-103, 195],
      [-105, 198],
      [-114, 201],
      [-119, 184],
      [-123, 164],
      [-119, 162],
      [-117, 163],
      [-111, 187],
      [-105, 187],
    ],
    color: mapConfig.colors.craft,
    popupContent: createPopupHTML(
      "Greenwood Village",
      "In this area I would expect to see lots of people demonstrating or participating in workshops. There may be sounds of machines and tools. This area could be quite loud if there are lots of people working. There may be smells such as wood and varnish.",
      "greenwood.jpg"
    ),
  },
  {
    coords: [
      [-115, 61],
      [-131, 50],
      [-136, 50],
      [-138, 57],
      [-134, 62],
      [-135, 84],
      [-124, 89],
      [-120, 89],
      [-118, 78],
    ],
    color: mapConfig.colors.industry,
    popupContent:
      "This area contains the <b>Ironmonger's Shop</b>, <b>Machine Shop</b>, <b>Print Shop</b>, <b>Road Steam and Stationary Engine Shed</b>, and <b>Humphrey's Barn & Cottage Kitchen</b>. As I walk around this part of the museum I might hear a quiet whirring and get faint smells. There might be a few machines being operated showing how you they are used and some of the things they can create. This area includes the print shop, the ironmongers shop, the machine shop and the Road Steam and Stationary Engine shed. In the Road Steam and Stationary Engine shed, when some of the engines are being operated there might be the smell of smoke, the whirring is also louder here. In the print shop itself I may smell some oils and it is more brightly lit. In this area it is more likely that I’ll hear sounds from the road. Some of the machines here can be quite noisy but they aren’t always being operated.",
  },
];

const map = setup();
