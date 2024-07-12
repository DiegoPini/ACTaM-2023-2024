// Inizializza la mappa e le variabili globali
let coin = 0;
let selectedCountry;
let playClicked = false;
mapboxgl.accessToken =
  "pk.eyJ1IjoiY2hpYWx1bmdoaSIsImEiOiJjbG5vbHhqb3gwZWQyMnZwZjZkZDlxa2FhIn0.hT_7Fs3WyTZHUA3fNOsCsQ";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/chialunghi/clpecviq600d901padnab3zej",
  center: [12.4964, 41.9028], // Roma
  zoom: 3,
});

let myJSON = [];
// Carica il JSON con le informazioni musicali
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
// Ruota la mappa gradualmente
let rotation = setInterval(() => {
  rotationAngle += 0.1;
  map.rotateTo(rotationAngle);
}, 100);

// Gestione dell'interfaccia utente
const playSound1 = document.getElementById("playSound");
playSound1.style.display = "none";
const Play = document.getElementById("play");
const RW = document.getElementById("RW");
const popup = document.getElementById("popup");
const game = document.getElementById("gameContainer");
const scoreDiv = document.getElementById("score");

// Avvia la modalità singleplayer
function singleplayer() {
  game.style.display = "flex";
  scoreDiv.textContent = "score:" + coin;
  playSound1.style.display = "block";
  select.style.display = "block";
  RW.style.display = "block";
  changestate();
}

let playerSelection;

// Gestisce il click sulla mappa, controlla se il paese selezionato è corretto e aggiorna il punteggio
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
  playSound1.disabled = false;
  console.log(features[0].properties.name);
  const feature = features[0].properties.name;

  if (feature == selectedCountry) coin++;
  else coin--;
  scoreDiv.textContent = "score:" + coin;
  CheckWin();
});

// Torna al menu principale
document.getElementById("back").addEventListener("click", function () {
  window.location.href = "game/game.html";
});

// Seleziona un paese e prepara il gioco
select.addEventListener("click", () => {
  console.log("select");
  RWButton.style.display = "block";
  popup.style.display = "none";
  playSound1.style.display = "none";
  isPlaying = false;
  stopLoop();
  stopDrumLoop();
  playSound1.textContent = "Play";
  select.style.display = "none";
  document.getElementById("back").style.display = "block";
});

let samplesInst;
let instNotesOriginal;
let instNotesCopy;
let instDurations;
let numInst;
let instNotes;
let sampleNotes;
let alreadyUsed = [];
// Cambia lo stato del gioco selezionando un nuovo paese e caricando la sua musica
function changestate() {
  if (alreadyUsed.length == myJSON.length) alreadyUsed = [];
  do {
    index = Math.floor(Math.random() * myJSON.length);
    selectedCountry = myJSON[index].State;
  } while (alreadyUsed.includes(selectedCountry));
  alreadyUsed.push(selectedCountry);
  console.log(selectedCountry);

  // Setup della musica in base al paese selezionato
  setup(
    myJSON[index].bpm * 4,
    myJSON[index].DrumBeat,
    myJSON[index].TimeSignature
  );

  // Carica i suoni della batteria
  loadDrumSounds(
    myJSON[index].SamplesDrums[0],
    myJSON[index].SamplesDrums[1],
    myJSON[index].SamplesDrums[2],
    myJSON[index].SamplesDrums[3]
  );
  samplesInst = myJSON[index].SamplesInst;
  numInst = myJSON[index].numInst;
  sampleNotes = myJSON[index].SamplesNotes;
  instNotesOriginal = myJSON[index].Inst_notes;
  instNotesCopy = JSON.parse(JSON.stringify(instNotesOriginal));
  instDurations = myJSON[index].Inst_durations;
  instNotes = myJSON[index].Inst_notes;
}

// Controlla se il giocatore ha vinto o perso
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

// Gestisce il click sul pulsante di play
Play.addEventListener("click", () => {
  Play.style.display = "none";
  playClicked = true;
  clearInterval(rotation);
  singleplayer();
  document.getElementById("back").style.display = "block";
});

// Termina il gioco
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

// Gestisce il click sul pulsante RW
RWButton.addEventListener("click", () => {
  popup.style.display = "flex";
  game.style.display = "flex";
  select.style.display = "block";
  playSound1.style.display = "block";
  RWButton.style.display = "none";
});

let isPlaying = false;
// Gestisce il click sul pulsante di play/stop del suono
playSound1.addEventListener("click", function () {
  if (isPlaying) {
    stopLoop();
    stopDrumLoop();
    this.disabled = true;
    this.textContent = "Play";
    this.style.display = "none";
  } else {
    playALot(myJSON[index].bpm * 4, myJSON[index].TimeSignature);
    for (let i = 0; i < numInst; i++) {
      startLoop(
        samplesInst[i],
        sampleNotes[i],
        instNotes[i],
        instDurations[i],
        myJSON[index].bpm
      );
    }
    this.textContent = "Stop";
    isPlaying = !isPlaying;
  }
});
