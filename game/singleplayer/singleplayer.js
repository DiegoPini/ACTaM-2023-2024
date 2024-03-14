let coin = 0;
let selectedCountry;

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2hpYWx1bmdoaSIsImEiOiJjbG5vbHhqb3gwZWQyMnZwZjZkZDlxa2FhIn0.hT_7Fs3WyTZHUA3fNOsCsQ";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/chialunghi/clpecviq600d901padnab3zej",
  // center: punto da cui di default appare la mappa, in questo caso Roma
  center: [12.4964, 41.9028],
  zoom: 3,
});

var myJSON = [];
async function loadJSON() {
  try {
    const response = await fetch("../../MusicBeat.json");
    myJSON = await response.json();
  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}
loadJSON();
let rotationAngle = 0;
let rotation = setInterval(() => {
  rotationAngle += 0.1;
  map.rotateTo(rotationAngle);
}, 100);

const Play = document.getElementById("play");
const RW = document.getElementById("RW");
const popup = document.getElementById("popup");
const game = document.getElementById("gameContainer");

const scoreDiv = document.createElement("div");

function singleplayer() {
  game.style.display = "block";
  scoreDiv.id = "score";
  scoreDiv.textContent = "score:" + coin;
  game.appendChild(scoreDiv);

  select.style.display = "block";
  RW.style.display = "block";
  changestate();
}

let playerSelection;

map.on("click", (event) => {
  popup.style.display = "block";

  const features = map.queryRenderedFeatures(event.point, {
    layers: ["countries"],
  });
  if (!features.length) {
    return;
  }
  console.log(features[0].properties.name);
  const feature = features[0].properties.name;
  if (feature == selectedCountry) coin++;
  else coin--;
  scoreDiv.textContent = "score:" + coin;
  CheckWin();
});

select.addEventListener("click", () => {
  console.log("select");
  popup.style.display = "none";
  select.style.display = "none";
});

function changestate() {
  let index = Math.floor(Math.random() * myJSON.length);
  selectedCountry = myJSON[index].State;
  console.log(selectedCountry);
  setup(myJSON[index].bpm, myJSON[index].DrumBeat, myJSON[index].TimeSignature);

  if (myJSON[index].Samples.indexOf(undefined) != -1) {
    loadSounds(
      myJSON[index].Samples[0],
      myJSON[index].Samples[1],
      myJSON[index].Samples[2],
      myJSON[index].Samples[3]
    );
  }
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
  }
}

Play.addEventListener("click", () => {
  Play.style.display = "none";
  clearInterval(rotation);
  singleplayer();
});

function end() {
  game.style.display = "none";
  RW.style.display = "none";
  coin = 0;
  playerCoinDiv.textContent = coin;
}
