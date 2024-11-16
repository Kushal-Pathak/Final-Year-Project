function undo(k) {
  if (seed > seedCounter) {
    recycleBin = [];
  }
  if (k === "o" || k === "O") {
    if (gates.length) {
      let gate = gates.pop();
      gate.exists = false;
      for (let i = 0; i < gate.n2; i++) {
        gate.output[i].exists = false;
      }
      if (gate.type === SWITCH) gate.node.exists = false;
      recycleBin.push(gate);
      seedCounter = seed;
    }
  }
}

function redo(k, g) {
  if (k === "p" || k === "P") {
    if (recycleBin.length) {
      let gate = recycleBin.pop();
      gate.exists = true;
      for (let i = 0; i < gate.n2; i++) {
        gate.output[i].exists = true;
      }
      if (gate.type === SWITCH) gate.node.exists = true;
      gates.push(gate);
    }
  }
}

function deleter(g) {
  let index = gates.indexOf(g);
  if (index > -1) {
    let waste = gates.splice(index, 1);
    waste.exists = false;
    for (let i = 0; i < waste.n2; i++) {
      waste.output[i].exists = false;
    }
    if (waste.type === SWITCH) waste.node.exists = false;
    seedCounter = seed;
    recycleBin.push(waste);
  }
}
