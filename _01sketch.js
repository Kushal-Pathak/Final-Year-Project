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
function setup() {
  //frameRate(5)
  createCanvas(windowWidth - 17, windowHeight - 56);
  areaDragOffset = createVector(0, 0);
  pressedPos = createVector(0, 0);
  releasedPos = createVector(0, 0);
  strokeWeight(3);
  textAlign(CENTER, CENTER);
  textSize(20);
  selectArea = { p1: createVector(0, 0), p2: createVector(0, 0), w: 0, h: 0 };
  gateMenufunc();
}

function draw() {
  background(20);
  noStroke();
  fill(40);
  rect(0, 0, 100, height);
  for (let gate of gates) {
    gate.update();
  }
  for (let gate of gateMenu) {
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
