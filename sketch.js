const SIZE = 88;
const MARGIN = SIZE / 10;
const RADIUS = SIZE / 2;
const WIDTH = 11;
const HEIGHT = 15;
const NAMES = ['ヴィ', 'レン', 'ロジ', 'ハク', 'へび'];

let mousePressed = false;
let target = null;
let tiles = [];
let pcs = [];
let monsters = [];
let spell = null;
let dialog = null;
let measure = null;

function setup() {
  createCanvas(WIDTH * SIZE + 1, HEIGHT * SIZE + 1);
  tiles = new Tiles();
  pcs = new Pcs();
  spell = new Spell(0, 0)
  dialog =  new Dialog();
  measure = new Measure();
}

function draw() {
  for (const tile of [...tiles]) {
    const color = (tile.touched() && mousePressed) ? 'white' : (spell.inRange(tile) ? 'pink' : 192);
    fill(color);
    tile.draw();
  }
  if (mousePressed) {
    measure.draw();
  }
  for (const node of nodes()) {
    node.move();
    node.draw();
  }
  dialog.draw();
}

function touchStarted() {
  if (dialog.visible) {
    dialog.touchStarted();
  } else {
    mousePressed = true;
    measure.touchStarted(pcs, monsters, spell);
  }
  return false;
}

function touchEnded() {
  measure.touchEnded();
  target = null;
  mousePressed = false;
}
