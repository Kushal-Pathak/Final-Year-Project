function gateMenufunc() {
  gateMenu.push(new Gate(OR, createVector(50, 50)));
  gateMenu.push(new Gate(AND, createVector(50, 125)));
  gateMenu.push(new Gate(NOT, createVector(50, 200)));
  gateMenu.push(new Gate(NOR, createVector(50, 275)));
  gateMenu.push(new Gate(NAND, createVector(50, 350)));
  gateMenu.push(new Gate(XOR, createVector(50, 425)));
  gateMenu.push(new Switch(createVector(50, 500)));
  gateMenu.push(new PNode(createVector(50, 575)));
  for (let i = 0; i < gateMenu.length; i++) {
    gateMenu[i].freeze = true;
    gateMenu[i].fertile = true;
  }
  gateMenu[6].node.extendable = false;
  gateMenu[7].extendable = false;
}

function generateGate() {
  //if (keyIsDown(49)) gates.push(new Gate(OR, createVector(mouseX, mouseY)));
  if (keyIsDown(49)) gates.push(new Componentt(OR, createVector(mouseX, mouseY)));

  if (keyIsDown(50)) gates.push(new Gate(AND, createVector(mouseX, mouseY)));

  //if (keyIsDown(51)) gates.push(new Gate(NOT, createVector(mouseX, mouseY)));
  if (keyIsDown(51)) gates.push(new Componentt(NOT, createVector(mouseX, mouseY)));

  if (keyIsDown(52)) gates.push(new Gate(NOR, createVector(mouseX, mouseY)));

  if (keyIsDown(53)) gates.push(new Gate(NAND, createVector(mouseX, mouseY)));

  if (keyIsDown(54)) gates.push(new Gate(XOR, createVector(mouseX, mouseY)));

  // if (keyIsDown(83) || keyIsDown(115))
  //   gates.push(new Switch(createVector(mouseX, mouseY)));

  // if (keyIsDown(78) || keyIsDown(110)) {
  //   gates.push(new PNode(createVector(mouseX, mouseY)));
  // }

  if (keyIsDown(83) || keyIsDown(115))
    gates.push(new Componentt(SWITCH, createVector(mouseX, mouseY)));

  if (keyIsDown(78) || keyIsDown(110)) {
    gates.push(new Componentt(NODE,createVector(mouseX, mouseY)));
  }
}
