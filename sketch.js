const SIZE = 100;
const WIDTH = 10;
const HEIGHT = 15;
let locked = false;
const tiles = [];
let balls = [];
let target = null;

function collid(x, y, ox, oy, size) {
  return ox < x && x < ox + size && oy < y && y < oy + size;
}

class Tile {
  constructor(p) {
    this.p = p;
  }
  draw() {
    square(this.p.x, this.p.y, SIZE);
  }
  collid(x, y) {
    return collid(x, y, this.p.x, this.p.y, SIZE);
  }
}

class Ball {
  constructor(p) {
    this.p = p;
    this.q = p.copy();
  }
  move() {
    this.p.add(this.q.copy().sub(this.p).div(8));
  }
  draw() {
    fill('#65ace4')
    ellipse(this.p.x, this.p.y, SIZE - 10);
  }
  collid(x, y) {
    return collid(x, y, this.p.x - SIZE / 2, this.p.y - SIZE / 2, SIZE);
  }
}

function setup() {
  createCanvas(WIDTH * SIZE, HEIGHT * SIZE);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      tiles.push(new Tile(createVector(x * SIZE, y * SIZE)));
    }
  }
  for (let i = 0; i < 4; i++) {
    balls.push(new Ball(createVector(i * SIZE + SIZE / 2, SIZE / 2)));
  }
}

function draw() {
  background(220);
  for (const tile of tiles) {
    const color = tile.collid(mouseX, mouseY) ? 'white' : 192;
    fill(color);
    tile.draw();
  }
  if (locked && target) {
    fill(128, 128, 128, 0)
    ellipse(mouseX, mouseY, SIZE - 10)
    line(target.p.x, target.p.y, mouseX, mouseY)
  }
  for (const ball of balls) {
    ball.move();
    ball.draw();
  }
}

function touchStarted() {
  locked = true;
  target = balls.find((ball) => ball.collid(mouseX, mouseY));
  return false;
}

function touchEnded() {
  locked = false;
  if (target) {
    target.q = createVector(int(mouseX / SIZE) * SIZE + SIZE / 2, int(mouseY / SIZE) * SIZE + SIZE / 2);
  }
}
