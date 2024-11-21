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

function findSourceFrom(freshGates) {
  for (let gate of freshGates) {
    if (gate.type === NODE) {
      if (gate.source) gate.source = findNodeWithId(gate.source.id, freshGates);
    } else if (GATELIST.includes(gate.type)) {
      for (let input of gate.input) {
        if (input.source)
          input.source = findNodeWithId(input.source.id, freshGates);
      }
    } else if (gate.type === CHIP) {
      for (let input of gate.input) {
        if (input.source)
          input.source = findNodeWithId(input.source.id, freshGates);
      }
      for (let output of gate.output) {
        if (output.source)
          output.source = findNodeWithId(output.source.id, freshGates);
      }
    }
  }
}

function findNodeWithId(id, freshGates) {
  for (let gate of freshGates) {
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
      for (let input of gate.input) {
        if (input.id === id) return input;
      }
      for (let output of gate.output) {
        if (output.id === id) return output;
      }
    }
  }
  return null;
}

function clearSimulation() {
  gates = [];
  if (mode === IC) {
    chip = new Componentt(CHIP);
    gates.push(chip);
  }
}

// function changeMode() {
//   if (mode === SIM) {
//     mode = IC;
//     SIM_BTN.style.borderRadius = "";
//     IC_BTN.style.borderRadius = "15px";
//     gates.push(new Commentt(CHIP));
//   } else {
//     mode = SIM;
//   }
// }

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
      chip = new Componentt(CHIP);
      gates.push(chip);
    }
  }
  mode = IC;
  SIM_BTN.style.borderRadius = "";
  SIM_BTN.style.backgroundColor = "";
  IC_BTN.style.borderRadius = "5px";
  IC_BTN.style.backgroundColor = "rgba(0,255,0,0.5)";
}

//checks if mouse is pressed inside object
function pressedInside(object, toggle = false) {
  if (object.type === NODE) {
    return p5.Vector.dist(object.pos, pressedPos) < NODE_RADIUS;
  }
  if (object.type === SWITCH) {
    if (toggle) {
      //for switching purpose
      return p5.Vector.dist(object.pos, pressedPos) < object.switchRadius;
    } else {
      //for dragging purpose
      let x1 = object.pos.x + object.switchRadius;
      let x2 = object.node.pos.x - NODE_RADIUS;
      let y1 = object.pos.y - object.switchRadius;
      let y2 = object.pos.y + object.switchRadius;
      return (
        pressedPos.x > x1 &&
        pressedPos.x < x2 &&
        pressedPos.y > y1 &&
        pressedPos.y < y2
      );
    }
  }
  if (GATELIST.includes(object.type)) {
    return (
      pressedPos.x > object.pos.x + NODE_RADIUS &&
      pressedPos.x < object.pos.x + object.w - NODE_RADIUS &&
      pressedPos.y > object.pos.y &&
      pressedPos.y < object.pos.y + object.h
    );
  }
  if (object.type === CHIP) {
    return (
      pressedPos.x > object.pos.x + NODE_RADIUS &&
      pressedPos.x < object.pos.x + object.w - NODE_RADIUS &&
      pressedPos.y > object.pos.y &&
      pressedPos.y < object.pos.y + object.h
    );
  }
}

//checks if mouse is released inside object
function releasedInside(object, toggle = false) {
  if (object.type === NODE) {
    return p5.Vector.dist(object.pos, releasedPos) < NODE_RADIUS;
  }
  if (object.type === SWITCH) {
    if (toggle) {
      return p5.Vector.dist(object.pos, releasedPos) < object.switchRadius;
    }
    return;
  }
  if (GATELIST.includes(object.type)) {
    return;
  }
  if (object.type === CHIP) {
    return;
  }
}

// Checks if object is inside the given rectangle
function isWithinRectangle(object, x, y, w, h) {
  if (object.type === NODE) {
    return (
      object.pos.x > x &&
      object.pos.x < x + w &&
      object.pos.y > y &&
      object.pos.y < y + h
    );
  }
  return false; // Default return
}

//remove object from array
function deleteFromArrayIfExists(object, array) {
  let index = array.indexOf(object); // Find index
  if (index > -1) {
    array.splice(index, 1); // Remove object
  }
}

function isInsideSelectArea(object) {
  return (
    object.pos.x > selectArea.p1.x &&
    object.pos.x < selectArea.p2.x &&
    object.pos.y > selectArea.p1.y &&
    object.pos.y < selectArea.p2.y
  );
}

function switchIsToggled(switchObject) {
  return (
    p5.Vector.dist(switchObject.pos, pressedPos) < switchObject.switchRadius
  );
}

function assignColor(gate) {
  switch (gate.type) {
    case OR:
      gate.color = color(255, 0, 0, 153); // Red with 60% opacity
      break;
    case AND:
      gate.color = color(0, 255, 0, 153); // Green with 60% opacity
      break;
    case NOT:
      gate.color = color(0, 0, 255, 153); // Blue with 60% opacity
      break;
    case NOR:
      gate.color = color(128, 0, 128, 153); // Purple with 60% opacity
      break;
    case NAND:
      gate.color = color(255, 165, 0, 153); // Orange with 60% opacity
      break;
    case XOR:
      gate.color = color(75, 0, 130, 153); // Indigo with 60% opacity
      break;
  }
  gate.color = color(26, 54, 54);
}

function reIdentifyGates(freshGates) {
  for (let gate of freshGates) {
    gate.getNewId();
    if (gate.type === SWITCH) gate.node.getNewId();
    if (gate.type === CHIP || GATELIST.includes(gate.type)) {
      for (let input of gate.input) {
        input.getNewId();
      }
      for (let output of gate.output) {
        output.getNewId();
      }
    }
  }
}
