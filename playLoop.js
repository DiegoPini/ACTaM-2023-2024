
const context = new AudioContext();

function loadSample(sample) {
  const audio = new Audio(sample);
  return fetch(sample)
    .then(response => response.arrayBuffer())
    .then(buffer => context.decodeAudioData(buffer));
}


// C4 is 60 in MIDI
// every semitone is +1 in MIDI
// every note is 2 ** (1/12) times the previous note
// duration 1 means 1/16 of a beat
function playSample(sample, sampleNote = 48, noteToPlay = 48, duration = 2, bpm = 120) {
    const source = context.createBufferSource();
    source.buffer = sample;
    source.playbackRate.value = 2 ** ((noteToPlay - sampleNote) / 12);
    source.connect(context.destination);

    const stopTime = context.currentTime + (duration / 4) * (60 / bpm);
    
    //source.stop(context.currentTime); //Stop the sample if it's already playing
    source.start(0);  // play immediately
    source.stop(stopTime);  // stop after "duration" second
  }

  // PER PROVA
  bpm = 40;
  sampleNote = 48;
  arrayNotes1 = [60, 62, 64, 65, 67, 69, 71, 72];
  arrayDurations1 = [4,4,4,4,4,4,4,4]; // 1 means 1/16
  arrayNotes2 = [67, 65, 60, 59, 55, 60];
  arrayDurations2 = [4,4,10,2,4,4,4];


  //TEST SUONO
  //playSample.onclick = loadSample("Samples/Flauto_C3.wav").then(sample => playSample(sample, 48, 60));

  function playLoop(sample, sampleNote, arrayNotes, arrayDurations, bpm) {
    totTime = 0;

    for (let i = 0; i < arrayNotes.length; i++) {

      setTimeout(() => {
        playSample(sample, sampleNote, arrayNotes[i], arrayDurations[i], bpm);
      }, (totTime*60/bpm*1000/4));              // COSì PARTONO TUTTE DOPO 1/4
      totTime += arrayDurations[i];
    }
  }

  //TEST SUONO
  //playLoop.onclick = loadSample("Samples/Flauto_C3.wav").then(sample => playLoop(sample, sampleNote, arrayNotes1, arrayDurations1, bpm));
  //playLoop.onclick = loadSample("Samples/Flauto_C3.wav").then(sample => playLoop(sample, sampleNote, arrayNotes2, arrayDurations2, bpm));



  /*
  function playSound(sound, bpm=120, duration=1, noteToPlay=60, sampleNote=60){
    sound.playbackRate.value = 2 ** ((noteToPlay - sampleNote) / 12);
    sound.play();
    setTimeout(() => {
      sound.pause();
      sound.currentTime = 0;
    }, ((duration/4)*60/bpm*1000)); // time in ms to wait before stopping the sound
  }
  */


  /*
  function playSequentialSounds(sounds) {
    let currentIndex = 0;

    function playNextSound() {
      if (currentIndex >= sounds.length) {
        return;
      }

      const sound = sounds[currentIndex];
      sound.play();
      sound.onended = () => {
        currentIndex++;
        playNextSound();
      };
    }

    playNextSound();
  }
  */




  /*
    let currentIndex = 0;

    function playNextSound() {
      if (currentIndex >= arrayNotes.length) {  // METTI ANCHE UNA FLAG PER FERMARE LOOP-------------------------------
        currentIndex = 0;
      }

    const sound = sounds[currentIndex]; // CAMBIA playSOund IN MODO DA AVERE UNA FUNZIONA CHE CREA UN ARRAY DI SUONI GIUSTI--------------
      sound.play();
      sound.onended = () => {
        currentIndex++;
        playNextSound();
      };
    }

    playNextSound();
    */


    /*
    sound1Times.forEach((time) => {
      setTimeout(() => {
        sound1.play();
      }, time);

      for (let i = 0; i < arrayNotes.length; i++) {
        setTimeout(() => {
          changeButtonColor(ctx, arrayNotes[i], "purple");
        }, time);
      }
    });
    */

  