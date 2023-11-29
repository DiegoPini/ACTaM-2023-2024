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

let ClapsButtons = [];
let SoundButtons = [];
let KickButtons = [];
let HihatButtons = [];

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
      changeButtonColor(ctx, ClapsButtons[i], "white");
    }
    if (beat[1][i] === 1) {
      changeButtonColor(ctx, SoundButtons[i], "yellow");
    } else {
      changeButtonColor(ctx, SoundButtons[i], "white");
    }
    if (beat[2][i] === 1) {
      changeButtonColor(ctx, KickButtons[i], "yellow");
    } else {
      changeButtonColor(ctx, KickButtons[i], "white");
    }
    if (beat[3][i] === 1) {
      changeButtonColor(ctx, HihatButtons[i], "yellow");
    } else {
      changeButtonColor(ctx, HihatButtons[i], "white");
    }
  }
}

function beatColor44(beat) {
  ClapsButtons = circles.slice(0, 16);
  SoundButtons = circles.slice(16, 32);
  KickButtons = circles.slice(32, 48);
  HihatButtons = circles.slice(48, 64);

  for (let i = 0; i < 16; i++) {
    if (beat[0][i] === 1) {
      changeButtonColor(ctx, ClapsButtons[i], "yellow");
    } else {
      changeButtonColor(ctx, ClapsButtons[i], "white");
    }
    if (beat[1][i] === 1) {
      changeButtonColor(ctx, SoundButtons[i], "yellow");
    } else {
      changeButtonColor(ctx, SoundButtons[i], "white");
    }
    if (beat[2][i] === 1) {
      changeButtonColor(ctx, KickButtons[i], "yellow");
    } else {
      changeButtonColor(ctx, KickButtons[i], "white");
    }
    if (beat[3][i] === 1) {
      changeButtonColor(ctx, HihatButtons[i], "yellow");
    } else {
      changeButtonColor(ctx, HihatButtons[i], "white");
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

let counter = 0;

function startRotation(bpm) {
  setInterval(() => {
    drawRotatingLine(22.5 * (Math.PI / 180) * counter);
    counter++;
  }, 60000 / bpm);
  counter = 0;
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
