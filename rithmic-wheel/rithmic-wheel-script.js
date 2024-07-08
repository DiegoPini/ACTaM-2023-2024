let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let lineCanvas = document.getElementById("lineCanvas");
let lineCtx = lineCanvas.getContext("2d");

let X_init = 0;
let Y_init = 0;
let DIM = 300;
let MAX_RADIUS = DIM / 2;
let X_center = MAX_RADIUS + X_init;
let Y_center = MAX_RADIUS + Y_init;

ctx.beginPath();
ctx.arc(X_center, Y_center, MAX_RADIUS, 0, 2 * Math.PI);
ctx.fillStyle = "#FE938C";
ctx.fill();

ctx.beginPath();
ctx.arc(X_center, Y_center, (MAX_RADIUS * 9) / 11, 0, 2 * Math.PI);
ctx.fillStyle = "#E6B89C";
ctx.fill();

ctx.beginPath();
ctx.arc(X_center, Y_center, (MAX_RADIUS * 7) / 11, 0, 2 * Math.PI);
ctx.fillStyle = "#91B6B7";
ctx.fill();

ctx.beginPath();
ctx.arc(X_center, Y_center, (MAX_RADIUS * 5) / 11, 0, 2 * Math.PI);
ctx.fillStyle = "#4281A4";
ctx.fill();

function drawButton(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();

  return { x, y, radius, color };
}

let circles = [];
let sound1;
let sound2;
let sound3;
let sound4;
let oldTempo;

function drawButtons44(
  ctx,
  centerX,
  centerY,
  circleRadius,
  buttonRadius,
  color
) {
  const numberOfButtons = 16;
  for (let i = 0; i < numberOfButtons; i++) {
    const angle = 22.5 * i * (Math.PI / 180);
    const buttonX = centerX + circleRadius * Math.cos(angle);
    const buttonY = centerY + circleRadius * Math.sin(angle);
    const circle = drawButton(ctx, buttonX, buttonY, buttonRadius, color);

    circles.push(circle);
  }
}

function changeButtonColor(ctx, circle, newColor) {
  circle.color = newColor;
  drawButton(ctx, circle.x, circle.y, circle.radius + 1, circle.color);
}

let sound1But = [];
let sound2But = [];
let sound3But = [];
let sound4But = [];

let sound1Times = [];
let sound2Times = [];
let sound3Times = [];
let sound4Times = [];

function selectBeatColor(beat, check) {
  if (check == 1) beatColor44(beat);
  else beatColor34(beat);
}

function beatColor34(beat) {
  sound1But = [];
  sound2But = [];
  sound3But = [];
  sound4But = [];

  sound1But = circles.slice(0, 12);
  sound2But = circles.slice(12, 24);
  sound3But = circles.slice(24, 36);
  sound4But = circles.slice(36, 48);

  for (let i = 0; i < 12; i++) {
    if (beat[0][i] === 1) {
      changeButtonColor(ctx, sound1But[i], "#EAE26D");
    } else {
      changeButtonColor(ctx, sound1But[i], "#4281A4");
    }
    if (beat[1][i] === 1) {
      changeButtonColor(ctx, sound2But[i], "#EAE26D");
    } else {
      changeButtonColor(ctx, sound2But[i], "#91B6B7");
    }
    if (beat[2][i] === 1) {
      changeButtonColor(ctx, sound3But[i], "#EAE26D");
    } else {
      changeButtonColor(ctx, sound3But[i], "#E6B89C");
    }
    if (beat[3][i] === 1) {
      changeButtonColor(ctx, sound4But[i], "#EAE26D");
    } else {
      changeButtonColor(ctx, sound4But[i], "#FE938C");
    }
  }
}

