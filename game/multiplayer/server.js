import {
  initializeApp,
  getApps,
  getApp,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onDisconnect,
  set,
  onValue,
  onChildAdded,
  onChildRemoved,
  get,
  off,
  update,
  push,
  child,
  query,
  orderByChild,
  equalTo,
  remove,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrCM-4KbqYargFjfSTPz4VVYDMvWDS9Zk",
  authDomain: "multiplayer-test-a9a46.firebaseapp.com",
  databaseURL:
    "https://multiplayer-test-a9a46-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "multiplayer-test-a9a46",
  storageBucket: "multiplayer-test-a9a46.appspot.com",
  messagingSenderId: "746008047029",
  appId: "1:746008047029:web:01e7932703a4907374fdfc",
};
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}
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

const createform = document.getElementById("create-lobby-form");
const joinform = document.getElementById("join-lobby-form");
const activeLobbiesList = document.getElementById("active-lobbies-list");
const db = getDatabase(app);
const auth = getAuth(app);
const create = document.getElementById("create-lobby");
const start = document.getElementById("start-game");
const RW = document.getElementById("RW");
const select = document.getElementById("select");
const mapind = document.getElementById("map");
const title = document.getElementById("title");

mapind.style.display = "none";

signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error:", errorCode, errorMessage);
  });

let lobbyId;
let point = 0;
create.addEventListener("click", () => {
  createLobby();
});

let playerId;
let stateList = [];

function createLobby() {
  myJSON.forEach((element) => {
    stateList.push(element.State);
  });
  stateList = shuffleArray(stateList);
  console.log(stateList);
  const userId = document.getElementById("creator").value;
  const lobbiesRef = ref(db, "lobbies");
  playerId = userId;
  const newLobbyRef = push(lobbiesRef);
  off(lobbiesRef);
  activeLobbiesList.display = "none";
  set(newLobbyRef, {
    creator: userId,
    players: [userId],
    list: stateList,
    state: "waiting",
    guess: "default",
  });
  onDisconnect(newLobbyRef).remove();
  const playerIDRef = ref(
    db,
    "lobbies/" + newLobbyRef.key + "/players" + userId
  );
  set(playerIDRef, {
    points: point,
  });
  console.log("Lobby created with ID:", newLobbyRef.key);
  updateLobbyMembersUI(newLobbyRef.key);
  createform.style.display = "none";
  joinform.style.display = "none";
  activeLobbiesList.style.display = "block";
  lobbyId = newLobbyRef.key;
  const lobbyPlayersRef = ref(db, "lobbies/" + newLobbyRef.key + "/players");
  onValue(lobbyPlayersRef, (snapshot) => {
    const players = snapshot.val();
    console.log(players);
    const numPlayers = Object.keys(players).length;
    if (numPlayers >= 2) {
      start.style.display = "block";
      start.addEventListener("click", function () {
        startGame(newLobbyRef.key);
      });
    }
  });
}

const join = document.getElementById("join-lobby");
join.addEventListener("click", () => {
  joinLobby();
});

function joinLobby() {
  const lobbyName = document.getElementById("lobby-id").value;
  const userId = document.getElementById("user-id").value;
  lobbyId = lobbyName;
  playerId = userId;
  const lobbyPlayersRef = ref(db, "lobbies/" + lobbyName + "/players");
  const lobbyIdRef = ref(db, "lobbies/" + lobbyName);
  const lobbiesRef = ref(db, "lobbies");
  off(lobbiesRef);
  activeLobbiesList.display = "none";
  updateLobbyMembersUI(lobbyName);

  get(lobbyPlayersRef).then((snapshot) => {
    if (!snapshot.exists()) {
      console.error("Lobby does not exist.");
      return;
    }
    let players = snapshot.val();
    if (players === null) {
      players = [];
    }
    players.push(userId);
    set(lobbyPlayersRef, players);
    const playerIDRef = ref(db, "lobbies/" + lobbyName + "/players" + userId);
    set(playerIDRef, {
      points: point,
    });

    get(lobbyIdRef).then((snapshot) => {
      const lobby = snapshot.val();
      stateList = lobby.list;
    });
    createform.style.display = "none";
    joinform.style.display = "none";
    activeLobbiesList.style.display = "block";
  });

  const lobbysRef = ref(db, "lobbies/" + lobbyName);
  onValue(lobbysRef, (snapshot) => {
    const lobby = snapshot.val();
    if (lobby && lobby.state === "started") {
      startGameForPlayer(lobbyName);
    }
  });
}

