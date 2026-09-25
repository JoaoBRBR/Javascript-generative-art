class Boid {
  vision = 40;

  constructor(pos, dir) {
    this.pos = pos;
    this.dir = dir;
    this.acc = new Vector2D();

    this.maxSpeed = 1;
    this.maxForce = 0.05;

    this.alignPower = 100;
    this.cohesionPower = 8;
    this.separationPower = 0.3;

    this.friends = 0;

    this.id = Math.random().toString(36).substring(2, 9);

    //random
    this.personality = new Vector2D();
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y);
    ctx.lineTo(this.pos.x + this.dir.x * 10, this.pos.y + this.dir.y * 10);
    ctx.lineWidth = 2;

    const maxFriends = 70;
    const currentFriends = Math.min(this.friends, maxFriends);
    const ratio = currentFriends / maxFriends;
    const hue = 120 - ratio * 120;
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.stroke();
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
  }

  // TODO regra de chuncks para eficiencia
  rules(flock) {
    // this.#setPersonality();
    // this.#applyForce(this.personality);

    let near = [];
    for (let n = 0; n < flock.length; n++) {
      if (this.id == flock[n].id) continue;
      const d = this.pos.getDistance(flock[n].pos);
      if (d < this.vision) {
        near.push(flock[n]);
      }
    }
    this.friends = near.length;
    if (near.length == 0) return;

    const c = this.#cohesion(near);
    const dPower = this.#getPowerByDistance(c);
    const dPowerNear = this.#getPowerByDistance(c, true);

    const vecAlign = this.#align(near).setMag(dPower * this.alignPower);
    const vecCoh = c.copy().setMag(dPower * this.cohesionPower);
    const vecSep = this.#separation(near).setMag(
      dPowerNear * this.separationPower,
    );

    this.#applyForce(vecAlign);
    this.#applyForce(vecCoh);
    this.#applyForce(vecSep);

    near = [];
  }

  #setPersonality() {
    if (Math.random() < 0.5) {
      if (Math.random() < 0.5) {
        this.personality.setMag(0);
      } else {
        this.personality.random();
        this.personality.setMag(Math.random() * 100);
      }
    }
  }

  #applyForce(force) {
    this.acc.sum(force);
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
