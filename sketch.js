const SIZE = 88;
const MARGIN = SIZE / 10;
const RADIUS = SIZE / 2;
const WIDTH = 11;
const HEIGHT = 15;
const NAMES = ['ヴィ', 'レン', 'ロジ', 'ハッ', 'パイ'];

let locked = false;
let tiles = [];
let balls = [];
let target = null;
let spell = null;
let monsters = [];
let nodes = [];
let showDialog = false;
let buttons = [];

function collid(x, y, ox, oy, size) {
  return ox < x && x < ox + size && oy < y && y < oy + size;
}

function expand(x, y) {
  return createVector(x, y).mult(SIZE).add(createVector(RADIUS, RADIUS));
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

class Node {
  constructor(p, id, label, color) {
    this.id = id;
    this.label = label;
    this.color = color;
    this.p = p;
    this.q = p.copy();
  }
  move() {
    this.p.add(this.q.copy().sub(this.p).div(4));
    if (this.p.dist(this.q) < SIZE / 4) {
      this.p = this.q.copy();
    }    
  }
  draw() {
    this.drawFrame();
    this.drawLabel();
  }
  drawFrame() {
    fill(this.color);
    strokeWeight(3);
    circle(this.p.x, this.p.y, SIZE - MARGIN);
  }
  drawLabel() {
    textSize(32);
    textStyle(BOLD);
    fill('white');
    stroke('black');
    strokeWeight(6);
    textAlign(CENTER);
    text(this.label, this.p.x - RADIUS, this.p.y + 14, SIZE);
  }
  collid(x, y) {
    return collid(x, y, this.p.x - RADIUS, this.p.y - RADIUS, SIZE);
  }
}

class Pc extends Node {
  constructor(id) {
    const p = expand(id + 3, 0);
    super(p, id, NAMES[id], '#65ace4');
  }
  move() {
    this.p.add(this.q.copy().sub(this.p).div(4));
    if (this.p.dist(this.q) < RADIUS) {
      this.p = this.q.copy();
    }
  }
  drawFrame() {
    fill('#65ace4')
    strokeWeight(3);
    ellipse(this.p.x, this.p.y, SIZE - MARGIN);
  }
  drawName() {
    textSize(32);
    fill(255);
    textStyle(BOLD);
    stroke(0);
    strokeWeight(6);
    textAlign(CENTER);
    text(NAMES[this.id], this.p.x - RADIUS, this.p.y + 14, SIZE);
  }
  draw() {
    this.drawFrame();
    this.drawName();
  }
  collid(x, y) {
    return collid(x, y, this.p.x - RADIUS, this.p.y - RADIUS, SIZE);
  }
}

class Spell extends Node{
  constructor(p, id) {
    super(p, id, '火', '#c93a40');
    this.r = 20;
  }
  inRange(tile) {
    return dist(this.p.x, this.p.y, tile.p.x + RADIUS, tile.p.y + RADIUS) < this.r * SIZE / 5 + 0.2;
  }
}

class Monster extends Node{
  constructor(id) {
    const x = Math.floor(Math.random() * 11);
    const y = Math.floor(Math.random() * 3 + 12);
    const p = expand(x, y);
    super(p, id, `${id}`, '#de9610');
    this.damage = random() / 2 + 0.5;
  }
  draw() {
    super.draw();
    this.drawHpBar();
  }
  drawHpBar() {
    const x = this.p.x - RADIUS + 5
    const y = this.p.y + SIZE / 3
    const w = SIZE - 10
    const h = 10;
    const damage = random();
    strokeWeight(0);
    fill('red');
    rect(x, y, w, h);
    fill('lime');
    rect(x, y, w * this.damage, h);
  }
}

class Button extends Node {
  static create() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 5; j++) {
        const n = j + i * 5 + 1;
        const x = j * SIZE * 1.5 + SIZE * 2.5;
        const y = i * SIZE * 1.5 + SIZE * 3.5;
        buttons.push(new Button(n, x, y)); 
      }
    }
  }
  constructor(id, x, y) {
    const p = createVector(x, y);
    super(p, id, `${id + 1}`, '#56a764');
  }
}

function setup() {
  createCanvas(WIDTH * SIZE + 1, HEIGHT * SIZE + 1);
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      tiles.push(new Tile(createVector(x * SIZE, y * SIZE)));
    }
  }
  for (let i = 0; i < NAMES.length; i++) {
    nodes.push(new Pc(i));
  }
  for (let i = 0; i < 6; i++) {
    nodes.push(new Monster(i+1));
  }
  spell = new Spell(createVector(RADIUS, RADIUS))
  nodes.push(spell);
  Button.create();
}

function drawMeasure() {
  const x = target.p.x;
  const y = target.p.y;
  const mx = mouseX;
  const my = mouseY;
  const tx = (x + mx) / 2;
  const ty = (y + my) / 2;
  const d = dist(x, y, mx, my);
  line(x, y, mx, my);
  textSize(64);
  fill(250);
  stroke(0);
  strokeWeight(4);
  text(`${int(d / SIZE) * 5}feet`, tx, ty);
}

function draw() {
  background(220);
  for (const tile of tiles) {
    const color = (tile.collid(mouseX, mouseY) && locked) ? 'white' : (spell.inRange(tile) ? 'pink' : 192);
    fill(color);
    tile.draw();
  }
  if (locked && target) {
    fill(128, 128, 128, 0);
    ellipse(mouseX, mouseY, SIZE - 10);
    drawMeasure();
  }
  for (const node of nodes) {
    node.move();
    node.draw();
  }
  if (showDialog) {
    fill('white');
    strokeWeight(3);
    rect(SIZE * 1.5, SIZE * 1.5, SIZE * 8, SIZE * 6);
    fill('black');
    strokeWeight(0);
    textAlign(LEFT);
    text('モンスターの数を設定', SIZE * 2, SIZE * 2);
    for (const button of buttons) {
      button.draw();
    }
  }
}

function touchStarted() {
  locked = true;
  target = nodes.find((node) => node.collid(mouseX, mouseY));
  return false;
}

function touchEnded() {
  locked = false;
  if (target) {
    target.q = expand(int(mouseX / SIZE), int(mouseY / SIZE));
  } else {
    showDialog = !showDialog;
  }
}
