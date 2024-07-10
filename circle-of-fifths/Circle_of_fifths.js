let major_scale = [0, 2, 4, 5, 7, 9, 11, 12];
let minor_nat_scale = [0, 2, 3, 5, 7, 8, 10, 12];
let minor_arm_scale = [0, 2, 3, 5, 7, 8, 11, 12];

let dorian_scale = [0, 2, 3, 5, 7, 9, 10, 12];
let phrygian_scale = [0, 1, 3, 5, 7, 8, 10, 12];
let lydian_scale = [0, 2, 4, 6, 7, 9, 11, 12];
let mixolydian_scale = [0, 2, 4, 5, 7, 9, 10, 12];
let aeolian_scale = [0, 2, 3, 5, 7, 8, 10, 12];
let locrian_scale = [0, 1, 3, 5, 6, 8, 10, 12];

let chosen_scale = major_scale;

let selectedTonality = 'C';
var change_scale;

const externalButton = document.getElementById("play");

document.addEventListener("DOMContentLoaded", function () {
  change_scale = document.getElementById("change_scale");

  // listener change scale labels
  change_scale.addEventListener("change", function () {

    // stop loop and reset progress bar when changing scale
    stopLoop();
    stopDrumLoop();
    stopAndResetProgressBar();

    muteButtons.forEach(function(button, index) {
      if (button.classList.contains('clicked')) {
        button.classList.toggle('clicked');
      }
    });


    if (isPlaying) {
      let button = document.getElementById("play");
      button.disabled = true;
      isPlaying = !isPlaying;
      button.style.backgroundColor = "#CD5C5C";
      button.textContent = "Wait";
      setTimeout(function () {
        button.disabled = false;
        button.textContent = "Play";
        button.style.backgroundColor = "#4281a4";
      }, (6000 / 120) * 16 + 3500);
    }

    if (change_scale.value === "minor_nat_scale")
      chosen_scale = minor_nat_scale;
    else if (change_scale.value === "minor_arm_scale")
      chosen_scale = minor_arm_scale;
    else if (change_scale.value === "major_scale")
      chosen_scale = major_scale;

    else if (change_scale.value === "phrygian_scale")
      chosen_scale = phrygian_scale;
    else if (change_scale.value === "mixolydian_scale")
      chosen_scale = mixolydian_scale;

    /*
      else if (change_scale.value === "dorian_scale")
      chosen_scale = dorian_scale;

     else if (change_scale.value === "lydian_scale")
      chosen_scale = lydian_scale;

    else if (change_scale.value === "aeolian_scale")
      chosen_scale = aeolian_scale;
    else if (change_scale.value === "locrian_scale")
      chosen_scale = locrian_scale;*/

    else console.log("error");


    // change key and tonality to the selected ones
    for (let i = 0; i < numInst; i++) {
      changeKey(
        instNotesOriginal[i],
        instNotesCopyStatica[i],
        change_scale.value
      );
      changeTonality(
        instNotesOriginal[i],
        instNotesCopy[i],
        instNotesCopyStatica[i],
        "C",
        selectedTonality
      );
    }

  document.getElementById(selectedTonality).dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }))
  });

});

window.addEventListener("load", function () {
  notes = [
    document.getElementById("a"),
    document.getElementById("bb"),
    document.getElementById("b"),
    document.getElementById("c"),
    document.getElementById("db"),
    document.getElementById("d"),
    document.getElementById("eb"),
    document.getElementById("e"),
    document.getElementById("f"),
    document.getElementById("gb"),
    document.getElementById("g"),
    document.getElementById("ab"),
  ];

  scales = [
    document.getElementById("A"),
    document.getElementById("Bb"),
    document.getElementById("B"),
    document.getElementById("C"),
    document.getElementById("Db"),
    document.getElementById("D"),
    document.getElementById("Eb"),
    document.getElementById("E"),
    document.getElementById("F"),
    document.getElementById("Gb"),
    document.getElementById("G"),
    document.getElementById("Ab"),
  ];

  scales.forEach(function (scale) {
    //listener per cambio chiave
    scale.addEventListener("click", function () {

      // stop loop and reset progress bar when changing scale
      stopLoop();
      stopDrumLoop();
      stopAndResetProgressBar();

      muteButtons.forEach(function(button, index) {
        if (button.classList.contains('clicked')) {
          button.classList.toggle('clicked');
        }
      });

      
      if (isPlaying) {
        let button = document.getElementById("play");
        button.disabled = true;
        isPlaying = !isPlaying;
        button.style.backgroundColor = "#CD5C5C";
        button.textContent = "Wait";
        setTimeout(function () {
          button.disabled = false;
          button.textContent = "Play";
          button.style.backgroundColor = "#4281a4";
        }, (6000 / 120) * 16 + 3500);
      }

      // change key and tonality to the selected ones
      selectedTonality = scale.id;
      for (let i = 0; i < numInst; i++) {
       changeKey(
          instNotesOriginal[i],
          instNotesCopyStatica[i],
          change_scale.value
        );
        changeTonality(
          instNotesOriginal[i],
          instNotesCopy[i],
          instNotesCopyStatica[i],
          "C",
          selectedTonality
        );
      }

      notes.forEach(function (note) {
        note.classList.remove("note_selected");
      });
      scales.forEach(function (sc) {
        sc.classList.remove("scale_selected");
      });

      scale.classList.add("scale_selected");
      var index = scales.indexOf(scale);
      for (var i = 0; i < 8; i++) {
        ind = (chosen_scale[i] + index) % 12;
        notes[ind].classList.add("note_selected");
      }
    });

  });

  // auto click C key
  map.on("click", (event) => {
    document.getElementById('C').dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }))

    // autoclick major scale
    document.getElementById('change_scale').value = 'major_scale';

    // Resetta la partitura in C maggiore
    for (let i = 0; i < numInst; i++) {
      changeKey(
        instNotesOriginal[i],
        instNotesCopyStatica[i],
        "major_scale"
      );
      changeTonality(
        instNotesOriginal[i],
        instNotesCopy[i],
        instNotesCopyStatica[i],
        "C",
        "C"
      );
    }

  });

});