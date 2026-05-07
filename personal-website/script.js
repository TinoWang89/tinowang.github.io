const canvas = document.querySelector("#cultureCanvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let ratio = 1;
let frame = 0;

function resizeCanvas() {
  ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawVinyl(x, y, radius, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  const disc = ctx.createRadialGradient(0, 0, radius * 0.08, 0, 0, radius);
  disc.addColorStop(0, "#d0922f");
  disc.addColorStop(0.18, "#211e1c");
  disc.addColorStop(0.74, "#131211");
  disc.addColorStop(1, "#34302d");

  ctx.fillStyle = disc;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(247, 243, 234, 0.13)";
  ctx.lineWidth = 1;
  for (let groove = radius * 0.28; groove < radius * 0.92; groove += radius * 0.075) {
    ctx.beginPath();
    ctx.arc(0, 0, groove, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "#f2dfb4";
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.19, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#191716";
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.045, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawFilmStrip(x, y, stripWidth, stripHeight, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.fillStyle = "rgba(25, 23, 22, 0.82)";
  ctx.fillRect(-stripWidth / 2, -stripHeight / 2, stripWidth, stripHeight);

  ctx.fillStyle = "rgba(247, 243, 234, 0.78)";
  const holeSize = 14;
  for (let yy = -stripHeight / 2 + 16; yy < stripHeight / 2 - 8; yy += 34) {
    ctx.fillRect(-stripWidth / 2 + 10, yy, holeSize, holeSize);
    ctx.fillRect(stripWidth / 2 - 24, yy, holeSize, holeSize);
  }

  const frameCount = 4;
  const frameHeight = (stripHeight - 62) / frameCount;
  for (let index = 0; index < frameCount; index += 1) {
    const top = -stripHeight / 2 + 26 + index * (frameHeight + 10);
    const frameGradient = ctx.createLinearGradient(0, top, 0, top + frameHeight);
    frameGradient.addColorStop(0, "rgba(47, 95, 152, 0.74)");
    frameGradient.addColorStop(1, "rgba(140, 47, 57, 0.64)");
    ctx.fillStyle = frameGradient;
    ctx.fillRect(-stripWidth / 2 + 34, top, stripWidth - 68, frameHeight);
  }

  ctx.restore();
}

function drawNotes() {
  const notes = ["♪", "♫", "♬"];
  ctx.save();
  ctx.font = "700 24px Inter, sans-serif";
  ctx.fillStyle = "rgba(140, 47, 57, 0.26)";

  for (let index = 0; index < 16; index += 1) {
    const x = (index * 137 + 80) % Math.max(width, 1);
    const y = (index * 83 + 90 + Math.sin(frame * 0.018 + index) * 16) % Math.max(height, 1);
    ctx.fillText(notes[index % notes.length], x, y);
  }
  ctx.restore();
}

function render() {
  frame += 1;

  ctx.clearRect(0, 0, width, height);

  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "#f7f3ea");
  background.addColorStop(0.46, "#efe2cc");
  background.addColorStop(1, "#bcc9c3");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  drawNotes();
  drawFilmStrip(width * 0.78, height * 0.52, 190, Math.min(height * 0.78, 620), -0.22);
  drawFilmStrip(width * 0.9, height * 0.2, 110, 320, 0.38);
  drawVinyl(width * 0.68, height * 0.72, Math.min(width, height) * 0.19, frame * 0.006);
  drawVinyl(width * 0.92, height * 0.86, Math.min(width, height) * 0.13, -frame * 0.004);

  requestAnimationFrame(render);
}

resizeCanvas();
render();

window.addEventListener("resize", resizeCanvas);
