const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const flockSize = 500;

var flock = [];

//nao vou ter uma funcao assim, quero um padrao de estrategia aqui, paar escolher o que mostrar no canvas
function init() {
  for (let i = 0; i < flockSize; i++) {
    const pos = new Vector2D(Math.random() * 800, Math.random() * 800);
    const dir = new Vector2D(Math.random() * 2 - 1, Math.random() * 2 - 1);
    flock.push(new Boid(pos, dir));
  }
}

//vai fazer parte do canvas
function mainLoop() {
  ctx.fillStyle = "rgb(0, 0, 70, 0.08)";
  ctx.fillRect(0, 0, 800, 800);

  for (let i = 0; i < flockSize; i++) {
    flock[i].draw(ctx);
    flock[i].rules(flock);
    flock[i].move();
  }

  requestAnimationFrame(mainLoop);
}

init();
requestAnimationFrame(mainLoop);
