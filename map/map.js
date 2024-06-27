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
    if (myJSON[i].State === country) {
      return i;
    }
  }
}
var id;
let playRWjs;
var index;

let samplesInst;
let instNotesOriginal;
let instNotesCopy;
let instDurations;
let numInst;
let sampleNotes;
map.on("click", (event) => {
  const features = map.queryRenderedFeatures(event.point, {
    layers: ["countries"], // layer name in the Style that is referred to the data (markers)
  });
  if (!features.length) {
    return;
  }

  document.getElementById("customPopup").style.display = "block";
  document.getElementById("game").style.display = "none";

  const feature = features[0];

  index = loadIndex(feature.properties.name);

  setup(myJSON[index].bpm, myJSON[index].DrumBeat, myJSON[index].TimeSignature);

  loadDrumSounds(
    myJSON[index].SamplesDrums[0],
    myJSON[index].SamplesDrums[1],
    myJSON[index].SamplesDrums[2],
    myJSON[index].SamplesDrums[3]
  );

  // array dei sample degli strumenti
  samplesInst = myJSON[index].SamplesInst;

  // array delle note degli strumenti
  numInst = myJSON[index].numInst; // CONTROLLA SE VA CON CONSOLE LOG NEL CASO DI PROBLEMI
  sampleNotes = myJSON[index].SamplesNotes; // nota originale del sample
  instNotesOriginal = myJSON[index].Inst_notes; // partitura note
  instNotesCopy = JSON.parse(JSON.stringify(instNotesOriginal)); // partitura note
  instDurations = myJSON[index].Inst_durations; // partitura durate

  const countryName = document.getElementById("countryName");
  const description = document.getElementById("description");
  countryName.textContent = myJSON[index].title;
  description.textContent = myJSON[index].description;
});

let isPlaying = false; // Variabile per tenere traccia dello stato di riproduzione
window.addEventListener("load", function () {
  document.getElementById("play").addEventListener("click", function () {
    if (isPlaying) {
      // Se il loop sta suonando, chiama la funzione stopLoop
      stopLoop();
      stopDrumLoop();
      setup(
        myJSON[index].bpm,
        myJSON[index].DrumBeat,
        myJSON[index].TimeSignature
      );
      this.disabled = true;
      button = this;
      this.style.backgroundColor = "#CD5C5C";
      this.textContent = "Wait";
      setTimeout(function () {
        button.disabled = false;
        button.textContent = "Play";
        button.style.backgroundColor = "#4281a4";
      }, (6000 / myJSON[index].bpm) * 16 + 3500);
    } else {
      // Se il loop non sta suonando, inizia a suonare il loop
      playALot(myJSON[index].bpm, myJSON[index].TimeSignature);
      for (let i = 0; i < numInst; i++) {
        startLoop(
          samplesInst[i],
          sampleNotes[i],
          instNotesCopy[i],
          instDurations[i],
          myJSON[index].bpm
        );
      }
      this.textContent = "Stop"; // Cambia il testo del pulsante
    }
    isPlaying = !isPlaying; // Cambia lo stato
  });

  document.getElementById("close").addEventListener("click", () => {
    stopLoop();
    stopDrumLoop();
    if (isPlaying) {
      let button = document.getElementById("play");
      button.disabled = true;

      button.style.backgroundColor = "#CD5C5C";
      button.textContent = "Wait";
      setTimeout(function () {
        button.disabled = false;
        button.textContent = "Play";
        button.style.backgroundColor = "#4281a4";
      }, (6000 / myJSON[index].bpm) * 16 + 3500);
    }
    document.getElementById("customPopup").style.display = "none";
    document.getElementById("game").style.display = "block";
  });
});

document.getElementById("game").addEventListener("click", function () {
  console.log("game");
  window.location.href = "../game/game.html";
});

var canva = document.getElementById("myCanvas");
var cont = canva.getContext("2d");

// Function to resize the canvas
function resizeCanvas() {
  // Set canvas dimensions to the window dimensions
  canva.width = window.innerWidth;
  canva.height = window.innerHeight;

  // Redraw content
  draw();
}
