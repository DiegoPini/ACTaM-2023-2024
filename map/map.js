mapboxgl.accessToken =
    "pk.eyJ1IjoiY2hpYWx1bmdoaSIsImEiOiJjbG5vbHhqb3gwZWQyMnZwZjZkZDlxa2FhIn0.hT_7Fs3WyTZHUA3fNOsCsQ";
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/chialunghi/clpecviq600d901padnab3zej",
    // center: punto da cui di default appare la mappa, in questo caso Roma
    center: [12.4964, 41.9028],
    zoom: 3,
});

/*
     Add an event listener that runs
     when a user clicks on the map element.
     */
var myJSON = [];
async function loadJSON() {
    try {
        const response = await fetch("../MusicBeat.json");
        myJSON = await response.json();
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}
loadJSON();

function loadIndex(country) {
    for (i = 0; i < myJSON.length; i++) {
        if (myJSON[i].State == country) {
            return i;
        }
    }
}
var id;
let playRWjs;
var index;

map.on("click", (event) => {
    document.getElementById("customPopup").style.display = "block";

    const features = map.queryRenderedFeatures(event.point, {
        layers: ["countries"], // layer name in the Style that is referred to the data (markers)
    });
    if (!features.length) {
        return;
    }
    const feature = features[0];
    var id = features[0].properties.name;

    index = loadIndex(feature.properties.name);

    setup(
        myJSON[index].bpm,
        myJSON[index].DrumBeat,
        myJSON[index].TimeSignature
    );

    loadSounds(
        myJSON[index].Samples[0],
        myJSON[index].Samples[1],
        myJSON[index].Samples[2],
        myJSON[index].Samples[3]
    );
});

window.addEventListener('load', function() {

    document.getElementById("play").addEventListener('click', function() {
        play(myJSON[index].bpm, myJSON[index].TimeSignature);
    });

    document.getElementById("close").addEventListener("click", () => {
        document.getElementById("customPopup").style.display = "none";
    });


});

