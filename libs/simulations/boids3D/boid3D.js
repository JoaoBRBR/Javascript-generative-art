class Boid3D {
  vision = 50;

  constructor(pos, dir) {
    this.pos = pos;
    this.dir = dir;
    this.acc = new Vector3D();

    this.maxSpeed = 1;
    this.maxForce = 0.1;

    this.alignPower = 100;
    this.cohesionPower = 5;
    this.separationPower = 0.2;

    this.id = Math.random().toString(36).substring(2, 9);
  }

  draw(canvas,ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.pos.z / 800 * 10, 0, Math.PI * 2);
    ctx.fillStyle = "royalblue";
    ctx.fill();
  }

  move(canvas) {
    const w = canvas.width;
    const h = canvas.height;
    if (this.acc.getMag() > this.maxForce) {
      this.acc.setMag(this.maxForce);
    }

    this.dir.sum(this.acc);

    if (this.dir.getMag() > this.maxSpeed) {
      this.dir.setMag(this.maxSpeed);
    }

    this.pos.sum(this.dir);


    if (this.pos.x < 0) this.pos.x = w;
    if (this.pos.x > w) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = h;
    if (this.pos.y > h) this.pos.y = 0;
    if (this.pos.z < 0) this.pos.z = w;
    if (this.pos.z > w) this.pos.z = 0;
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
    const dPowerNear = this.#getPowerByDistance(c, true);

    const vecAlign = this.#align(near).setMag(dPower * this.alignPower);
    const vecCoh = c.copy().setMag(dPower * this.cohesionPower);
    const vecSep = this.#separation(near).setMag(
      dPowerNear * this.separationPower,
    );

    // this.dir.sum(vecAlign);
    // this.dir.sum(vecCoh);
    // this.dir.sum(vecSep);
    this.#applyForce(vecAlign);
    this.#applyForce(vecCoh);
    this.#applyForce(vecSep);

    // const velocity = this.dir.getMag();
    // if (velocity > 1) {
    //   this.dir.setMag(1);
    // }

    near = [];
  }

  #applyForce(force) {
    this.acc.sum(force);
  }

  #cohesion(near) {
    let avgPos = new Vector3D();
    for (let i = 0; i < near.length; i++) {
      avgPos.sum(near[i].pos);
    }
    avgPos.mult(1 / near.length);
    avgPos.sub(this.pos);
    return avgPos;
  }

  #separation(near) {
    let opsVec = new Vector3D();
    for (let i = 0; i < near.length; i++) {
      opsVec.sum(
        new Vector3D(
          this.pos.x - near[i].pos.x,
          this.pos.y - near[i].pos.y,
          this.pos.z - near[i].pos.z,
        ),
      );
    }
    opsVec.mult(-1);
    return opsVec;
  }

  #align(near) {
    let alignV = new Vector3D();
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
