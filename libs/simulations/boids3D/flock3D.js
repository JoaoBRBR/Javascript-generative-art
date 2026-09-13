class Boids3D {
  flockSize = 600;
  flock = [];

  init(canvas) {
    const w = canvas.width;
    const h = canvas.height;
    for (let i = 0; i < this.flockSize; i++) {
      const pos = new Vector3D(
        Math.random() * w,
        Math.random() * h,
        Math.random() * w,
      );
      const dir = new Vector3D(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      );
      this.flock.push(new Boid3D(pos, dir));
    }
  }

  draw(canvas,ctx) {
    for (let i = 0; i < this.flockSize; i++) {
      this.flock[i].draw(canvas,ctx);
      this.flock[i].rules(this.flock);
      this.flock[i].move(canvas);
    }
  }
}
