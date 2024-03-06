let coin = 0;
const Play = document.getElementById("SinglePlayer");
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

const RW = document.getElementById("RW");
const popup = document.getElementById("popup");
const game = document.getElementById("gameContainer");
const mapind = document.getElementById("map");

const playerNameDiv = document.createElement("div");
const playerCoinDiv = document.createElement("div");
const select = document.getElementById("select");

function singleplayer() {
  game.style.display = "block";
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
  game.style.display = "block";
  const features = map.queryRenderedFeatures(event.point, {
    layers: ["countries"],
  });
  if (!features.length) {
    return;
  }

  const feature = features[0].properties.name;
  if (feature == selectedCountry) coin++;
  else {
    coin--;
    console.log(feature);
    console.log(selectedCountry);
  }

  playerCoinDiv.textContent = coin;
  CheckWin();
});

select.addEventListener("click", () => {
  console.log("select");
  game.style.display = "none";
  popup.style.display = "none";
  select.style.display = "none";
  mapind.style.display = "block";
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
    changcoin();
    select.style.display = "block";
    mapind.style.display = "none";
  }
}

Play.addEventListener("click", () => {
  Play.style.display = "none";
  singleplayer();
});

function changcoin() {
  game.style.display = "block";
  playerCoinDiv.textContent = coin;
}

function end() {
  game.style.display = "none";
  Play.style.display = "block";
  RW.style.display = "none";
  coin = 0;
  playerCoinDiv.textContent = coin;
}