function beatColor44(beat) {
  sound1But = [];
  sound2But = [];
  sound3But = [];
  sound4But = [];
  sound1But = circles.slice(0, 16);
  sound2But = circles.slice(16, 32);
  sound3But = circles.slice(32, 48);
  sound4But = circles.slice(48, 64);

  for (let i = 0; i < 16; i++) {
    if (beat[0][i] === 1) {
      changeButtonColor(ctx, sound1But[i], "#EAE26D");
    } else {
      changeButtonColor(ctx, sound1But[i], "#4281A4");
    }
    if (beat[1][i] === 1) {
      changeButtonColor(ctx, sound2But[i], "#EAE26D");
    } else {
      changeButtonColor(ctx, sound2But[i], "#91B6B7");
    }
    if (beat[2][i] === 1) {
      changeButtonColor(ctx, sound3But[i], "#EAE26D");
    } else {
      changeButtonColor(ctx, sound3But[i], "#E6B89C");
    }
    if (beat[3][i] === 1) {
      changeButtonColor(ctx, sound4But[i], "#EAE26D");
    } else {
      changeButtonColor(ctx, sound4But[i], "#FE938C");
    }
  }
}

function drawRotatingLine(angle) {
  lineCtx.clearRect(X_init, Y_init, canvas.width, canvas.height);
  let startX = canvas.width / 2;
  let startY = canvas.height / 2;
  let endX = startX + Math.cos(angle) * MAX_RADIUS * 0.9;
  let endY = startY + Math.sin(angle) * MAX_RADIUS * 0.9;

  lineCtx.beginPath();
  lineCtx.moveTo(startX, startY);
  lineCtx.lineTo(endX, endY);
  lineCtx.lineWidth = 5;
  lineCtx.stroke();
}

drawRotatingLine(0);

let counter;
let intervalId1;
var angle = 0;
let stopRotation = 0;

let stoprotation = false;

function startRotation(bpm, sign) {
  if (sign === 1) {
    stopRotation = 17;
    angle = 22.5;
  } else {
    stopRotation = 13;
    angle = 30;
  }
  let counter = 1; // Inizializza il contatore
  const intervalstupido = setInterval(() => {
    drawRotatingLine(angle * (Math.PI / 180) * counter);
    counter++;
    if (stoprotation) {
      clearInterval(intervalstupido);
      counter = 1;
      drawRotatingLine(0);
      return;
    }
  }, 60000 / bpm);
}

function drawButtons34(
  ctx,
  centerX,
  centerY,
  circleRadius,
  buttonRadius,
  color
) {
  const numberOfButtons = 12;
  for (let i = 0; i < numberOfButtons; i++) {
    const angle = 30 * i * (Math.PI / 180);
    const buttonX = centerX + circleRadius * Math.cos(angle);
    const buttonY = centerY + circleRadius * Math.sin(angle);
    const circle = drawButton(ctx, buttonX, buttonY, buttonRadius, color);

    circles.push(circle);
  }
}

function selectTempo(sign) {
  resetButtonColors();
  circles = [];
  if (sign == 1) {
    for (i = 0; i < 4; i++) {
      drawButtons44(
        ctx,
        MAX_RADIUS,
        MAX_RADIUS,
        MAX_RADIUS * (4 / 11 + (i * 2) / 11),
        5,
        "white"
      );
    }
  } else {
    for (i = 0; i < 4; i++) {
      drawButtons34(
        ctx,
        MAX_RADIUS,
        MAX_RADIUS,
        MAX_RADIUS * (4 / 11 + (i * 2) / 11),
        5,
        "white"
      );
    }
  }
}
let beat0;
function saveTime(bpm, beat) {
  beat0 = beat[0];
  sound1Times = [];
  sound2Times = [];
  sound3Times = [];
  sound4Times = [];
  for (let i = 0; i < beat[0].length; i++) {
    if (beat[0][i] === 1) {
      sound1Times.push((i * 60000) / bpm);
    }
    if (beat[1][i] === 1) {
      sound2Times.push((i * 60000) / bpm);
    }
    if (beat[2][i] === 1) {
      sound3Times.push((i * 60000) / bpm);
    }
    if (beat[3][i] === 1) {
      sound4Times.push((i * 60000) / bpm);
    }
  }
}

