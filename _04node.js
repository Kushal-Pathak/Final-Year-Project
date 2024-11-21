class PNode {
  constructor(pos = createVector(0, 0)) {
    this.type = NODE;
    this.id = seed++;
    this.pos = pos;
    this.source = null;
    this.signal = 0;
    this.color = this.signal ? color(255, 0, 0) : color(100, 0, 0);
    this.static = false;
    this.dockable = true;
    this.extendable = true;
    this.disconnectable = true;
    this.exists = true;
    this.removable = true;
    this.selected = false;
    this.frozen = false;
    this.visible = true;
    this.revealWire = true;
    this.dragOffset = createVector(0, 0);
    this.fertile = false;
    this.new = true;
    this.insideInput = false; //for chip input/output
    this.insideOutput = false;
  }
  update(alreadyDrawn) {
    this.delete();
    if (this.exists) {
      if (!this.fertile) {
        this.compute();
        this.drag();
        this.select();
        this.updateStructure();
        this.connect();
      }
      this.genesis();
      if (1) this.draw(); //draw node if it is not drawn by it's parent
    }
  }

  draw() {
    if (this.visible) {
      fill(this.color);
      stroke(255);
      strokeWeight(3);
      circle(this.pos.x, this.pos.y, 2 * NODE_RADIUS);
      strokeWeight(4);
      stroke(this.color);
      noFill();

      if (source === this) {
        let x1 = this.pos.x;
        let y1 = this.pos.y;
        let x2 = mouseX;
        let y2 = mouseY;
        line(x1, y1, x2, y2);
      }
      if (this.revealWire) {
        if (this.source && this.source.exists) {
          let x1 = this.pos.x;
          let y1 = this.pos.y;
          let x2 = this.source.pos.x;
          let y2 = this.source.pos.y;
          line(x1, y1, x2, y2);
        }
      }
    }
  }

  connect() {
    //seek connection
    if (this.extendable && mouseIsPressed && !source && !dragObject) {
      if (pressedInside(this)) source = this;
    }

    //establish/dock connection
    if (this.dockable && wireBin && this !== wireBin) {
      if (releasedInside(this)) {
        this.source = wireBin;
        wireBin = null;
      }
    }

    //break connection
    if (
      this.disconnectable &&
      (keyIsDown(100) || keyIsDown(68)) &&
      !this.selected &&
      mouseIsPressed &&
      this.source
    ) {
      if (pressedInside(this)) {
        this.source = null;
        this.signal = 0;
      }
    }
  }

  drag() {
    if (!this.static) {
      if (
        keyIsDown(CONTROL) &&
        !dragObject &&
        !this.selected &&
        mouseIsPressed
      ) {
        if (pressedInside(this)) {
          dragObject = this;
          this.dragOffset = p5.Vector.sub(pressedPos, this.pos);
        }
      }

      if (dragObject === this) {
        this.pos.set(mouseX - this.dragOffset.x, mouseY - this.dragOffset.y);
        if (this.pos.x > 100) {
          this.new = false;
        } else if (!this.new && this.pos.x <= 100) {
          this.pos.x = 100 + NODE_RADIUS;
        }
        if (this.pos.y <= 0) {
          this.pos.y = 0 + NODE_RADIUS;
        }
      }
    }
  }

  compute() {
    //update node's signal
    if (this.source) {
      if (this.source.exists) {
        this.signal = this.source.signal;
      } else {
        this.signal = 0;
      }
    }
    this.color = this.signal ? color(255, 0, 0) : color(100, 0, 0);
  }

  updateStructure() {
    // Update while making chip
    if (mode === IC && !this.static) {
      const x1 = chip.inputArea.x;
      const x2 = chip.outputArea.x;
      const y1 = chip.inputArea.y;
      const h = chip.h;

      // Determine the node's position
      const isInInputArea = isWithinRectangle(this, x1, y1, IO_AREA_WIDTH, h);
      const isInOutputArea = isWithinRectangle(this, x2, y1, IO_AREA_WIDTH, h);

      if (isInInputArea) {
        if (!chip.input.includes(this)) {
          chip.input.push(this); // Add to input if not already present
        }
        deleteFromArrayIfExists(this, chip.output); // Ensure it's removed from output
        deleteFromArrayIfExists(this, gates);
      } else if (isInOutputArea) {
        if (!chip.output.includes(this)) {
          chip.output.push(this); // Add to output if not already present
        }
        deleteFromArrayIfExists(this, chip.input); // Ensure it's removed from input
        deleteFromArrayIfExists(this, gates);
      } else {
        // Node is outside both input and output areas
        if (!gates.includes(this)) gates.push(this);
        deleteFromArrayIfExists(this, chip.input);
        deleteFromArrayIfExists(this, chip.output);
      }
    }
  }

  delete() {
    //make existence false if user tries to delete object
    if (this.removable) {
      if (
        (keyIsDown(88) || keyIsDown(120)) &&
        !this.selected &&
        mouseIsPressed
      ) {
        if (pressedInside(this)) {
          this.exists = false;
        }
      }

      //remove from simulation if existence is false
      if (!this.exists) {
        deleteFromArrayIfExists(this, gates);
      }

      //remove node dropped inside menu of gates
      if (this.pos.x - NODE_RADIUS < 100 && this !== dragObject)
        this.exists = false;
    }
  }

  select() {
    //select if node is under select area
    if (selection && !this.selected && !this.static) {
      if (isInsideSelectArea(this)) {
        this.selected = true;
        selectees.push(this);
      }
    }

    //unselect if node is not under select area
    if (!selection && !readyToMove) {
      this.selected = false;
    }
  }

  genesis() {
    //node genesis logic
    if (this.fertile && !dragObject && mouseIsPressed) {
      if (pressedInside(this)) {
        if (!myNewGate) {
          myNewGate = new Componentt(
            NODE,
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
