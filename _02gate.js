class Gate {
  constructor(type, pos, n1 = 2, n2 = 1) {
    this.id = seed++;
    this.source = []; //input sources (gates or power switches)
    this.input = []; //input signals
    this.output = []; //output signals
    this.type = type; //type of gate
    this.pos = pos; //position of gate in canvas
    this.n1 = n1;
    this.n2 = n2;
    this.exists = true;
    this.removable = true;
    this.selected = false;
    this.static = false;
    this.dragOffset = createVector(0, 0);
    this.h = 50; //height of gate
    this.w = 75; //width of gate
    this.pos.set(this.pos.x - this.w / 2, this.pos.y - this.h / 2);
    this.freeze = false;
    this.fertile = false;
    this.fill = color(0, 0, 0);
    this.new = true;
    this.prepareGate();
  }

  update() {
    this.delete();
    if (this.exists) {
      if (!this.freeze) {
        this.drag();
        this.select();
        this.updateStructure();

        this.compute();
      }
      this.genesis();
      this.draw();
      for (let input of this.input) {
        input.update(this.freeze);
      }
      for (let output of this.output) {
        output.update(this.freeze);
      }
    }
  }

  //prepare gate's initial parameters
  prepareGate() {
    switch (this.type) {
      case OR:
        this.fill = color(255, 0, 0, 153); // Red with 60% opacity
        break;
      case AND:
        this.fill = color(0, 255, 0, 153); // Green with 60% opacity
        break;
      case NOT:
        this.fill = color(0, 0, 255, 153); // Blue with 60% opacity
        break;
      case NOR:
        this.fill = color(128, 0, 128, 153); // Purple with 60% opacity
        break;
      case NAND:
        this.fill = color(255, 165, 0, 153); // Orange with 60% opacity
        break;
      case XOR:
        this.fill = color(75, 0, 130, 153); // Indigo with 60% opacity
        break;
    }

    if (this.type === NOT) {
      this.n1 = 1;
      this.n2 = 1;
    }

    //generate n1's input nodes
    for (let i = 0; i < this.n1; i++) {
      let node = new PNode();
      node.static = true;
      node.extendable = false;
      node.removable = false;
      this.input.push(node);
    }
    //generate n2's output nodes
    for (let i = 0; i < this.n2; i++) {
      let node = new PNode();
      node.static = true;
      node.dockable = false;
      node.removable = false;
      this.output.push(node);
    }
    this.inputGap = this.h / (this.input.length + 1);
    this.outputGap = this.h / (this.output.length + 1);
    let x = this.pos.x;
    for (let i = 0; i < this.input.length; i++) {
      let y = this.pos.y + this.inputGap * (i + 1);
      this.input[i].pos.set(x, y);
    }
    x = this.pos.x + this.w;
    for (let i = 0; i < this.output.length; i++) {
      let y = this.pos.y + this.outputGap * (i + 1);
      this.output[i].pos.set(x, y);
    }
    this.cx = this.pos.x + this.w / 2;
    this.cy = this.pos.y + this.h / 2;
  }

  //draw gate in canvas
  draw() {
    stroke(255);
    strokeWeight(3);
    fill(this.fill);
    rect(this.pos.x, this.pos.y, this.w, this.h); //drawing gate body
    for (let i = 0; i < this.input.length; i++) {
      //this.input[i].draw();
    }
    for (let i = 0; i < this.output.length; i++) {
      //this.output[i].draw();
    }
    noStroke();
    fill(255);
    text(this.type, this.cx, this.cy);
  }

  drag() {
    if (!this.static) {
      if (!this.selected) {
        if (!dragObject) {
          if (mouseIsPressed) {
            if (
              pressedPos.x > this.pos.x + 5 &&
              pressedPos.x < this.pos.x + this.w - 5 &&
              pressedPos.y > this.pos.y &&
              pressedPos.y < this.pos.y + this.h
            ) {
              dragObject = this;
              this.dragOffset.set(p5.Vector.sub(pressedPos, this.pos));
            }
          }
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

  connect() {
    for (let node of this.input) {
      node.connect();
    }
    for (let node of this.output) {
      node.connect();
    }
  }

  updateStructure() {
    if (dragObject == this || this.selected) {
      //for optimization only update the structure of gate if gate is being dragged
      let x = this.pos.x;
      for (let i = 0; i < this.input.length; i++) {
        let y = this.pos.y + this.inputGap * (i + 1);
        this.input[i].pos.set(x, y);
      }
      x = this.pos.x + this.w;
      for (let i = 0; i < this.output.length; i++) {
        let y = this.pos.y + this.outputGap * (i + 1);
        this.output[i].pos.set(x, y);
      }
      this.cx = this.pos.x + this.w / 2;
      this.cy = this.pos.y + this.h / 2;
    }
  }

  compute() {
    switch (this.type) {
      case OR:
        this.output[0].signal =
          this.input[0].signal || this.input[1].signal ? 1 : 0;
        break;
      case AND:
        this.output[0].signal =
          this.input[0].signal && this.input[1].signal ? 1 : 0;
        break;
      case NOT:
        this.output[0].signal = this.input[0].signal ? 0 : 1;
        break;
      case NOR:
        this.output[0].signal = !(this.input[0].signal || this.input[1].signal)
          ? 1
          : 0;
        break;
      case NAND:
        this.output[0].signal = !(this.input[0].signal && this.input[1].signal)
          ? 1
          : 0;
        break;
      case XOR:
        this.output[0].signal =
          this.input[0].signal === this.input[1].signal ? 0 : 1;
        break;
      default:
        this.output[0].signal = 0;
    }
  }

  delete() {
    if (keyIsDown(88) || keyIsDown(120)) {
      if (!this.selected) {
        if (this.removable) {
          if (mouseIsPressed) {
            if (
              pressedPos.x > this.pos.x + 5 &&
              pressedPos.x < this.pos.x + this.w - 5 &&
              pressedPos.y > this.pos.y &&
              pressedPos.y < this.pos.y + this.h
            ) {
              //deleter(this)
              this.exists = false;
              for (let i = 0; i < this.n1; i++) {
                this.input[i].exists = false;
              }
              for (let i = 0; i < this.n2; i++) {
                this.output[i].exists = false;
              }
            }
          }
        }
      }
    }
    if (!this.exists) {
      let index = gates.indexOf(this); // Find the index of this object in the array
      if (index > -1) {
        let removedGates = gates.splice(index, 1); // Remove this object from the array
        recycleBin.push(removedGates[0]);
        seedCounter = seed;
      }
    }
  }

  select() {
    if (selection) {
      if (!this.selected) {
        if (!this.static) {
          if (
            this.pos.x > selectArea.p1.x &&
            this.pos.x < selectArea.p2.x &&
            this.pos.y > selectArea.p1.y &&
            this.pos.y < selectArea.p2.y
          ) {
            this.selected = true;
            selectees.push(this);
          }
        }
      }
    }

    if (!selection && !readyToMove) {
      this.selected = false;
    }
  }

  genesis() {
    if (this.fertile) {
      if (!dragObject) {
        if (mouseIsPressed) {
          if (
            pressedPos.x > this.pos.x + 5 &&
            pressedPos.x < this.pos.x + this.w - 5 &&
            pressedPos.y > this.pos.y &&
            pressedPos.y < this.pos.y + this.h
          ) {
            if (!myNewGate) {
              //genesis logic
              myNewGate = new Gate(
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
    }
  }

  makePackage() {
    let packagedGate = JSON.stringify(this);
    return packagedGate;
  }
}
