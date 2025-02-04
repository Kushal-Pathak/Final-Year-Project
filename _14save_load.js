//offset to fetch rows from db
let rowOffset = {
  circuit: 0,
  circuit_end: false,
  post: 0,
  post_end: false,
  comment: 0,
  comment_end: false,
};
//notification for saved circuit------------------------------------------------------
const toastLiveExample = document.getElementById("liveToast");

//save circuit-------------------------------------------------------------------------
function saveCircuit(filename = "") {
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

    const serializedCircuit = serializeCircuit(gates); // Get the serialized circuit data
    const data = {
      circuit_name: filename,
      circuit: serializedCircuit,
    };

    fetch("save_circuit.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Convert the data object to a JSON string
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response from the server
      })
      .then((responseData) => {
        // Handle success
        const msg = responseData.message;
        document.getElementById("notification").innerText = msg;
        bootstrap.Toast.getOrCreateInstance(toastLiveExample).show();
      })
      .catch((error) => {
        // Handle errors
        document.getElementById(
          "notification"
        ).innerText = `Error: ${error.message}`;
        toastTrigger.click();
      });
  }
}

//loading circuit list----------------------------------------------------------------------------
const open_btn = document.querySelector("#open_btn");
if (open_btn) {
  open_btn.addEventListener("click", async () => {
    rowOffset.circuit = 0;
    rowOffset.circuit_end = false;
    try {
      const circuitList = await fetchCircuitList(); // Wait for the circuits to be fetched
      document.querySelector("#modal-list").innerHTML = "";
      appendIntoModal(circuitList);
    } catch (error) {
      console.error("Error fetching circuits:", error.message);
    }
  });
}

async function fetchCircuitList() {
  const data = { fetch_circuit: true, offset: rowOffset.circuit };
  try {
    const response = await fetch("fetch_circuit_list.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Convert the data object to a JSON string
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json(); // Parse the JSON response from the server
    if (responseData.circuits.length === 0) rowOffset.circuit_end = true;
    return responseData.circuits; // Return circuits
  } catch (error) {
    console.error("Error in fetchCircuitList:", error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
}

//append list of circuit into modal
function appendIntoModal(circuits) {
  for (let circuit of circuits) {
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    const div3 = document.createElement("div");
    const span = document.createElement("i");
    const hr = document.createElement("hr");
    div1.appendChild(div2);
    div1.appendChild(hr);
    div2.appendChild(div3);
    div2.appendChild(span);
    div2.className = "circuit-list-bg";
    div3.className = "circuit-name";
    div3.textContent = circuit.circuit_name;
    div3.dataset.circuit_id = circuit.circuit_id;
    div3.addEventListener("click", loadCircuit);
    span.className = "bi bi-trash delete-circuit";
    span.dataset.circuit_id = circuit.circuit_id;
    span.dataset.circuit_name = circuit.circuit_name;
    span.addEventListener("click", deleteCircuit);
    hr.className = "m-1";
    document.querySelector("#modal-list").appendChild(div1);
  }
}

//load a circuit into simulation------------------------------------------------
function loadCircuit(event) {
  const circuitId = event.currentTarget.dataset.circuit_id;

  // Send the POST request to open_circuit.php
  fetch("load_circuit.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ circuit_id: circuitId }), // Send the circuit_id
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse the JSON response from the server
    })
    .then((responseData) => {
      // Handle success
      const circuit = responseData.circuit;
      try {
        const deSerializedCircuit = deSerializeCircuit(circuit);
        assignSource(deSerializedCircuit);
        assignTargets(deSerializedCircuit);
        assignParentToNodes(deSerializedCircuit);
        reIdentifyGates(deSerializedCircuit);
        gates.push(...deSerializedCircuit); // Add new gates
        document.querySelector("#btn-close").click();
      } catch (error) {
        console.error("Error parsing the uploaded circuit:", error);
      }
    })
    .catch((error) => {
      // Handle errors
      console.log("Error opening circuit:", error.message);
    });
}

//load more when circuit list is scrolled------------------------
const scrollable = document.querySelector("#scrollable");
scrollable.addEventListener("scroll", async () => {
  if (!rowOffset.circuit_end && endOfScrollDetected(scrollable)) {
    rowOffset.circuit += 7;
    try {
      const circuitList = await fetchCircuitList(); // Wait for the circuits to be fetched
      appendIntoModal(circuitList);
    } catch (error) {
      console.error("Error fetching circuits:", error.message);
    }
  }
});

function endOfScrollDetected(element) {
  if (!element) {
    console.log("No element to detect scroll");
    return;
  }
  const scrollTop = element.scrollTop;
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;
  if (scrollHeight - scrollTop - clientHeight <= 10) return true;
  else return false;
}
