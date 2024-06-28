const canvas = document.getElementById('progressCanvasProgBar');
const contextCanvas = canvas.getContext('2d');

const progressBar = {
    width: canvas.width,
    height: canvas.height,
    fill: 0,
};

/* PER PROVA BARRA E LOOP --------------------------------------------------------------------------------------------*/
sample = "Samples/Flauto_C3.wav";
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

arrayDurations = arrayDurations1;
//------------------------------------------------------------------------------------------------------------

function computeTimeLoop(bpm, arrayDurations) {

    let totBeats = arrayDurations.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    totBeats = totBeats / 4; // 1/16
    totTimeLoop =  totBeats * (60 / bpm); // in seconds
    return totTimeLoop;
}

totTimeLoop = computeTimeLoop(bpm, arrayDurations);

function drawProgressBar() {
    contextCanvas.clearRect(0, 0, progressBar.width, progressBar.height);

    // Draw the background
    contextCanvas.fillStyle = '#eee';
    contextCanvas.fillRect(0, 0, progressBar.width, progressBar.height);

    // Draw the filled part of the bar
    const fillWidth = (progressBar.fill / 100) * progressBar.width;
    contextCanvas.fillStyle = '#4caf50';
    contextCanvas.fillRect(0, 0, fillWidth, progressBar.height);
}

function updateProgressBar() {
    progressBar.fill += 1;

    if (progressBar.fill > 100) {
    progressBar.fill = 0; // Reset fill to 0 when it reaches 100
    }

    drawProgressBar();
}

// Set the interval for updating the progress bar (in milliseconds)
const updateInterval = totTimeLoop * 1000 / 100;
//setInterval(updateProgressBar, updateInterval);   // Messa in bottoneProvaLoop. Serve per aggioranre la barra


let progressBarUpdateInterval;

function startProgressBar() {
    progressBarUpdateInterval = setInterval(updateProgressBar, updateInterval);
}

function stopAndResetProgressBar() {
    // Stop the progress bar update
    clearInterval(progressBarUpdateInterval);

    // Reset the progress bar
    progressBar.fill = 0;
    drawProgressBar();
}