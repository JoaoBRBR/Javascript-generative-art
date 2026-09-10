class Boid {
  vision = 30;

  constructor(pos, dir) {
    this.pos = pos;
    this.dir = dir;
    this.id = Math.random().toString(36).substring(2, 9);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y);
    ctx.lineTo(this.pos.x + this.dir.x * 10, this.pos.y + this.dir.y * 10);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";
    ctx.stroke();
    //circulo
    // ctx.beginPath();
    // ctx.arc(this.pos.x, this.pos.y, this.vision, 0, 2 * Math.PI);
    // ctx.fillStyle = "white";
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = "white";
    // ctx.stroke();
  }

  move() {
    this.pos.sum(this.dir);

    if (this.pos.x < 0) this.pos.x = 800;
    if (this.pos.x > 800) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = 800;
    if (this.pos.y > 800) this.pos.y = 0;
  }

  // TODO regra de chuncks para eficiencia
  rules(flock) {
    let near = [];
    for (let n = 0; n < flock.length; n++) {
      if (this.id == flock[n].id) continue;
      const d = this.pos.getDistance(flock[n].pos);
      if (d < this.vision) {
        near.push(flock[n]);
      }
    }
    if (near.length == 0) return;

    const c = this.#cohesion(near);
    const dPower = this.#getPowerByDistance(c);
    const dPowerNear = this.#getPowerByDistance(c,true);

    const vecAlign = this.#align(near).setMag(dPower * 100);
    const vecCoh = c.copy().setMag(dPower * 5);
    const vecSep = this.#separation(near).setMag(dPowerNear * 0.3);

    this.dir.sum(vecAlign);
    this.dir.sum(vecCoh);
    this.dir.sum(vecSep);

    const velocity = this.dir.getMag();
    if (velocity > 1) {
      this.dir.setMag(1);
    }

    near = [];
  }

  #cohesion(near) {
    let avgPos = new Vector2D();
    for (let i = 0; i < near.length; i++) {
      avgPos.sum(near[i].pos);
    }
    avgPos.mult(1 / near.length);
    avgPos.sub(this.pos);
    return avgPos;
  }

  #separation(near) {
    let opsVec = new Vector2D();
    for (let i = 0; i < near.length; i++) {
      opsVec.sum(
        new Vector2D(this.pos.x - near[i].pos.x, this.pos.y - near[i].pos.y),
      );
    }
    opsVec.mult(-1);
    return opsVec;
  }

  #align(near) {
    let alignV = new Vector2D();
    if (near.length == 0) return;
    for (let i = 0; i < near.length; i++) {
      alignV.sum(near[i].dir);
    }
    return alignV;
  }

  #getPowerByDistance(vec, nearStrength) {
    const smooth = 50;
    const d = this.pos.getDistance(vec);
    const xPos = (100 * d) / this.vision;
    let power = 10000 / ((xPos + smooth) * (xPos + smooth));
    if (nearStrength === true) {
      power = 10000 / ((xPos + smooth / 2) * (xPos + smooth / 2)) - 0.5;
    }
    return power / 100;
  }
}
