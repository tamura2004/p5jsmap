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

function setup() {
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
}

function draw() {
  for (const tile of [...tiles]) {
    const color = (tile.touched() && mousePressed) ? 'white' : (units.inRange(tile) ? 'pink' : 192);
    fill(color);
    tile.draw();
  }
  if (mousePressed) {
    measure.draw();
  }
  for (const unit of [...units]) {
    unit.move();
    unit.draw();
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
