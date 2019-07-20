const SIZE = 88;
const WIDTH = 11;
const HEIGHT = 15;
// const NAMES = ['ヴィ', 'レン', 'ロジ', 'ハッ', 'パイ'];

let locked = false;
let tiles = [];
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
    strokeWeight(1);
    square(this.p.x, this.p.y, SIZE);
  }
  collid(x, y) {
    return collid(x, y, this.p.x, this.p.y, SIZE);
  }
}

class Ball {
  constructor(p, id) {
    this.p = p;
    this.id = id;
    this.q = p.copy();
  }
  move() {
    this.p.add(this.q.copy().sub(this.p).div(4));
  }
  drawFrame() {
    fill('#65ace4')
    strokeWeight(3);
    ellipse(this.p.x, this.p.y, SIZE - 10);
  }
  // drawName() {
  //   textSize(32);
  //   fill(255);
  //   textStyle(BOLD);
  //   stroke(0);
  //   strokeWeight(6);
  //   textAlign(CENTER);
  //   text(NAMES[this.id], this.p.x - SIZE / 2, this.p.y + 14, SIZE);
  // }
  draw() {
    this.drawFrame();
    // this.drawName();
  }
  collid(x, y) {
    return collid(x, y, this.p.x - SIZE / 2, this.p.y - SIZE / 2, SIZE);
  }
}

function setup() {
  createCanvas(WIDTH * SIZE + 1, HEIGHT * SIZE + 1);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      tiles.push(new Tile(createVector(x * SIZE, y * SIZE)));
    }
  }
  for (let i = 0; i < 5; i++) {
    balls.push(new Ball(createVector((i + 3) * SIZE + SIZE / 2, SIZE / 2), i));
  }
}

// function drawMeasure() {
//   const x = target.p.x;
//   const y = target.p.y;
//   const mx = mouseX;
//   const my = mouseY;
//   const tx = (x + mx) / 2;
//   const ty = (y + my) / 2;
//   const d = dist(x, y, mx, my);
//   line(x, y, mx, my);
//   textSize(64);
//   fill(250);
//   stroke(0);
//   strokeWeight(4);
//   text(`${int(d / SIZE) * 5}feet`, tx, ty);
// }

function draw() {
  background(220);
  for (const tile of tiles) {
    const color = (tile.collid(mouseX, mouseY) && locked) ? 'white' : 192;
    fill(color);
    tile.draw();
  }
  if (locked && target) {
    fill(128, 128, 128, 0);
    ellipse(mouseX, mouseY, SIZE - 10);
    // drawMeasure();
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
