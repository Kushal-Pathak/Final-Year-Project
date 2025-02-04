function deleteCircuit(event) {
  const circuitId = event.currentTarget.dataset.circuit_id;
  const parent = this.parentElement.parentElement;
  const circuit_name = event.currentTarget.dataset.circuit_name;
  if (!confirm(`Do you really want to delete ${circuit_name}?`)) return;
  // Send the POST request to open_circuit.php
  fetch("delete_circuit.php", {
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
      //handle success
      const msg = responseData.msg;
      const status = responseData.status;
      if (status === "success") {
        parent.remove();
        document.getElementById("notification").innerText = msg;
        bootstrap.Toast.getOrCreateInstance(toastLiveExample).show();
      }
    })
    .catch((error) => {
      // Handle errors
      console.log("Error opening circuit:", error.message);
    });
}
