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
    const response = await fetch("musicbeatjson2.json");
    myJSON = await response.json();
  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}
loadJSON();

const createform = document.getElementById("create-lobby-form");
const joinform = document.getElementById("join-lobby-form");

const db = getDatabase(app);
const auth = getAuth(app);
const create = document.getElementById("create-lobby");
const start = document.getElementById("start-game");
const RW = document.getElementById("RW");
const select = document.getElementById("select");
const title = document.getElementById("title");
const wait = document.getElementById("wait");
const temp = document.getElementById("temp");
const removeactivelobbies = document.getElementById("remove-active-lobbies");
const startButtonContainer = document.getElementById("start-game-container");
const back = document.getElementById("back");
const PLAY = document.getElementById("play");

const lobbiesRef = ref(db, "lobbies");

let rotationAngle = 0;
let rotation = setInterval(() => {
  rotationAngle += 0.1;
  map.rotateTo(rotationAngle);
}, 100);

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
let creator;
let onDisconnectCreator;
function createLobby() {
  temp.style.display = "none";
  clearInterval(rotation);
  map.rotateTo(0);
  myJSON.forEach((element) => {
    stateList.push(element.State);
  });

  stateList = shuffleArray(stateList);
  const userId = document.getElementById("creator").value;
  playerId = userId;
  const newLobbyRef = push(lobbiesRef);
  creator = userId;
  off(lobbiesRef);
  removeactivelobbies.style.display = "none";
  activeLobbiesList.display = "none";
  set(newLobbyRef, {
    creator: userId,
    players: [userId],
    list: stateList,
    state: "waiting",
    guess: "default",
  });

  onDisconnect(
    ref(db, "lobbies/" + newLobbyRef.key + "/players" + userId)
  ).remove();
  onDisconnect(ref(db, "lobbies/" + newLobbyRef.key + "/players/0")).remove();
  const playerIDRef = ref(
    db,
    "lobbies/" + newLobbyRef.key + "/players" + userId
  );

  onDisconnectCreator = onDisconnect(ref(db, "lobbies/" + newLobbyRef.key));
  onDisconnectCreator.remove();

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
    const numPlayers = Object.keys(players).length;
    if (numPlayers >= 2) {
      startButtonContainer.style.display = "flex";
      start.addEventListener("click", function () {
        startGame(newLobbyRef.key);
      });
    } else {
      startButtonContainer.style.display = "none";
    }
  });
  wait.setAttribute(
    "style",
    "display: flex; height: 100%; align-content: center; justify-content: center; flex-direction: column;"
  );
}

const join = document.getElementById("join-lobby");
join.addEventListener("click", () => {
  joinLobby();
});

let namecheck = [];
function joinLobby() {
  clearInterval(rotation);
  map.rotateTo(0);
  const lobbyName = document.getElementById("lobby-id").value;
  const userId = document.getElementById("user-id").value;
  lobbyId = lobbyName;
  playerId = userId;
  const lobbyPlayersRef = ref(db, "lobbies/" + lobbyName + "/players");
  const lobbyIdRef = ref(db, "lobbies/" + lobbyName);

  get(lobbyIdRef).then((snapshot) => {
    creator = snapshot.val().creator;
  });

  get(lobbyIdRef).then((snapshot) => {
    namecheck = snapshot.val().players;
    if (!namecheck.includes(playerId)) {
      clearInterval(rotation);
      activeLobbiesList.display = "none";
      updateLobbyMembersUI(lobbyName);

      off(lobbiesRef);
      removeactivelobbies.style.display = "none";

      get(lobbyPlayersRef).then((snapshot) => {
        if (!snapshot.exists()) {
          console.error("Lobby does not exist.");
          return;
        } else {
          temp.style.display = "none";
          let players = snapshot.val();
          if (players === null) {
            players = [];
          }
          players.push(userId);
          set(lobbyPlayersRef, players);
          const playerIDRef = ref(
            db,
            "lobbies/" + lobbyName + "/players" + userId
          );
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
          wait.setAttribute(
            "style",
            "display: flex; height: 100%; align-content: center; justify-content: center; flex-direction: column;"
          );
        }
        console.log(namecheck.length + 1);
        onDisconnect(
          ref(db, "lobbies/" + lobbyName + "/players" + userId)
        ).remove();
        onDisconnect(
          ref(db, "lobbies/" + lobbyName + "/players/" + namecheck.length)
        ).remove();
      });

      onValue(lobbyIdRef, (snapshot) => {
        const lobby = snapshot.val();
        if (lobby && lobby.state === "started") {
          startGameForPlayer(lobbyName);
        }
      });
    } else {
      alert("Name already in use");
    }
  });
}

