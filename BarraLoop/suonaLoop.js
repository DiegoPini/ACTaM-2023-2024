let loopContext = new AudioContext();   

// Create master volume node. Value is set to 1 by default
let masterVolumeNode = loopContext.createGain();

// Array to store mute states and gain nodes for each loop
let loopMuteStates = [];
let loopVolumeNodes = [];
let loopState = false; // false means stopped, true means playing

let loopIntervals = []; // Store interval IDs   



function loadSample(sample, audioContext) { 
  const audio = new Audio(sample);
  return fetch(sample)
    .then(response => response.arrayBuffer())
    .then(buffer => audioContext.decodeAudioData(buffer));
}

/* 
    startLoop suona il loop finchè non viene chiamata stopLoop
    playLoop suona il loop per intero 1 volta
    playNoteFromSample suona un sample

    Quindi startLoop chiama playLoop che chiama playNoteFromSample
    perciò è sufficiente chiamare solo startLoop
*/

function playNoteFromSample(loopContext, source, envelopeGainNode, sampleNote = 48, noteToPlay = 48, duration = 2, bpm = 120, envelopeGain = 0.4) {
  // loopContext is the AudioContext for the loop
  // source is the buffer source node

  // C4 is 60 in MIDI
  // every semitone is +1 in MIDI
  // every note is 2 ** (1/12) times the previous note
  // duration 1 means 1/16 of a beat

  if (noteToPlay != 0) {  // 0 means no note

    // Pitch shift and duration in beats
    source.playbackRate.value = 2 ** ((noteToPlay - sampleNote) / 12); 
    let stopTime = loopContext.currentTime + (duration / 4) * (60 / bpm); 


    // Envelope parameters
    const attackTime = 0.08;
    const releaseTime = 0.05;
    

    // Apply envelope
    let now = loopContext.currentTime;
    envelopeGainNode.gain.setValueAtTime(0, now);
    envelopeGainNode.gain.linearRampToValueAtTime(envelopeGain, now + attackTime);
    envelopeGainNode.gain.setValueAtTime(envelopeGain, stopTime - releaseTime);
    envelopeGainNode.gain.linearRampToValueAtTime(0, stopTime);


    // Check if the source is already playing. If so, stop it
    if (source && source.playbackState !== source.PLAYING_STATE) {
      source.stop(0);  
    }


    // Play the note
    source.start(0); 
    source.stop(stopTime);  
  }
}


function playLoop(loopContext, envelopeGainNode, sample, sampleNote, arrayNotes, arrayDurations, bpm) {
  // playLoop deve essere chiamata continuamente ogni volta che il loop deve essere riprodotto

  // Example:
  // arrayNotes = [60, 62, 64, 65, 67, 69, 71, 72];
  // arrayDurations = [4,4,4,4,4,4,4,4]; // 1 means 1/16

  totTime = 0;
  for (let i = 0; i < arrayNotes.length; i++) {

    setTimeout(() => {
      let source = loopContext.createBufferSource();
      source.buffer = sample;
      source.connect(envelopeGainNode);

      playNoteFromSample(loopContext = loopContext, source = source, envelopeGainNode = envelopeGainNode, 
        sampleNote = sampleNote, noteToPlay = arrayNotes[i], duration = arrayDurations[i], bpm = bpm);
    }, (totTime*60/bpm*1000/4));
    totTime += arrayDurations[i];

  }

}


function startLoop(sample, sampleNote, arrayNotes, arrayDurations, bpm) { // NUOVA
  loopState = true;
  masterVolumeNode.gain.value = 1; // Unmute the master volume

  // Create gain nodes
  let envelopeGainNode = loopContext.createGain(); 
  let loopVolumeNode = loopContext.createGain();

  loopVolumeNodes.push(loopVolumeNode); // Store the gainNode for each track
  loopMuteStates.push(false); // Initialize mute state for this loop (false means unmuted)

  // Connect nodes
  // N source -> N envelope gain independently -> N loop volume gain independently -> everything in the master Volume Gain -> destination
  envelopeGainNode.connect(loopVolumeNode);
  loopVolumeNode.connect(masterVolumeNode);
  masterVolumeNode.connect(loopContext.destination);

  
  // Compute time between each loop iteration in milliseconds
  let interval = 0; 
  for (let i = 0; i < arrayDurations.length; i++) {
    interval += arrayDurations[i];
  }
  interval = (interval * 60 / bpm) * 1000 / 4; // Convert to milliseconds

  // Prima iterazione del loop immediatamente
  if (loopState) {
    loadSample(sample, loopContext).then((sampleBuffer) => {
      playLoop(loopContext, envelopeGainNode, sampleBuffer, sampleNote, arrayNotes, arrayDurations, bpm);
    });
  }

  // Loop iterations
  const loopInterval = setInterval(() => {
    if (loopState) {
      loadSample(sample, loopContext).then((sampleBuffer) => {
        playLoop(loopContext, envelopeGainNode, sampleBuffer, sampleNote, arrayNotes, arrayDurations, bpm);
      });
    } else {
      clearInterval(loopInterval);
    }
  }, interval);

  loopIntervals.push(loopInterval); // Store interval ID
}


