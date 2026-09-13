class Vector3D {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  sum(vec) {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
    return this;
  }

  sub(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;
    return this;
  }

  mult(mag) {
    this.x *= mag;
    this.y *= mag;
    this.z *= mag;
    return this;
  }

  normalize() {
    let l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    l = l === 0 ? 0.0001 : l;
    this.x = this.x / l;
    this.y = this.y / l;
    this.z = this.z / l;
    return this;
  }

  setMag(mag) {
    this.normalize(this);
    this.x *= mag;
    this.y *= mag;
    this.z *= mag;
    return this;
  }

  getDistance(vec) {
    const dx = vec.x - this.x;
    const dy = vec.y - this.y;
    const dz = vec.z - this.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  getMag() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  copy() {
    return new Vector3D(this.x, this.y, this.z);
  }
}
