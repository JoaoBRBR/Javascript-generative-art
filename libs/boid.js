class Boid {
  //preciso de uma classe de vetor
  ver = { x: 0, y: 0 };
  vision = 30;

  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.id = Math.random().toString(36).substring(2, 9);
  }

  draw(ctx) {
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    // ctx.fillStyle = "white";
    // ctx.fill();
    // ctx.lineWidth = 3;
    // ctx.strokeStyle = "white";
    // ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.dx * 10, this.y + this.dy * 10);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";
    ctx.stroke();

    // ctx.beginPath();
    // ctx.moveTo(this.x, this.y);
    // ctx.lineTo(this.x + this.ver.x, this.y + this.ver.y);
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = "red";
    // ctx.stroke();
  }

  move() {
    // maluco
    // if (Math.random() * 100 < 0.05) {
    //   this.dx = Math.random() * 2 - 1;
    //   this.dy = Math.random() * 2 - 1;
    // }

    this.x += this.dx;
    this.y += this.dy;

    // quica
    // if (this.x < 0 || this.x > 800) {
    //   this.dx *= -1;
    // }
    // if (this.y < 0 || this.y > 800) {
    //   this.dy *= -1;
    // }

    // atravessa
    if (this.x < 0) this.x = 800;
    if (this.x > 800) this.x = 0;
    if (this.y < 0) this.y = 800;
    if (this.y > 800) this.y = 0;
  }

  rules(flock) {
    // get near
    let near = [];
    for (let n = 0; n < flock.length; n++) {
      if (this.id == flock[n].id) continue;
      const d = this.#distance(flock[n].x, flock[n].y);
      if (d < this.vision) {
        near.push(flock[n]);
      }
    }

    if (near.length == 0) return;

    // alignment
    const a = this.#align(near);
    const nA = this.#normalize(a.x, a.y);
    const aPower = 100 * this.#getPowerByDistance(a.x, a.y);
    // cohesion
    const c = this.#cohesion(near);
    const nC = this.#normalize(c.x, c.y);
    const cPower = 0.6 * this.#getPowerByDistance(c.x, c.y);
    this.ver = { x: c.x * cPower * 50, y: c.y * cPower * 50 };

    // separation WRONG
    const s = this.#separation(near);
    const nS = this.#normalize(s.x, s.y);
    const sPower = 0.7 * this.#getPowerByDistance(s.x, s.y, true);

    const sumX = nC.x * cPower + nS.x * sPower + nA.x * aPower;
    const sumY = nC.y * cPower + nS.y * sPower + nA.y * aPower;

    this.dx += sumX;
    this.dy += sumY;

    const velocity = this.#magnitude(this.dx, this.dy);
    if (velocity > 1) {
      this.#setMag(1);
    }

    near = [];
  }

  #setMag(mag) {
    const nM = this.#normalize(this.dx, this.dy);
    this.dx = nM.x * mag;
    this.dy = nM.y * mag;
  }

  #cohesion(near) {
    let avgX = 0;
    let avgY = 0;
    for (let i = 0; i < near.length; i++) {
      avgX += near[i].x;
      avgY += near[i].y;
    }
    avgX = avgX / near.length;
    avgY = avgY / near.length;
    return { x: avgX - this.x, y: avgY - this.y };
  }

  #separation(near) {
    let opsX = 0;
    let opsY = 0;

    for (let i = 0; i < near.length; i++) {
      opsX += this.x - near[i].x;
      opsY += this.y - near[i].y;
    }

    return { x: -opsX, y: -opsY };
  }

  #align(near) {
    let dx = 0;
    let dy = 0;

    if (near.length == 0) return;
    for (let i = 0; i < near.length; i++) {
      dx += near[i].dx;
      dy += near[i].dy;
    }

    return { x: dx, y: dy };
    //no rotation
    // const a = (0.5 * Math.PI) / 180;
    // const side = this.#getSide(dx, dy);
    // const prevX = this.dx;
    // if (side < 0) {
    //   this.dx = this.dx * Math.cos(a) - this.dy * Math.sin(a);
    //   this.dy = prevX * Math.sin(a) + this.dy * Math.cos(a);
    // } else if (side > 0) {
    //   this.dx = this.dx * Math.cos(a) + this.dy * Math.sin(a);
    //   this.dy = -prevX * Math.sin(a) + this.dy * Math.cos(a);
    // }
  }

  #getSide(x, y) {
    return this.x * y - this.y * x;
  }

  #normalize(x, y) {
    let l = Math.sqrt(x * x + y * y);
    l = l === 0 ? 0.0001 : l;
    return { x: x / l, y: y / l };
  }

  #getPowerByDistance(x, y, nearStrength) {
    const smooth = 50;
    const d = this.#distance(x, y);
    const xPos = (100 * d) / this.vision;
    let power = 10000 / ((xPos + smooth) * (xPos + smooth));
    if (nearStrength === true) {
      power = 10000 / ((xPos + smooth / 2) * (xPos + smooth / 2)) - 0.5;
    }
    return power / 100;
  }

  #distance(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  #magnitude(x, y) {
    return Math.sqrt(x * x + y * y);
  }
}