function startGame(lobbyId) {
  const lobbyRef = ref(db, "lobbies/" + lobbyId);
  update(lobbyRef, { state: "started" });
  startGameForPlayer(lobbyId);
}

function displayActiveLobbies() {
  const lobbiesRef = ref(db, "lobbies");
  onValue(lobbiesRef, (snapshot) => {
    var activeLobbiesList = document.getElementById("active-lobbies-list");
    activeLobbiesList.innerHTML = "";

    snapshot.forEach(function (childSnapshot) {
      var lobby = childSnapshot.val();
      var lobbyId = childSnapshot.key;
      var listItem = document.createElement("li");
      var copybutton = document.createElement("button");
      copybutton.textContent = "Copy";
      copybutton.addEventListener("click", function () {
        navigator.clipboard.writeText(lobbyId);
        alert("Copied");
      });
      listItem.textContent =
        "Lobby: " + lobbyId + " (ID: " + lobby.creator + ")";
      listItem.setAttribute("data-lobby-id", lobbyId);

      activeLobbiesList.appendChild(listItem);
      activeLobbiesList.appendChild(copybutton);
    });
  });
}

function updateLobbyMembersUI(lobbyId) {
  var lobbyMembersList = document.getElementById("lobby-members-list");

  const lobbyMembersRef = ref(db, "lobbies/" + lobbyId + "/players");

  onValue(lobbyMembersRef, (snapshot) => {
    var members = snapshot.val();
    lobbyMembersList.innerHTML = "";
    members.forEach(function (member) {
      var memberDiv = document.createElement("div");
      memberDiv.textContent = "Player ID: " + member;
      lobbyMembersList.appendChild(memberDiv);
    });
  });
}

displayActiveLobbies();

function shuffleArray(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

let selectedCountry;

function loadIndex(country) {
  for (let i = 0; i < myJSON.length; i++) {
    if (myJSON[i].State == country) {
      return i;
    }
  }
}

function changestate(index) {
  setup(myJSON[index].bpm, myJSON[index].DrumBeat, myJSON[index].TimeSignature);

  loadSounds(
    myJSON[index].Samples[0],
    myJSON[index].Samples[1],
    myJSON[index].Samples[2],
    myJSON[index].Samples[3]
  );
}

let counter = 0;
function startGameForPlayer(lobbyId) {
  popup.style.display = "block";
  RW.style.display = "block";
  select.style.display = "block";
  const lobbyMembersRef = ref(db, "lobbies/" + lobbyId + "/players");
  off(lobbyMembersRef);

  const lobbyRef = ref(db, "lobbies/" + lobbyId);
  off(lobbyRef);

  selectedCountry = stateList[counter];
  let index = loadIndex(selectedCountry);
  changestate(index);
  onValue(lobbyRef, (snapshot) => {
    const lobby = snapshot.val();

    console.log(lobby.guess);

    if (lobby.guess === "correct") {
      update(lobbyRef, {
        guess: "default",
      });
      nextRound();
    }
  });
}

function nextRound() {
  counter++;
  console.log(counter);
  popup.style.display = "block";
  select.style.display = "block";
  CheckWin();
  selectedCountry = stateList[counter];
  let index = loadIndex(selectedCountry);
  changestate(index);
}

select.addEventListener("click", () => {
  popup.style.display = "none";
  select.style.display = "none";
  mapind.style.display = "block";
});

map.on("click", (event) => {
  popup.style.display = "block";

  const features = map.queryRenderedFeatures(event.point, {
    layers: ["countries"],
  });

  const lobbyRef = ref(db, "lobbies/" + lobbyId);
  const feature = features[0].properties.name;
  console.log(feature);
  console.log(selectedCountry);
  if (feature == selectedCountry) {
    point++;
    update(lobbyRef, {
      guess: "correct",
      [`players${playerId}/points`]: point,
    });
    console.log(point);
  } else {
    popup.style.display = "block";
    select.style.display = "block";
  }
});

function CheckWin() {
  const lobbyref = ref(db, "lobbies/" + lobbyId);
  if (point == 5) {
    update(lobbyref, {
      state: "ended",
    });
  }
  onValue(lobbyref, (snapshot) => {
    const lobby = snapshot.val();
    if (lobby.state == "ended") {
      if (point == 5) {
        alert("You Win");
        end();
      } else {
        alert("You Lose");
        end();
      }
    }
  });
}

function end() {
  popup.style.display = "none";
  const lobbyref = ref(db, "lobbies/" + lobbyId);
  lobbyref.remove();
}

// si devono disconettere tutti e due
// aggiungi i punteggi
//check dei nomi
// qunado uno esce dalla lobby prima cjhe inizi il gioco
