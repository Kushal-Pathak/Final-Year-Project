class Gate {
  constructor(type, pos) {
    this.id = seed++;
    this.type = type; //type of gate
    this.pos = pos; //position of gate in canvas
    this.n1 = this.type === NOT ? 1 : 2;
    this.n2 = 1;
    this.h = 30; //height of gate
    this.w = 60; //width of gate
    this.input = []; //input signals
    this.output = []; //output signals
    this.exists = true;
    this.removable = true;
    this.selected = false;
    this.static = false;
    this.fertile = false;
    this.new = true;
    this.visible = true;
    this.dragOffset = createVector(0, 0);
    this.pos.set(this.pos.x - this.w / 2, this.pos.y - this.h / 2);
    assignColor(this);

    //generate input nodes
    for (let i = 0; i < this.n1; i++) {
      let node = new Componentt(NODE);
      node.static = true;
      node.extendable = false;
      node.removable = false;
      node.parent = this;
      this.input.push(node);
    }

    //generate output nodes
    for (let i = 0; i < this.n2; i++) {
      let node = new Componentt(NODE);
      node.static = true;
      node.dockable = false;
      node.removable = false;
      node.parent = this;
      this.output.push(node);
    }

    //port spacing
    this.h = 42;
    this.margin = 1.5 * NODE_RADIUS;
    let len = this.h - 2 * this.margin;
    if (this.n1 > 1) {
      this.inputGap = len / (this.n1 - 1);
      for (let i = 0; i < this.n1; i++) {
        this.input[i].pos.x = this.pos.x;
        this.input[i].pos.y = this.pos.y + this.margin + i * this.inputGap;
      }
    } else {
      this.input[0].pos.x = this.pos.x;
      this.input[0].pos.y = this.pos.y + this.h / 2;
    }
    this.output[0].pos.x = this.pos.x + this.w;
    this.output[0].pos.y = this.pos.y + this.h / 2;

    this.cx = this.pos.x + this.w / 2;
    this.cy = this.pos.y + this.h / 2;
  }

  update() {
    this.delete();
    if (this.exists) {
      if (!this.fertile) {
        this.drag();
        this.select();
        this.updateStructure();
        computeGate(this);
      }
      this.genesis();
      this.draw();
      for (let input of this.input) input.update(CHILD_NODES_ARE_DRAWN);
      for (let output of this.output) output.update(CHILD_NODES_ARE_DRAWN);
    }
  }

  //draw gate in canvas
  draw() {
    if (this.visible) {
      stroke(255);
      strokeWeight(3);
      fill(this.color);
      rect(this.pos.x, this.pos.y, this.w, this.h); //drawing gate body
      for (let i = 0; i < this.input.length; i++) {
        this.input[i].draw();
      }
      for (let i = 0; i < this.output.length; i++) {
        this.output[i].draw();
      }
      noStroke();
      fill(255);
      text(this.type, this.cx, this.cy);
    }
  }

  drag() {
    if (!this.static) {
      if (!dragObject && !this.selected && mouseIsPressed) {
        if (pressedInside(this)) {
          dragObject = this;
          this.dragOffset.set(p5.Vector.sub(pressedPos, this.pos));
        }
      }

      if (dragObject == this) {
        this.pos.set(mouseX - this.dragOffset.x, mouseY - this.dragOffset.y);
        if (this.pos.x > 100) {
          this.new = false;
        } else if (!this.new && this.pos.x < 100) {
          this.pos.x = 100;
        }
        if (this.pos.y < 0) {
          this.pos.y = 0;
        }
      }
    }
  }

  updateStructure() {
    if (dragObject == this || this.selected) {
      restructureGate(this);
    }
    if (mode === IC && !this.static) {
      if (!chip.components.includes(this)) {
        chip.components.push(this);
        deleteFromArrayIfExists(this, gates);
      }
    }
  }

  delete() {
    if (this.removable) {
      if (
        (keyIsDown(88) || keyIsDown(120)) &&
        !this.selected &&
        this.removable &&
        mouseIsPressed
      ) {
        if (pressedInside(this)) {
          this.exists = false;
          for (let i = 0; i < this.n1; i++) {
            this.input[i].exists = false;
          }
          for (let i = 0; i < this.n2; i++) {
            this.output[i].exists = false;
          }
        }
      }
      if (this.pos.x < 100 && this !== dragObject) this.exists = false;
      if (!this.exists) {
        deleteFromArrayIfExists(this, gates);
      }
    }
  }

  select() {
    if (selection && !this.selected && !this.static) {
      if (isInsideSelectArea(this)) {
        this.selected = true;
        selectees.push(this);
      }
    }

    if (!selection && !readyToMove) {
      this.selected = false;
    }
  }

  genesis() {
    if (this.fertile && !dragObject && mouseIsPressed) {
      if (pressedInside(this)) {
        if (!myNewGate) {
          myNewGate = new Componentt(
            this.type,
            createVector(pressedPos.x, pressedPos.y)
          );
          myNewGate.dragOffset.set(p5.Vector.sub(pressedPos, this.pos));
          gates.push(myNewGate);
          dragObject = myNewGate;
        }
      }
    }
  }

  getNewId() {
    this.id = seed++;
  }
}
