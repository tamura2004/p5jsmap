const SIZE = 88;
const MARGIN = SIZE / 10;
const RADIUS = SIZE / 2;
const WIDTH = 11;
const HEIGHT = 15;
const COLORS = { MONSTER: '#de9610', PC: '#65ace4', SPELL: '#c93a40' };

let mousePressed = false;
let tiles = [];
let pcs = [];
let monsters = [];
let spell = null;
let measure = null;
let nodes = [];
let units = [];
let bg;
let filename;

function setup() {
  bg = loadImage('map001.png');
  createCanvas(WIDTH * SIZE + 1, HEIGHT * SIZE + 1);
  tiles = new Tiles();
  spell = new Spell({x: 0, y: 0, type: 'SPELL'});
  measure = new Measure();
  units = new Units();
  db.collection('units').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const id = change.doc.id;
      const data = change.doc.data();
      if (change.type === 'added') {
        units.add(id, data);
      } else if (change.type === 'modified') {
        units.modify(id, data);
      } else if (change.type === 'removed') {
        units.remove(id);
      }
    });
  });
  db.collection('battlemaps').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const key = change.doc.id;
      const data = change.doc.data();
      if (key === 'selected') {
        filename = data.filename;
        bg = loadImage(filename);
      }
    });
  });
}

function draw() {
  background(bg);
  for (const tile of [...tiles]) {
    if (tile.touched() && mousePressed) {
      fill('white');
    } else if (units.inRange(tile)) {
      fill(256, 64, 64, 128);
    } else {
      noFill();
    }
    tile.draw();
  }
  if (mousePressed) {
    measure.draw();
  }
  for (const unit of [...units]) {
    if (unit.visible) {
      unit.move();
      unit.draw();
    }
  }
}

function touchStarted() {
  mousePressed = true;
  measure.touchStarted(units);
  return false;
}

function touchEnded() {
  measure.touchEnded();
  mousePressed = false;
}
