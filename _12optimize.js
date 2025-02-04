function optimizeCircuit(gateArray = gates) {
  //phase 1: collect gates that has no targets
  let targetlessGates = [...bringAllTargetlessGates(gateArray)];
  let visited = [];
  if (!targetlessGates.length) return "No optimization needed";

  //phase 2: reverse-traverse through chain of sources from each targetless gate
  //push the chain into another array
  for (let gate of targetlessGates) {
    const res = traverseSources(gate, visited).slice(1); // Exclude the first element
    //console.log(visited);
  }

  for (let gate of targetlessGates) {
    //remove targetless gates
    deleteFromArrayIfExists(gate, visited);
  }

  visited = visited.reverse(); //reverse visited pattern

  //phase 3: reverse the array and return
  let optimizedCircuit = [...visited, ...targetlessGates];
  let optimized = validateArrays(
    gates,
    optimizedCircuit,
    "gates",
    "optimizedCircuit"
  );
  if (optimized) gates = optimizedCircuit;
}

function bringAllTargetlessGates(gatesArray) {
  let targetlessGates = [];
  for (let gate of gatesArray) {
    if (gate.type === NODE) {
      if (!gate.targets.length) {
        targetlessGates.push(gate);
        continue;
      } else {
        let targetIsOutside = true;
        for (let target of gate.targets) {
          targetIsOutside &&= !gateResidesInside(target, gatesArray); //if target gate resides outside current array
        }
        if (targetIsOutside) targetlessGates.push(gate);
      }
    }
    if (gate.type === SWITCH) {
      if (!gate.node.targets.length) {
        targetlessGates.push(gate);
        continue;
      } else {
        let targetIsOutside = true;
        for (let target of gate.node.targets) {
          targetIsOutside &&= !gateResidesInside(target, gatesArray);
        }
      }
    }
    if (GATELIST.includes(gate.type) || gate.type === CHIP) {
      let targetIsOutside = true;
      let emptyTargets = true;
      for (let output of gate.output) {
        emptyTargets &&= !output.targets.length;
        for (let target of output.targets) {
          targetIsOutside &&= !gateResidesInside(target, gatesArray);
        }
      }
      if (emptyTargets || targetIsOutside) targetlessGates.push(gate);
    }
  }
  return targetlessGates;
}

function gateResidesInside(gate, gatesArray) {
  if (!gate) return null;
  let id = gate.id;
  for (let g of gatesArray) {
    if (g.id === id) {
      return g;
    }
    if (g.type === SWITCH && g.node.id === id) {
      return g;
    }
    if (g.type === CHIP) {
      let foundGate = gateResidesInside(gate, g.input);
      if (!foundGate) foundGate = gateResidesInside(gate, g.components);
      if (!foundGate) foundGate = gateResidesInside(gate, g.output);
      if (foundGate) return foundGate;
    }
    if (GATELIST.includes(g.type)) {
      let foundGate = gateResidesInside(gate, g.input);
      if (!foundGate) foundGate = gateResidesInside(gate, g.output);
      if (foundGate) return foundGate;
    }
  }
  return null;
}

function traverseSources(gate, visited) {
  let pointer = gate;
  //base cases:
  if (!pointer) return visited;
  const case_1 = isSwitch(pointer); //stop at switch
  const case_2 = isNode(pointer) && !hasSource(pointer) && !hasParent(pointer); //stop at dead node
  const case_3 = isGate(pointer) && allInputsAreDead(pointer); //stop at dead gate
  if (case_1 || case_2 || case_3) {
    if (notVisited(pointer, visited)) {
      visited.push(pointer);
    }
    return visited;
  }

  //recursive cases:

  //node traversing to it's source
  if (isNode(pointer)) {
    if (!hasParent(pointer)) {
      //visiting current node if it has no parent
      if (notVisited(pointer, visited)) {
        visited.push(pointer);
      } else {
        //return immediately if already visited
        return visited;
      }
    }
    //continue remaining logic
    const source = pointer.source;
    if (source && !hasParent(source) && notVisited(source, visited)) {
      //traversing to lonely source
      return traverseSources(source, visited);
    }
    if (source && hasParent(source) && notVisited(source.parent, visited)) {
      //traversing to source parent
      return traverseSources(source.parent, visited);
    }
  }

  //gate traversing to it's source
  if (isGate(pointer)) {
    //visiting current gate if not visited
    if (notVisited(pointer, visited)) visited.push(pointer);
    else return visited; //return immediately if already visited

    for (let input of pointer.input) {
      traverseSources(input, visited);
    }
  }
  return visited;
}

function allInputsAreDead(gate) {
  for (let input of gate.input) {
    if (input.source) return false;
  }
  return true;
}

class Test {
  constructor(name = "_", roll = 0) {
    this.name = name;
    this.roll = roll;
    this.child = this;
  }
}

function validateArrays(arr1, arr2, arr1Name = "arr1", arr2Name = "arr2") {
  // Check for duplicates in arr2
  const uniqueElements = new Set(arr2);
  if (uniqueElements.size !== arr2.length) {
    const duplicates = arr2.filter(
      (item, index) => arr2.indexOf(item) !== index
    );
    console.log(`${arr2Name} has duplicate elements:`, [
      ...new Set(duplicates),
    ]);
    return false;
  }

  // Check if lengths of both arrays are equal
  if (arr1.length !== arr2.length) {
    console.log(
      `Length mismatch: ${arr1Name} has ${arr1.length} elements, but ${arr2Name} has ${arr2.length} elements.`
    );
    return false;
  }

  // Check if all elements in arr1 are present in arr2
  const missingElements = arr1.filter((element) => !arr2.includes(element));
  if (missingElements.length > 0) {
    console.log(
      `The following elements in ${arr1Name} are missing from ${arr2Name}:`,
      missingElements
    );
    return false;
  }

  // If all checks pass
  console.log("Optimization successful");
  return true;
}

function isNode(gate) {
  return gate && gate.type === NODE;
}
function isSwitch(gate) {
  return gate && gate.type === SWITCH;
}

function isGate(gate) {
  return gate && GATELIST.includes(gate.type);
}

function hasSource(node) {
  return node && node.source;
}

function hasParent(node) {
  return node && node.parent;
}

function notVisited(gate, arr) {
  return gate && Array.isArray(arr) && !arr.includes(gate);
}
function isVisited(gate, arr) {
  return gate && Array.isArray(arr) && !arr.includes(gate);
}
