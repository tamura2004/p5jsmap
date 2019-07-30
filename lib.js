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

class Unit {
  constructor(id, {x, y, name, type, visible, hp, damage}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.name = name;
    this.type = type;
    this.visible = visible;
    this.hp = hp;
    this.damage = damage;
    this.color = COLORS[type];
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
    text(this.name, this.p.x - RADIUS + MARGIN, this.p.y - RADIUS, SIZE - MARGIN, SIZE);
  }
  touched() {
    return touched(this.p.x - RADIUS, this.p.y - RADIUS, SIZE);
  }
  setQ(x, y) {
    this.q = createVector(int(x / SIZE) * SIZE + RADIUS, int(y / SIZE) * SIZE + RADIUS);
  }
  modify({x, y}) {
    this.x = x;
    this.y = y;
    this.q = createVector(x * SIZE + RADIUS, y * SIZE + RADIUS);
  }
}

class Pc extends Unit {
  constructor(id, init) {
    super(id, init);
  }
}

class Spell extends Unit {
  constructor(id, init) {
    super(id, {...init, name: '火'});
    this.r = 20;
  }
  inRange(tile) {
    return dist(this.p.x, this.p.y, tile.x + RADIUS, tile.y + RADIUS) < this.r * SIZE / 5 + 0.2;
  }
}

class Monster extends Unit {
  constructor(id, init) {
    super(id, init);
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

class Units {
  constructor() {
    this.map = new Map();
  }
  add(id, data) {
    const fn = data.type === 'PC' ? Pc : (data.type === 'MONSTER' ? Monster : Spell);
    this.map.set(id, new fn(id, data));
  }
  modify(id, data) {
    let unit = this.map.get(id);
    unit.modify(data);
  }
  remove(id) {
    this.map.delete(id);
  }
  inRange(tile) {
    return [...this].some((unit) => unit.type === 'SPELL' && unit.inRange(tile));
  }
  * [Symbol.iterator]() {
    for (const value of this.map.values()) {
      yield value;
    }
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
  touchStarted(units) {
    this.target = [...units].find((unit) => unit.touched());
  }
  touchEnded() {
    if (this.target) {
      this.target.setQ(mouseX, mouseY);
    }
  }
}
