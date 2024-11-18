function computeGate(gate) {
  switch (gate.type) {
    case OR:
      gate.output[0].signal =
        gate.input[0].signal || gate.input[1].signal ? 1 : 0;
      break;
    case AND:
      gate.output[0].signal =
        gate.input[0].signal && gate.input[1].signal ? 1 : 0;
      break;
    case NOT:
      gate.output[0].signal = gate.input[0].signal ? 0 : 1;
      break;
    case NOR:
      gate.output[0].signal = !(gate.input[0].signal || gate.input[1].signal)
        ? 1
        : 0;
      break;
    case NAND:
      gate.output[0].signal = !(gate.input[0].signal && gate.input[1].signal)
        ? 1
        : 0;
      break;
    case XOR:
      gate.output[0].signal =
        gate.input[0].signal === gate.input[1].signal ? 0 : 1;
      break;
    default:
      gate.output[0].signal = 0;
  }
}

function findSource() {
  for (let gate of gates) {
    if (gate.type === NODE) {
      if (gate.source) gate.source = findNodeWithId(gate.source.id);
    } else if (GATELIST.includes(gate.type)) {
      for (let input of gate.input) {
        if (input.source) input.source = findNodeWithId(input.source.id);
      }
    }
  }
}

function findNodeWithId(id) {
  for (let gate of gates) {
    if (gate.id === id && gate.type === NODE) {
      return gate;
    }
    if (gate.type === SWITCH && gate.node.id === id) {
      return gate.node;
    }
    if (GATELIST.includes(gate.type)) {
      for (let output of gate.output) {
        if (output.id === id) return output;
      }
    }
    if (gate.type === CHIP) {
      //find source node inside chips
      return null;
    }
  }
  return null;
}

function clearSimulation() {
  gates = [];
}

function changeMode() {
  if (mode === SIM) {
    mode = IC;
    SIM_BTN.style.borderRadius = "";
    IC_BTN.style.borderRadius = "15px";
    gates.push(new Commentt(CHIP));
  } else {
    mode = SIM;
  }
}

function simulationMode() {
  if (mode === IC) {
    let temp = gates;
    gates = gatesBin;
    gatesBin = temp;
  }
  mode = SIM;
  SIM_BTN.style.borderRadius = "5px";
  SIM_BTN.style.backgroundColor = "rgba(0,255,0,0.5)";
  IC_BTN.style.borderRadius = "";
  IC_BTN.style.backgroundColor = "";
}

function ICMode() {
  if (mode === SIM) {
    let temp = gates;
    gates = gatesBin;
    gatesBin = temp;
    if (!gates.length) {
      gates.push(new Componentt(CHIP));
    }
  }
  mode = IC;
  SIM_BTN.style.borderRadius = "";
  SIM_BTN.style.backgroundColor = "";
  IC_BTN.style.borderRadius = "5px";
  IC_BTN.style.backgroundColor = "rgba(0,255,0,0.5)";
}
