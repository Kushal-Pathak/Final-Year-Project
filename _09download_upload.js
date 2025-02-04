function serializeGate(gate) {
  let serializedGate = {};
  if (gate.type === NODE) {
    serializedGate.type = gate.type;
    serializedGate.id = gate.id;
    serializedGate.pos = { x: gate.pos.x, y: gate.pos.y };
    serializedGate.source = gate.source ? { id: gate.source.id } : null;
    serializedGate.static = gate.static;
    serializedGate.dockable = gate.dockable;
    serializedGate.extendable = gate.extendable;
    serializedGate.disconnectable = gate.disconnectable;
    serializedGate.exists = gate.exists;
    serializedGate.removable = gate.removable;
    serializedGate.visible = gate.visible;
    serializedGate.revealWire = gate.revealWire;
  } else if (gate.type === SWITCH) {
    serializedGate.type = gate.type;
    serializedGate.id = gate.id;
    serializedGate.pos = { x: gate.pos.x, y: gate.pos.y };
    serializedGate.exists = gate.exists;
    serializedGate.removable = gate.removable;
    serializedGate.static = gate.static;
    serializedGate.visible = gate.visible;
    serializedGate.node = serializeGate(gate.node);
  } else if (GATELIST.includes(gate.type)) {
    serializedGate.type = gate.type;
    serializedGate.id = gate.id;
    serializedGate.pos = { x: gate.pos.x, y: gate.pos.y };
    serializedGate.h = gate.h;
    serializedGate.w = gate.w;
    serializedGate.cx = gate.cx;
    serializedGate.cy = gate.cy;
    serializedGate.exists = gate.exists;
    serializedGate.removable = gate.removable;
    serializedGate.static = gate.static;
    serializedGate.visible = gate.visible;
    serializedGate.input = gate.input.map((g) => serializeGate(g));
    serializedGate.output = gate.output.map((g) => serializeGate(g));
  } else if (gate.type === CHIP) {
    serializedGate.type = gate.type;
    serializedGate.id = gate.id;
    serializedGate.pos = { x: gate.pos.x, y: gate.pos.y };
    serializedGate.h = gate.h;
    serializedGate.w = gate.w;
    serializedGate.cx = gate.cx;
    serializedGate.cy = gate.cy;
    serializedGate.exists = gate.exists;
    serializedGate.removable = gate.removable;
    serializedGate.static = gate.static;
    serializedGate.visible = gate.visible;
    serializedGate.name = gate.name;
    serializedGate.margin = gate.margin;
    serializedGate.inputGap = gate.inputGap;
    serializedGate.outputGap = gate.outputGap;
    serializedGate.input = gate.input.map((g) => serializeGate(g));
    serializedGate.components = gate.components.map((g) => serializeGate(g));
    serializedGate.output = gate.output.map((g) => serializeGate(g));
  }
  return serializedGate;
}

function deSerializeGate(gate) {
  let deSerializedGate = new Componentt(
    gate.type,
    createVector(gate.pos.x, gate.pos.y)
  );
  if (gate.type === NODE) {
    deSerializedGate.id = gate.id;
    deSerializedGate.pos = createVector(gate.pos.x, gate.pos.y);
    deSerializedGate.source = gate.source;
    deSerializedGate.static = gate.static;
    deSerializedGate.dockable = gate.dockable;
    deSerializedGate.extendable = gate.extendable;
    deSerializedGate.disconnectable = gate.disconnectable;
    deSerializedGate.exists = gate.exists;
    deSerializedGate.removable = gate.removable;
    deSerializedGate.visible = gate.visible;
    deSerializedGate.revealWire = gate.revealWire;
  } else if (gate.type === SWITCH) {
    deSerializedGate.id = gate.id;
    deSerializedGate.pos = createVector(gate.pos.x, gate.pos.y);
    deSerializedGate.exists = gate.exists;
    deSerializedGate.removable = gate.removable;
    deSerializedGate.static = gate.static;
    deSerializedGate.visible = gate.visible;
    deSerializedGate.node = deSerializeGate(gate.node);
  } else if (GATELIST.includes(gate.type)) {
    deSerializedGate.id = gate.id;
    deSerializedGate.pos = createVector(gate.pos.x, gate.pos.y);
    deSerializedGate.h = gate.h;
    deSerializedGate.w = gate.w;
    deSerializedGate.cx = gate.cx;
    deSerializedGate.cy = gate.cy;
    deSerializedGate.exists = gate.exists;
    deSerializedGate.removable = gate.removable;
    deSerializedGate.static = gate.static;
    deSerializedGate.visible = gate.visible;
    deSerializedGate.input = gate.input.map((g) => deSerializeGate(g));
    deSerializedGate.output = gate.output.map((g) => deSerializeGate(g));
  } else if (gate.type === CHIP) {
    deSerializedGate.fabricating = false;
    deSerializedGate.type = gate.type;
    deSerializedGate.id = gate.id;
    deSerializedGate.pos = createVector(gate.pos.x, gate.pos.y);
    deSerializedGate.h = gate.h;
    deSerializedGate.w = gate.w;
    deSerializedGate.cx = gate.cx;
    deSerializedGate.cy = gate.cy;
    deSerializedGate.exists = gate.exists;
    deSerializedGate.removable = gate.removable;
    deSerializedGate.static = gate.static;
    deSerializedGate.visible = gate.visible;
    deSerializedGate.name = gate.name;
    deSerializedGate.margin = gate.margin;
    deSerializedGate.inputGap = gate.inputGap;
    deSerializedGate.outputGap = gate.outputGap;
    deSerializedGate.input = gate.input.map((g) => deSerializeGate(g));
    deSerializedGate.components = gate.components.map((g) =>
      deSerializeGate(g)
    );
    deSerializedGate.output = gate.output.map((g) => deSerializeGate(g));
  }
  return deSerializedGate;
}

