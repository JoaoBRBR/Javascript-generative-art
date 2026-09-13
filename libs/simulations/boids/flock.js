class Boids {
  flockSize = 1000;
  flock = [];

  init(canvas) {
    const w = canvas.width;
    const h = canvas.height;
    for (let i = 0; i < this.flockSize; i++) {
      const pos = new Vector2D(Math.random() * w, Math.random() * h);
      const dir = new Vector2D(Math.random() * 2 - 1, Math.random() * 2 - 1);
      this.flock.push(new Boid(pos, dir));
    }
  }

  draw(canvas, ctx) {
    for (let i = 0; i < this.flockSize; i++) {
      this.flock[i].draw(ctx);
      this.flock[i].rules(this.flock);
      this.flock[i].move(canvas);
    }
  }

  clear(canvas, ctx) {
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
    ctx.fillRect(0, 0, w, h);
  }
}
