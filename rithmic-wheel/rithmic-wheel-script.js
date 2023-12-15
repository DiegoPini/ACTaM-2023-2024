let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let lineCanvas = document.getElementById("lineCanvas");
let lineCtx = lineCanvas.getContext("2d");

ctx.beginPath();
ctx.arc(275, 275, 275, 0, 2 * Math.PI);
ctx.fillStyle = "pink";
ctx.fill();

ctx.beginPath();
ctx.arc(275, 275, 225, 0, 2 * Math.PI);
ctx.fillStyle = "red";
ctx.fill();

ctx.beginPath();
ctx.arc(275, 275, 175, 0, 2 * Math.PI);
ctx.fillStyle = "green";
ctx.fill();

ctx.beginPath();
ctx.arc(275, 275, 125, 0, 2 * Math.PI);
ctx.fillStyle = "blue";
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
  drawButton(ctx, circle.x, circle.y, circle.radius, circle.color);
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
  ClapsButtons = circles.slice(0, 12);
  SoundButtons = circles.slice(12, 24);
  KickButtons = circles.slice(24, 36);
  HihatButtons = circles.slice(36, 48);

  for (let i = 0; i < 12; i++) {
    if (beat[0][i] === 1) {
      changeButtonColor(ctx, ClapsButtons[i], "yellow");
    } else {
      changeButtonColor(ctx, ClapsButtons[i], "blue");
    }
    if (beat[1][i] === 1) {
      changeButtonColor(ctx, SoundButtons[i], "yellow");
    } else {
      changeButtonColor(ctx, SoundButtons[i], "green");
    }
    if (beat[2][i] === 1) {
      changeButtonColor(ctx, KickButtons[i], "yellow");
    } else {
      changeButtonColor(ctx, KickButtons[i], "red");
    }
    if (beat[3][i] === 1) {
      changeButtonColor(ctx, HihatButtons[i], "yellow");
    } else {
      changeButtonColor(ctx, HihatButtons[i], "pink");
    }
  }
}

function beatColor44(beat) {
  sound1But = circles.slice(0, 16);
  sound2But = circles.slice(16, 32);
  sound3But = circles.slice(32, 48);
  sound4But = circles.slice(48, 64);

  for (let i = 0; i < 16; i++) {
    if (beat[0][i] === 1) {
      changeButtonColor(ctx, sound1But[i], "yellow");
    } else {
      changeButtonColor(ctx, sound1But[i], "blue");
    }
    if (beat[1][i] === 1) {
      changeButtonColor(ctx, sound2But[i], "yellow");
    } else {
      changeButtonColor(ctx, sound2But[i], "green");
    }
    if (beat[2][i] === 1) {
      changeButtonColor(ctx, sound3But[i], "yellow");
    } else {
      changeButtonColor(ctx, sound3But[i], "red");
    }
    if (beat[3][i] === 1) {
      changeButtonColor(ctx, sound4But[i], "yellow");
    } else {
      changeButtonColor(ctx, sound4But[i], "pink");
    }
  }
}

function drawRotatingLine(angle) {
  lineCtx.clearRect(0, 0, canvas.width, canvas.height);
  let startX = canvas.width / 2;
  let startY = canvas.height / 2;
  let endX = startX + Math.cos(angle) * 250;
  let endY = startY + Math.sin(angle) * 250;

  lineCtx.beginPath();
  lineCtx.moveTo(startX, startY);
  lineCtx.lineTo(endX, endY);
  lineCtx.lineWidth = 5;
  lineCtx.stroke();
}

drawRotatingLine(0);

let counter = 1;
let intervalId;
var angle = 0;
let stopRotation = 0;
function setupRotation(bpm, sign) {
  if (sign === 1) {
    stopRotation = 17;
    angle = 22.5;
  } else {
    stopRotation = 13;
    angle = 30;
  }
}
function startRotation(bpm, sign) {
  if (sign === 1) {
    stopRotation = 17;
    angle = 22.5;
  } else {
    stopRotation = 13;
    angle = 30;
  }

  intervalId = setInterval(() => {
    drawRotatingLine(angle * (Math.PI / 180) * counter);
    counter++;
    if (counter == stopRotation) clearInterval(intervalId);
  }, 60000 / bpm);

  setTimeout(() => {
    counter = 1;
  }, (60000 / bpm) * 17);
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

function selectTempo(tempo) {
  if (tempo == 1) {
    for (i = 0; i < 4; i++) {
      drawButtons44(ctx, 275, 275, 100 + i * 50, 10, "white");
    }
  } else {
    for (i = 0; i < 4; i++) {
      drawButtons34(ctx, 275, 275, 100 + i * 50, 10, "white");
    }
  }
}

function saveTime(bpm, beat) {
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

function playSound(bpm) {
  sound1Times.forEach((time) => {
    setTimeout(() => {
      changeButtonColor(ctx, sound1But[(time * bpm) / 60000], "purple");
      sound1.play();
    }, time);
    setTimeout(() => {
      changeButtonColor(ctx, sound1But[(time * bpm) / 60000], "yellow");
    }, time + 400);
  });
  sound2Times.forEach((time) => {
    setTimeout(() => {
      changeButtonColor(ctx, sound2But[(time * bpm) / 60000], "purple");
      sound2.play();
    }, time);
    setTimeout(() => {
      changeButtonColor(ctx, sound2But[(time * bpm) / 60000], "yellow");
    }, time + 400);
  });
  sound3Times.forEach((time) => {
    setTimeout(() => {
      sound3.play();
      changeButtonColor(ctx, sound3But[(time * bpm) / 60000], "purple");
    }, time);
    setTimeout(() => {
      changeButtonColor(ctx, sound3But[(time * bpm) / 60000], "yellow");
    }, time + 400);
  });
  sound4Times.forEach((time) => {
    setTimeout(() => {
      changeButtonColor(ctx, sound4But[(time * bpm) / 60000], "purple");
      sound4.play();
    }, time);
    setTimeout(() => {
      changeButtonColor(ctx, sound4But[(time * bpm) / 60000], "yellow");
    }, time + 400);
  });
}

function setup(bpm, beat, sign) {
  selectTempo(sign);
  saveTime(bpm, beat);
  selectBeatColor(beat, sign);
}

function play(bpm, sign) {
  startRotation(bpm, sign);
  playSound(bpm);
}

function loadSounds(sound1D, sound2D, sound3D, sound4D) {
  sound1 = new Audio(sound1D);
  sound2 = new Audio(sound2D);
  sound3 = new Audio(sound3D);
  sound4 = new Audio(sound4D);
}
