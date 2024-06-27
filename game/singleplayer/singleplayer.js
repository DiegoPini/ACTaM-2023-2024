let coin = 0;
let selectedCountry;
let playClicked = false;
mapboxgl.accessToken =
  "pk.eyJ1IjoiY2hpYWx1bmdoaSIsImEiOiJjbG5vbHhqb3gwZWQyMnZwZjZkZDlxa2FhIn0.hT_7Fs3WyTZHUA3fNOsCsQ";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/chialunghi/clpecviq600d901padnab3zej",
  // center: punto da cui di default appare la mappa, in questo caso Roma
  center: [12.4964, 41.9028],
  zoom: 3,
});

let myJSON = [];
async function loadJSON() {
  try {
    const response = await fetch("../MusicBeatMult.json");
    myJSON = await response.json();
  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}
loadJSON();
let index;
let rotationAngle = 0;
let rotation = setInterval(() => {
  rotationAngle += 0.1;
  map.rotateTo(rotationAngle);
}, 100);

const playSound1 = document.getElementById("playSound");
playSound1.style.display = "none";
const Play = document.getElementById("play");
const RW = document.getElementById("RW");
const popup = document.getElementById("popup");
const game = document.getElementById("gameContainer");
const scoreDiv = document.getElementById("score");
// const Back = document.getElementById("back");

function singleplayer() {
  game.style.display = "flex";
  scoreDiv.textContent = "score:" + coin;
  playSound1.style.display = "block";
  select.style.display = "block";
  RW.style.display = "block";
  changestate();
}

let playerSelection;

map.on("click", (event) => {
  if (playClicked == false) return;
  const features = map.queryRenderedFeatures(event.point, {
    layers: ["countries"],
  });

  if (!features.length) {
    return;
  }
  popup.style.display = "flex";
  game.style.display = "flex";
  select.style.display = "block";
  playSound1.style.display = "block";
  RWButton.style.display = "none";
  console.log(features[0].properties.name);
  const feature = features[0].properties.name;

  if (feature == selectedCountry) coin++;
  else coin--;
  scoreDiv.textContent = "score:" + coin;
  CheckWin();
});

document.getElementById("back").addEventListener("click", function () {
  window.location.href = "../game.html";
});

select.addEventListener("click", () => {
  console.log("select");
  RWButton.style.display = "block";
  popup.style.display = "none";
  playSound1.style.display = "none";
  stopLoop();
  stopDrumLoop();
  playSound1.textContent = "Play";
  select.style.display = "none";
  document.getElementById("back").style.display = "block"; // Show the back button
});

let samplesInst;
let instNotesOriginal;
let instNotesCopy;
let instDurations;
let numInst;
let instNotes;
let sampleNotes;
let alreadyUsed = [];
function changestate() {
  do {
    index = Math.floor(Math.random() * myJSON.length);
    selectedCountry = myJSON[index].State;
  } while (alreadyUsed.includes(selectedCountry));
  alreadyUsed.push(selectedCountry);
  console.log(selectedCountry);

  setup(myJSON[index].bpm, myJSON[index].DrumBeat, myJSON[index].TimeSignature);

  loadDrumSounds(
    myJSON[index].SamplesDrums[0],
    myJSON[index].SamplesDrums[1],
    myJSON[index].SamplesDrums[2],
    myJSON[index].SamplesDrums[3]
  );
  Play.disabled = false;
  samplesInst = myJSON[index].SamplesInst;
  numInst = myJSON[index].numInst; // CONTROLLA SE VA CON CONSOLE LOG NEL CASO DI PROBLEMI
  sampleNotes = myJSON[index].SamplesNotes; // nota originale del sample
  instNotesOriginal = myJSON[index].Inst_notes; // partitura note
  instNotesCopy = JSON.parse(JSON.stringify(instNotesOriginal)); // partitura note
  instDurations = myJSON[index].Inst_durations; // partitura durate
  instNotes = myJSON[index].Inst_notes;
}

function CheckWin() {
  if (coin == 5) {
    alert("You won!");
    end();
  } else if (coin == -3) {
    alert("You lost!");
    end();
  } else {
    changestate();
    select.style.display = "block";
    playSound1.style.display = "block";
  }
}

Play.addEventListener("click", () => {
  Play.style.display = "none";
  playClicked = true;
  clearInterval(rotation);
  singleplayer();
  document.getElementById("back").style.display = "block"; // Show the back button
});

function end() {
  popup.style.display = "flex";
  Play.style.display = "block";
  game.style.display = "none";
  RW.style.display = "none";
  scoreDiv.textContent = "";
  select.style.display = "none";
  playSound1.style.display = "none";
  playClicked = false;
  coin = 0;
  alreadyUsed = [];
}

const RWButton = document.getElementById("RWbutton");

RWButton.addEventListener("click", () => {
  popup.style.display = "flex";
  game.style.display = "flex";
  select.style.display = "block";
  playSound1.style.display = "block";
  RWButton.style.display = "none";
});

let isPlaying = false;
playSound1.addEventListener("click", function () {
  if (isPlaying) {
    // Se il loop sta suonando, chiama la funzione stopLoop
    stopLoop();
    stopDrumLoop();
    this.disabled = true;
    this.textContent = "Play"; // Cambia il testo del pulsante
  } else {
    // Se il loop non sta suonando, inizia a suonare il loop
    playALot(myJSON[index].bpm, myJSON[index].TimeSignature);
    for (let i = 0; i < numInst; i++) {
      startLoop(
        samplesInst[i],
        sampleNotes[i],
        instNotes[i],
        instDurations[i],
        myJSON[index].bpm
      );
    }
    this.textContent = "Stop"; // Cambia il testo del pulsante
    isPlaying = !isPlaying;
  } // Cambia lo stato
});