function stopLoop() { 

  // Stop the loop from repeating
  loopState = false;

  // Mute the master volume (the value is set to 0.001 because 0 doesn't work with the function)
  masterVolumeNode.gain.value = 0;
  //masterVolumeNode.gain.exponentialRampToValueAtTime(0.001, loopContext.currentTime + 0.08);


  // Mute all loops                   PROVA CON TOGGLE MUTE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  for (let i = 0; i < loopVolumeNodes.length; i++) {
    //loopVolumeNodes[i].gain.exponentialRampToValueAtTime(0.001, loopContext.currentTime + 0.08);
    loopVolumeNodes[i].gain.value = 0;
    loopMuteStates[i] = true;
  }


  // Clear the arrays only after all the loops are muted
  //     USA QUESTA SE METTI IL VOLUME A 0 SENZA EXPONENTIAL RAMP
  doWhenAllGainValuesReachValue(loopVolumeNodes, 0, function() {
    loopVolumeNodes = [];
    loopMuteStates = [];
  });
  /*     USA QUESTA SE METTI IL VOLUME A 0.001 CON EXPONENTIAL RAMP
  doWhenAllGainValuesReachValue(loopVolumeNodes, 0.001, function() {
    loopVolumeNodes = [];
    loopMuteStates = [];
  });
  */


  // Clear all intervals
  for (let i = 0; i < loopIntervals.length; i++) {
    clearInterval(loopIntervals[i]);
  }
  loopIntervals = []; // Reset interval IDs array

}


function doWhenAllGainValuesReachValue(array, value, callback) {
  let intervalId = setInterval(function() {
    if (array.every(node => node.gain.value === value)) {
      clearInterval(intervalId);
      callback();
    }
  }, 100); // Check every 100 milliseconds
}


// Function to toggle mute/unmute for a specific loop
function toggleMute(loopIndex) {
  const node = loopVolumeNodes[loopIndex];
  if (node) {
    if (loopMuteStates[loopIndex]) {
      node.gain.value = 1; // Unmute
      //node.gain.exponentialRampToValueAtTime(1, loopContext.currentTime + 0.1);
    } else {
      node.gain.value = 0; // Mute
      //node.gain.exponentialRampToValueAtTime(0.001, loopContext.currentTime + 0.1)
    }
    loopMuteStates[loopIndex] = !loopMuteStates[loopIndex]; // Toggle mute state
  }
}


// Add event listeners to mute buttons for each loop

/*                                                                        CONTROLLA SE VA BENE QUELLA DOPO O MEGLIO QUESTA
const muteButtons = document.querySelectorAll('.muteButton'); 
muteButtons.forEach((button, index) => {
  button.addEventListener('click', () => toggleMute(index));
});
*/

/*                                                                  FUNZIONA MA DA IMPLEMENTARE NEL CODICE COMPLETO
document.addEventListener("DOMContentLoaded", function() {
  var muteButtons = document.querySelectorAll(".muteButtonProgBar");

  muteButtons.forEach(function(muteButton, index) {
    muteButton.addEventListener("click", function() {
      this.classList.toggle("clicked");
      toggleMute(index); // Toggle mute for the corresponding track
    });     
  });
});


var bottoneProvaLoop = document.querySelector(".bottoneProvaLoopProgBar");

bottoneProvaLoop.addEventListener("click", function() {
  startLoop(sample, sampleNote, arrayNotes1, arrayDurations1, bpm);
  startLoop(sample, sampleNote, arrayNotes2, arrayDurations2, bpm);
  startLoop(sample, sampleNote, arrayNotes3, arrayDurations3, bpm);
  startLoop(sample, sampleNote, arrayNotes4, arrayDurations4, bpm);

  setInterval(updateProgressBar, updateInterval);
});   
*/



/*
// PER PROVA

sample = "SamplesProvaProgBar/Flauto_C3.wav";
bpm = 40;
sampleNote = 48;
arrayNotes1 = [60, 62, 64, 65, 67, 69, 71, 72];
arrayDurations1 = [4,4,4,4,4,4,4,4]; // 1 means 1/16
arrayNotes2 = [67, 65, 60, 59, 55, 60, 60];
arrayDurations2 = [4,4,10,2,4,4,4];
arrayNotes3 = [48, 50, 52, 53, 55, 57, 59, 60];
arrayDurations3 = [4,4,4,4,4,4,4,4]; // 1 means 1/16
arrayNotes4 = [74, 72, 67, 66, 62, 67, 67];
arrayDurations4 = [4,4,10,2,4,4,4];

startLoop(sample, sampleNote, arrayNotes1, arrayDurations1, bpm)
startLoop(sample, sampleNote, arrayNotes2, arrayDurations2, bpm)
startLoop(sample, sampleNote, arrayNotes3, arrayDurations3, bpm)
startLoop(sample, sampleNote, arrayNotes4, arrayDurations4, bpm)

stopLoop();
*/
