class CanvasManager {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.currentSimulation = null;
    this.animationFrame = null;
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 40;
  }

  setSimulation(sim) {
    this.resizeCanvas();
    this.currentSimulation = sim;
    this.currentSimulation.init(this.canvas);
  }

  start() {
    const loop = () => {
      if (this.currentSimulation) {
        if (this.currentSimulation.clear) {
          this.currentSimulation.clear(this.canvas, this.ctx);
        } else {
          this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.height);
        }

        this.currentSimulation.draw(this.canvas, this.ctx);
      }

      this.animationFrame = requestAnimationFrame(loop);
    };

    loop();
  }
}

//iniciando tudo:
const manager = new CanvasManager();
const boidSim2D = new Boids();

manager.setSimulation(boidSim2D);
manager.start();

//botoes para mudar animacao.
document.getElementById("boids").addEventListener("click", () => {
  manager.setSimulation(boidSim2D);
});
document.getElementById("boids3D").addEventListener("click", () => {
  manager.setSimulation(new Boids3D());
});

//redimencian tela
window.addEventListener("resize", () => {
  console.log("redimenciona");
  manager.resizeCanvas();
});
