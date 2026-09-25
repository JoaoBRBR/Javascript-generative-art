class Boids {
  flockSize = 2000;
  flock = [];
  chunks = [];
  chunkStructure = { w: 12, h: 6 };

  init(canvas) {
    const w = canvas.width;
    const h = canvas.height;
    for (let i = 0; i < this.flockSize; i++) {
      const pos = new Vector2D(Math.random() * w, Math.random() * h);
      const dir = new Vector2D(Math.random() * 2 - 1, Math.random() * 2 - 1);
      this.flock.push(new Boid(pos, dir));
    }

    //Cria os chuncks
    const chunkW = w / this.chunkStructure.w;
    const chunkH = h / this.chunkStructure.h;
    for (let i = 0; i < this.chunkStructure.w; i++) {
      this.chunks.push([]);
      for (let j = 0; j < this.chunkStructure.h; j++) {
        this.chunks[i][j] = {
          startX: i * chunkW,
          startY: j * chunkH,
          w: chunkW,
          h: chunkH,
          boids: [],
        };
      }
    }

    //popular chunks antes de iniciar, com posicoes atuais
    this.populateChunks();
  }

  draw(canvas, ctx) {
    for (let i = 0; i < this.flockSize; i++) {
      const localFlock = this.getFlocksForThisChunk(this.flock[i]);
      this.flock[i].draw(ctx);
      // this.flock[i].rules(this.flock);
      // console.log("a", localFlock)
      this.flock[i].rules(localFlock);
      this.flock[i].move(canvas);
    }
    this.populateChunks();
  }

  clear(canvas, ctx) {
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, w, h);
  }

  populateChunks() {
    let restOfList = this.flock;
    for (let i = 0; i < this.chunkStructure.w; i++) {
      for (let j = 0; j < this.chunkStructure.h; j++) {
        const chunkHere = this.chunks[i][j];
        const rest = [];
        const boidsHere = restOfList.filter((b) => {
          if (
            b.pos.x >= chunkHere.startX &&
            b.pos.x < chunkHere.startX + chunkHere.w &&
            b.pos.y >= chunkHere.startY &&
            b.pos.y < chunkHere.startY + chunkHere.h
          ) {
            return true;
          } else {
            rest.push(b);
          }
        });
        restOfList = rest;
        this.chunks[i][j].boids = boidsHere.length > 0 ? boidsHere : [];
      }
    }
  }

  getFlocksForThisChunk(b) {
    // Math.floor(b.pos.x / chunkW)
    let localBoids = [];
    for (let i = 0; i < this.chunkStructure.w; i++) {
      for (let j = 0; j < this.chunkStructure.h; j++) {
        const chunkHere = this.chunks[i][j];
        if (
          b.pos.x >= chunkHere.startX &&
          b.pos.x <= chunkHere.startX + chunkHere.w &&
          b.pos.y >= chunkHere.startY &&
          b.pos.y <= chunkHere.startY + chunkHere.h
        ) {
          localBoids = this.chunks[i][j].boids;

          //cima
          if (j != 0) {
            localBoids = localBoids.concat(this.chunks[i][j - 1].boids);
            if (i != 0) {
              localBoids = localBoids.concat(this.chunks[i - 1][j - 1].boids);
            }
            //direita
            if (i != this.chunkStructure.w - 1) {
              localBoids = localBoids.concat(this.chunks[i + 1][j - 1].boids);
            }
          }
          //baixo
          if (j != this.chunkStructure.h - 1) {
            localBoids = localBoids.concat(this.chunks[i][j + 1].boids);

            if (i != 0) {
              localBoids = localBoids.concat(this.chunks[i - 1][j + 1].boids);
            }
            //direita
            if (i != this.chunkStructure.w - 1) {
              localBoids = localBoids.concat(this.chunks[i + 1][j + 1].boids);
            }
          }
          //esquerda
          if (i != 0) {
            localBoids = localBoids.concat(this.chunks[i - 1][j].boids);
          }
          //direita
          if (i != this.chunkStructure.w - 1) {
            localBoids = localBoids.concat(this.chunks[i + 1][j].boids);
          }
          return localBoids;
        }
      }
    }
    return localBoids;
  }
}