function serializeCircuit(circuit) {
  if (circuit.length) {
    let serializedCircuit = circuit.map((gate) => serializeGate(gate));
    serializedCircuit = JSON.stringify(serializedCircuit);
    return serializedCircuit;
  }
  return null;
}

function deSerializeCircuit(circuit) {
  circuit = JSON.parse(circuit);
  let deSerializedCircuit = circuit.map((gate) => deSerializeGate(gate));
  return deSerializedCircuit;
}

function downloadCircuit(filename) {
  if (gates.length) {
    if (mode === SIM) {
      filename = prompt("Please enter the circuit name:", "New Circuit");
      if (filename === "") filename = "New Circuit";
      else if (filename === null) return null;
    }
    if (mode === IC) {
      filename = prompt("Please enter the chip name:", "New Chip");
      if (filename === "") filename = "New Chip";
      else if (filename === null) return null;
      chip.name = filename;
      minifyChip();
      encapsulateComponents();
    }

    const serializedCircuit = serializeCircuit(gates);
    const blob = new Blob([serializedCircuit], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}

function uploadCircuit() {
  const fileInput = document.getElementById("fileInput");

  // Clear any previous file input value to allow re-uploading the same file
  fileInput.value = "";

  // Add a one-time event listener for the 'change' event
  fileInput.onchange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (!file) {
      console.error("No file selected");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const deSerializedCircuit = deSerializeCircuit(event.target.result);
        assignSource(deSerializedCircuit);
        assignTargets(deSerializedCircuit);
        assignParentToNodes(deSerializedCircuit);
        reIdentifyGates(deSerializedCircuit);
        gates.push(...deSerializedCircuit); // Add new gates
      } catch (error) {
        console.error("Error parsing the uploaded circuit:", error);
      }
    };

    reader.onerror = () => {
      console.error("Error reading file:", reader.error);
    };

    reader.readAsText(file); // Read the file as a text string
  };

  // Trigger the file input dialog programmatically
  fileInput.click();
}

function minifyChip() {
  if (mode === IC) {
    gates = [];
    simulationMode();
    gates.push(chip);
    chip.static = false;
    chip.fabricating = false;
    chip.removable = true;
    restructureGate(chip);
  }
}

function restructureGate(gate) {
  const n1 = gate.input.length;
  const n2 = gate.output.length;
  const n = n1 > n2 ? n1 : n2;
  const M = 10;
  let val = 10;
  if (n > 2) val = 12.5;
  if (n >= 5) val = 20;
  const H = 2 * M + n * val;
  let W = textWidth((txt = gate.name || gate.type)) + 20;
  if (GATELIST.includes(gate.type)) W = 60;
  const X = gate.pos.x;
  const Y = gate.pos.y;
  let G1 = 0;
  let G2 = 0;

  if (n1 > 1) {
    G1 = (H - 2 * M) / (n1 - 1);
    for (let i = 0; i < n1; i++) {
      const y = Y + M + i * G1;
      gate.input[i].pos.set(X, y);
    }
  } else {
    const y = Y + H / 2;
    gate.input[0].pos.set(X, y);
  }
  if (n2 > 1) {
    const x = X + W;
    G2 = (H - 2 * M) / (n2 - 1);
    for (let i = 0; i < n2; i++) {
      const y = Y + M + i * G2;
      gate.output[i].pos.set(x, y);
    }
  } else {
    const x = X + W;
    const y = Y + H / 2;
    gate.output[0].pos.set(x, y);
  }

  gate.w = W;
  gate.h = H;
  gate.cx = X + W / 2;
  gate.cy = Y + H / 2;
}

function encapsulateComponents() {
  for (let node of chip.input) {
    node.static = true;
    node.extendable = false;
    node.removable = false;
  }
  for (let node of chip.output) {
    node.static = true;
    node.dockable = false;
    node.disconnectable = false;
    node.removable = false;
    node.revealWire = false;
  }

  for (let gate of chip.components) {
    if (gate.type === NODE) {
      gate.extendable = false;
      gate.dockable = false;
      gate.disconnectable = false;
      gate.visible = false;
      gate.static = true;
      gate.removable = false;
    }
    if (GATELIST.includes(gate.type) || (gate.type === CHIP && gate !== chip)) {
      gate.visible = false;
      gate.static = true;
      gate.removable = false;
      for (let input of gate.input) {
        input.extendable = false;
        input.dockable = false;
        input.disconnectable = false;
        input.visible = false;
      }
      for (let output of gate.output) {
        output.extendable = false;
        output.dockable = false;
        output.disconnectable = false;
        output.visible = false;
      }
    }
  }
}
