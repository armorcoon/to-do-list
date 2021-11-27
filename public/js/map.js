mapboxgl.accessToken =
  "pk.eyJ1IjoiYXJtb3Jjb29uIiwiYSI6ImNrb3VvYm9ncTAwZWgybm53czVoM3c3N2YifQ.bBB_1bPMWHbGjatWIpEqEA";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 11,
  center: [149.130005, -35.280937], //longitue,lattitude
});

var size = 100;

var pulsingDot = {
  width: size,
  height: size,
  data: new Uint8Array(size * size * 4),

  // get rendering context for the map canvas when layer is added to the map
  onAdd: function () {
    var canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext("2d");
  },

  // called once before every frame where the icon will be used
  render: function () {
    var duration = 1000;
    var t = (performance.now() % duration) / duration;

    var radius = (size / 2) * 0.3;
    var outerRadius = (size / 2) * 0.7 * t + radius;
    var context = this.context;

    // draw outer circle
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
    context.fill();

    // draw inner circle
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 100, 100, 1)";
    context.strokeStyle = "white";
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();

    // update this image's data with data from the canvas
    this.data = context.getImageData(0, 0, this.width, this.height).data;

    // continuously repaint the map, resulting in the smooth animation of the dot
    map.triggerRepaint();

    // return `true` to let the map know that the image was updated
    return true;
  }
};

// Fetch stores from API
async function getUsers() {
  const res = await fetch("/api/v1/users");
  const res_gps = await fetch("/api/v2/users");
  const data = await res.json();

  const users = data.data.map((user) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          user.location.coordinates[0],
          user.location.coordinates[1],
        ],
      },
      properties: {
        userId: user.userId,
        icon: "shop",
      },
    };
  });
  loadMap(users);
}
//


// Load map 
function loadMap(users) {
  map.on("load", function () {
    map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });
    map.addLayer({
      id: "points",
      type: "symbol",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: users,
        },
      },
      layout: {
        "icon-image": "pulsing-dot",
        "icon-size": 1.5,
        "text-field": "{userId}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.9],
        "text-anchor": "top",
      },
    });
  });
}

getUsers();