function startGame(lobbyId) {
  onDisconnectCreator.cancel();
  const lobbyRef = ref(db, "lobbies/" + lobbyId);
  update(lobbyRef, { state: "started" });
  startGameForPlayer(lobbyId);
}

const activeLobbiesList = document.getElementById("active-lobbies-list");
function displayActiveLobbies() {
  onValue(lobbiesRef, (snapshot) => {
    activeLobbiesList.innerHTML = "";

    snapshot.forEach(function (childSnapshot) {
      const lobby = childSnapshot.val();
      const lobbyId = childSnapshot.key;
      if (lobby.state != "started") {
        const listItem = document.createElement("li");
        const copybutton = document.createElement("button");
        copybutton.textContent = "Copy";
        copybutton.addEventListener("click", function () {
          setTimeout(function () {
            navigator.clipboard
              .writeText(lobbyId)
              .then(() => {
                alert("Copied");
              })
              .catch((err) => {
                console.error("Could not copy text: ", err);
              });
          }, 100);
        });
        listItem.textContent =
          "Lobby: " + lobbyId + " (ID: " + lobby.creator + ")";
        listItem.setAttribute("data-lobby-id", lobbyId);

        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.appendChild(listItem);
        container.appendChild(copybutton);

        activeLobbiesList.appendChild(container);
      }
    });
  });
}

