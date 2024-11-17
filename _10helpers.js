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
