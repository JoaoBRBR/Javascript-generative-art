class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  sum(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  sub(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  mult(mag) {
    this.x *= mag;
    this.y *= mag;
    return this;
  }

  normalize() {
    let l = Math.sqrt(this.x * this.x + this.y * this.y);
    l = l === 0 ? 0.0001 : l;
    this.x = this.x / l;
    this.y = this.y / l;
    return this;
  }

  random() {
    this.x = Math.random() *2 - 1;
    this.y = Math.random() *2 - 1;
    return this.normalize();
  }

  setMag(mag) {
    this.normalize(this);
    this.x *= mag;
    this.y *= mag;
    return this;
  }

  rotate(d) {
    const a = (d * Math.PI) / 180;
    const prevX = this.x;
    this.x = this.x * Math.cos(a) - this.y * Math.sin(a);
    this.y = prevX * Math.sin(a) + this.y * Math.cos(a);
    return this;
  }

  getDistance(vec) {
    const dx = vec.x - this.x;
    const dy = vec.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  getMag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  getSide(vec) {
    return this.x * vec.y - this.y * vec.x;
  }

  copy() {
    return new Vector2D(this.x, this.y);
  }
}
