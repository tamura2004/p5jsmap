function *nodes() {
  for (const monster of [...monsters]) {
    yield monster;
  }
  for (const pc of [...pcs]) {
    yield pc;
  }
  yield spell;
}

function touched(ox, oy, size) {
  const x = mouseX;
  const y = mouseY;
  return ox < x && x < ox + size && oy < y && y < oy + size;
}

class Iterable {
  constructor(values) {
    this.values = values;
  }
  * [Symbol.iterator]() {
    for (const value of this.values) {
      yield value;
    }
  }
}

class Tile {
  constructor(x, y) {
    this.x = x * SIZE;
    this.y = y * SIZE;
  }
  draw() {
    strokeWeight(1);
    square(this.x, this.y, SIZE);
  }
  touched() {
    return touched(this.x, this.y, SIZE);
  }
}

class Tiles extends Iterable {
  constructor() {
    const tiles = [];
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        tiles.push(new Tile(x, y));
      }
    }
    super(tiles);
  }
}

class Node {
  constructor(x, y, label, color) {
    this.label = label;
    this.color = color;
    this.x = x;
    this.y = y;
    this.p = createVector(x * SIZE + RADIUS, y * SIZE + RADIUS);
    this.q = this.p.copy();
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
  setQ(x, y) {
    this.q = createVector(int(x / SIZE) * SIZE + RADIUS, int(y / SIZE) * SIZE + RADIUS);
  }
}

class Pc extends Node {
  constructor(id) {
    super(id + 3, 0, NAMES[id], '#65ace4');
  }
}

class Pcs extends Iterable {
  constructor() {
    const pcs = [];
    for (let i = 0; i < NAMES.length; i++) {
      pcs.push(new Pc(i));
    }
    super(pcs);
  }
}

class Spell extends Node {
  constructor(x, y) {
    super(x, y, '火', '#c93a40');
    this.r = 20;
  }
  inRange(tile) {
    return dist(this.p.x, this.p.y, tile.x + RADIUS, tile.y + RADIUS) < this.r * SIZE / 5 + 0.2;
  }
}

class Monster extends Node {
  constructor(id) {
    const x = Math.floor(Math.random() * 11);
    const y = Math.floor(15 + 2 * Math.log(1 - Math.random()));
    super(x, y, `${id}`, '#de9610');
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

class Monsters extends Iterable {
  constructor(n) {
    const monsters = [];
    let i = 1;
    while (monsters.length < n) {
      const monster = new Monster(i);
      if (monsters.every((m) => m.p.x !== monster.p.x || m.p.y !== monster.p.y)) {
        monsters.push(monster);
        i++;
      }
    }
    super(monsters);
  }
}

class Measure {
  constructor() {
    this.target = null;
  }
  draw() {
    if (this.target) {
      const x = this.target.p.x;
      const y = this.target.p.y;
      const mx = mouseX;
      const my = mouseY;
      const tx = (x + mx) / 2;
      const ty = (y + my) / 2;
      const d = dist(x, y, mx, my);
      strokeWeight(1);
      fill(128, 128, 128, 0);
      ellipse(mouseX, mouseY, SIZE - 10);  
      line(x, y, mx, my);
      textSize(64);
      fill(250);
      stroke(0);
      strokeWeight(4);
      text(`${int(d / SIZE) * 5}feet`, tx, ty);
    }
  }
  touchStarted(pcs, monsters, spell) {
    this.target = [...pcs].find((pc) => pc.touched());
    this.target = this.target || [...monsters].find((monster) => monster.touched());
    this.target = this.target || (spell.touched() ? spell : null);
  }
  touchEnded() {
    if (this.target) {
      this.target.setQ(mouseX, mouseY);
    }
  }
}

class Button extends Node {
  constructor(id, x, y) {
    super(x, y, `${id}`, '#56a764');
    this.id = id;
  }
}

class Buttons extends Iterable {
  constructor() {
    const buttons = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 5; j++) {
        const n = j + i * 5 + 1;
        buttons.push(new Button(n, j * 1.5 + 2, i * 1.5 + 3));
      }
    }
    super(buttons);
  }
}

class Dialog {
  constructor() {
    this.buttons = new Buttons();
    this.visible = true;
  }
  draw() {
    if (this.visible) {
      fill('white');
      strokeWeight(3);
      rect(SIZE * 1.5, SIZE * 1.5, SIZE * 8, SIZE * 6);
      fill('black');
      strokeWeight(0);
      textAlign(LEFT);
      text('モンスターの数を設定', SIZE * 2, SIZE * 2);
      for (const button of [...this.buttons]) {
        button.draw();
      }
    }
  }
  touchStarted() {
    const button = [...this.buttons].find((b) => b.touched());
    if (button) {
      monsters = new Monsters(button.id);
      this.visible = false;
    }
  }
}
