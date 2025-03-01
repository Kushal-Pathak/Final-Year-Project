function gateMenufunc() {
  gateMenu.push(new Componentt(OR, createVector(50, 50)));
  gateMenu.push(new Componentt(AND, createVector(50, 125)));
  gateMenu.push(new Componentt(NOT, createVector(50, 200)));
  gateMenu.push(new Componentt(NOR, createVector(50, 275)));
  gateMenu.push(new Componentt(NAND, createVector(50, 350)));
  gateMenu.push(new Componentt(XOR, createVector(50, 425)));
  gateMenu.push(new Componentt(SWITCH, createVector(50, 500)));
  gateMenu.push(new Componentt(NODE, createVector(50, 575)));
  for (let i = 0; i < gateMenu.length; i++) {
    gateMenu[i].frozen = true;
    gateMenu[i].fertile = true;
    gateMenu[i].removable = false;
  }
  gateMenu[6].node.extendable = false;
  //gateMenu[7].extendable = false;
  //gateMenu[7].dockable = false;
}

function generateGate() {
  //if (keyIsDown(49)) gates.push(new Gate(OR, createVector(mouseX, mouseY)));
  if (keyIsDown(49))
    gates.push(new Componentt(OR, createVector(mouseX, mouseY)));

  if (keyIsDown(50))
    gates.push(new Componentt(AND, createVector(mouseX, mouseY)));

  //if (keyIsDown(51)) gates.push(new Gate(NOT, createVector(mouseX, mouseY)));
  if (keyIsDown(51))
    gates.push(new Componentt(NOT, createVector(mouseX, mouseY)));

  if (keyIsDown(52))
    gates.push(new Componentt(NOR, createVector(mouseX, mouseY)));

  if (keyIsDown(53))
    gates.push(new Componentt(NAND, createVector(mouseX, mouseY)));

  if (keyIsDown(54))
    gates.push(new Componentt(XOR, createVector(mouseX, mouseY)));

  // if (keyIsDown(83) || keyIsDown(115))
  //   gates.push(new Switch(createVector(mouseX, mouseY)));

  // if (keyIsDown(78) || keyIsDown(110)) {
  //   gates.push(new PNode(createVector(mouseX, mouseY)));
  // }

  if (keyIsDown(83) || keyIsDown(115))
    gates.push(new Componentt(SWITCH, createVector(mouseX, mouseY)));

  if (keyIsDown(78) || keyIsDown(110)) {
    gates.push(new Componentt(NODE, createVector(mouseX, mouseY)));
  }
}