let playersList = [];
function updateLobbyMembersUI(lobbyId) {
  const lobbyMembersList = document.getElementById("lobby-members-list");
  lobbyMembersList.setAttribute(
    "style",
    "font-size: 1.5rem; font-weight: bold;"
  );
  const lobbyMembersRef = ref(db, "lobbies/" + lobbyId + "/players");

  onValue(lobbyMembersRef, (snapshot) => {
    const members = snapshot.val();
    if (members === null) {
      end();
    }
    lobbyMembersList.innerHTML = "";
    members.forEach(function (member) {
      const memberDiv = document.createElement("div");
      memberDiv.textContent = "Player ID: " + member;
      lobbyMembersList.appendChild(memberDiv);
    });
    if (playersList.length != 0) {
      const playersNotInMembers = playersList.filter(
        (player) => !members.includes(player)
      );
      playersNotInMembers.forEach((player) => {
        const playerDiv = document.getElementById(player);
        playerDiv.remove();
      });
    }
    playersList = members;
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

let samplesInst;
let numInst;
let sampleNotes;
let instNotesOriginal;
let instNotesCopy;
let instDurations;
let instNotes;
function changestate(index) {
  setup(myJSON[index].bpm, myJSON[index].DrumBeat, myJSON[index].TimeSignature);
  samplesInst = myJSON[index].SamplesInst;
  numInst = myJSON[index].numInst;
  sampleNotes = myJSON[index].SamplesNotes; // nota originale del sample
  instNotesOriginal = myJSON[index].Inst_notes; // partitura note
  instNotesCopy = JSON.parse(JSON.stringify(instNotesOriginal)); // partitura note
  instDurations = myJSON[index].Inst_durations; // partitura durate
  instNotes = myJSON[index].Inst_notes;
}

let counter = 0;
let index;
function startGameForPlayer(lobbyId) {
  title.style.display = "none";
  popup.style.display = "block";
  Quit.style.display = "block";
  RW.style.display = "block";
  RW.setAttribute(
    "style",
    "display: flex; height: 100%; align-items: center; justify-content: center; flex-direction: column;"
  );
  select.style.display = "block";
  PLAY.style.display = "block";
  const lobbyMembersRef = ref(db, "lobbies/" + lobbyId + "/players");
  off(lobbyMembersRef);

  const lobbyRef = ref(db, "lobbies/" + lobbyId);
  off(lobbyRef);

  playersList.forEach((player) => {
    let playerRef = ref(db, "lobbies/" + lobbyId + "/players" + player);
    get(playerRef).then((snapshot) => {
      var playerData = snapshot.val();

      var playerDiv = document.createElement("div");
      if (player == playerId) {
        playerDiv.textContent = "You:" + playerData.points;
        playerDiv.id = player;
      } else {
        playerDiv.textContent = player + ":" + playerData.points;
        playerDiv.id = player;
      }
      document.getElementById("players").appendChild(playerDiv);
    });
  });

  selectedCountry = stateList[counter];
  index = loadIndex(selectedCountry);
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

  onValue(lobbyRef, (snapshot) => {
    const lobby = snapshot.val();
    console.log(lobby.players);
    if (!lobby.players.includes(creator) || lobby.players.length < 2) {
      end();
      lobbyRef.remove();
    }
    if (lobby.players.length != namecheck.lenght) {
      const playersExited = namecheck.filter(
        (playerId) => !lobby.players.includes(playerId)
      );

      playersExited.forEach((playerId) => {
        const playerDiv = document.getElementById(playerId);
        playerDiv.remove();
      });
    }
  });
}

function nextRound() {
  if (counter == stateList.length - 1) counter = 0;
  else counter++;
  PLAY.disabled = false;
  isPlaying = false;
  playersList.forEach((player) => {
    let playerRef = ref(db, "lobbies/" + lobbyId + "/players" + player);
    get(playerRef).then((snapshot) => {
      var playerData = snapshot.val();
      if (player == playerId) {
        document.getElementById(player).textContent =
          "You:" + playerData.points;
      } else {
        document.getElementById(player).textContent =
          player + ":" + playerData.points;
      }
    });
  });
  popup.style.display = "block";
  select.style.display = "block";
  PLAY.style.display = "block";
  if (!CheckWin()) {
    selectedCountry = stateList[counter];
    let index = loadIndex(selectedCountry);
    changestate(index);
    PLAY.disabled = false;
  }
}

select.addEventListener("click", () => {
  popup.style.display = "none";
  select.style.display = "none";
  PLAY.style.display = "none";
  back.style.display = "block";
  isPlaying = false;
  stopLoop();
  stopDrumLoop();
  PLAY.textContent = "Play";
});

back.addEventListener("click", () => {
  popup.style.display = "block";
  PLAY.style.display = "block";
  select.style.display = "block";
  back.style.display = "none";
});

let feature;
map.on("click", (event) => {
  popup.style.display = "block";
  back.style.display = "none";

  const features = map.queryRenderedFeatures(event.point, {
    layers: ["countries"],
  });

  const lobbyRef = ref(db, "lobbies/" + lobbyId);
  if (features[0] == undefined) {
    popup.style.display = "block";
    select.style.display = "block";
    return;
  } else feature = features[0].properties.name;

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
  onValue(lobbyref, (snapshot) => {
    const lobby = snapshot.val();
    if (lobby.state == "ended") {
      if (point == 3) {
        alert("You Win");
        end();
      } else {
        alert("You Lose");
        end();
      }
    }
  });
  if (point == 3) {
    update(lobbyref, {
      state: "ended",
    });
    return true;
  } else {
    return false;
  }
}

function end() {
  const lobbyref = ref(db, "lobbies/" + lobbyId);
  remove(lobbyref);
  window.location.href = "../game.html";
}

const Quit = document.getElementById("Quit");
Quit.addEventListener("click", () => {
  get(ref(db, "lobbies/" + lobbyId)).then((snapshot) => {
    const lobby = snapshot.val();
    remove(ref(db, "lobbies/" + lobbyId + "/players" + playerId));
    remove(
      ref(
        db,
        "lobbies/" + lobbyId + "/players/" + lobby.players.indexOf(playerId)
      )
    );
  });
});

const GAME = document.getElementById("game");
GAME.addEventListener("click", () => {
  window.location.href = "../game.html";
});

let isPlaying = false;
PLAY.addEventListener("click", function () {
  if (isPlaying) {
    // Se il loop sta suonando, chiama la funzione stopLoop
    stopLoop();
    stopDrumLoop();
    this.disabled = true;
    this.textContent = "Play"; // Cambia il testo del pulsante
    this.style.display = "none";
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
    this.disable = true;
    isPlaying = !isPlaying;
  } // Cambia lo stato
});
