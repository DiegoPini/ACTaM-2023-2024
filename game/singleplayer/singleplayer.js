let coin = 0;
const SPB = document.getElementById("SinglePlayer");
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
    const response = await fetch("MusicBeat.json");
    myJSON = await response.json();
  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}
loadJSON();

const MPB = document.getElementById("MultiPlayer");
const RW = document.getElementById("RW");
const popup = document.getElementById("popup");
const game = document.getElementById("gameContainer");

const playerNameDiv = document.createElement("div");
const playerCoinDiv = document.createElement("div");

function singleplayer() {
  game.style.display = "block";
  playerNameDiv.id = "you";
  playerCoinDiv.id = "youcoin";
  playerNameDiv.textContent = "you";
  playerCoinDiv.textContent = coin;
  game.appendChild(playerNameDiv);
  game.appendChild(playerCoinDiv);

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

  const feature = features[0];
  if (feature == selectedCountry) coin++;
  else coin--;
  playerCoinDiv.textContent = coin;
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
  setup(myJSON[index].bpm, myJSON[index].DrumBeat, myJSON[index].TimeSignature);

  loadSounds(
    myJSON[index].Samples[0],
    myJSON[index].Samples[1],
    myJSON[index].Samples[2],
    myJSON[index].Samples[3]
  );
}

function CheckWin() {
  if (coin == 10) {
    alert("You win!");
    end();
  } else if (coin == -10) {
    alert("You lose!");
    end();
  } else {
    changestate();
    select.style.display = "block";
  }
}

SPB.addEventListener("click", () => {
  SPB.style.display = "none";
  MPB.style.display = "none";
  singleplayer();
});

function end() {
  game.style.display = "none";
  SPB.style.display = "block";
  MPB.style.display = "block";
  RW.style.display = "none";
  coin = 0;
  playerCoinDiv.textContent = coin;
}
