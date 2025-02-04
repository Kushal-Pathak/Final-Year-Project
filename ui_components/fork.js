function forkCircuit(post_id) {
  fetch("fork.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set the request content type
    },
    body: JSON.stringify({ post_id }), // Convert the data to JSON
  })
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
      const circuit = data.circuit;
      try {
        const deSerializedCircuit = deSerializeCircuit(circuit);
        assignSource(deSerializedCircuit);
        assignTargets(deSerializedCircuit);
        assignParentToNodes(deSerializedCircuit);
        reIdentifyGates(deSerializedCircuit);
        gates.push(...deSerializedCircuit); // Add new gates
        document.querySelector("#forums-btn-close").click();
      } catch (error) {
        console.error("Error parsing the uploaded circuit:", error);
      }
    })
    .catch((error) => {
      console.error("Error:", error); // Handle any errors
    });
}
