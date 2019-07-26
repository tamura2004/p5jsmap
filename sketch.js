const SIZE = 88;
const MARGIN = SIZE / 10;
const RADIUS = SIZE / 2;
const WIDTH = 11;
const HEIGHT = 15;
const NAMES = ['ヴィ', 'レン', 'ロジ', 'ハク', 'へび'];

let locked = false;
let moved = false;
let tiles = [];
let balls = [];
let target = null;
let spell = null;
let pcs = [];
let monsters = [];
let buttons = [];
let monsterNumberDialog = null;
let monsterDamageDialog = null;
let dialog = null;

function *nodes() {
  for (const monster of monsters) {
    yield monster;
  }
  for (const pc of pcs) {
    yield pc;
  }
  yield spell;
}

function touched(ox, oy, size) {
  const x = mouseX;
  const y = mouseY;
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
  touched() {
    return touched(this.p.x, this.p.y, SIZE);
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
    textAlign(CENTER, CENTER);
    text(this.label, this.p.x - RADIUS + MARGIN, this.p.y - RADIUS, SIZE - MARGIN, SIZE);
  }
  touched() {
    return touched(this.p.x - RADIUS, this.p.y - RADIUS, SIZE);
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
  touched() {
    return touched(this.p.x - RADIUS, this.p.y - RADIUS, SIZE);
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
    this.hp = 100;
    this.damage = 20;
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
    strokeWeight(0);
    fill('red');
    rect(x, y, w, h);
    fill('lime');
    rect(x, y, w * (this.hp - this.damage) / this.hp, h);
  }
}

class Monsters {
  constructor(n) {
    this.monsters = [];
    for (let i = 0; i < n; i++) {
      this.monsters.push(new Monster(i + 1));
    }
  }
  * [Symbol.iterator]() {
    for (const monster of this.monsters) {
      yield monster;
    }
  }
}

class Button extends Node {
  constructor(id, x, y) {
    const p = createVector(x, y);
    super(p, id, `${id}`, '#56a764');
  }
}

class MonsterDamageDialog {
  constructor() {
    const nums = [7,8,9,4,5,6,1,2,3,0];
    this.buttons = [];
    for (let i = 0; i < 10; i++) {
      const n = nums[i];
      const x = (i % 3) * SIZE + SIZE * 2.5;
      const y = Math.floor(i / 3) * SIZE + SIZE * 3.5;
      this.buttons.push(new Button(n, x, y));
    }
  }
  draw() {
    fill('white');
    strokeWeight(3);
    rect(SIZE * 1.5, SIZE * 1.5, SIZE * 8, SIZE * 6);
    fill('black');
    strokeWeight(0);
    textAlign(LEFT);
    text('ダメージ', SIZE * 2, SIZE * 2);
    for (const button of this.buttons) {
      button.draw();
    }
  }
  touchStarted() {

  }
}
class MonsterNumberDialog {
  constructor() {
    this.buttons = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 5; j++) {
        const n = j + i * 5 + 1;
        const x = j * SIZE * 1.5 + SIZE * 2.5;
        const y = i * SIZE * 1.5 + SIZE * 3.5;
        this.buttons.push(new Button(n, x, y));
      }
    }
  }
  draw() {
    fill('white');
    strokeWeight(3);
    rect(SIZE * 1.5, SIZE * 1.5, SIZE * 8, SIZE * 6);
    fill('black');
    strokeWeight(0);
    textAlign(LEFT);
    text('モンスターの数を設定', SIZE * 2, SIZE * 2);
    for (const button of this.buttons) {
      button.draw();
    }
  }
  touchStarted() {
    const button = this.buttons.find((b) => b.touched());
    if (button) {
      monsters = new Monsters(button.id);
    }
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
    pcs.push(new Pc(i));
  }
  monsters = new Monsters(6);
  spell = new Spell(createVector(RADIUS, RADIUS))
  monsterNumberDialog = new MonsterNumberDialog();
  monsterDamageDialog = new MonsterDamageDialog();
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
    const color = (tile.touched() && locked) ? 'white' : (spell.inRange(tile) ? 'pink' : 192);
    fill(color);
    tile.draw();
  }
  if (locked && target) {
    fill(128, 128, 128, 0);
    ellipse(mouseX, mouseY, SIZE - 10);
    drawMeasure();
  }
  for (const node of nodes()) {
    node.move();
    node.draw();
  }
  if (dialog) {
    dialog.draw();
  }
}

function touchStarted() {
  if (dialog) {
    dialog.touchStarted();
  } else {
    locked = true;
    target = pcs.find((pc) => pc.touched());
    target = target || Array.from(monsters).find((monster) => monster.touched());
    target = target || (spell.touched() ? spell : null);
  }
  return false;
}

function touchMoved() {
  moved = true;
  return false;
}

function touchEnded() {
  if (target) {
    if (moved) {
      target.q = expand(int(mouseX / SIZE), int(mouseY / SIZE));
    } else {
      dialog = monsterDamageDialog;
    }
  } else {
    dialog = dialog ? null : monsterNumberDialog;
  }
  locked = false;
  moved = false;
}
