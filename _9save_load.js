function serializeGates() {
  let saveData = JSON.stringify(gates);
  return saveData;
}

function deSerializeGates(serializedGates) {
  let loadData = JSON.parse(serializedGates, (key, value) => {
    if (key === "") {
      return value.map((obj) => Object.assign(new Gate(), obj));
    }
    return value;
  });
}
