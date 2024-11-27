class Componentt {
  constructor(type, pos) {
    if (type === NODE) {
      return new PNode(pos);
    }
    if (type === SWITCH) {
      return new Switch(pos);
    }
    if (type === CHIP) {
      return new Chip();
    }
    if (GATELIST.includes(type)) {
      return new Gate(type, pos);
    }
    return null;
  }
}
