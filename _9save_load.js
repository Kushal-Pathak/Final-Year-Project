function serializeGates() {
  let saveData = JSON.stringify(gates);
  return saveData;
}

function deSerializeGates(serializedGates) {
  let semiDeSerializedGates = JSON.parse(serializedGates);
  let originalGates = [];
  for (gate of semiDeSerializedGates) {
    let g = new Componentt(gate.type, createVector(gate.pos.x, gate.pos.y));
    Object.assign(g, gate);

    g.pos = createVector(gate.pos.x, gate.pos.y);

    if (gate.dragOffset) {
      g.dragOffset = createVector(gate.dragOffset.x, gate.dragOffset.y);
    }

    if (g.type === SWITCH) {
      g.node = new Componentt(NODE);
      Object.assign(g.node, gate.node);
      g.node.pos = createVector(gate.node.pos.x, gate.node.pos.y);
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
        return restoredNode;
      });
    }

    if (gate.color) {
      g.color = color(
        gate.color.levels[0],
        gate.color.levels[1],
        gate.color.levels[2],
        gate.color.levels[3]
      );
    }

    originalGates.push(g);
  }
  return originalGates;
}

function downloadCircuit(
  serializedGates = serializeGates(),
  filename = "New-Circuit.json"
) {
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

function uploadCircuit() {
  // Programmatically trigger the hidden file input
  const fileInput = document.getElementById("fileInput");
  fileInput.click();

  // Add a one-time event listener to handle the file after selection
  fileInput.addEventListener(
    "change",
    function () {
      const file = fileInput.files[0]; // Get the selected file

      if (!file) {
        console.error("No file selected");
        return;
      }

      // Read the file
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const originalGates = deSerializeGates(event.target.result); // Parse the JSON
          for (let g of originalGates) {
            gates.push(g);
          }
          findSource();
          //console.log("Uploaded JSON:", jsonData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };

      reader.onerror = () => {
        console.error("Error reading file:", reader.error);
      };

      reader.readAsText(file); // Read the file as a text string
    },
    { once: true } // Ensure the event listener runs only once
  );
}
