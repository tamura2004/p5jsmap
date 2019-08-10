const SIZE = 88;
const MARGIN = SIZE / 10;
const RADIUS = SIZE / 2;
const WIDTH = 11;
const HEIGHT = 15;
const COLORS = { MONSTER: '#de9610', PC: '#65ace4', SPELL: '#c93a40' };
const STEP = 4; // 移動アニメーションの中割数

let mousePressed = false;
let units = new Units();
let tiles = new Tiles(units);
let battlemap = new Battlemap();

function setup() {
  createCanvas(WIDTH * SIZE + 1, HEIGHT * SIZE + 1);
}

function draw() {
  if (battlemap.image) {
    background(battlemap.image);
  }
  tiles.draw();
  if (mousePressed) {
    units.measure.draw();
  }
  for (const unit of [...units]) {
    if (unit.visible) {
      unit.move();
      unit.draw();
    }
  }
  units.damage.draw();
}

function touchStarted() {
  mousePressed = true;
  units.measure.touchStarted(units);
  return false;
}

function touchEnded() {
  units.measure.touchEnded();
  mousePressed = false;
}
