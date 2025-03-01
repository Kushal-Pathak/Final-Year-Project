let dragObject = null;
let areaDragOffset;
let pressedPos;
let releasedPos;
let mouseIsReleased = false;
let connectingObject = null;
let movementFound = true;
let source = null;
let wireBin = null;
let seed = 0;
let gates = [];
let gatesBin = [];
let chip = null;
let pressedObject = null;
let switchBin = null;
let selection = false;
let selectArea = null;
let selectees = [];
let readyToMove = false;
let gateMenu = [];
let myNewGate = null;
let recycleBin = [];
let seedCounter = seed;
let mode = SIM;
let canvas;
function setup() {
  canvas = createCanvas(windowWidth - 17, windowHeight - 56);
  areaDragOffset = createVector(0, 0);
  pressedPos = createVector(0, 0);
  releasedPos = createVector(0, 0);
  strokeWeight(3);
  textAlign(CENTER, CENTER);
  textSize(15);
  selectArea = { p1: createVector(0, 0), p2: createVector(0, 0), w: 0, h: 0 };
  gateMenufunc();
  simulationMode();
  seed = Date.now();
}

function draw() {
  background(150);
  // const x = 300;
  // const y = 250;
  // const h = 50;
  // const w = 120;
  // const cx1 = x;
  // const cy1 = y;
  // const cx2 = x;
  // const cy2 = y;

  // const start_angle = -PI / 2;
  // const end_angle = PI / 2;
  // push();
  // strokeWeight(2.5);
  // stroke(255);
  // arc(x, y + w / 4, w, w, -PI / 1.85, -PI / 6); //upper arc
  // arc(x, y - w / 4, w, w, PI / 6, PI / 1.85); //lower arc
  // arc(x - w / 2, y, w, w, -PI / 6, PI / 6); //left arc
  // const rad_squared = (w * w) / 4;
  // for (let i = x; i < x + w / 2; i++) {
  //   for (let j = y - w / 4; j < y + w / 4; j++) {}
  // }
  // pop();
  noStroke();
  fill(43, 48, 53);
  rect(0, 0, 100, height);
  strokeWeight(1);
  stroke(150);
  line(0, 0, 100, 0);
  for (let gate of gateMenu) {
    gate.update();
  }
  for (let gate of gates) {
    gate.update();
  }
  bin = null;
  selectMultiple();
  massDelete();
}

function mousePressed() {
  generateGate();
  pressedPos.set(mouseX, mouseY);
  mouseIsReleased = false;
}

function mouseReleased() {
  wireBin = source;
  source = null;
  switchBin = pressedObject;
  pressedObject = null;
  dragObject = null;
  releasedPos.set(mouseX, mouseY);
  mouseIsReleased = true;
  selection = false;
  if (selectees.length) {
    readyToMove = true;
  } else {
    readyToMove = false;
  }
  myNewGate = null;
}

function keyReleased() {
  undo(key);
  redo(key);
}

function windowResized() {
  resizeCanvas(windowWidth - 17, windowHeight - 56);
}