let timeouts = [];
function playSound(bpm) {
  timeouts = [];
  sound1Times.forEach((time) => {
    let id1 = setTimeout(() => {
      changeButtonColor(ctx, sound1But[(time * bpm) / 60000], "purple");
      sound1.pause(); // Stop the sound if it is currently playing
      sound1.currentTime = 0; // Reset the sound to the beginning
      sound1.play();
    }, time);

    let id2 = setTimeout(() => {
      changeButtonColor(ctx, sound1But[(time * bpm) / 60000], "#EAE26D");
    }, time + 400);

    timeouts.push(id1);
    timeouts.push(id2);
  });
  sound2Times.forEach((time) => {
    let id3 = setTimeout(() => {
      changeButtonColor(ctx, sound2But[(time * bpm) / 60000], "purple");
      sound2.pause(); // Stop the sound if it is currently playing
      sound2.currentTime = 0; // Reset the sound to the beginning
      sound2.play();
    }, time);
    let id4 = setTimeout(() => {
      changeButtonColor(ctx, sound2But[(time * bpm) / 60000], "#EAE26D");
    }, time + 400);
    timeouts.push(id3);
    timeouts.push(id4);
  });
  sound3Times.forEach((time) => {
    let id5 = setTimeout(() => {
      sound3.pause(); // Stop the sound if it is currently playing
      sound3.currentTime = 0; // Reset the sound to the beginning
      sound3.play();
      changeButtonColor(ctx, sound3But[(time * bpm) / 60000], "purple");
    }, time);
    let id6 = setTimeout(() => {
      changeButtonColor(ctx, sound3But[(time * bpm) / 60000], "#EAE26D");
    }, time + 400);
    timeouts.push(id5);
    timeouts.push(id6);
  });
  sound4Times.forEach((time) => {
    let id7 = setTimeout(() => {
      changeButtonColor(ctx, sound4But[(time * bpm) / 60000], "purple");
      sound4.pause(); // Stop the sound if it is currently playing
      sound4.currentTime = 0; // Reset the sound to the beginning
      sound4.play();
    }, time);
    let id8 = setTimeout(() => {
      changeButtonColor(ctx, sound4But[(time * bpm) / 60000], "#EAE26D");
    }, time + 400);
    timeouts.push(id7);
    timeouts.push(id8);
  });
}

function setup(bpm, beat, sign) {
  selectTempo(sign);
  saveTime(bpm, beat);
  selectBeatColor(beat, sign);
}

let drumsLoopState = false;
function playALot(bpm, sign) {
  drumsLoopState = true;
  stoprotation = false;
  // Compute time between each loop iteration in milliseconds
  let drumsInterval = (beat0.length * 60000) / bpm;

  if (drumsLoopState) {
    playSound(bpm);
    startRotation(bpm, sign);
  }

  const DrumLoopInterval = setInterval(() => {
    if (drumsLoopState) {
      playSound(bpm);
      startRotation(bpm, sign);
    } else {
      clearInterval(DrumLoopInterval);
    }
  }, drumsInterval);
}

function stopDrumLoop() {
  drumsLoopState = false;
  stoprotation = true;
  clearTimeout;
  timeouts.forEach((timeout) => {
    clearTimeout(timeout);
  });
  drawRotatingLine(0);
  counter = 0;
}

function loadDrumSounds(sound1D, sound2D, sound3D, sound4D) {
  sound1 = new Audio(sound1D);
  sound2 = new Audio(sound2D);
  sound3 = new Audio(sound3D);
  sound4 = new Audio(sound4D);
}

function resetButtonColors() {
  if (circles.length == 48) {
    for (let i = 0; i < 12; i++) {
      changeButtonColor(ctx, circles[i], "#4281A4");
      changeButtonColor(ctx, circles[i + 12], "#91B6B7");
      changeButtonColor(ctx, circles[i + 24], "#E6B89C");
      changeButtonColor(ctx, circles[i + 36], "#FE938C");
    }
  } else if (circles.length == 64) {
    for (let i = 0; i < 16; i++) {
      changeButtonColor(ctx, circles[i], "#4281A4");
      changeButtonColor(ctx, circles[i + 16], "#91B6B7");
      changeButtonColor(ctx, circles[i + 32], "#E6B89C");
      changeButtonColor(ctx, circles[i + 48], "#FE938C");
    }
  }
}
