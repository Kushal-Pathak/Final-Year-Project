function serializeGates() {
  let saveData = JSON.stringify(gates);
  return saveData;
}

function downloadCircuit(filename) {
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
  }

  let serializedGates = serializeGates();
  // Create a Blob object representing the JSON data
  const blob = new Blob([serializedGates], { type: "application/json" });

  // Create a temporary anchor element
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;

  // Trigger the download by simulating a click
  a.click();

  // Clean up the URL object
  URL.revokeObjectURL(a.href);
}

function deSerializeGates(serializedGates) {
  let semiDeSerializedGates = JSON.parse(serializedGates);
  let originalGates = [];
  for (gate of semiDeSerializedGates) {
    const g = new Componentt(gate.type, createVector(gate.pos.x, gate.pos.y));
    Object.assign(g, gate);

    g.pos = createVector(gate.pos.x, gate.pos.y);
    g.dragOffset = createVector(0, 0);
    if (gate.color) {
      g.color = color(
        gate.color.levels[0],
        gate.color.levels[1],
        gate.color.levels[2],
        gate.color.levels[3]
      );
    }

    if (g.type === SWITCH) {
      g.node = new Componentt(NODE);
      Object.assign(g.node, gate.node);
      g.node.pos = createVector(gate.node.pos.x, gate.node.pos.y);
      if (g.node.color) {
        g.color = color(
          g.node.color.levels[0],
          g.node.color.levels[1],
          g.node.color.levels[2],
          g.node.color.levels[3]
        );
      }
    }

    // Restore input nodes for gates
    if (Array.isArray(gate.input)) {
      g.input = gate.input.map((inputNode) => {
        let restoredNode = new Componentt(
          NODE,
          createVector(inputNode.pos.x, inputNode.pos.y)
        );
        Object.assign(restoredNode, inputNode);
        restoredNode.pos = createVector(inputNode.pos.x, inputNode.pos.y); // Restore position
        if (restoredNode.color) {
          restoredNode.color = color(
            restoredNode.color.levels[0],
            restoredNode.color.levels[1],
            restoredNode.color.levels[2],
            restoredNode.color.levels[3]
          );
        }
        return restoredNode;
      });
    }

    // Restore output nodes for gates
    if (Array.isArray(gate.output)) {
      g.output = gate.output.map((outputNode) => {
        let restoredNode = new Componentt(
          NODE,
          createVector(outputNode.pos.x, outputNode.pos.y)
        );
        Object.assign(restoredNode, outputNode);
        restoredNode.pos = createVector(outputNode.pos.x, outputNode.pos.y); // Restore position
        if (restoredNode.color) {
          restoredNode.color = color(
            restoredNode.color.levels[0],
            restoredNode.color.levels[1],
            restoredNode.color.levels[2],
            restoredNode.color.levels[3]
          );
        }
        return restoredNode;
      });
    }

    originalGates.push(g);
  }
  return originalGates;
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
        const freshGates = deSerializeGates(event.target.result);
        findSourceFrom(freshGates);
        reIdentifyGates(freshGates);
        gates.push(...freshGates); // Add new gates
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
    chip.n1 = chip.input.length;
    chip.n2 = chip.output.length;
    let n1 = chip.n1;
    let n2 = chip.n2;
    let n = 0;
    if (n1 > 0 && n2 > 0) {
      //calculating chip height/width dynamically
      if (n1 > n2) {
        n = n1;
      } else {
        n = n2;
      }
      let wideness = textWidth(chip.name) + 20;
      chip.w = wideness;
      //port spacing
      chip.margin = 1.5 * NODE_RADIUS;
      let len = n * (NODE_RADIUS * 2 + 6);
      chip.h = 2 * chip.margin + len;
      //let len = chip.h - 2 * chip.margin;
      if (n1 > 1) {
        chip.inputGap = len / (chip.n1 - 1);
        for (let i = 0; i < chip.n1; i++) {
          chip.input[i].pos.x = chip.pos.x;
          chip.input[i].pos.y = chip.pos.y + chip.margin + i * chip.inputGap;
        }
      } else {
        chip.input[0].pos.x = chip.pos.x;
        chip.input[0].pos.y = chip.pos.y + chip.h / 2;
      }
      if (n2 > 1) {
        chip.outputGap = len / (chip.n2 - 1);
        for (let i = 0; i < chip.n2; i++) {
          chip.output[i].pos.x = chip.pos.x + chip.w;
          chip.output[i].pos.y = chip.pos.y + chip.margin + i * chip.outputGap;
        }
      } else {
        chip.output[0].pos.x = chip.pos.x + chip.w;
        chip.output[0].pos.y = chip.pos.y + chip.h / 2;
      }
      chip.cx = chip.pos.x + chip.w / 2;
      chip.cy = chip.pos.y + chip.h / 2;
      chip.static = false;
      chip.fabricating = false;
      chip.removable = true;
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
      for (let gate of gates) {
        if (gate.type === NODE) {
          gate.extendable = false;
          gate.dockable = false;
          gate.disconnectable = false;
          gate.visible = false;
          gate.static = true;
          gate.removable = false;
        }
        if (
          GATELIST.includes(gate.type) ||
          (gate.type === CHIP && gate !== chip)
        ) {
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
        gatesBin.push(gate);
      }
      simulationMode();
      chip = null;
      gatesBin = [];
    }
  }
}
